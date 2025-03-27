import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestDefinitionComponent } from './test-definition.component';
import { AddTestDirectoryComponent } from './add-test-directory/add-test-directory.component';
import { ProfileComponent } from './profile/profile.component';
import { ReferenceRangesComponent } from './reference-ranges/reference-ranges.component';
import { NumericRefernceRangeComponent } from './numeric-refernce-range/numeric-refernce-range.component';
import { TestAllocationComponent } from './test-allocation/test-allocation.component';

const routes: Routes =
  [
    {
      path: 'testdefinition',
      component: TestDefinitionComponent,
      children: [
        {
          path: 'addtestdirectory',
          component: AddTestDirectoryComponent
        },
        {
          path: 'Reference-ranges',
          component: ReferenceRangesComponent
        },
        {
          path: 'Profile',
          component: ProfileComponent
        },
        {
          path: 'Numeric-Reference-Ranges',
          component: NumericRefernceRangeComponent
        },
        {
          path: 'Test-Allocation',
          component: TestAllocationComponent
        }
      ]
    }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestDefinitionRoutingModule {


}