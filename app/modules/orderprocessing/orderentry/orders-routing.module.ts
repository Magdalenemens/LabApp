import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { AddOrderentryComponent } from './add-orderentry/add-orderentry.component';
import { ListOrderentryComponent } from './list-orderentry/list-orderentry.component';
import { AuthGuard } from '../../auth/auth.guard';
 


const routes: Routes =
  [
    {
      path: '',
      component: OrdersComponent,
      // canActivate: [AuthGuard], // Apply guard at the parent level
      children: [
        {
          path: 'AddOrderentry',
          component: AddOrderentryComponent,
          // canActivate: [AuthGuard],
          // data: { roles: roleNameConstant.roleId }, // Use the constant array here
        },
        {
          path: 'ListOrderentry',
          component: ListOrderentryComponent,
          // canActivate: [AuthGuard],
          // data: { roles: roleNameConstant.roleId }, // Use the constant array here
        },
      ],
    }
    // { path: '**', redirectTo: '/login', pathMatch: 'full' },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule {


}
