import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [SidebarComponent]
})
export class OrdersComponent {
  selected: string = 'AddOrderentry'; // Default active tab
  url: string = '';
  constructor(public compOne: SidebarComponent,private router: Router) { }
  ngOnInit(): void {
    //this.router.url;
    this.changetab(this.router.url);
    //$('#btnadclient').addClass("is-active");
  }
  
  addOrders($myParam: string = ''): void {
    
   this.selected=$myParam;
    this.url ='../orderprocessing/orders/'+$myParam;
   
    this.router.navigate([this.url]);
  }
  EditOrders($myParam: string = ''): void {
    
   this.selected=$myParam;
   
    this.url = '../orderprocessing/orders/' + $myParam;
   
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
