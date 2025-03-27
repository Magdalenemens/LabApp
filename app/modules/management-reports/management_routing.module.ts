import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinanceComponent } from './finance/finance.component';
import { ProcessingComponent } from './processing/processing.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: 'Finance',
    component: FinanceComponent
  },
  {
    path: 'Processing',
    component: ProcessingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
