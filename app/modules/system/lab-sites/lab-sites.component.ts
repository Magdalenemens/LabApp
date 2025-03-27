import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AuthService } from '../../auth/auth.service';
 
  

@Component({
  selector: 'app-lab-sites',
  templateUrl: './lab-sites.component.html',
  styleUrls: ['./lab-sites.component.scss'],
  providers: [SidebarComponent]
})
export class LabSitesComponent {
  selected: string = 'addData'; // Default active tab
  url: string = '';
  abrv: string;

  constructor(public compOne: SidebarComponent, private router: Router,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.changetab(this.router.url);   
    this.abrv = EncryptionHelper.decrypt(this._authService.getSiteAbbreviation());
  }

  goToLabsites($myParam: string = ''): void {
    this.selected = $myParam;
    this.url = '../system/Labsites/' + $myParam;
    this.router.navigate([this.url]);
  }

  changetab(id: any) {
    // $('.tab-nav button').removeClass("is-active");
    // if (id.cont === "addData")
    //   $('#addData').addClass("is-active");
    // else if (id === "siteList")
    //   $('#siteList').addClass("is-active");
  }
}

