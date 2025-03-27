import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { siteModel, siteTestsAssignmentModel } from 'src/app/models/siteModel';
import { SharedService } from 'src/app/modules/shared/services/sharedService';
import { LabSiteService } from '../lab-sites.service';
import { DivisionService } from 'src/app/modules/masters/divisions/division.service';
import { TDModel } from 'src/app/models/tdmodel';
import { SectionService } from 'src/app/modules/masters/sections/section.service';
import { SiteService } from 'src/app/modules/masters/site/sites.service';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-site-tests-lists',
  templateUrl: './site-tests-lists.component.html',
  styleUrl: './site-tests-lists.component.scss'
})

export class SiteTestsListsComponent {
  siteList: siteModel[] = [];
  tdList: TDModel[] = [];
  div: string = 'Select';
  sect: string = '';
  siteTestsAssigmentList: siteTestsAssignmentModel[] = [];
  filterListData: siteTestsAssignmentModel[] = [];

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  totalItems: number;
  pageChange: any;

  //readmore variable, its true than read more string will print
  Addrecord: boolean = false
  edituserListId: any;
  url = '';
  //hiding info box
  visible: boolean = false
  dtTrigger: Subject<any> = new Subject<any>();
  //Search
  filteredList: any[] = [];
  searchText: string = '';
  divisionDropDown: any[] = [];
  sectionDropDown: any[] = [];

  selectedDivision: string = '';
  selectedSection: string = '';

  orderLabFilter: string = '';
  processLabFilter: string = '';
  testCodeFilter: string = '';
  testIdFilter: string = '';
  testNameFilter: string = '';
  ctFilter: string = '';

  orderLabOptions: any[] = []; // Populate this with your data
  processLabOptions: any[] = []; // Populate this with your data
  ctLabOptions: any[] = [];

  selectedOrderLabs: any[] = []; // Store selected order labs
  selectedProcessLabs: any[] = []; // Store selected process labs
  selectedCtLabs: any[] = [];
  selectedNamesorder: any = [];
  selectedNamesProcess: any = [];

  filterVisibility = {
    orderLab: false,
    processLab: false,
    testCode: false,
    testId: false,
    ct: false,
    testName: false
  };

  constructor(private _labSiteService: LabSiteService,
    private route: Router, private _siteService: SiteService,
    private _commonAlertService: CommonAlertService,
    private _divisionService: DivisionService,
    private _sectionService: SectionService) {
  }

