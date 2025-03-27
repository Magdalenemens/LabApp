import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGeneralResultsComponent } from './add-general-results/add-general-results.component';
import { ListGeneralResultsComponent } from './list-general-results/list-general-results.component';
import { PtrComponent } from './ptr/ptr.component';
import { AuditComponent } from './audit/audit.component';
import { GeneralresultsComponent } from './generalresults.component';
import { AuthGuard } from '../../auth/auth.guard';


const routes: Routes =
  [
    {
      path: '',
      component: GeneralresultsComponent,
      canActivate: [AuthGuard],
      children: [
        {
          path: 'addgeneralresults',
          component: AddGeneralResultsComponent
        },
        {
          path: 'listgeneralresults',
          component: ListGeneralResultsComponent
        },
        {
          path: 'ptr',
          component: PtrComponent
        },
        {
          path: 'audit',
          component: AuditComponent
        },
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenealResultsRoutingModule {


}