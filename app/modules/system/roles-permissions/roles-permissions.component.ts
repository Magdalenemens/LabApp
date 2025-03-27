import { Component, OnInit } from '@angular/core';
import { SytemService } from '../system.service';
import { CommonAlertService } from 'src/app/common/commonAlertService';

import { error } from 'jquery';

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss']
})
export class RolesPermissionsComponent implements OnInit {

  result: any = {};
  roles: any[] = [];
  subModules: any[] = [];
  orderPermissions: any[] = [];
  resultPermissions: any[] = [];
  mainAccessPermissions: any[] = [];
  roleId = null;
  subModule = '';
  isEditable = false;


  constructor(private systemService: SytemService, public _commonAlertService: CommonAlertService) {

  }

  ngOnInit(): void {
    this.roleId = 19;
    this.getOrderPermissions(this.roleId
      , this.subModule);
    this.getResultPermissions(this.roleId
      , this.subModule);
    this.getMainAccessPermissions(this.roleId);
    this.getRoles();
  }

  EditMode(editStatus: boolean) {
    this.isEditable = editStatus;

    if (editStatus == false) {
      this.getMainAccessPermissions(this.roleId);
      this.getOrderPermissions(this.roleId, this.subModule);
      this.getResultPermissions(this.roleId, this.subModule);
    }
  }

  getRoles(): void {
    this.systemService.getOrderRoles().subscribe(res => {
      this.roles = res;
    },
      (error) => {
        console.error('Error loading User list:', error);
      })
  }

  savePermissions() {
    let editStatus = false;
    if (this.result.mainAccess) {
      editStatus = true;
    }
    else if (this.result.order) {
      editStatus = true;
    }
    else if (this.result.result) {
      editStatus = true;
    }
    if (editStatus) {
      this.systemService.updateAllPermission(this.result).subscribe(response => {
        if (response.status === 200 || response.status === 204) {
        this._commonAlertService.updateMessage();
        this.isEditable = false;
        this.result = {};
        }
      },
        (error) => {
          const status = error.status;
          this.isEditable = false;
          this.getMainAccessPermissions(this.roleId);
          this.getOrderPermissions(this.roleId, this.subModule);
          this.getResultPermissions(this.roleId, this.subModule);
          this.result = {};
          if (status === 409) {
          this._commonAlertService.PermissionWarningMessage()
          }
          else if (status === 404) {
            this._commonAlertService.notFoundMessage();
          } else {
            this._commonAlertService.errorMessage();
          }
        })
    } 
    else
        {
          this._commonAlertService.PermissionWarningMessage()
        }
  }


  roleChange(event) {
    if (event == undefined) {
      this.roleId = null;
    } else {
      this.roleId = event;
    }
    this.getOrderPermissions(this.roleId
      , this.subModule);
    this.getResultPermissions(this.roleId
      , this.subModule);
    this.getMainAccessPermissions(this.roleId);
  }



  getOrderPermissions(roleId: any, subModule: any): void {
    subModule = this.subModule;
    this.systemService.getOrderPermissions(roleId, '').subscribe(res => {
      this.orderPermissions = res;
     
    },
      (error) => {
        this.orderPermissions = [];
        console.error('Error loading User list:', error);
      })
  }

  updatePermission(item) {

    // this.systemService.updateOrderPermission(item).subscribe(res => {
    // },
    //   (error) => {
    //     alert('Permision not updated');
    //     this.getOrderPermissions(this.roleId, this.subModule);
    //   })

    if (this.result.order === undefined) {
      this.result.order = [];
    }
    this.result.order.push(item);


  }

  getResultPermissions(roleId: any, subModule: any): void {

    subModule = this.subModule;
    this.systemService.getResultPermissions(roleId, '').subscribe(res => {
      this.resultPermissions = res;
    },
      (error) => {
        this.resultPermissions = [];
        console.error('Error loading User list:', error);
      })
  }

  updateResultPermission(item) {
    // this.systemService.updateResultPermission(item).subscribe(res => {
    // },
    //   (error) => {
    //     alert('Permision not updated');
    //     this.getResultPermissions(this.roleId, this.subModule);
    //   })
    if (this.result.result === undefined) {
      this.result.result = [];
    }
    this.result.result.push(item);


  }

  getMainAccessPermissions(roleId: any): void {

    this.systemService.getMainAccessPermissions(roleId).subscribe(res => {
      this.mainAccessPermissions = res;
    },
      (error) => {
        this.mainAccessPermissions = [];
        console.error('Error loading User list:', error);
      })
  }

  updateMainAccessPermission(item) {
    // this.systemService.updateMainAccessResultPermission(item).subscribe(res => {
    // },
    //   (error) => {
    //     alert('Permision not updated');
    //     this.getMainAccessPermissions(this.roleId);
    //   })

    if (this.result.mainAccess === undefined) {
      this.result.mainAccess = [];
    }
    this.result.mainAccess.push(item);

  }


}

