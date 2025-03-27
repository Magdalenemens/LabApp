import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BillsGenerationComponent } from './bills-generation/bills-generation.component';
import { BillsListingComponent } from './bills-listing/bills-listing.component';
import { BillsChecksComponent } from './bills-checks/bills-checks.component';
import { BilingComponent } from './biling.component';
 
 

const routes: Routes =
  [
    {
      path: '',
      component: BilingComponent,
      children: [
        {
          path: 'bills-generation',
          component: BillsGenerationComponent
        },
        {
          path: 'bills-listing',
          component: BillsListingComponent
        },
        {
          path: 'bills-checks',
          component: BillsChecksComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class bilingRoutingModule {


}