import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [

  {
    path: 'Anatomic',
    loadChildren: () => import('./anatomic-pathology/anatomic-pathology.module').then(m => m.AnatomicPathologyModule)
  },
  {
    path: 'Cytogenetics',
    loadChildren: () => import('./cytogenetics/cytogenetics.module').then(m => m.CytogeneticsModule)
  },
  {
    path: 'GeneralResults',
    loadChildren: () => import('./generalresults/generalresults.module').then(m => m.GeneralResultsModule)
  },
  {
    path: 'MicroBiology',
    loadChildren: () => import('./micro-biology/micro-biology.module').then(m => m.MicroBiologyModule),
  },
  {
    path: 'ClinicalEnvironmental',
    loadChildren: () => import('./clinical-environmental/clinical-environmental.module').then(m => m.clinicalEnvironmentalModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicalRoutingModule { }