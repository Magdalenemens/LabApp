import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SiteService } from '../masters/site/sites.service';
import { DatePipe } from '@angular/common';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';
import { changePasswordRequestModel, loginFlModel } from 'src/app/models/loginModel';
import { UserService } from '../system/users/users.service';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Clinical_Modules, Finance, Management_Reporting, Master_Setup, Orders, System, Test_Directory } from 'src/app/common/moduleNameConstant';
import { moduleBaseAction, roleBaseAction } from 'src/app/models/roleBaseAction';
import { modulePermissionModel, rolePermissionModel } from 'src/app/models/rolePermissionModel';
import { PermissionService } from 'src/app/services/permission.service';
import Swal from 'sweetalert2';
import { LoaderService } from '../shared/services/loaderService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',

})
export class DashboardComponent {
  chnagePasswordForm: FormGroup;

  rolepermissionmodel: rolePermissionModel[] = [];
  rolebaseaction: roleBaseAction = new roleBaseAction();

  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordChangeModel: changePasswordRequestModel[] = [];
  passwordChangeReuestData: changePasswordRequestModel = new changePasswordRequestModel();

  userId: string;
  userName: string;
  password: string;
  fullName: string;
  site: string | null = null;
  refSite: any;
  refLab: any;
  siteName: any;
  userSystemIp: any;
  loginTime: any;
  logoutTime: any;
  isCurrentPasswordInvalid: boolean = false;
  isNewPasswordInvalid: boolean = false;
  submitted = false;
  isSavesDisabled: boolean = true;

  oldPasswordInvalid: boolean = false;
  newPasswordInvalid: boolean = false;
  confirmPasswordInvalid: boolean = false;
  oldPasswordError: string = '';
  newPasswordError: string = '';
  confirmPasswordError: string = ''; s
  moduleBasedActionModel = new moduleBaseAction();

  loginFlId: number | null = null; // Store the ID
  userLoginTime: Date;   // Store the ID
  userCode: string;
  userFullName: string;
  userIP: any;
  userID; any;

  userloginList: loginFlModel[] = [];

  constructor(private formBuilder: FormBuilder, private _authService: AuthService,
    private _siteService: SiteService, private _userService: UserService,
    private _commonAlertService: CommonAlertService, private router: Router,
    private _permissionService: PermissionService, private _loaderService: LoaderService) {


  }

  ngOnInit(): void {
    this.IntializeSession();
    this.initializeMethods();
    this._permissionService.getModuleBaseRoleAccess();
    this._loaderService.ShowHideLoader(2000);
  }

  IntializeSession() {
    this._loaderService.show();
    this._authService.userName$.subscribe(
      userName => {
        this.userName = EncryptionHelper.decrypt(userName)
      }
    );
    this.fullName = EncryptionHelper.decrypt(this._authService.getUserFullName());
    this.userId = EncryptionHelper.decrypt(this._authService.getuserId());
    this.site = EncryptionHelper.decrypt(this._authService.getSiteNo());
    this.refSite = EncryptionHelper.decrypt(this._authService.getRefSiteNo());
    this.refLab = EncryptionHelper.decrypt(this._authService.getRefLab());
    this.siteName = EncryptionHelper.decrypt(this._authService.getSiteName());
    let getLoginAndLogoutTime;
    this._siteService.getLoginTimeId(Number(EncryptionHelper.decrypt(this._authService.getuserId()))).subscribe(
      x => {
        getLoginAndLogoutTime = x;
        this.loginTime = getLoginAndLogoutTime[0].iN_DTTM;
      }
    );
    setTimeout(() => {
      this.loadPermission();
    }, 2000);
    this._loaderService.hide();
  }

  loadPermission() {
    this.moduleBasedActionModel = this._permissionService.getModuleBaseRoleAccess();
  }

  initializeMethods() {
    this.GetAllLoginHistory();
  }

  // Method to validate fields and enable/disable the save button
  validateFields(): void {
    this.isSavesDisabled = !(this.oldPassword.trim() && this.newPassword.trim() && this.confirmPassword.trim());
  }

  onChangePassword(): void {
    // Only proceed if the save button is enabled
    if (this.isSavesDisabled) return;
    ;
    const passwordChangeRequestData: changePasswordRequestModel = {
      currentPassword: EncryptionHelper.encrypt(this.oldPassword),
      newPassword: EncryptionHelper.encrypt(this.newPassword),
      confirmPassword: EncryptionHelper.encrypt(this.confirmPassword),
    };

    this._userService.changePassword(passwordChangeRequestData).subscribe({
      next: (response) => {
        if ([200, 204].includes(response.status)) {
          this._commonAlertService.changePasswordSuccessMessage();
        }
      },
      error: (error) => {
        const status = error.status;
        switch (status) {
          case 400:
            this._commonAlertService.inCorrectPassword();
            break;
          case 409:
            this._commonAlertService.passworDuplicatedMessage();
            break;
          case 401:
            this._commonAlertService.userAuthorzedErrorMessage();
            break;
          default:
            // Handle other errors
            break;
        }
      },
    });
  }

