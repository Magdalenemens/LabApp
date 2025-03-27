import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, debounceTime, catchError, of } from 'rxjs';
import { ADD_USER_ERROR, deleteErrorMessage, deleteMessage, NOT_FOUND_MESSAGE, registerSuccessMessage, REQUIRED_FIELDS, updateSuccessMessage, USER_ALREADY_EXISTS } from 'src/app/common/constant';
import { Operation } from 'src/app/common/enums';

import { userflModel, userJobTypeModel, userRoleModel } from 'src/app/models/userflModel';
import { SiteService } from 'src/app/modules/masters/site/sites.service';

import Swal from 'sweetalert2';
import { UserService } from '../users.service';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { userSiteAccessList, userSiteAccesslModel } from 'src/app/models/userSiteAccesslModel';
import { Modal } from 'bootstrap';
import { siteModel } from 'src/app/models/siteModel';
import { NgSelectComponent } from '@ng-select/ng-select';
import { rolePermissionModel } from 'src/app/models/rolePermissionModel';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})

export class AdduserComponent {
  form: FormGroup;
  @ViewChild('inputFile') inputFile!: ElementRef<HTMLInputElement>;
  @ViewChild('previewImage') previewImage!: ElementRef<HTMLImageElement>;
  @ViewChildren('siteNoInput') siteNoInputs: QueryList<ElementRef>;

  // Models for Forms
  userData: userflModel = new userflModel();
  userAllData: userflModel[] = [];
  userAllJobData: userJobTypeModel[] = [];
  jobType: any[] = [];
  userJobData: userJobTypeModel = new userJobTypeModel();
  userRoleData: userRoleModel = new userRoleModel();
  userRoleAllData: userRoleModel[] = [];
  refDropDown: any[] = [];
  roleDropDown: any[] = [];
  jobTypeDropDown: any[] = [];
  base64Image = '';
  isUserNameInvalid: boolean = false;
  siteData: siteModel = new siteModel();
  siteAllData: siteModel[] = [];

  // Models for Grid
  userSiteList: userSiteAccesslModel[] = [];
  findAllSites: userSiteAccessList[] = [];
  userSiteData: userSiteAccesslModel = new userSiteAccesslModel();

  imageSelected: boolean = false;
  userFlid: number = 1;

  //Action Buttons
  operation = 0; // 0 means show, 1 means add,2 means edit, 3 means delete // make enum for operation
  isAddBtnActive: boolean = false;
  isEditBtnActive: boolean = false;
  isDeleteBtnActive: boolean = false;
  isSaveBtnActive: boolean = true;
  isCancelBtnActive: boolean = true;
  submitted = false;
  IsDisabled = true;
  isEdit = false;
  isDelete = false;
  isNavigationActive: boolean = false;
  isSubmitBtnActive: boolean = true;


  //Search
  filteredSites: any[] = [];
  searchTerm: string = '';
  matchedUsers$!: Observable<userflModel[]>;
  selectedUser: userflModel | undefined; // Property to hold the selected site
  selectedJobType: any;
  matchedSites: any[] = [];
  selectedRole: any;
  isDefaultSiteReadOnly: boolean = true;
  isAdding: boolean = false;  // Flag to track if adding a new record
  isDisabled = false;
  fromId: number;
  toId: number;
  isUserNameReadOnly: boolean = false;
  isDisableSignature: boolean = false;
  Showupdate: boolean;
  IsAdd: boolean;
  IsEdit: boolean;
  Reset: boolean;
  useRfl_ID: any;
  keyword = 'users';
  users: userflModel;
  userIdFromRoute: number;
  isEditing: boolean = false;
  hit: number = 0;
  //Pagination 
  currentPage: any;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options
  hasData: boolean = false; // Flag to track if data is available
  cacheService: any;
  constructor(private formBuilder: FormBuilder, public _userService: UserService,
    public _commonAlertService: CommonAlertService, private el: ElementRef,
    private _siteService: SiteService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.initializeForm();
  }

