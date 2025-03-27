import { Component, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OrderentryService } from 'src/app/modules/orderprocessing/orderentry/add-orderentry/orderentry.service';
import { AddTestDirectoryService } from '../../test-definition/add-test-directory/add-test-directory.service';
import { apTestDefinitionModel } from 'src/app/models/apTestDefinitionModel';
import { DivisionService } from 'src/app/modules/masters/divisions/division.service';
import { WorkCenterService } from 'src/app/modules/masters/workcenters/workcenter.service';
import { SectionService } from 'src/app/modules/masters/sections/section.service';
import { TestSiteService } from 'src/app/modules/masters/testsites/testsite.service';

@Component({
  selector: 'app-aptestdefinitionlist',
  templateUrl: './aptestdefinitionlist.component.html',
  styleUrls: ['./aptestdefinitionlist.component.scss']
})
export class APTestDefinitionListComponent {
  apTestDefinitionData: apTestDefinitionModel = new apTestDefinitionModel();
  tdAllData: apTestDefinitionModel[] = [];
  tdSearchList: apTestDefinitionModel[] = [];

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: apTestDefinitionModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;
  id: string;

  sortColumn: string = '';
  sortDirection: string = 'asc';
  public ArrayLabDivision: any[] = [];
  isLoaded = false;
  divsionDropDown: any;
  sectionDropDown: any;
  workcenterDropDown: any
  testsitesDropDown: any

  constructor(private _divisionService: DivisionService,private _sectionnService: SectionService,
     private _workCenterService: WorkCenterService,private _testsitesService: TestSiteService,
    
    private _testDirectoryService: AddTestDirectoryService,
    private auth: OrderentryService) {

  }

  ngOnInit(): void {
    $('#btnaddtestdefinition').addClass("is-active");
    this.getAllAPTestDefinitionData();
    this.fillDivisionDropDown();
    this.fillSectionDropDown();
    this.fillWorkCenterDropDown();
    this.fillTestSitesDropDown();
  }

  getAllAPTestDefinitionData(): void {
    this._testDirectoryService.getAllAPTestDefinition().subscribe(res => {
      this.tdAllData = res;

    },
      (error) => {
        console.error('Error loading user list:', error);
      })
  }

  fillDivisionDropDown() {
    this.divsionDropDown = this._divisionService.getAllDivision().subscribe(divisions => {
      this.divsionDropDown = divisions;
    })
  }

  fillSectionDropDown() {
    this.sectionDropDown = this._sectionnService.getAllSection().subscribe(sections => {
      this.sectionDropDown = sections;
    })
  }

  fillWorkCenterDropDown() {
    this.workcenterDropDown = this._workCenterService.getAllWorkCenter().subscribe(wc => {
      this.workcenterDropDown = wc;
    })
  }

  fillTestSitesDropDown() {
    this.testsitesDropDown = this._testsitesService.getAllTestSite().subscribe(ts => {
      this.testsitesDropDown = ts;
    })
  }


  updatePagination(): void {
    const totalPages = Math.ceil(this.tdAllData.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, totalPages) || 1;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(event: any): void {
    this.itemsPerPage = event;
    this.currentPage = 1; // Reset to first page when page size changes
    this.updatePagination();
  }


}
