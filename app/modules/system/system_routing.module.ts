import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemConfigurationComponent } from './system-configuration/system-configuration.component';
import { ArchivingComponent } from './archiving/archiving.component';
import { ManualBackupComponent } from './manual-backup/manual-backup.component';
import { LoginTrackComponent } from './login-track/login-track.component';
import { UserComponent } from './users/users.component';
import { RolesPermissionsComponent } from './roles-permissions/roles-permissions.component';
 import { AuthGuard } from '../auth/auth.guard';
 

const routes: Routes = [
  {
    path: 'System-Configuration',
    component: SystemConfigurationComponent   
  },
  {
    path: 'Archiving',
    component: ArchivingComponent  
  },
  {
    path: 'Manual-Backup',
    component: ManualBackupComponent  
  },
  {
    path: 'Login-track',
    component: LoginTrackComponent   
  }, 
  {
    path: 'Login-track/:userId',
    component: LoginTrackComponent  
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)  
  },
  {
    path: 'Labsites',
    loadChildren: () => import('./lab-sites/lab-sites.module').then(m => m.labsitesModule)  
  },
  {
    path: 'Roles-And-Permissions',
    component: RolesPermissionsComponent   
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
