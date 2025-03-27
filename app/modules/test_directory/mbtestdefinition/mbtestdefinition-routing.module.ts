import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '../../auth/can-deactivate-gaurd';
import { MbtestdefinitionComponent } from './mbtestdefinition.component';
import { AddmbtestdefinitionComponent } from './addmbtestdefinition/addmbtestdefinition.component';
import { ListmbtestdefinitionComponent } from './listmbtestdefinition/listmbtestdefinition.component';

const routes: Routes =
  [
    {
      path: 'mbtestdefinition',
      component: MbtestdefinitionComponent,
      children: [
        {
          path: 'addmbtestdefinition',
          component: AddmbtestdefinitionComponent,
          canDeactivate: [CanDeactivateGuard],

        },
        {
          path: 'mblist',
          component: ListmbtestdefinitionComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class mbtestdefinitionRoutingModule {


}