  ngOnInit(): void {
    $('#siteTestsList').addClass("is-active");
    this.getSiteAssignmentListData();
    this.getSiteListData();
    this.fillDivisionDropDown();
    this.fillSectionDropDown();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  isFilterVisible(): boolean {
    return Object.values(this.filterVisibility).some(visible => visible);
  }

  getSiteAssignmentListData(): void {
    this._labSiteService.getAllSiteTests().subscribe(res => {
      this.siteTestsAssigmentList = res;
      this.getFilteredItems();
      this.filteredList = [...this.siteTestsAssigmentList];
      this.getPaginatedList();
      this.updatePagination();
      this.dtTrigger.next(null);
    },
      (error) => {
        console.error('Error loading Site list:', error);
      });
  }

  getSiteListData(): void {
    this._labSiteService.getAllSite().subscribe(res => {
      this.siteList = res;
    },
      (error) => {
        console.error('Error loading User list:', error);
      })
  }



  filteredsiteTestsAssigmentList() {
    const filteredList = this.siteTestsAssigmentList.filter(item =>
      (!this.orderLabFilter || item.abrv.toLowerCase().includes(this.orderLabFilter.toLowerCase())) &&
      (!this.processLabFilter || item.reF_SITE_S.toLowerCase().includes(this.processLabFilter.toLowerCase())) &&
      (!this.testCodeFilter || item.tcode.toLowerCase().includes(this.testCodeFilter.toLowerCase())) &&
      (!this.testIdFilter || item.tesT_ID.toLowerCase().includes(this.testIdFilter.toLowerCase())) &&
      (!this.testNameFilter || item.fulL_NAME.toLowerCase().includes(this.testNameFilter.toLowerCase())) &&
      (!this.ctFilter || item.ct.toLowerCase().includes(this.ctFilter.toLowerCase()))
    );
    this.totalItems = filteredList.length;
    return filteredList;
  }


  getPaginatedList(): any[] {
    this.filterListData = this.filteredsiteTestsAssigmentList();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filterListData.slice(startIndex, endIndex);
  }

  toggleFilter(filter: string) {
    this.filterVisibility[filter] = !this.filterVisibility[filter];
  }

  // Function to return display type based on item properties
  getDisplayType(item: any): string {
    const value = String(item);  // Convert to string to ensure proper comparison
    if (value === 'D') {
      return 'Single';
    } else if (value === 'G') {
      return 'Profile';
    } else if (value === 'S') {
      return 'Package';
    } else {
      return 'N/A';
    }
  }


  // Function to handle search input changes
  onSearch(): void {
    this.siteTestsAssigmentList = [...this.filteredList];
    const searchText = this.searchText.toLowerCase().trim();
    this.siteTestsAssigmentList = this.siteTestsAssigmentList.filter(item =>
      item.tcode.includes(searchText) || item.tcode.toLocaleLowerCase().includes(searchText) ||
      item.reF_SITE.includes(searchText) || item.reF_SITE.toLocaleLowerCase().includes(searchText) ||
      item.reF_SITE_S.includes(searchText) || item.reF_SITE_S.toLocaleLowerCase().includes(searchText) ||
      item.tesT_ID.includes(searchText) || item.tesT_ID.toLocaleLowerCase().includes(searchText)
    );
    this.filterListData = this.siteTestsAssigmentList;
    this.updatePagination();
  }

  routePath(_id: any) {
    localStorage.setItem('siteId', _id);
    // this._sharedservice.selected = url;
    this.url = ('../system/Labsites/addData');
    this.route.navigate([this.url]);
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.filterListData.length / this.itemsPerPage);
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

  // Fill the division dropdown
  fillDivisionDropDown(): void {
    this._divisionService.getAllDivision().subscribe(x => {
      this.divisionDropDown = x;
    }, error => console.error('Error loading division data:', error));
  }

  // Fill the section dropdown
  fillSectionDropDown(): void {
    this._sectionService.getAllSection().subscribe(x => {
      this.sectionDropDown = x;
    }, error => console.error('Error loading section data:', error));
  }

  // Function to handle dropdown changes and filter the list accordingly
  // onDropdownChange(): void {
  //   this.filteredList = this.tdList.filter(site => {
  //     // Check if both dropdowns are selected
  //     const matchesDivision = this.selectedDivision ? site.div === this.selectedDivision : true;
  //     const matchesSection = this.selectedSection ? site.sect === this.selectedSection : true;

  //     // Return the sites that match both dropdowns, or either if one is not selected
  //     return matchesDivision && matchesSection;
  //   });
  // }

  getFilteredItems(): void {

    // Extract unique order lab options from the siteList (mapping `abrv` values)
    const FilteredLabSiteData = Array.from(new Set(this.siteTestsAssigmentList.map(item => item.abrv))).map(processLab => ({
      name: processLab, // Use `abrv` as 'name'
      selected: false
    }));
    const FilteredCTData = Array.from(new Set(this.siteTestsAssigmentList.map(item => item.ct))).map(ctPackageType => ({
      name: this.getDisplayType(ctPackageType),
      selected: false
    }));

    // Assign the filtered data to the respective options
    this.orderLabOptions = [...FilteredLabSiteData];
    this.processLabOptions = [...FilteredLabSiteData];
    this.ctLabOptions = [...FilteredCTData];

  }

  applyFilters() {
    let filteredData = [...this.siteTestsAssigmentList]; // Start with the full list of data

    // Apply order Lab filter if selected
    if (this.selectedOrderLabs && this.selectedOrderLabs.length > 0) {
      const selectedOrderLabs = this.selectedOrderLabs.map(lab => lab.name); // Get 'name' which is 'abrv'

      // Filter the siteList based on 'abrv' field
      filteredData = filteredData.filter(item => selectedOrderLabs.includes(item.abrv)); // Ensure uppercase matching
    }


    // Apply process Lab filter if selected
    if (this.selectedProcessLabs && this.selectedProcessLabs.length > 0) {
      const selectedProcessLabs = this.selectedProcessLabs.map(lab => lab.name);
      filteredData = filteredData.filter(item => selectedProcessLabs.includes(item.abrv));
    }

    // Apply Test Code filter
    if (this.testCodeFilter) {
      filteredData = filteredData.filter(item =>
        item.tcode.toLowerCase().includes(this.testCodeFilter.toLowerCase())
      );
    }

    // Apply Test ID filter
    if (this.testIdFilter) {
      filteredData = filteredData.filter(item =>
        item.tesT_ID.toLowerCase().includes(this.testIdFilter.toLowerCase())
      );
    }

    // Apply Test Name filter
    if (this.testNameFilter) {
      filteredData = filteredData.filter(item =>
        item.fulL_NAME.toLowerCase().includes(this.testNameFilter.toLowerCase())
      );
    }
    // Define a map to convert display values to their corresponding codes
    const displayToCodeMap = {
      'Profile': 'G',
      'Single': 'D',
      'Package': 'S'
    };

    // Apply CT filter (multi-select)
    if (this.selectedCtLabs && this.selectedCtLabs.length > 0) {
      // Map selectedCtLabs to their corresponding codes
      const selectedCtCodes = this.selectedCtLabs.map(lab => displayToCodeMap[lab.name?.trim()]);

      // Filter the data based on the 'ct' field, matching any of the selected codes
      filteredData = filteredData.filter(item =>
        item.ct && selectedCtCodes.some(code => code === item.ct?.trim())
      );
    }

    this.filteredList = filteredData;
    this.filterListData = this.filteredList;
    this.updatePagination(); // Update pagination if needed
  }

  onOrderLabFilterChange(item: any): void {
    // Check if the item is selected or deselected
    if (item.selected) {
      // If selected, add to the selectedOrderLabs array if not already present
      const alreadySelected = this.selectedOrderLabs.some(lab => lab.name === item.name);
      if (!alreadySelected) {
        this.selectedOrderLabs.push({ name: item.name }); // Add the selected lab to the array
      }
    } else {
      // If deselected, remove from the selectedOrderLabs array
      this.selectedOrderLabs = this.selectedOrderLabs.filter(lab => lab.name !== item.name);
    }

    // Apply filters after selection changes
    this.applyFilters(); // Update the filtered results based on the current selections
  }


  // This method will be triggered when a checkbox is clicked
  onCtSelectionChange(selectedItem: any): void {
    // Update selectedCtLabs array based on the checkbox state
    if (selectedItem.selected) {
      // Add the item if it's not already in the selected list
      if (!this.selectedCtLabs.includes(selectedItem)) {
        this.selectedCtLabs.push(selectedItem);
      }
    } else {
      // Remove the item if it's unchecked
      this.selectedCtLabs = this.selectedCtLabs.filter(item => item !== selectedItem);
    }
    // Apply filters after selection is updated
    this.applyFilters();
  }

  deleteRow(_id: any): void {
    const userConfirmed = confirm("Do you want to delete this record?");
    if (!userConfirmed) {
      return; // Exit if user cancels the deletion
    }

    this._siteService.deleteSiteTestsAssignment(_id).subscribe(
      (response: any) => {
        const status = response.status;
        if (status === 200 || status === 204) {
          this._commonAlertService.deleteMessage();

          // Filter out the deleted item from the list
          this.siteTestsAssigmentList = this.siteTestsAssigmentList.filter(item => item.sitE_TESTS_ID !== _id);

          // Introduce a time delay (e.g., 1 second) before fetching updated data
          setTimeout(() => {
            this.getSiteAssignmentListData();  // Fetch the updated list after deletion
          }, 1500); // Adjust the time delay as needed (1000ms = 1 second)
        }
      },
      (error) => {
        console.error('Error occurred during deletion:', error);
        const status = error.status;
        if (status === 400) {
          this._commonAlertService.badRequestMessage();
        }
      }
    );
  }

}




