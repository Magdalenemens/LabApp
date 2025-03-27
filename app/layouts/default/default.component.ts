import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // if (!this.authService.isLoggedIn()) {
    //   this.authService.login();
    // }
  }

  logintriggered(){
    // this.authService.login();
  }

  logouttriggered(){
    // this.authService.logout();
    alert('say hello');
  }
}
