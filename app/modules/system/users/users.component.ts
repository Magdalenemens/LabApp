import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { SharedService } from '../../shared/services/sharedService';
import { AuthService } from '../../auth/auth.service';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [SidebarComponent]
})

export class UserComponent {
  selected: string = 'adduser'; // Default active tab
  url: string = '';
  abrv: string;

  constructor(public compOne: SidebarComponent, private router: Router,
    public _sharedservice: SharedService, private route: ActivatedRoute,
    private _authService: AuthService) {
  }
  ngOnChnage() {
    this.selected = this._sharedservice.selected;
  }

  ngOnCheck() {
    this.selected = this._sharedservice.selected;
  }

  ngOnInit(): void {
    var url = this.router.url.split('/');
    this._sharedservice.selected = url[3] + '/';
    this.abrv = EncryptionHelper.decrypt(this._authService.getSiteAbbreviation());
  }

  goToDataEnty($myParam: string = ''): void {
    this.selected = $myParam;
    this._sharedservice.selected = $myParam;
    // if ($myParam == 'logintracking') {
    //   this.url = '../system/Login-track'  ;
    // } else {
    this.url = '../system/users/' + $myParam;
    // }

    this.router.navigate([this.url]);
  }

  EditClient($myParam: string = ''): void {

    this.selected = $myParam;
    this._sharedservice.selected = $myParam;

    this.url = '../system/users/adduser/' + $myParam;
    this.router.navigate([this.url]);
  }

  changetab(id: any) {

  }


}

