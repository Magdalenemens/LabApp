import { Component } from '@angular/core';
import { successMessage, EMPTYMESSAGE, TestwarningMessage } from 'src/app/common/constant';
import { tdDivModel, TDModel } from 'src/app/models/tdmodel';
import { NumericRefernceRangeService } from 'src/app/modules/test_directory/test-definition/numeric-refernce-range/numeric-refernce-range.service';
import Swal from 'sweetalert2';
import { LabSiteService } from '../lab-sites.service';
import { siteModel, siteTestsAssignmentModel } from 'src/app/models/siteModel';
import { AddTestDirectoryService } from 'src/app/modules/test_directory/test-definition/add-test-directory/add-test-directory.service';
import _ from 'lodash';
import { Router } from '@angular/router';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { SiteService } from 'src/app/modules/masters/site/sites.service';

@Component({
  selector: 'app-site-tests-assignment',
  templateUrl: './site-tests-assignment.html',
  styleUrls: ['./site-tests-assignment.component.scss'],
})

export class SiteTestsAssignmentComponent {
  isAddModal: boolean = false;
  divList: tdDivModel[] = [];
  sectList: tdDivModel[] = [];
  tdList: TDModel[] = [];
  tdListCopy: TDModel[] = [];
  savedTestsList: siteTestsAssignmentModel[] = [];
  index: number = 0;
  div: string = '0';
  sect: string = '';
  testTd: string = '';
  testCode: string = '';
  refValue: string = '';
  siteList: any[] = []; //
  siteData: siteModel = new siteModel();
  siteCode: string = '0';
  siteName: string = '';
  selectedSites: any[] = [];
  selectedTests: any[] = [];
  siteTestsAssignmentModel: any[] = []; // Model for storing selected rows
  siteTestsList: siteTestsAssignmentModel[] = [];
  isSaveBtnActive: boolean = true;
  isClearBtnActive: boolean = true;
  isPushBtnActive: boolean = true;
  editingIndex: number;
  divisionList: any;
  reflabValues: string[] = ['01', '02', '03', '04']; // Replace with actual reflab values
  siteTestDropDown: any;
  refSecSiteDropDown: any;
  url: string;
  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
 
  constructor(
    private _numericReferenceRangeService: NumericRefernceRangeService,
    private _siteService: SiteService,
     private _labSiteService: LabSiteService, public _commonAlertService: CommonAlertService,
    private _addTestDirectoryService: AddTestDirectoryService, private router: Router) { }

  ngOnInit(): void {
    this.isPushBtnActive = false;
    $('#siteTestsAssignment').addClass("is-active");
    this.getSiteData();
    this.getAllTestDirecotryData();
    this.getDivisionData();
    this.fillrefDropDown();
    this.getTestsForDivision(0);
    this.fillRefSecDropDown();
    this.getSiteAssignmentListData();
  }

  getSiteData(): void {
    this._labSiteService.getAllSite().subscribe(
      (res) => {
        // Filter the siteList where site_tp equals 'ls'
        this.siteList = res.filter(item => item.sitE_TP === 'LS');
        this.siteTestsAssignmentModel.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      },
      (error) => {
        console.error('Error loading Site list:', error);
      }
    );
  }

  getAllTestDirecotryData(): void {
    this._addTestDirectoryService.getAllTD().subscribe(
      (res: any[]) => {
        // Map the response once and store it in a temporary array
        const mappedData = res.map(item => ({
          ...item,
          fulL_NAME: item.full_Name // Map full_Name to fulL_NAME
        }));

        // Assign the mapped data to both models
        this.tdList = [...mappedData];
        this.tdListCopy = [...mappedData];
      },
      (error) => {
        console.error('Error loading Site list:', error);
      }
    );
  }

  getSiteAssignmentListData(): void {
    this._labSiteService.getAllSiteTests().subscribe(res => {
      this.savedTestsList = res;
    },
      (error) => {
        console.error('Error loading Site list:', error);
      });
  }

  onItemSelect(item: any): void {
    if (item.selected) {
      this.selectedSites.push(item);
    } else {
      this.selectedSites = this.selectedSites.filter(selectedItem => selectedItem.sitE_NO !== item.sitE_NO);
    }
  }

  selectAll(event: any): void {
    const isChecked = event.target.checked;
    this.selectedSites = isChecked ? [...this.siteList] : [];

    this.siteList.forEach(item => {
      item.selected = isChecked;
    });
  }

  onTestSelect(test: any): void {
    if (test.selected) {
      // Ensure the testId is included when pushing the selected test
      this.selectedTests.push({
        tcode: test.tcode,
        tesT_ID: test.tesT_ID, // Add testId here
        fulL_NAME: test.fulL_NAME // Include any other relevant properties if needed
      });
    } else {
      // Remove the test from selectedTests if it's deselected
      this.selectedTests = this.selectedTests.filter(selectedTest => selectedTest.tcode !== test.tcode);
    }
  }

  pushSelectedFieldsToTable(): void {
    if (!this.selectedSites.length || !this.selectedTests.length) {
      this._commonAlertService.emptymassage();
      return;
    }
    this.selectedSites.forEach(site => {
      if (!site?.reF_SITE) {
        return;  // Exit if the site doesn't have a valid reF_SITE
      }
      // Get existing saved tests for the current site
      const existingSavedTestsForSite = this.getSavedTestsForSite(site.reF_SITE);

      // Get tests that don't already exist in the saved list or the assigned list
      const newTests = this.getNewTestsForSite(existingSavedTestsForSite);
      if (!newTests.length) {
        this._commonAlertService.TestwarningMessage();
        return;  // Skip if no new tests to add
      }
      // Add new tests to the assignment model
      this.addTestsToAssignmentModel(newTests, site);
      // Set buttons state
      this.isSaveBtnActive = false;
      this.isClearBtnActive = false;
    });
  }

