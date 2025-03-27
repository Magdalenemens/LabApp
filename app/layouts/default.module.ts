import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default/default.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { defaultroutingmodule } from './default-routing.module';
import { TimezonePipe } from '../common/timezone.pipe';
 




@NgModule({
   declarations: [DefaultComponent,HeaderComponent,TimezonePipe,SidebarComponent,FooterComponent],
  imports: [
    CommonModule,
    defaultroutingmodule,
 ],
  exports:[DefaultComponent,HeaderComponent,SidebarComponent,FooterComponent]
})
export class DefaultModule { }
