import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  providers: [SidebarComponent]
})
export class ClientsComponent {
  selected: string = 'addclient'; // Default active tab
  url: string = '';
  constructor(public compOne: SidebarComponent,private router: Router) {
  }

  ngOnInit(): void {
    //this.router.url;
    this.changetab(this.router.url);
    //$('#btnadclient').addClass("is-active");
  }
  
  goToVotes($myParam: string = ''): void {    
   this.selected=$myParam;
   this.url='../masters/clients/'+$myParam;
   
   this.router.navigate([this.url]);
  }

  EditClient($myParam: string = ''): void {
    
   this.selected=$myParam;   
   this.url='../masters/clients/addclient/'+$myParam;   
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
