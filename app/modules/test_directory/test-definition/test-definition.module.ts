import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestDefinitionRoutingModule } from './test-definition-routing.module';
import { ReferenceRangesComponent } from './reference-ranges/reference-ranges.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
   // AddTestDirectoryComponent, //commented by roufal
    ReferenceRangesComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,  
    FormsModule,
    ReactiveFormsModule,
    TestDefinitionRoutingModule
  ]
})


export class TestDefinitionModule { }