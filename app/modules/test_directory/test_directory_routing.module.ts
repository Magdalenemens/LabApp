import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { roleNameConstant } from 'src/app/common/moduleNameConstant';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [

  {
    path: 'Testdefinition',
    loadChildren: () => import('./test-definition/test-definition.module').then(m => m.TestDefinitionModule)
  },
  {
    path: 'aptestdefinition',
    loadChildren: () => import('./aptestdefinition/aptestdefinition.module').then(m => m.apTestDefinitionModule)
  },
  {
    path: 'evtestdefinition',
    loadChildren: () => import('./evtestdefinition/evtestdefinition.module').then(m => m.evTestDefinitionModule)
  }
  {
    path: 'cgtestdefinition',
    loadChildren: () => import('./cgtestdefinition/cgtestdefinition.module').then(m => m.cgTestDefinitionModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class TestDirectoryRoutingModule { }