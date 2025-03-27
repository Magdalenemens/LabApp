import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CytogeneticsLoginComponent } from './cytogenetics-login/cytogenetics-login.component';
import { PreAnalyticalReceivingComponent } from './preanalyticalreceiving/preanalyticalreceiving.component';
import { APReceivingComponent } from './ap-receiving/ap-receiving.component.';
import { CustomerQuotationComponent } from './customer-quotation/customer-quotation.component';
import { CytogeneticOrdersComponent } from './cytogenetic-orders/cytogenetic-orders.component';
 import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [

  {
    path: 'orders',
    loadChildren: () => import('./orderentry/orders.module').then(m => m.OrdersModule)    
  },
  {
    path: 'ordersnew',
    loadChildren: () => import('./orderentrynew/ordersnew.module').then(m => m.OrdersNewModule)    
  },
  {
    path: 'orders-receiving',
    loadChildren: () => import('./centralreceiving/orders-receiving.module').then(m => m.OrdersReceivingModule) 
  },
  {
    path: 'cytogenetics-login',
    component: CytogeneticsLoginComponent   
  },
  {
    path: 'ap-receiving',
    component: APReceivingComponent  
  },
  {
    path: 'pre-analytical-receiving',
    //loadChildren: () => import('./preanalyticalreceiving/pre-analytical-receiving.module').then(m => m.PreAnalyticalsReceivingModule)\\
    component: PreAnalyticalReceivingComponent   
  },
  {
    path: 'environmentalorders',
    loadChildren: () => import('./environmentalorder/environmentalorders.module').then(m => m.EnvironmentalordersModule)
    //component:EnvironmentalordersComponent  
  },
  {
    path: 'customer-quotationComponent',
    component: CustomerQuotationComponent  
  },
  {
    path: 'cytogenetics-Orders',
    component: CytogeneticOrdersComponent 
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderprocessingRoutingModule { }
