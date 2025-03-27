import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnvironmentalordersComponent } from './environmentalorders.component';
import { AddEnvironmentalorderComponent } from './add-environmentalorder/add-environmentalorder.component';
import { ListEnvironmentalorderComponent } from './list-environmentalorder/list-environmentalorder.component';


const routes: Routes =
  [
    {
      path: '',
      component: EnvironmentalordersComponent,
      children: [
        {
          path: 'AddEnvironmentalOrder',
          component: AddEnvironmentalorderComponent
        },
        {
          path: 'ListEnvironmentalOrder',
          component: ListEnvironmentalorderComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnvironmentalOrdersRoutingModule {


}
