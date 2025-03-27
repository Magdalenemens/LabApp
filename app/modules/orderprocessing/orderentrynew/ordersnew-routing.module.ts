import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOrderentrynewComponent } from './list-orderentrynew/list-orderentrynew.component';
import { AddOrderentrynewComponent } from './add-orderentrynew/add-orderentrynew.component';
import { OrderentrynewComponent } from './orderentrynew.component';
import { AuthGuard } from '../../auth/auth.guard';
 

const routes: Routes =
  [
    {
      path: '',
      component: OrderentrynewComponent,   
      children: [
        {
          path: 'AddOrderentryNew',
          component: AddOrderentrynewComponent        
        },
        {
          path: 'ListOrderentryNew',
          component: ListOrderentrynewComponent        
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersNewRoutingModule {


}