  validatePasswords() {
    // Check if all fields are filled
    this.isSavesDisabled = !(
      this.oldPassword?.trim() &&
      this.newPassword?.trim() &&
      this.confirmPassword?.trim()
    );

    // Reset validation states
    this.newPasswordInvalid = false;
    this.confirmPasswordInvalid = false;
    this.oldPasswordInvalid = false;
    this.oldPasswordError = '';
    this.newPasswordError = '';
    this.confirmPasswordError = '';

    // Validate old password
    if (!this.oldPassword?.trim()) {
      this.oldPasswordInvalid = true;
      this.oldPasswordError = 'Old Password is required.';
    }

    // Validate new password
    if (!this.newPassword?.trim()) {
      this.newPasswordInvalid = true;
      this.newPasswordError = 'New Password is required.';
      this.isSavesDisabled = true;
    } else if (this.newPassword.length < 6) {
      this.newPasswordInvalid = true;
      this.newPasswordError = 'New Password must be at least six characters long.';
      this.isSavesDisabled = true;
    }

    // Validate confirm password
    if (!this.confirmPassword?.trim()) {
      this.confirmPasswordInvalid = true;
      this.confirmPasswordError = 'Confirm Password is required.';
      this.isSavesDisabled = true;
    } else if (this.confirmPassword.length < 6) {
      this.confirmPasswordInvalid = true;
      this.confirmPasswordError = 'Confirm Password must be at least six characters long.';
      this.isSavesDisabled = true;
    } else if (this.confirmPassword !== this.newPassword) {
      this.confirmPasswordInvalid = true;
      this.confirmPasswordError = 'Passwords do not match.';
      this.isSavesDisabled = true;
    }
  }

  GetAllLoginHistory(): void {
    this._siteService.getAllLoginHistory().subscribe(
      res => {
        this.userloginList = res;
        if (this.userloginList.length > 0) {
          // Identify the currently logged-in user's login history
          const currentUserId = EncryptionHelper.decrypt(this._authService.getuserId()).toString();
          const currentUserLoginHistory = this.userloginList.find(login => login.u_ID === currentUserId);
          // 10 records
          if (currentUserLoginHistory) {
            this.loginFlId = currentUserLoginHistory.logiN_FL_ID;
            this.userIP = currentUserLoginHistory.statioN_ID;
            this.userID = currentUserLoginHistory.u_ID;
            this.userLoginTime = currentUserLoginHistory.iN_DTTM;
          } else {
            console.error('Current user login history not found.');
          }
        } else {
          console.error('Login history is empty.');
        }
      },
      (error) => {
        console.error('Error loading login history:', error);
      }
    );
  }


  logoutAndUpdate(event: Event): void {
    // Prevent the default action (if this is attached to an anchor, for example)
    event.preventDefault();

    // Show the confirmation dialog using SweetAlert2
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed logout, prepare the logout model data
        const logoutTime = new Date();
        const loginModel: loginFlModel = {
          logiN_FL_ID: this.loginFlId,
          statioN_ID: this.userIP,
          u_ID: this.userID,
          fulL_NAME: '',
          iN_DTTM: this.userLoginTime,
          ouT_DTTM: logoutTime,
          useR_CODE: ''
        };

        // Call the service to update the logout time
        this._siteService.updateLogoutTime(loginModel).subscribe(
          (response) => {
            if (response.status === 200 || response.status === 204) {
              // Show a success message that auto-closes after 1.5 seconds
              Swal.fire({
                text: 'You have successfully logged out!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
              }).then(() => {
                // After the success message auto-closes, clear the token and redirect to the login screen
                this._authService.clearToken();
                this.router.navigate(['/login']);
              });
            } else {
              Swal.fire({
                text: 'An error occurred while updating logout time.',
                icon: 'error'
              });
            }
          },
          (error) => {
            if (error.status === 409) {
              Swal.fire({
                text: 'User already exists.',
                icon: 'warning'
              });
            } else {
              Swal.fire({
                text: 'An error occurred while updating logout time.',
                icon: 'error'
              });
            }
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Optionally show a cancellation message
        Swal.fire({
          text: 'Logout cancelled, you are still logged in.',
          icon: 'info'
        });
      }
    });
  }
}




