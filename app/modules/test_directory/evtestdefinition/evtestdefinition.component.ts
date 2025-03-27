import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/auth.service';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';

@Component({
  selector: 'app-evtestdefinition',
  templateUrl: './evtestdefinition.component.html',
  styleUrls: ['./evtestdefinition.component.scss'],
  providers: [SidebarComponent]
})
export class EvtestdefinitionComponent {
  selected: string = 'addevtestdefinition'; // Default active tab
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

  goToEvTestDefinition($myParam: string = ''): void {
    this.selected = $myParam;
    this.url = '../test-directory/evtestdefinition/' + $myParam;

    this.router.navigate([this.url]);
  }

  changetab(id: any) {

    // $('.tab-nav button').removeClass("is-active");
    // if (id.cont === "addclient")
    // $('#btnadclient').addClass("is-active");
    // else if (id === "specialprices")
    // $('#btnspecialprices').addClass("is-active");
  }

  exit(): void {
    Swal.fire({
      title: 'Are you sure you want to exit?',
      text: 'Any unsaved changes may be lost.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, exit',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal2-popup', // Ensure the class name matches your CSS
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}

