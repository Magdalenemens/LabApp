import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PriceMasterListComponent } from './price-master-list/price-master-list.component';
import { MasterListTwoComponent } from './master-list-two/master-list-two.component';
import { MasterListThreeComponent } from './master-list-three/master-list-three.component';
import { SalesPricesComponent } from './sales-prices.component';

 
 

const routes: Routes =
  [
    {
      path: '',
      component: SalesPricesComponent,
      children: [
        {
          path: 'price-master-list',
          component: PriceMasterListComponent
        },
        {
          path: 'master-list-two',
          component: MasterListTwoComponent
        },
        {
          path: 'master-list-three',
          component: MasterListThreeComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class salesPriceRoutingModule {


}