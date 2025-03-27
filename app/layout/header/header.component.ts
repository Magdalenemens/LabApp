import { Component, OnInit } from '@angular/core';
 
//import { OktaAuth } from '@okta/okta-auth-js';
// import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

// Services
//import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {  
  userName: string = "";
  closeResult = '';
  constructor(
    public router: Router,
  ) {
    // customize default values of modals used by this component tree
    // config.backdrop = 'static';
    // config.keyboard = false;
  }
  async ngOnInit() {        
    //this.authservice.getuserClaims().then(res => this.userName = res.idToken.claims.name);
  }
  // async login() {
  //   await this.OktaAuth.signInWithRedirect({
  //     originalUri: '/home'
  //   });
  // }
  // logout(content: any) {    
  //    this.authservice.logout();
  // }

  open(content: any) {
    // this.modalService.open(content, { centered: true });
  }


}
