import { Routes } from '@angular/router';

export const DEFAULT_ROUTES: Routes = [
    
    {
        path: '',
        loadChildren: () => import('../modules/masters/divisions/divisions.component').then(m => m.DivisionsComponent)
    }
    // ,{
    //     path: 'userpolicy',
    //     loadChildren: () => import('../policy/policy.module').then(m => m.PolicyModule)
    // }
    
]