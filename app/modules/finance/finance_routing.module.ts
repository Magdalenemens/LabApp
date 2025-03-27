import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard'; 

const routes: Routes = [

  {
    path: 'Biling',
    loadChildren: () => import('./biling/biling.module').then(m => m.bilingModule)
  },
  {
    path: 'SalesPrices',
    loadChildren: () => import('./sales-prices/sales-prices.module').then(m => m.salesPriceModule)  
  },
  {
    path: 'ClientAccount',
    loadChildren: () => import('./client-account/client-account.module').then(m => m.clientaccountModule)    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FianceRoutingModule { }