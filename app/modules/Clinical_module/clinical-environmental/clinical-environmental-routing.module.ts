import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicalEnvironmentalComponent } from './clinical-environmental.component';
import { AddClinicalEnvironmentalComponent } from './add-clinical-environmental/add-clinical-environmental.component';
import { ListClinicalEnvironmentalComponent } from './list-clinical-environmental/list-clinical-environmental.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes =
  [
    {
      path: '',
      component: ClinicalEnvironmentalComponent,
      canActivate: [AuthGuard], // Apply guard at the parent level
      children: [
        {
          path: 'addClinicalEnvironmental',
          component: AddClinicalEnvironmentalComponent
        },
        {
          path: 'listClinicalEnvironmental',
          component: ListClinicalEnvironmentalComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class clinicalEnvironmentalRoutingModule {


}