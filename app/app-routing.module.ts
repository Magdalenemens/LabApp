import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { AuthGuard } from './modules/auth/auth.guard';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { Clinical_Modules, Finance, Management_Reporting, Master_Setup, Orders, roleIdConstant, System, Test_Directory } from './common/moduleNameConstant';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full' // Redirect empty path to login
  },
  {
    path: 'login',
    component: LoginComponent, // Define the login route
  },
  {
    path: '',
    component: TestComponent,
    // canActivate: [AuthGuard], // Apply guard at the parent level
    children: [
      {
        path: 'auth',
        loadChildren: () => import('../app/modules/auth/auth.module').then(m => m.AuthModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'clinical-module',
        loadChildren: () => import('../app/modules/Clinical_module/clinical.module').then(m => m.ClinicalModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module: Clinical_Modules }, // Use the constant array here
      },
      {
        path: 'clinical-module',
        loadChildren: () => import('../app/modules/Clinical_module/clinical-environmental/clinical-environmental.module').then(m => m.clinicalEnvironmentalModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module: Clinical_Modules }, // Use the constant array here

      },
      {
        path: 'finance',
        loadChildren: () => import('../app/modules/finance/client-account/client-account.module').then(m => m.clientaccountModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module: Finance }, // Use the constant array here
      },
      {
        path: 'finance',
        loadChildren: () => import('../app/modules/finance/finance.module').then(m => m.FinanceModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module: Finance }, // Use the constant array here
      },
      {
        path: 'masters',
        loadChildren: () => import('../app/modules/masters/masters.module').then(m => m.MastersModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module: Master_Setup }, // Use the constant array here
      },
      {
        path: 'management-reports',
        loadChildren: () => import('../app/modules/management-reports/management.module').then(m => m.ManagementModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module:Management_Reporting }, // Use the constant array here
      },
      {
        path: 'orderprocessing',
        loadChildren: () => import('../app/modules/orderprocessing/orderprocessing.module').then(m => m.OrderprocessingModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module: Orders }, // Use the constant array here
      },
      {
        path: 'system',
        loadChildren: () => import('../app/modules/system/system.module').then(m => m.SystemModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module: System }, // Use the constant array here
      },
      {
        path: 'test-directory',
        loadChildren: () => import('../app/modules/test_directory/test-definition/test-definition.module').then(m => m.TestDefinitionModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module: Test_Directory }, // Use the constant array here
      },
      {
        path: 'test-directory',
        loadChildren: () => import('../app/modules/test_directory/aptestdefinition/aptestdefinition.module').then(m => m.apTestDefinitionModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module: Test_Directory }, // Use the constant array here
      },
      {
        path: 'test-directory',
        loadChildren: () => import('../app/modules/test_directory/evtestdefinition/evtestdefinition.module').then(m => m.evTestDefinitionModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module: Test_Directory }, // Use the constant array here

      },
      {
        path: 'test-directory',
        loadChildren: () => import('../app/modules/test_directory/cgtestdefinition/cgtestdefinition.module').then(m => m.cgTestDefinitionModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module: Test_Directory }, // Use the constant array here
      },
      {
        path: 'test-directory',
        loadChildren: () => import('../app/modules/test_directory/mbtestdefinition/mbtestdefinition.module').then(m => m.mbTestDefinitionModule),
        canActivate: [AuthGuard],
        data: { roles: roleIdConstant.rolesWithAllModuleAccess, module: Test_Directory }, // Use the constant array here

      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login', // Redirect any unknown paths to login
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
