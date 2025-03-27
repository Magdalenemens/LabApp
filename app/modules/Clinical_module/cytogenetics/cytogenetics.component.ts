import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AuthService } from '../../auth/auth.service';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';

@Component({
  selector: 'app-cytogenetics',
  templateUrl: './cytogenetics.component.html',
  styleUrls: ['./cytogenetics.component.scss'],
  providers: [SidebarComponent]
})
export class CytogeneticsComponent {
  selected: string = 'addcytogenetics'; // Default active tab
  url: string = '';
  abrv: string;

  constructor(public compOne: SidebarComponent, private router: Router,
    private _authService: AuthService
  ) { }
  
  ngOnInit(): void {
    //this.router.url;
    this.changetab(this.router.url);
    this.abrv = EncryptionHelper.decrypt(this._authService.getSiteAbbreviation());
    //$('#btnadclient').addClass("is-active");
  }

  goToCytogenetics($myParam: string = ''): void {
    this.selected = $myParam;
    this.url = '../clinical-module/Cytogenetics/' + $myParam;
    this.router.navigate([this.url]);
  }

  changetab(id: any) {
  }
}
