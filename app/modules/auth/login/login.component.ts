import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { loginModel } from 'src/app/models/loginModel';
import { Router } from '@angular/router';
import { SiteService } from '../../masters/site/sites.service';
import { siteModel } from 'src/app/models/siteModel';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { UserService } from '../../system/users/users.service';
import { userSiteAccesslModel } from 'src/app/models/userSiteAccesslModel';
import { EncryptionHelper } from '../../../interceptors/encryption-helper';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  userData: loginModel = new loginModel();
  userSiteList: userSiteAccesslModel[] = [];
  loginForm: FormGroup;
  labSiteData: siteModel = new siteModel();
  siteForm: FormGroup;
  siteDropDown: any;
  sitePermissionGranted: boolean = false;
  isLoginFormVisible: boolean = true;
  isSiteSelectionVisible: boolean = false;
  isFieldsDisabled: boolean = false;
  isPasswordVisible: boolean = false;

  constructor(private fb: FormBuilder, private _authService: AuthService,
    private router: Router, private _siteService: SiteService,
    public _userService: UserService, public _commonAlertService: CommonAlertService) {
    this._authService.clearToken();
    this.initializeLoginForm();
  }

  initializeLoginForm() {
    this.loginForm = this.fb.group({
      userName: [new FormControl(), Validators.required],
      password: [new FormControl(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.createForm();
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  
  createForm(): void {
    this.siteForm = this.fb.group({
      reF_SITE: ['', Validators.required],
      cmpnY_NO: ['']

    });
  }

  login(): void {
    this.isFieldsDisabled = true;
    const user: loginModel = {
      userName: this.username,
      password: EncryptionHelper.encrypt(this.password),
      siteNo: ''
    };
    this._authService.authenticateUser(user).subscribe({
      next: (response) => {
        const status = response.status;
        if (status === 200 || response.status === 204) {
          const userId = response.body.userId;
          this.getSiteDataByUserId(userId);
          this.isSiteSelectionVisible = true;
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        this._authService.clearToken();
        Swal.fire({
          text: 'Invalid credentials',
        });
        this.isFieldsDisabled = false;
      }
    });
  }
  sitePopUp() {
    throw new Error('Method not implemented.');
  }

  fillSiteDropDown(): void {
    this._siteService.getAllSite().subscribe(sites => {
      this.siteDropDown = sites;
      this._authService.siteNo$.subscribe(x => this.labSiteData.sitE_NO = x);
      if (this.labSiteData.sitE_NO) {
        let _siteData = this.siteDropDown.find(x => x.sitE_NO == this.labSiteData.sitE_NO);
        this.siteForm.controls['reF_SITE'].setValue(_siteData.sitE_NO + ' - ' + _siteData.sitE_NAME);
        this.siteForm.controls['cmpnY_NO'].setValue(_siteData.cmpnY_NO);
      }
    });
  }

  // Load sites based on the UserId
  getSiteDataByUserId(userId: string): void {
    this._userService.getSitesByUserId(userId).subscribe({
      next: (data) => {
        this.siteDropDown = data && data.length > 0 ? data : this.fillSiteDropDown();
      },
      error: (error) => {
        console.error("Error fetching site data:", error);
        this._commonAlertService.ERROR_FETCHING_DATA();
      }
    });
  }


  findRefSite(siteno: any): void {
    const site = this.siteDropDown.find(site => site.sitE_NO == siteno);
    if (site) {
      this.labSiteData.reF_SITE = site.reF_SITE;
      this._authService.setSiteRefNo(site.reF_SITE);

      const company = this.labSiteData.cmpnY_NO = site.cmpnY_NO;
      this.labSiteData.cmpnY_NO = company;
      this._authService.setCompanyNo(site.cmpnY_NO);
      // console.log(selectedCompany);

      const refLab = this.labSiteData.reF_SITE_NAME = site.reF_SITE_NAME;
      this.labSiteData.reF_SITE_NAME = refLab;
      this._authService.setRefLab(site.reF_SITE_NAME);

      const siteName = this.labSiteData.sitE_NAME = site.sitE_NAME;
      this.labSiteData.sitE_NAME = siteName;
      this._authService.setSiteName(site.sitE_NAME);


      this.labSiteData.abrv = site.abrv;
      this._authService.setSiteAbbreviation(site.abrv);

    } else {
      console.error('Site not found');
    }
  }

  onSubmitSite(): void {
    const selectedSiteValue = this.siteForm.get('reF_SITE')?.value;
    // const parts = selectedSiteValue.split('-');
    // const refLab = parts.length > 1 ? parts[1].trim() : null;
    if (!selectedSiteValue) {
      console.error('No site selected.');
      return;
    }

    const site = selectedSiteValue.split('-')[0].trim();       
    this._authService.setSiteNo(site); // Store the selected site number    
    this.sitePermissionGranted = !this.sitePermissionGranted;
    if (this.sitePermissionGranted) {
      this.findRefSite(site);
      this.router.navigate(['/dashboard']);
      this.labSiteData.sitE_NO = site;
      this.cancel();
    } else {
      // console.log('Site permission revoked for site:', selectedSite);
    }
  }

  cancel(): void {
    this.siteForm.reset();
    this.isSiteSelectionVisible = false;
    this.isFieldsDisabled = false;
    this.isLoginFormVisible = true;
  }
}
