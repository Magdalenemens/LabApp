import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Authroutingmodule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
@NgModule({
  declarations: [    
  ],
  imports: [
    CommonModule,
    Authroutingmodule,
    FormsModule,
    ReactiveFormsModule
  ],    
 
})
export class AuthModule { }
