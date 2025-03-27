import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MicroBiologyComponent } from './micro-biology.component';

import { SlidePicturesMBComponent } from './slide-pictures/slide-pictures.component';
import { AddMicrobiologyComponent } from './add-microbiology/add-microbiology.component';
import { ListMicrobiologyComponent } from './list-microbiology/list-microbiology.component';
import { AuthGuard } from '../../auth/auth.guard';


const routes: Routes =
  [
    {
      path: '',
      component: MicroBiologyComponent,
      canActivate: [AuthGuard],
      children: [
        {
          path: 'addmicrobiology',
          component: AddMicrobiologyComponent
        },
        {
          path: 'list',
          component: ListMicrobiologyComponent
        },
        {
          path: 'pictures',
          component: SlidePicturesMBComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MicrobiologyRoutingModule {


}