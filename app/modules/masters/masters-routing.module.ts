import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DivisionsComponent } from './divisions/divisions.component';
import { SectionsComponent } from './sections/sections.component';
import { WorkCentersComponent } from './workcenters/workcenters.component';
import { TestsitesComponent } from './testsites/testsites.component';
import { SpecimenTypesComponent } from './specimentypes/specimentypes.component';
import { SpecimenSitesComponent } from './specimensites/specimensites.component';
import { ResultstemplatesComponent } from './resultstemplates/resultstemplates.component';
import { AccountmanagersComponent } from './accountmanagers/accountmanagers.component';
import { DriversComponent } from './drivers/drivers.component';
import { SitesComponent } from './site/sites.component';
 

import { MnComponent } from './mn/mn.component';
import { mniComponent } from './mni/mni.component';
import { CnlcdComponent } from './cnlcd/cnlcd.component';
import { ClientsComponent } from './clients/clients.component';
import { ArComponent } from './ar/ar.component';
import { UsersComponent } from './users/users.component';
import { UnderConstComponent } from './under-const/under-const.component';
import { ReportmainheaderComponent } from './reportmainheader/reportmainheader.component';
import { ReportsubheaderComponent } from './reportsubheader/reportsubheader.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { AccnprefixComponent } from './accnprefix/accnprefix.component';
import { CompanyComponent } from './company/company.component';
import { EvSampleTypeComponent } from './ev-sample-type/ev-sample-type.component';

const routes: Routes = [
  {
    path: 'annprefix',
    component: AccnprefixComponent
  },

  {
    path: 'divisions',
    component: DivisionsComponent
  },
  {
    path: 'sections',
    component: SectionsComponent
  },
  {
    path: 'workcenters',
    component: WorkCentersComponent
  },
  {
    path: 'testsites',
    component: TestsitesComponent
  },
  {
    path: 'specimentypes',
    component: SpecimenTypesComponent
  },
  {
    path: 'specimensites',
    component: SpecimenSitesComponent
  },
  {
    path: 'resultstemplates',
    component: ResultstemplatesComponent
  },
  {
    path: 'accountmanagers',
    component: AccountmanagersComponent
  },
  {
    path: 'drivers',
    component: DriversComponent
  },
  {
    path: 'sites',
    component: SitesComponent
  },
  {
    path: 'mn',
    component: MnComponent
  },
  {
    path: 'mni',
    component: mniComponent
  },
  {
    path: 'cnlcd',
    component: CnlcdComponent
  },
  {
    path: 'ar',
    component: ArComponent
  },
  {
    path: 'EV-Sample-test',
    component: EvSampleTypeComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'underconst',
    component: UnderConstComponent
  }, 
  {
    path: 'clients',
    loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule)
  },
  {
    path: 'reportmainheader',
    component: ReportmainheaderComponent
  },
  {
    path: 'reportsubheader',
    component: ReportsubheaderComponent
  },
  {
    path: 'doctors',
    component: DoctorsComponent
  },
  {
    path: 'company',
    component: CompanyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class mastersroutingmodule { }