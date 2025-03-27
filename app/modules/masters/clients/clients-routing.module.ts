import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddclientsComponent } from './addclients/addclients.component';
import { SpecialpricesComponent } from './specialprices/specialprices.component';
import { ClientsComponent } from './clients.component';
import { ListComponent } from './list/list.component';

const routes: Routes =
  [
    {
      path: '',
      component: ClientsComponent,
      children: [
        {
          path: 'addclient',
          component: AddclientsComponent
        },
        {
          path: 'specialprices',
          component: SpecialpricesComponent
        },
        {
          path: 'list',
          component: ListComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule {


}
