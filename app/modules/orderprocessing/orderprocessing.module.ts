import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderprocessingRoutingModule } from './orderprocessing_routing.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { NgSelectModule } from '@ng-select/ng-select';
import { NgxEditorModule } from 'ngx-editor';
import { APReceivingComponent } from './ap-receiving/ap-receiving.component.';
import { AppComponent } from 'src/app/app.component';



@NgModule({
  declarations: [ 
   APReceivingComponent
  ],

  imports: [
    CommonModule,
    OrderprocessingRoutingModule,
    FormsModule,
    NgSelectModule,
    NgxEditorModule,
    ReactiveFormsModule

  ],  
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderprocessingModule { }
