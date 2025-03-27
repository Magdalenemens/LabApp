import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserListComponent } from './list/list.component';

import { UserComponent } from './users.component';
import { AdduserComponent } from './adduser/adduser.component';
import { PagetrackingComponent } from './pagetracking/pagetracking.component';
import { LoginTrackComponent } from '../login-track/login-track.component';
import { LoginTrackingComponent } from './logintracking/logintracking.component';
import { PrivilegesComponent } from './privileges/privileges.component';
import { ClinicalPrivilegesComponent } from './clinical-privileges/clinical-privileges.component';

const routes: Routes =
  [
    {
      path: '',
      component: UserComponent,
      children: [
        {
          path: 'adduser',
          component: AdduserComponent
        }, {
          path: 'adduser/:userId',
          component: AdduserComponent
        },
        {
          path: 'list',
          component: UserListComponent
        },
        {
          path: 'pagetracking/:userId',
          component: PagetrackingComponent
        },
        {
          path: 'pagetracking',
          component: PagetrackingComponent
        },
        {
          path: 'logintracking',
          component: LoginTrackingComponent
        },
        {
          path: 'logintracking/:userId',
          component: LoginTrackingComponent
        },
        {
          path: 'privileges',
          component: PrivilegesComponent
        },
        {
          path: 'clinical-privileges',
          component: ClinicalPrivilegesComponent
        },
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {


}
