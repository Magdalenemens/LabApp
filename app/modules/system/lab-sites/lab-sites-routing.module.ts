import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LabSitesComponent } from './lab-sites.component';
import { DataEntryComponent } from './data-entry/data-entry.component';
 
 
 import { SiteListComponent } from './site-list/site-list.component';
import { SiteTestsAssignmentComponent } from './site-tests-assignment/site-tests-assignment.component';
import { SiteTestsListsComponent } from './site-tests-lists/site-tests-lists.component';
 
 

const routes: Routes =
  [
    {
      path: '',
      component: LabSitesComponent,
      children: [
        {
          path: 'addData',
          component: DataEntryComponent
        },
        {
          path: 'siteTestsAssignment',
          component: SiteTestsAssignmentComponent,
        },
        {
          path: 'siteList',
          component: SiteListComponent
        },
        {
          path: 'siteTestsList',
          component:  SiteTestsListsComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class labsitesRoutingModule {


}