  initializeForm() {
    this.userData = new userflModel();
    this.isDisableSignature = true;
    this.form = this.formBuilder.group({
      txtNumber: [{ value: '', disabled: true }],
      txtName: [{ value: this.userData.useR_NAME, disabled: true }, Validators.required],
      txtFullName: [{ value: this.userData.fulL_NAME, disabled: true }, Validators.required, Validators.pattern(/^[0-9]*$/)],
      txtNatId: [{ value: this.userData.naT_ID, disabled: true }, Validators.required],
      txtTel: [{ value: '', disabled: true }],
      txtEmail: [{ value: this.userData.email, disabled: true }, Validators.required, Validators.email],
      txtUserCode: [{ value: '', disabled: true }],
      joB_CD: [{ value: '', disabled: true }],
      reF_SITE: [{ value: '', disabled: true }],
      rolE_ID: [{ value: '', disabled: true }],
      rolE_NAME: [{ value: '', disabled: true }],
      useR_ROLE: [{ value: '', disabled: true }],
      // txtPassword: [{ value: '', disabled: true }],
      chkbilling: [{ value: false, disabled: true }],
      chkNDC: [{ value: false, disabled: true }],
      chkNpc: [{ value: false, disabled: true }],
      txtDiscount: [{ value: 0, disabled: true }],
      txtlgnlmt: [{ value: 0, disabled: true }],
      txtlgncnt: [{ value: 0, disabled: true }],
      chkpagehdr: [{ value: false, disabled: true }],
      chkelecsngr: [{ value: false, disabled: true }],
      chkesngracs: [{ value: false, disabled: true }],
      chkdfltsngr: [{ value: false, disabled: true }],
      chkPriceUpdate: [{ value: false, disabled: true }],
      chkvalidator: [{ value: false, disabled: true }],
      chkvldprmt: [{ value: false, disabled: true }],
      chkdrsldprint: [{ value: false, disabled: true }],
      chkSiteSelection: [{ value: false, disabled: true }],
      chkdefaultspcmnRcvd: [{ value: false, disabled: true }],
      txtsign_line1: [{ value: '', disabled: true }],
      txtsign_line2: [{ value: '', disabled: true }],
      txtnotes: [{ value: '', disabled: true }],
      chkActive: [{ value: false, disabled: true }]
    });
  }

  ngOnInit(): void {
    this.initializeSession();
    this.initializeMethods();
  }

  initializeSession() {
    const routeParams = this.route.snapshot.paramMap;
    this.userIdFromRoute = Number(routeParams.get('userId'));
    if (localStorage.getItem('ResetForm')) {
      this.Reset = Boolean(localStorage.getItem('ResetForm'));
      localStorage.removeItem('ResetForm')
      this.IsAdd = true;
      this.IsEdit = false;
      this.Showupdate = false;
    } else if (this.userIdFromRoute && this.userIdFromRoute > 0) {
      this.getUserDataById(this.userIdFromRoute);
    } else if (localStorage.getItem('useRfl_ID')) {
      this.useRfl_ID = localStorage.getItem('useRfl_ID')?.toString();
      if (this.useRfl_ID) {
        this.getUserDataById(this.useRfl_ID);
      }
    }
  }

  initializeMethods() {
    this.getAllUsersData();
    this.getAllSiteData();
    this.getAllUserJobTypeData();
    this.populateJobTypeDropdown();
    this.fillRefDropDown();
    // this.fillJobTypeDropDown();
    this.fillRoleDropDown();
  }

