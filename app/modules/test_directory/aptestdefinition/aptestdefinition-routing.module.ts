import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAPTestDefinitionComponent } from './addaptestdefinition/addaptestdefinition.component';
import { APTestDefinitionComponent } from './aptestdefinition.component';
import { APTestDefinitionListComponent } from './aptestdefinitionlist/aptestdefinitionlist.component';


const routes: Routes =
  [
    {
      path: 'apTestDefinition',
      component: APTestDefinitionComponent,
      children: [
        {
          path: 'addapTestDefinition',
          component: AddAPTestDefinitionComponent,
        },
        {
          path: 'apTestDefinitionList',
          component: APTestDefinitionListComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class aptestdefinitionRoutingModule {


}