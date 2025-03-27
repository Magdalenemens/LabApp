import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AuthService } from '../../auth/auth.service';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';

@Component({
  selector: 'app-anatomic-pathology',
  templateUrl: './anatomic-pathology.component.html',
  styleUrls: ['./anatomic-pathology.component.scss'],
  providers: [SidebarComponent]
})
export class AnatomicPathologyComponent {
  selected: string = 'addanatomic'; // Default active tab
  url: string = '';
  abrv: string;

  constructor(public compOne: SidebarComponent, private router: Router,
    private _authService: AuthService) { }

  ngOnInit(): void {
    //this.router.url;
    this.changetab(this.router.url);
    this.abrv = EncryptionHelper.decrypt(this._authService.getSiteAbbreviation());
    //$('#btnadclient').addClass("is-active");
  }

  goToAnatomy($myParam: string = ''): void {

    this.selected = $myParam;
    this.url = '../clinical-module/Anatomic/' + $myParam;

    this.router.navigate([this.url]);
  }


  changetab(id: any) {

    // $('.tab-nav button').removeClass("is-active");
    // if (id.cont === "addclient")
    // $('#btnadclient').addClass("is-active");
    // else if (id === "specialprices")
    // $('#btnspecialprices').addClass("is-active");
  }
}