  // Method to check if a field is invalid
  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control && control.invalid && (control.dirty || control.touched || this.submitted);
  }

  getUserDataById(Client_id: number) {
    this._userService.getUserById(Client_id).subscribe(data => {
      this.users = data as userflModel
    })
    localStorage.removeItem('Client_id');
    this.isDisabled = true;
  }

  getAllUsersData(): void {
    this._userService.getAllUser().subscribe(res => {
      this.userAllData = res;
      this.userAllData = res.map(user => ({
        ...user,
        displayName: `${user.useR_NAME} - ${user.fulL_NAME}`
      }));
      this.matchedUsers$ = this.getFilteredUsers('');
      this.userData = res;
      if (this.userIdFromRoute > 0) {
        this.userData = this.userAllData.find(x => x.useR_FL_ID == this.userIdFromRoute);
      } else {
        this.userData = this.userAllData[this.userAllData.length - 1];
        this.getRecord("last", this.userAllData.length - 1);
        this.getSiteDataByUserId(this.userData.useR_ID);
      }
    })
  }

  // Get Site Data base on userId for right
  getSiteDataByUserId(userId: string) {
    this._userService.getSitesByUserId(userId).subscribe((data) => {
      if (data) {
        this.userSiteList = data;
      } else {
        this._commonAlertService.notFoundMessage();
      }
    })
  }

  getAllSiteData(): void {
    this._siteService.getAllSite().subscribe(res => {
      this.siteAllData = res;
      this.assignDefaultSiteToUser();
    });
  }

  getAllUserJobTypeData(): void {
    this._userService.getAllJobType().subscribe(res => {
      this.userAllJobData = res;
      this.jobTypeDropDown = res;
      this.assignJobTypeToUser();
    });
  }

  populateJobTypeDropdown(): void {
    this.jobType = this.userAllJobData.map(job => ({
      label: job.joB_TITLE,
      value: job.joB_CD
    }));
  }

  fillRefDropDown() {
    this._siteService.getAllSite().subscribe({
      next: (sites) => {
        this.refDropDown = sites;
      },
      error: (error) => {
        this._commonAlertService.ERROR_FETCHING_DATA();
      }
    });
  }

  fillRoleDropDown() {
    this._siteService.getAllRole().subscribe({
      next: (roles) => {
        this.roleDropDown = roles;
        this.getUserRole();
      },
      error: (error) => {
        this._commonAlertService.ERROR_FETCHING_DATA();
      }
    });
  }

  // fillJobTypeDropDown() {
  //   this._userService.getAllJobType().subscribe({
  //     next: (jobTypes) => {
  //       this.jobTypeDropDown = jobTypes;
  //     },
  //     error: (error) => {
  //       this._commonAlertService.ERROR_FETCHING_DATA();
  //     }
  //   });
  // }

  assignDefaultSiteToUser(): void {
    const defSite = this.userData?.deF_SITE;
    if (defSite && this.siteAllData.length > 0) {
      const defaultSite = this.siteAllData.find(site => site.sitE_NO === defSite);
      if (defaultSite) {
        const defSiteName = `${defaultSite.sitE_NO} - ${defaultSite.sitE_NAME}`;
        this.siteData.reF_SITE = defSiteName;
      } else {
        // this._commonAlertService.notFoundMessage();
        this.siteData.reF_SITE = ''; // Clear the site data if the default site is not found
      }
    } else {
      this.siteData.reF_SITE = ''; // Clear the site data if no default site is set
    }
  }

  assignJobTypeToUser(): void {
    this._userService.getAllUser().subscribe(res => {
      this.userAllData = res;
    })
    const userJobType = this.userData.joB_CD.toUpperCase();
    if (userJobType && this.userAllJobData.length > 0) {
      const userJobRole = this.userAllJobData.find(job => job.joB_CD === userJobType);
      if (userJobRole) {
        this.selectedJobType = userJobRole.joB_TITLE;
      } else {
        this.selectedJobType = ''; // Clear the job title if not found
      }
    } else {
      this.selectedJobType = ''; // Clear the job title if jobType or userJobList is empty
    }
  }

  getUserRole(): void {
    const roleId = this.userData.rolE_ID;
    if (roleId) {
      this.selectedRole = this.userData.useR_ROLE;
    } else {
      this.selectedRole = '';
    }
  }

  onSearchUser(event: any) {
    const filteredSites = this.userAllData.filter(site =>
      this.customSearch(event, site)
    );
    return new Observable(observer => {
      observer.next(filteredSites);
      observer.complete();
    });
  }

  onUserSelection(event: any, select: NgSelectComponent) {
    if (event.useR_NAME !== undefined) {
      const selectedValue = event.useR_NAME;
      const selectedUser = this.userAllData.find(user => user.useR_NAME === selectedValue);

      if (selectedUser) {
        this.userData = selectedUser;
        this.assignDefaultSiteToUser();
        this.getSiteDataByUserId(this.userData.useR_ID);
      } else {
        if (this.hit != 1) {
          this.getRecord("last", this.userAllData.length - 1);
        }
      }
      select.handleClearClick();
      this.hit = 1;
    }
  }

  onUserIdSelection(id: number) {
    this._userService.getUserById(id).subscribe(privileges => {
      this.userData = privileges;
      // Optionally, process privileges or display them in the UI
    });
  }

  assignPrivilegesToAnotherUser(userData: userflModel): void {
    if (this.toId && this.userAllData.length > 0) {
      // Find the target user to update
      const targetUser = this.userAllData.find(user => user.useR_FL_ID === this.toId);

      if (targetUser) {
        // Assign privileges from source to target
        targetUser.billing = userData.billing;
        targetUser.ndc = userData.ndc;
        targetUser.npc = userData.npc;
        targetUser.md = userData.md;
        targetUser.rao = userData.rao;
        targetUser.amin = userData.amin;
        targetUser.lgnlmt = userData.lgnlmt;
        targetUser.lgncnt = userData.lgncnt;
        targetUser.prntmod = userData.prntmod;
        targetUser.pagehdr = userData.pagehdr;
        targetUser.elecsngr = userData.elecsngr;
        targetUser.esngracs = userData.esngracs;
        targetUser.dfltsngr = userData.dfltsngr;
        targetUser.sngrrstrct = userData.sngrrstrct;
        targetUser.sP_UPDATE = userData.sP_UPDATE;
        targetUser.validator = userData.validator;
        targetUser.vldtprmt = userData.vldtprmt;
        targetUser.rsldprint = userData.rsldprint;
        targetUser.siteslct = userData.siteslct;

        // Send the updated user data to the server
        this._userService.updateUser(targetUser).subscribe(
          response => {
            if (response.status === 200 || response.status === 204) {
              Swal.fire({
                text: 'Privileges assigned successfully.',
                icon: 'success'
              });
            } else {
              Swal.fire({
                text: 'Failed to assign privileges.',
                icon: 'error'
              });
            }
          });
      } else {
        Swal.fire({
          text: 'Target user not found.',
          icon: 'error'
        });
      }
    } else {
      Swal.fire({
        text: 'Please select a valid user to assign privileges.',
        icon: 'warning'
      });
    }
  }

  // Function to filter users based on search term
  getFilteredUsers(term: string): Observable<userflModel[]> {
    const filteredSites = this.userAllData.filter(sno =>
      this.customSearch(term, this.userData)
    );
    return new Observable(observer => {
      observer.next(filteredSites);
      observer.complete();
    });
  }

  customSearch(term: string, item: userflModel): boolean {
    if (typeof term !== 'string') {
      return false;
    }
    term = term.toLowerCase();
    return item.useR_NAME.toLowerCase().includes(term);
  }

  onJobTypeChange(event: any): void {
    this.userData.joB_CD = event;
  }

  onSiteChange(event: any): void {
    this.siteData.reF_SITE = event;
  }

  onRoleChange(event: any): void {
    if (typeof event === 'string') {
      // Extract roleId before the hyphen
      const roleId = event.split('-')[0].trim();
      this.userData.rolE_ID = Number(roleId); // Convert to number
    }
  }

  checkAlreadyExisting(event: any) {
    if (this.userAllData.filter(x => x.useR_NAME == event.target.value).length >= 1) {
      Swal.fire({
        text: `Username already exists: ${event.target.value}`,
        icon: 'warning',
      });
      this.userData.useR_NAME = '';
      if (this.form.invalid) {
        // If the form is invalid, highlight all invalid fields
        Object.keys(this.form.controls).forEach(field => {
          const control = this.form.get(field);
          control?.markAsTouched({ onlySelf: true });
        });
        return;
      }
      // setTimeout(() => {
      //   this.el.nativeElement.querySelector('#userName').focus();
      // }, 500);
    } else if (event.target.value.length <= 6) {
      this._commonAlertService.userNameValidation();
    }
  }

  blockNumericInput(event: KeyboardEvent) {
    const key = event.key;
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

    // Block numbers but allow navigation keys
    if (!allowedKeys.includes(key) && /[0-9]/.test(key)) {
      event.preventDefault();
    }
  }

  restrictNonNumeric(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    const key = event.key;

    if (!allowedKeys.includes(key) && !/^\d$/.test(key)) {
      event.preventDefault(); // Block non-numeric characters
    }
  }

  onAddRecord() {
    this.form.reset(); // Reset the Angular form      
    this.isDisableSignature = false;
    this.userData.sngr = null;
    this.isAdding = true;
    const maxUserId = Math.max(...this.userAllData.map(record => parseInt(record.useR_ID, 10)), 0);
    const newUserId = (maxUserId + 1).toString();
    this.form.controls['txtNumber'].setValue(newUserId);
    this.toggleReadonlyState(true);
    this.operation = Operation.add;
    this.isSaveBtnActive = false;
    this.isCancelBtnActive = false;
    this.isEditBtnActive = true;
    this.isDeleteBtnActive = true;
    this.isDefaultSiteReadOnly = false;
    this.emptyTheForm();
    this.isNavigationActive = true;
    setTimeout(() => {
      this.el.nativeElement.querySelector('#userName').focus();
    }, 500);
    this.isAddBtnActive = true;
    if (this.form.invalid) {
      // If the form is invalid, highlight all invalid fields
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
  }

  emptyTheForm() {
    const userIdValue = this.form.controls['txtNumber'].value; // Store the current userID value
    this.isDisableSignature = false;
    this.form.reset({
      txtUserCode: '',
      txtName: '',
      txtFullName: '',
      joB_CD: '',
      reF_SITE: '',
      ddlFrom: '',
    });
    this.form.controls['txtNumber'].setValue(userIdValue); // Restore the userID value
  }

  Add() {
    this.userData.joB_CD = this.selectedJobType;
    this.userData.deF_SITE = this.siteData.reF_SITE.split(' - ')[0];
    if (this.userData.useR_ID && this.userData.useR_NAME && this.userData.fulL_NAME
      && this.userData.naT_ID && this.userData.email) {
      this._userService.addUser(this.userData).subscribe(
        response => {
          if (response.status === 200 || response.status === 204) {
            this.getAllUsersData();
            Swal.fire({
              text: registerSuccessMessage,
              icon: 'success'
            });
          }
          this.toggleReadonlyState(false);
          this.isAddBtnActive = false;
          this.isEditBtnActive = false;
          this.isCancelBtnActive = true;
          this.isSaveBtnActive = true;
          this.IsDisabled = false;
          this.isDisableSignature = true;
        },
        error => {
          this.IsDisabled = false;
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.userExistsMessage();
          } else {
            this._commonAlertService.addUserErrorMessage();
          }
        }
      );
    } else {
      this._commonAlertService.requiredFieldMessage();
      this.toggleReadonlyState(true);
      this.IsDisabled = false;
    }
  }

  onEditRecord() {
    this.isDisableSignature = false;
    this.toggleReadonlyState(true);
    this.disableOnEdit();
    this.isAddBtnActive = true;
    this.IsDisabled = false;
    this.isEdit = true;
    this.operation = Operation.edit;
    this.isNavigationActive = true;
    this.isSaveBtnActive = false;
    this.isCancelBtnActive = false;
    this.isDefaultSiteReadOnly = false;
    this.userAllDataBackup = JSON.parse(JSON.stringify(this.userAllData));
  }

  Update(userData: userflModel) {
    this.userData.deF_SITE = this.siteData.reF_SITE.split(' - ')[0];
    const requiredFields = [
      this.userData.useR_ID,
      // this.userData.useR_NAME,
      this.userData.fulL_NAME,
      this.userData.naT_ID
      // this.userData.email
    ];
    const allFieldsFilled = requiredFields.every(field => field && field.trim().length > 0);
    if (allFieldsFilled) {
      userData.joB_CD = this.userData.joB_CD;
      this._userService.updateUser(userData).subscribe(
        (response) => {
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
          }
          this.toggleReadonlyState(false);
          this.isAddBtnActive = false;
          this.isNavigationActive = false;
          this.IsDisabled = false;
          this.isSaveBtnActive = true;
          this.isCancelBtnActive = true;
          this.isDisableSignature = true;
        },
        (error) => {
          this.IsDisabled = false;
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.userExistsMessage();
          } else {
            this._commonAlertService.addUserErrorMessage();
          }
        }
      );
    } else {
      this._commonAlertService.requiredFieldMessage();
      this.toggleReadonlyState(true);
      this.IsDisabled = false;
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      // If the form is invalid, highlight all invalid fields
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    if (!this.isEdit) {
      this.isSaveBtnActive = false;
      this.isCancelBtnActive = false;
      this.isEditBtnActive = true;
      this.isDeleteBtnActive = false;
      this.isNavigationActive = false;
      this.AssignTheValueUsingFormControl();
      this.Add();
    }
    else {
      // this.AssignTheValueUsingFormControl() ;
      this.Update(this.userData);
    }
  }


  onDeleteRecord(_id: number) {
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._userService.deleteUser(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.isEditBtnActive = false;
            this.isAddBtnActive = false;
            this.isDeleteBtnActive = false;
            this.isCancelBtnActive = true;
            this.isSaveBtnActive = true;
            this.isDisableSignature = true;
            this.getAllUsersData();
            this._commonAlertService.deleteMessage();
          }
        },
        (error) => {
          // console.error('error caught in component')
          const status = error.status;
          if (status === 400) {
            this._commonAlertService.deleteErrorMessage();
          }
        });
    }
  }

  private userAllDataBackup: any[] = [];
  // Utility function to perform deep comparison
  private isEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  // Method to cancel the edit and restore original values
  onCancelRecord(_id: number) {
    this.isDisableSignature = true;
    this.toggleReadonlyState(false);

    if (this.isEdit) {
      // Find the index of the record with the given _id
      const index = this.userAllData.findIndex(x => x.useR_FL_ID === _id);
      if (index !== -1) {
        // Get the backup of the record from the original collection
        const originalData = this.userAllDataBackup.find(x => x.useR_FL_ID === _id);
        if (originalData) {

          // Also update the active user data to match the restored record
          this.userData = { ...originalData };

          // Recalculate any dependent fields
          const userJobRole = this.userAllJobData.find(job => job.joB_CD === this.userData.joB_CD?.toUpperCase());
          this.selectedJobType = userJobRole ? userJobRole.joB_TITLE : '';

          const siteIndex = this.siteAllData.findIndex(x => x.sitE_NO === this.userData.deF_SITE);
          if (siteIndex !== -1) {
            this.siteData.reF_SITE = `${this.siteAllData[siteIndex].sitE_NO} - ${this.siteAllData[siteIndex].sitE_NAME}`;
          } else {
            this.siteData.reF_SITE = '';
          }

          // Update UI controls
          this.operation = Operation.cancel;
          this.isCancelBtnActive = true;
          this.isSaveBtnActive = true;
          this.isAddBtnActive = false;
          this.isNavigationActive = false;
          this.isDisableSignature = true;
        }
      }
    } else {
      // Handle non-edit scenario (restore last record or reset)
      this.getRecord("last", this.userAllData.length - 1);
      this.isAddBtnActive = false;
      this.isEditBtnActive = false;
      this.isDeleteBtnActive = false;
      this.isCancelBtnActive = true;
      this.isNavigationActive = false;
      this.isDisableSignature = true;
    }
  }

  toggleReadonlyState(isEditable: boolean) {
    for (const controlName in this.form.controls) {
      if (this.form.controls.hasOwnProperty(controlName)) {
        const control = this.form.get(controlName);
        if (isEditable) {
          control?.enable();
        } else {
          control?.disable();
        }
      }
    }
  }

  disableOnEdit() {
    this.form.controls['txtName'].disable();
    this.form.controls['txtEmail'].disable();
    this.form.controls['txtTel'].disable();
  }

  AssignTheValueUsingFormControl() {
    const getFormValue = (controlName: string, defaultValue: any) => {
      const control = this.form.get(controlName);
      return control && control.value != null ? control.value : defaultValue;
    };
    var sngr = this.userData.sngr;
    this.userData = {
      useR_FL_ID: 0,
      sno: 0,
      rolE_ID: Number(this.userData.useR_ROLE.split(' - ')[0]),
      rolE_NAME: this.userData.useR_ROLE.split(' - ')[1],
      useR_ROLE: this.userData.useR_ROLE,
      useR_ID: getFormValue('txtNumber', 0),
      useR_CODE: getFormValue('txtUserCode', ''),
      useR_NAME: getFormValue(this.userData.fulL_NAME, ''),
      fulL_NAME: getFormValue('txtFullName', ''),
      naT_ID: getFormValue('txtNatId', ''),
      tel: getFormValue('txtTel', ''),
      email: getFormValue('txtEmail', ''),
      u_LVL: getFormValue('txtNumber', 0),
      joB_CD: getFormValue('joB_CD', ''),
      deF_SITE: getFormValue('reF_SITE', '').split(' - ')[0],
      // pasS_WORD: getFormValue('txtPassword', ''),
      billing: getFormValue('chkbilling', false),
      ndc: getFormValue('chkNDC', false),
      npc: getFormValue('chkNpc', false),
      md: getFormValue('txtDiscount', 0),
      rao: false,
      amin: false,
      lgnlmt: getFormValue('txtlgnlmt', 0),
      lgncnt: getFormValue('txtlgncnt', 0),
      prntmod: getFormValue('txtDiscount', ''),
      pagehdr: getFormValue('chkpagehdr', false),
      elecsngr: getFormValue('chkelecsngr', false),
      esngracs: getFormValue('chkesngracs', false),
      dfltsngr: getFormValue('chkdfltsngr', false),
      sngrrstrct: false,
      validator: getFormValue('chkvalidator', false),
      vldtprmt: getFormValue('chkvldprmt', false),
      rsldprint: getFormValue('chkdrsldprint', false),
      siteslct: getFormValue('chkSiteSelection', false),
      sP_UPDATE: getFormValue('chkdefaultspcmnRcvd', false),
      sigN_LINE1: getFormValue('txtsign_line1', ''),
      sigN_LINE2: getFormValue('txtsign_line2', ''),
      notes: getFormValue('txtnotes', ''),
      sngr: sngr,
      iS_ACTIVE: getFormValue('chkActive', false),
      IsAdd: false,
      IsEdit: false
    };
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  calculateCurrentIndex(currentSNO: number): number {
    let currentIndex = this.userAllData.findIndex(x => x.sno === currentSNO);
    return currentIndex + 1; // Start index is one-based
  }

  onSelectImage() {
    this.inputFile.nativeElement.click();
  }

  onRemoveImage() {
    this.previewImage.nativeElement.src = '';
    this.inputFile.nativeElement.value = '';
    this.imageSelected = false; // Reset imageSelected to false when removing image
    var userIndex = this.userAllData.findIndex(c => c.useR_ID == this.userData.useR_ID)
    if (userIndex >= 0) {
      this.userAllData[userIndex].sngr = null;
      this.userData.sngr = null;
    }
  }

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64Image = reader.result as string;
        this.onUpload();
      };
      reader.readAsDataURL(file);
    }
  }

  // This function is triggered when the user clicks "Upload"
  onUpload(): void {
    var userIndex = this.userAllData.findIndex(x => x.useR_FL_ID == this.userData.useR_FL_ID);
    if (userIndex >= 0) {
      this.userAllData[userIndex].sngr = this.base64Image.split(',')[1];
      this.userData.sngr = this.base64Image.split(',')[1];
    }
  }

  //Table Section Binding

  // Function to handle Edit/Save button click
  toggleEditUserSites() {
    this.isEditing = !this.isEditing;
    this.isSubmitBtnActive = false;
    if (this.isEditing) {
      // Start editing: add an empty row and set the focus on the new row.
      this.bindUserSiteGrid();
    } else {
      // Cancel editing: clear any newly added row.
      this.cancelEdit();
    }
  }

  bindUserSiteGrid(): void {
    if (this.userAllJobData.length > 0) {
      // Add an empty row only if `evReferenceRangeList` is initially empty
      if (this.userSiteList.length === 0) {
        this.addEmptyRow();
        setTimeout(() => {
          const inputsArray = this.siteNoInputs.toArray();
          if (inputsArray.length) {
            inputsArray[inputsArray.length - 1].nativeElement.focus();
          }
        }, 100);
      }
      this.userSiteList.forEach(item => item.isEditing = true);
      // } else if (shouldEdit) {
      //   this.userSiteList.forEach(item => item.isEditing = false);
      // }
    }
  }

  // Function to handle keydown event (for handling down arrow key)
  onKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowDown') {

      // If the down arrow is pressed on the last row, add a new row
      if (index === this.userSiteList.length - 1) {
        this.addEmptyRow();
        this.userSiteList.forEach(item => item.isEditing = true);
      }
    }
  }

  // Add empty row in the table 
  addEmptyRow() {
    const userSiteDetail = new userSiteAccesslModel();
    userSiteDetail.sitE_NO = '';
    userSiteDetail.abrv = '';
    userSiteDetail.sitE_NAME = '';
    userSiteDetail.isEditing = true;

    // Add the new row to the list and update `isEditing` for all rows
    this.userSiteList.push(userSiteDetail);

    // Use `setTimeout` with a delay to focus the newly added row
    setTimeout(() => {
      const inputsArray = this.siteNoInputs.toArray();
      if (inputsArray.length) {
        inputsArray[inputsArray.length - 1].nativeElement.focus();
      }
    }, 100);
  }

  cancelEdit() {
    this.isSubmitBtnActive = true;
    // Remove the last empty row if one was added during editing
    if (this.userSiteList.length > 0 && this.isRowEmpty(this.userSiteList[this.userSiteList.length - 1])) {
      this.userSiteList.pop();
    }
    // Reset editing mode for all items
    this.getSiteDataByUserId(this.userData.useR_ID);
    this.userSiteList.forEach(item => item.isEditing = false);
  }

  isRowEmpty(row: userSiteAccesslModel): boolean {
    return !row.sitE_NO && !row.abrv && !row.sitE_NAME;
  }

  // Method called on blur to initiate the API call and update the specific row
  onSiteNoChange(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (!value) {
      this.userSiteList.splice(index, 1);
    }

    // Check for duplicates in the reference range list
    if (this.isDuplicate(value, index)) {
      Swal.fire({
        text: "Site already exists in the list.",
        icon: "warning"
      });       
      return; // Exit the method if a duplicate is found
    }
   
    // Make API call to fetch site details
    const fetchDataObservable = this.getSiteDetailDataBySiteNo(value);

    if (!fetchDataObservable) {
      Swal.fire({
        title: "No Site Matched",
        text: "No sites matched your search criteria. Would you like to view all available sites?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          this.userSiteList = []; // Clear the list if no matches
          this.showModal('siteModel'); // Display the modal
          this.findAllSitesData("EMPTY"); // Fetch all sites
        }
      });
      return;
    }

    // Handle the API response
    fetchDataObservable.subscribe({
      next: (data) => {
        if (data) {
          // Update userSiteList with fetched data
          this.userSiteList[index].useR_ID = this.userData.useR_ID;
          this.userSiteList[index].sitE_NO = data.sitE_NO;
          this.userSiteList[index].abrv = data.abrv;
          this.userSiteList[index].sitE_NAME = data.sitE_NAME;
        } else {
          if (!data.sitE_NAME || !data.abrv)
            Swal.fire({
              text: "No site matched your search criteria.",
              icon: "info",
            });
          this.showModal('siteModel'); // Show modal if no data found
        }
      },
      error: (err) => {
        if (!this.userSiteList[index].sitE_NO)
          // console.error("Error during site search:", err);
          Swal.fire({
            text: "No site matched your search criteria.",
            icon: "info",
          });
        this.showModal('siteModel'); // Show modal in case of an error
        // Safely update the input field value if needed
        const inputElement = document.getElementById("searchInputSiteNo") as HTMLInputElement;
        if (inputElement) {
          inputElement.value = value?.trim() || ""; // Avoid direct assignment, use safe checks         
        }
        this.userSiteList.splice(index, 1);
        this.hasData = false;
        // this.findAllSitesData("EMPTY");
      },
    });
  }

  // Helper function to check for duplicates
  private isDuplicate(value: string, index: number): boolean {
    return this.userSiteList.some((item, i) =>
      item.sitE_NO === value && i !== index // Exclude the current item being edited
    );
  }

  // Method to call the API and update the source name for the specific item
  getSiteDetailDataBySiteNo(siteNo: string) {
    return this._userService.getSiteDetailsBySiteNo(siteNo);
  }

  // Show modal function to encapsulate modal display logic
  private showModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    const myModal = new Modal(modalElement);
    myModal.show();
  }

  onDeleteUserSite(_id: number, index: number) {
    const delBtn = confirm(
      _id === 0 ? "Do you want to cancel this site?" : "Do you want to delete this record?"
    );
  
    if (delBtn) {
      // Remove the item using the provided index
      if (index > -1 && index < this.userSiteList.length) {
        this.userSiteList.splice(index, 1);
      }
  
      // Call API delete only for saved records (_id > 0)
      if (_id > 0) {
        this.deleteUserSiteData(_id);
      }
    }
  }
  

  deleteUserSiteData(_id: number) {
    this._userService.deleteUserSite(_id).subscribe(
      (response: any) => {
        if (response.status === 200 || response.status === 204) {
          this.isEditBtnActive = false;
          this.isAddBtnActive = false;
          this.isDeleteBtnActive = false;
          this.isCancelBtnActive = true;
          this.isSaveBtnActive = true;
          this.isDisableSignature = true;
          this.userSiteList = this.userSiteList.filter(item => item.useR_SITES_ID !== _id);
          this.userSiteList.push();
          this._commonAlertService.deleteMessage();
          // Refresh data upon successful deletion

        }
      },
      (error) => {
        if (error.status === 400) {
          Swal.fire({
            text: deleteErrorMessage,
          });
        }
      }
    );
  }

  onSubmitList() {
    if (this.userSiteList.length >= 0) {
      this.registerUserSites();
    }
  }

  registerUserSites() {
    const item = this.userSiteList[0]?.sitE_NO;
    // Filter out empty rows based on key properties (e.g., sitE_NO, sitE_NAME, etc.)
    const validUserSites = this.userSiteList.filter(site => {
      return site.sitE_NO?.trim() && site.sitE_NAME?.trim();
    });

    // Check if the filtered list is empty
    if (!validUserSites.length) {
      this._commonAlertService.errorMessage();
      return;
    }
    // Assign the filtered list back to userSiteList for consistency
    this.userSiteList = validUserSites;
    // Call the service to save the data
    this._userService.registerUserSites(this.userSiteList).subscribe({
      next: (response) => {
        if (response.status === 200 || response.status === 204) {
          this._commonAlertService.commonMessage(); // Show success message
          this.userSiteList.forEach(item => item.isEditing = false);
          this.isEditing = false;
          this.IsDisabled = false;
          this.isSubmitBtnActive = true;
        }
      },
      error: (error) => {
        this.IsDisabled = false;
        const status = error.status;
        if (status === 409) {
          this._commonAlertService.warningMessage();
        } else {
          this._commonAlertService.errorMessage();
        }
      },
    });
  }

  onSearchSites() {
    const InpTestCode = document.getElementById("searchInputSiteNo") as HTMLInputElement;
    if (InpTestCode.value != '') {
      this.findAllSitesData(InpTestCode.value);
      this.displayFirstPage();
    } else
      this.findAllSitesData("EMPTY");
    this.displayFirstPage();
  }

  findAllSitesData(search: string) {
    this._userService.findAllSites(search).subscribe((data) => {
      if (data) {
        this.findAllSites = data;
        this.hasData = this.findAllSites.length > 0;
      } else {
        Swal.fire({
          text: "No sites matched your search criteria.",
          icon: "info"
        });
        this._commonAlertService.notFoundMessage();
      }
    })
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  onPageSizeChange(event: any): void {
    this.itemsPerPage = event;
    this.currentPage = 1; // Reset to first page when page size changes
    this.updatePagination();
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.userSiteList.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, totalPages) || 1;
  }

  // Method to display the first 10 records after search data populates
  displayFirstPage(): void {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.updatePagination();
  }

  // Function to add a selected record from the search results to the second table 
  addSite(site: any): void {
    // Check for duplicate entries
    const isDuplicate = this.userSiteList.some(
      (existingSite) =>
        existingSite.sitE_NO === site.sitE_NO
    );

    if (isDuplicate) {
      Swal.fire({
        text: "This site is already in the list.",
        icon: "warning",
      });
      return;
    }

    // Add new site to the list
    this.userSiteList.push({ ...site });

    Swal.fire({
      text: "Site added successfully.",
      icon: "success",
    });
    this.userSiteList.forEach(item => item.isEditing = true);
  }


  getRecord(input: string, SNO: number): void {
    const totalRecords = this.userAllData.length;
    const displayMessage = (message: string) => {
      Swal.fire({ text: message });
    };
    const updateSelectedJobType = () => {
      const userJobRole = this.userAllJobData.find(job => job.joB_CD === this.userData.joB_CD.toUpperCase());
      this.selectedJobType = userJobRole ? userJobRole.joB_TITLE : '';
    };
    const updateRecord = (recordIndex: number) => {
      this.userData = this.userAllData[recordIndex];
      this.assignDefaultSiteToUser();
      updateSelectedJobType();
      this.getSiteDataByUserId(this.userData.useR_ID);
    };
    this.getUserRole();
    switch (input) {
      case 'first':
        SNO === 1 ? displayMessage("You are already at the first record.") : updateRecord(0);
        break;
      case 'prev':
        SNO > 1 ? updateRecord(SNO - 2) : displayMessage("You are already at the first record.");
        break;
      case 'next':
        if (SNO < totalRecords) {
          updateRecord(SNO);
        } else {
          displayMessage("You are already at the last record.");
        }
        break;
      case 'last':
        SNO === totalRecords ? displayMessage("You are already at the last record.") : updateRecord(totalRecords - 1);
        break;
      default:
        console.warn("Invalid input for record navigation:", input);
        break;
    }
  }

}

