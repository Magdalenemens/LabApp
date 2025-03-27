import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { AuthService } from '../../auth/auth.service';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';

@Component({
  selector: 'app-orders',
  templateUrl: './environmentalorders.component.html',
  styleUrls: ['./environmentalorders.component.scss'],
  providers: [SidebarComponent]
})
export class EnvironmentalordersComponent {
  selected: string = 'AddEnvironmentalOrder'; // Default active tab
  url: string = '';
  abrv: string;
  constructor(public compOne: SidebarComponent, private router: Router, private route: ActivatedRoute,
    private _authService: AuthService
  ) { }
  ngOnInit(): void {
    // Check query parameters for tab navigation
    this.abrv = EncryptionHelper.decrypt(this._authService.getSiteAbbreviation());
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'];
      if (tab) {
        this.selected = tab;
        if (tab === 'AddEnvironmentalOrder') {
          this.addOrders(tab);
        }
      }
    });
  }

  addOrders($myParam: string = ''): void {
    this.selected = $myParam;
    this.url = '../orderprocessing/environmentalorders/' + $myParam;
    this.router.navigate([this.url]);
  }

  ListOrders($myParam: string = ''): void {
    this.selected = $myParam;
    this.url = '../orderprocessing/environmentalorders/' + $myParam;
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
