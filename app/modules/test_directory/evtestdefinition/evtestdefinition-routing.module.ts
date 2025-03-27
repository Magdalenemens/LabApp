import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvtestdefinitionComponent } from './evtestdefinition.component';
import { AddevtestdefinitionComponent } from './addevtestdefinition/addevtestdefinition.component';
import { EvtestdefinitionprofileComponent } from './evtestdefinitionprofile/evtestdefinitionprofile.component';
import { SeteupevtestdefinitionComponent } from './seteupevtestdefinition/seteupevtestdefinition.component';
import { CanDeactivateGuard } from '../../auth/can-deactivate-gaurd';

const routes: Routes =
  [
    {
      path: 'evtestdefinition',
      component: EvtestdefinitionComponent,
      children: [
        {
          path: 'addevtestdefinition',
          component: AddevtestdefinitionComponent,
          canDeactivate: [CanDeactivateGuard],

        },
        {
          path: 'evtestdefinitionProfile',
          component: EvtestdefinitionprofileComponent
        },
        {
          path: 'setuptestdefinitionProfile',
          component: SeteupevtestdefinitionComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class evtestdefinitionRoutingModule {


}