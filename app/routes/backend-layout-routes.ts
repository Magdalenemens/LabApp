import { Routes } from '@angular/router';

export const BACKEND_ROUTES: Routes = [
    {
        path: 'divisions',
        loadChildren: () => import('../modules/masters/divisions/divisions.component').then(m => m.DivisionsComponent)
    },
    {
        path: 'sections',
        loadChildren: () => import('../modules/masters/sections/sections.component').then(m => m.SectionsComponent)
    },
    {
        path: 'workcenters',
        loadChildren: () => import('../modules/masters/workcenters/workcenters.component').then(m => m.WorkCentersComponent)
    },
    {
        path: 'testsites',
        loadChildren: () => import('../modules/masters/testsites/testsites.component').then(m => m.TestsitesComponent)
    },
    {
        path: 'specimentypes',
        loadChildren: () => import('../modules/masters/specimentypes/specimentypes.component').then(m => m.SpecimenTypesComponent)
    },
    {
        path: 'specimensites',
        loadChildren: () => import('../modules/masters/specimensites/specimensites.component').then(m => m.SpecimenSitesComponent)
    },
    {
        path: 'resultstemplates',
        loadChildren: () => import('../modules/masters/resultstemplates/resultstemplates.component').then(m => m.ResultstemplatesComponent)
    },
    {
        path: 'accountmanagers',
        loadChildren: () => import('../modules/masters/accountmanagers/accountmanagers.component').then(m => m.AccountmanagersComponent)
    },
    {
      path:'orderentry',
      loadChildren:()=>import('../modules/orderprocessing/orderentry/add-orderentry/add-orderentry.component').then(m => m.AddOrderentryComponent)
    }
     
]