  // Helper function to get saved tests for a site
  private getSavedTestsForSite(refSite: string) {
    return this.savedTestsList.filter(savedTest =>
      savedTest.reF_SITE.split('-')[0].trim() === refSite
    );
  }

  // Helper function to get tests that are not already saved or assigned
  private getNewTestsForSite(existingSavedTestsForSite: any[]) {
    return this.selectedTests.filter(test =>
      !existingSavedTestsForSite.some(savedTest =>
        savedTest.tcode === test.tcode &&
        savedTest.tesT_ID === test.tesT_ID &&
        savedTest.fulL_NAME === test.fulL_NAME
      )
    );
  }

  // Helper function to add new tests to the assignment model
  private addTestsToAssignmentModel(tests: any[], site: any) {
    tests.forEach(test => {
      // Check if the item already exists in the list based on tcode and reF_SITE
      const exists = this.siteTestsAssignmentModel.some(item =>
        item.tcode === test.tcode && item.reF_SITE === site.reF_SITE
      );

      // Only push the new item/tests if it does not exist.
      if (!exists) {
        this.siteTestsAssignmentModel.push({
          reF_SITE: site.reF_SITE,
          tcode: test.tcode,
          fulL_NAME: test.fulL_NAME,
          tesT_ID: test.tesT_ID,
          reF_SITE_S: site.reF_SITE,
          sitE_NAME: site.sitE_NAME,
          selecteD_REF_SITE: site.reF_SITE,
          abrv: site.abrv
        });
      }
    });
  }

  fillRefSecDropDown() {
    this._labSiteService.getAllSite().subscribe(labSites => {
      this.refSecSiteDropDown = labSites.filter(site => site.sitE_TP === 'LS');
    });
  }

  onRefSiteSecChange(event: any, siteTestsModel: any): void {
    let refSite = siteTestsModel.reF_SITE_S;
    this.isSaveBtnActive = false; // Reset save button activation state
    const input = event;
    let indexOfData = this.siteTestsAssignmentModel.findIndex(x => x.reF_SITE == siteTestsModel.reF_SITE)
    if (input != '') {
      this.siteTestsAssignmentModel[indexOfData].reF_SITE_S = input;
      this.siteTestsAssignmentModel[indexOfData].reF_SITE = refSite;
    } else {
      this.isSaveBtnActive = true;
    }
  }

  fillrefDropDown(): void {
    this.siteTestDropDown = this._labSiteService.getAllSite().subscribe(x => {
      this.siteTestDropDown = x;
    })
  }

  // Method to insert all selected data into the site_test table
  insertSelectedData(): void {
    this._labSiteService.addSiteTestsAssignment(this.siteTestsAssignmentModel).subscribe(
      (response) => {
        if (response.status === 200) {
          this._commonAlertService.successMessage();
          Swal.fire({
            text: successMessage,
            icon: 'success',
          }).then(() => {
            // Add a delay before redirecting
            setTimeout(() => {
              this.url = ('../system/Labsites/siteTestsList');
              this.router.navigate([this.url]);
            }, 200);
          });
        }
      },
      (error) => {
        console.error('Error inserting selected SiteTests:', error);
      }
    );
  }

  removeSelectedRow(index: number): void {
    this.siteTestsAssignmentModel.splice(index, 1);
  }

  selectAllTests(event: any): void {
    const isChecked = event.target.checked;
    this.selectedTests = isChecked ? [...this.tdList] : [];

    this.tdList.forEach(test => {
      test.selected = isChecked;
    });
  }

  loadTestTD(event: any) {
    if (event.target.value.trim() === '') {
      this.tdList = this.tdListCopy;
    }
    this.tdList = this.tdList.filter(x => x.tcode.toString().startsWith(event.target.value.toString().toUpperCase()));
    this.tdList = this.tdList.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
  }

  getDivisionData(): void {
    this._numericReferenceRangeService.getAllDivision().subscribe(res => {
      this.divList = res;
    },
      (error) => {
        console.error('Error loading div list:', error);
      })
  }

  getSectionData(event: any) {
    this._labSiteService.getTestForDivision(parseInt(event.target.value)).subscribe(res => {
      this.sectList = res;
      this.div = event.target.value;
      this.getTestsForDivision(parseInt(event.target.value));
      this.sect = '';
    },
      (error) => {
        console.error('Error loading sect list:', error);
      })
  }

  getSectionDataFromDivision(event: any) {
    this.getTestsForDivision(parseInt(this.div));
    this.sect = event.target.value;
  }

  getTestsForDivision(div: number) {
    this._labSiteService.getAllTestsByDivision(div).subscribe(
      (res: any[]) => {
        // Map the response to update the property name from full_Name to full_NAME
        this.tdList = res.map(item => ({
          ...item,
          fulL_NAME: item.fulL_NAME, // Map full_Name to full_NAME             
        }));

        // Filter based on the section if it is not empty
        if (this.sect !== '') {
          this.tdList = this.tdList.filter(x =>
            x.sect.trim().toUpperCase() === this.sect.toString().toUpperCase()
          );
        }
      },
      (error) => {
        console.error('Error loading test directive list:', error);
      }
    );
  }

  reset(): void {
    this.isSaveBtnActive = true;
    this.isClearBtnActive = false;
    this.siteTestsAssignmentModel = [];
    this.getTestsForDivision(0);
    this.getDivisionData();
    this.getSiteData();
    this.selectedSites = [];
    this.selectedTests = [];
    this.isPushBtnActive = false;
  }
}

