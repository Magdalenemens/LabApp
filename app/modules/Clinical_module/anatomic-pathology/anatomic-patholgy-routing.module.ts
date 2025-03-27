import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnatomicPathologyComponent } from './anatomic-pathology.component';

import { SlidePicturesComponent } from './slide-pictures/slide-pictures.component';
import { AddPathologyComponent } from './add-pathology/add-pathology.component';
import { ListAnatomyComponent } from './list-anatomy/list-anatomy.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes =
  [
    {
      path: '',
      component: AnatomicPathologyComponent,
      canActivate: [AuthGuard],
      children: [
        {
          path: 'addanatomic',
          component: AddPathologyComponent
        },
        {
          path: 'list',
          component: ListAnatomyComponent
        },
        {
          path: 'pictures',
          component: SlidePicturesComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnatomicPathologyRoutingModule {


}