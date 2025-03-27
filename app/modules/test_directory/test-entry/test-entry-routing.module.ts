import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestEntryComponent } from './test-entry.component';
import { AddTestEntryComponent } from './add-test/add-test.component';

const routes: Routes = [
  { path: 'test-entry', component: TestEntryComponent},
  {path: 'add-test/:id', component: AddTestEntryComponent}];
 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestEntryRoutingModule { }
