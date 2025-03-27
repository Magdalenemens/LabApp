import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { modulePermissionModel, rolePermissionModel } from '../models/rolePermissionModel';
import { AuthService } from './../modules/auth/auth.service'
import { roleBaseAction, moduleBaseAction } from '../models/roleBaseAction';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  // Module Based Models 
  modulePermissionModel: modulePermissionModel[] = [];
  moduleBaseAction: moduleBaseAction = new moduleBaseAction();

  //Role Based Models
  rolepermissionmodel: rolePermissionModel[] = [];
  rolebaseaction: roleBaseAction = new roleBaseAction();


  constructor(private _authService: AuthService) {
    this._authService.getModuleRoleAccess().subscribe();
    this._authService.getRoleAccess();
  }

  ngOnInit(): void {

  }

  getModuleBaseRoleAccess(): moduleBaseAction {
    this._authService.getModuleRoleAccess().subscribe(x => { // Ensure it defaults to an empty array if undefined or null
      this.modulePermissionModel = x;
      if (this.modulePermissionModel && Object.keys(this.modulePermissionModel).length > 0) {
        this.modulePermissionModel.forEach((permission) => {
          const moduleType = permission.module;
          switch (moduleType) {
            case 'Orders':
              this.moduleBaseAction.ordersIsAllow = permission.alloW_ACCS;
              break;
            case 'Clinical Modules':
              this.moduleBaseAction.clinicalModulesIsAllow = permission.alloW_ACCS;
              break;
            case 'Test Directory':
              this.moduleBaseAction.testDirectoryIsAllow = permission.alloW_ACCS;
              break;
            case 'Finance':
              this.moduleBaseAction.financeIsAllow = permission.alloW_ACCS;
              break;
            case 'Master Setup':
              this.moduleBaseAction.masterSetupIsAllow = permission.alloW_ACCS;
              break;
            case 'System':
              this.moduleBaseAction.systemIsAllow = permission.alloW_ACCS;
              break;
            case 'Management Reporting':
              this.moduleBaseAction.managementReportingIsAllow = permission.alloW_ACCS;
              break;
            default:
              console.warn(`Unknown module type: ${moduleType}`);
              break;
          }
        });
      }
    });
    return this.moduleBaseAction;
  }


  getRoleBaseAccessOnAction(moduleName: string): roleBaseAction {
    this.rolepermissionmodel = this._authService.getRoleAccess();
    if (this.rolepermissionmodel && this.rolepermissionmodel.length > 0) {
      this.rolepermissionmodel.filter(x => x.suB_MODULE == moduleName).forEach(x => {
        let actionType = x.action.split('_')[1]?.toLowerCase() // Split if underscore exists        
        switch (actionType) {
          case 'add':
            this.rolebaseaction.isAddAccess = x.alloW_ACCS;
            break;
          case 'view':
            this.rolebaseaction.isViewAccess = x.alloW_ACCS;
            break;
          case 'edit':
            this.rolebaseaction.isEditAccess = x.alloW_ACCS;
            break;
          case 'cancel':
            this.rolebaseaction.isCancelAccess = x.alloW_ACCS;
            break;
          case 'modify':
            this.rolebaseaction.isModifyAccess = x.alloW_ACCS;
            break;
          case 'collect':
            this.rolebaseaction.isCollectAccess = x.alloW_ACCS;
            break;
          case 'change_price':
            this.rolebaseaction.isChangePriceAccess = x.alloW_ACCS;
            break;
          case 'issue_invoice':
            this.rolebaseaction.isIssueInvoiceAccess = x.alloW_ACCS;
            break;
          case 'addtest':
            this.rolebaseaction.isAddTestAccess = x.alloW_ACCS;
            break;
          case 'deletetest':
            this.rolebaseaction.isDeleteTestAccess = x.alloW_ACCS;
            break;
          case 'upload_attachment':
            this.rolebaseaction.isUploadAccess = x.alloW_ACCS;
            break;
          case 'save':
            this.rolebaseaction.isSaveAccess = x.alloW_ACCS;
            break;
          case 'verify':
            this.rolebaseaction.isVerifyAccess = x.alloW_ACCS;
            break;
          case 'validate':
            this.rolebaseaction.isValidateAccess = x.alloW_ACCS;
            break;
          case 'release':
            this.rolebaseaction.isReleaseAccess = x.alloW_ACCS;
            break;
          case 'amend':
            this.rolebaseaction.isAmendAccess = x.alloW_ACCS;
            break;
          case 'print':
            this.rolebaseaction.isPrintAccess = x.alloW_ACCS;
            break;
          case 'delete':
            this.rolebaseaction.isDeleteAccess = x.alloW_ACCS;
            break;
          case 'add m-axis':
            this.rolebaseaction.isMAxisAccess = x.alloW_ACCS;
            break;
        }
      });
    }
    return this.rolebaseaction;
  }
}
