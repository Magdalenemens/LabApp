import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersReceivingComponent } from './orders-receiving.component';
import { OrderReceivingComponent } from './order-receiving/order-receiving.component';
 import { AuthGuard } from '../../auth/auth.guard';
//import { ListOrderentryComponent } from './list-orderentry/list-orderentry.component';


const routes: Routes =
  [
    {
      path: '',
      component: OrdersReceivingComponent,       
      children: [
        {
          path: 'OrderReceiving',
          component: OrderReceivingComponent         
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersReceivingRoutingModule {


}
