import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, ElementRef,  Injectable, OnInit, Renderer2, } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { SiteService } from 'src/app/modules/masters/site/sites.service';
import { LOGOUT_CONFIRMATION, updateSuccessMessage, USER_ALREADY_EXISTS, USER_LOGOUT, warningMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { loginFlModel } from 'src/app/models/loginModel';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';

import { PermissionService } from 'src/app/services/permission.service';
import { moduleBaseAction } from 'src/app/models/roleBaseAction';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  @Injectable({
    providedIn: 'root'
  })

  Route: string = "";
  addOrders: any;
  isSidebarExpanded: boolean = false;
  logoutTime: any;
  loginTime: any;
  datePipe: any;
  loginFlId: number | null = null; // Store the ID
  userLoginTime: Date;   // Store the ID
  userCode: string;
  userFullName: string;
  userIP: any;
  userID; any;
  userloginList: loginFlModel[] = [];
  moduleBasedActionModel = new moduleBaseAction();

  constructor(
    private router: Router, private route: ActivatedRoute, private el: ElementRef,
    private renderer: Renderer2, public _authService: AuthService,
    private _permissionService: PermissionService, private _siteService: SiteService) {

  }

  ngOnInit(): void {
    this.intializeMethods();
    
    // Listen for clicks anywhere on the page
    this.renderer.listen('document', 'click', (event: Event) => {
      const clickedInside = this.el.nativeElement.contains(event.target);
      const toggleButton = document.querySelector('.right-arrow-btn'); // Ensure this is the correct selector

      // Close sidebar only if clicked outside and not on the toggle button
      if (!clickedInside && event.target !== toggleButton) {
        this.isSidebarExpanded = false;
      }
    });
  }

  intializeMethods() {
    this.GetAllLoginHistory();
    this._permissionService.getModuleBaseRoleAccess();
    setTimeout(() => {
      this.loadPermission();
    }, 2000);
  }

  loadPermission() {
    this.moduleBasedActionModel = this._permissionService.getModuleBaseRoleAccess();
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
      });
  }

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  collapseSidebar(): void {
    this.isSidebarExpanded = false;
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

  OrderReceiving($myParam: string = ''): void {
    const navigationDetails: string[] = ['/orderprocessing/orders-receiving/'];
    if ($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }

  goToGeneralLab($myParam: string = ''): void {
    const navigationDetails: string[] = ['/clinical-module/GeneralResults'];
    if ($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }

  goToMicroBiology($myParam: string = ''): void {
    const navigationDetails: string[] = ['/clinical-module/MicroBiology'];
    if ($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }

  goToAnatomy($myParam: string = ''): void {
    const navigationDetails: string[] = ['/clinical-module/Anatomic'];
    if ($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }

  goToCytogenetics($myParam: string = ''): void {
    const navigationDetails: string[] = ['/clinical-module/Cytogenetics'];
    if ($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }

  goToSelect($myParam: string = ''): void {
    const navigationDetails: string[] = ['/test-directory/Testdefinition'];
    if ($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }

  goToVotes($myParam: string = ''): void {
    const navigationDetails: string[] = ['/masters/clients/'];
    if ($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }

  UrlRedirect(val: string) {
    this.router.navigateByUrl(val);
  }
}
