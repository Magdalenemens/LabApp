import { Component, OnInit, HostListener  } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { SiteService } from 'src/app/modules/masters/site/sites.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userId: string;
  userName: string;
  fullName: string;
  site: string | null = null;
  company: string | null = null;
  refSite: any;
  userSystemIp: any;
  loginTime: any;
  logoutTime: any;
  isDropdownOpen = false;
  abrv: string;

  constructor(private _authService: AuthService,
    private _siteService: SiteService) { }

  ngOnInit(): void {
    this._authService.userName$.subscribe(
      userName => {
        this.userName = EncryptionHelper.decrypt(userName)
      }
    );
    this.fullName = EncryptionHelper.decrypt(this._authService.getUserFullName());
    this.userId = EncryptionHelper.decrypt(this._authService.getuserId());
    this.site = EncryptionHelper.decrypt(this._authService.getSiteNo());
    this.company = EncryptionHelper.decrypt(this._authService.getCompanyNo());
    this.refSite = EncryptionHelper.decrypt(this._authService.getRefSiteNo());
    let getLoginAndLogoutTime;
    this._siteService.getLoginTimeId(Number(EncryptionHelper.decrypt(this._authService.getuserId()))).subscribe(
      x => {
        getLoginAndLogoutTime = x;
        this.logoutTime = getLoginAndLogoutTime[0].ouT_DTTM;
        this.loginTime = getLoginAndLogoutTime[0].iN_DTTM;
      }
    );
    this.abrv = EncryptionHelper.decrypt(this._authService.getSiteAbbreviation());
  }

 

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
}

@HostListener('document:click', ['$event'])
closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
        this.isDropdownOpen = false;
    }
}

}
