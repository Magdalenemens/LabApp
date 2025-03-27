import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientAccountComponent } from './client-account.component';
import { ClientAccountStatementComponent } from './client-account-statement/client-account-statement.component';
import { DataClientAccountComponent } from './data-client-account/data-client-account.component';
import { CrossCheckComponent } from './cross-check/cross-check.component';
import { CurrentStatusComponent } from './current-status/current-status.component';

const routes: Routes =
  [
    {
      path: 'client-account',
      component: ClientAccountComponent,
      children: [
        {
          path: 'addclientAccount',
          component: DataClientAccountComponent
        },
        {
          path: 'clientAccountStatement',
          component: ClientAccountStatementComponent
        },
        {
          path: 'crossCheck',
          component: CrossCheckComponent
        },
        {
          path: 'currentStatus',
          component: CurrentStatusComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class clientaccountRoutingModule {


}