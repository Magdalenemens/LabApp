import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestEntryRoutingModule } from './test-entry-routing.module';
import { TestEntryComponent } from './test-entry.component';
import { AddTestEntryComponent } from './add-test/add-test.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TestEntryComponent,AddTestEntryComponent],
  imports: [
    CommonModule,
    TestEntryRoutingModule,
    FormsModule
  ]
})
export class TestEntryModule { }
