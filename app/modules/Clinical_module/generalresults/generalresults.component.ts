import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AuthService } from '../../auth/auth.service';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';

@Component({
  selector: 'app-generalresults',
  templateUrl: './generalresults.component.html',
  styleUrls: ['./generalresults.component.scss'],
  providers: [SidebarComponent]
})

export class GeneralresultsComponent {
  selected: string = 'addgeneralresults'; // Default active tab
  url: string = '';
  abrv: string;

  constructor(public compOne: SidebarComponent, private router: Router,
    private _authService: AuthService
  ) { }
  
  ngOnInit(): void {
    this.changetab(this.router.url);
    this.abrv = EncryptionHelper.decrypt(this._authService.getSiteAbbreviation());
  }

  goToGeneralLab($myParam: string = ''): void {
    this.selected = $myParam;
    this.url = '../clinical-module/GeneralResults/' + $myParam;

    this.router.navigate([this.url]);
  }
  changetab(id: any) {
  }
}
