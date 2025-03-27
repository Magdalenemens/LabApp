import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCytogeneticsComponent } from './add-cytogenetics/add-cytogenetics.component';
import { ListCytogeneticsComponent } from './list-cytogenetics/list-cytogenetics.component';
import { QualityCheckComponent } from './quality-check/quality-check.component';
import { CytogeneticsComponent } from './cytogenetics.component';
import { AuthGuard } from '../../auth/auth.guard';


const routes: Routes =
  [
    {
      path: '',
      component: CytogeneticsComponent,
      canActivate: [AuthGuard],
      children: [
        {
          path: 'addcytogenetics',
          component: AddCytogeneticsComponent
        },
        {
          path: 'qualitycheck',
          component: QualityCheckComponent
        },
        {
          path: 'list',
          component: ListCytogeneticsComponent
        },
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CytogeneticsRoutingModule {


}