import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CgtestdefinitionComponent } from './cgtestdefinition.component';
import { AddcgtestdefinitionComponent } from './addcgtestdefinition/addcgtestdefinition.component';
import { CgtestdefinitionprofileComponent } from './cgtestdefinitionprofile/cgtestdefinitionprofile.component';

const routes: Routes =
  [
    {
      path: 'cgtestdefinition',
      component: CgtestdefinitionComponent,
      children: [
        {
          path: 'addcgtestdefinition',
          component: AddcgtestdefinitionComponent
        },
        {
          path: 'cgtestdefinitionProfile',
          component: CgtestdefinitionprofileComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class cgtestdefinitionRoutingModule {


}