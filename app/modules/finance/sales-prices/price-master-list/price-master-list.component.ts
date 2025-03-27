import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { successMessage, updateSuccessMessage } from 'src/app/common/constant';
import { tdDivModel, TDModel } from 'src/app/models/tdmodel';
import { SortingComponent } from 'src/app/modules/pagination/sorting/sorting.component';
import { LabSiteService } from 'src/app/modules/system/lab-sites/lab-sites.service';
import { AddTestDirectoryService } from 'src/app/modules/test_directory/test-definition/add-test-directory/add-test-directory.service';
import { NumericRefernceRangeService } from 'src/app/modules/test_directory/test-definition/numeric-refernce-range/numeric-refernce-range.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-price-master-list',
  templateUrl: './price-master-list.component.html',
  styleUrls: ['./price-master-list.component.scss']
})
export class PriceMasterListComponent {

  isNormalPriceCardVisible: boolean = false;
  isHomeServiceCardVisible: boolean = false;
  cardPosition = { top: 0, left: 0 };
  isEditing: any;
  isAddModal: boolean = false;

  // Defined Models
  divList: tdDivModel[] = [];
  sectList: tdDivModel[] = [];
  tdList: TDModel[] = [];
  filteredList: TDModel[] = [];
  searchText: string = '';
  tdListCopy: TDModel[] = [];
  TDModel: any[] = [];

  // Defined Local Variables
  index: number = 0;
  div: string = '0';
  sect: string = '';
  testTd: string = '';
  testCode: string = '';
  refValue: string = '';
  isEditMode = false;
  divisionList: any;
  originalPrices = [];
  refSecSiteDropDown: any;
  url: string;
  excludeZeroValues: boolean = false; // To track the state of the checkbox
  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Sorting
  sortColumn: string = '';
  sortDirection: string = 'asc';

  //Filtering Varaiables
  filterVisibility = {
    testId: false,
    testCode: false,
    fulL_NAME: false,
    ct: false,
    bill: false,
    oldNormalPrice: false,
    uprice: false,
    oldHomePrice: false,
    uprice2: false
  };

  testIdFilter: string = '';
  testCodeFilter: string = '';
  fullNameFilter: string = '';
  ctFilter: string = '';
  billFilter: string = '';
  oldNormalPriceFilter: string = '';
  uPriceFilter: string = '';
  oldHomePriceFilter: string = '';
  uPrice2Filter: string = '';

  testIdOptions: any[] = []; // Populate this with your data   
  ctLabOptions: any[] = [];
  billOptions: any[] = [];

  selectedtestId: any[] = []; // Store selected order labs
  selectedtestCode: any[] = []; // Store selected process labs
  selectedfullName: any[] = [];
  selectedCtLabs: any = [];
  selectedbill: any = [];
  selectedoldNormalPrice: any = [];
  selecteduprice: any = [];
  selectedoldHomePrice: any = [];
  selecteduprice2: any = [];

  constructor(private _labSiteService: LabSiteService,
    private _numericReferenceRangeService: NumericRefernceRangeService,
    private _addTestDirectoryService: AddTestDirectoryService, private sortingService: SortingComponent) { }


  ngOnInit(): void {
    $('#siteTestsAssignment').addClass("is-active");
    this.refresh();
    this.getDivisionData();
    this.getTestsForDivision(0);
  }

  refresh() {
    this.getAllTestDirecotryData();
  }

  getAllTestDirecotryData(): void {
    this._addTestDirectoryService.getAllTD().subscribe(res => {
      this.tdList = res;
      // Map full_Name to fulL_NAME
      const mappedData = res.map(item => ({
        ...item,
        fulL_NAME: item.full_Name
      }));
      // Assign the mapped data to both models
      this.tdList = [...mappedData];
      this.getPrices();
      this.tdListCopy = [...mappedData];
      this.getFilteredItems();
      this.filteredList = [...this.tdList];
    },
      (error) => {
        console.error('Error loading Site list:', error);
      }
    );
  }

  hideCard(): void {
    this.isNormalPriceCardVisible = false;
    this.isHomeServiceCardVisible = false;
  }

  // Function to return display type based on item properties
  getDisplayType(item: any): string {
    switch (item) {
      case 'D':
        return 'Single';
      case 'G':
        return 'Profile';
      case 'S':
        return 'Package';
      default:
        return 'N/A'; // Default for unmatched types
    }
  }

  loadTestTD(event: any) {
    if (event.target.value.trim() === '') {
      this.tdList = this.tdListCopy;
    }
    this.getPrices();
    this.tdList = this.tdList.filter(x => x.tcode.toString().startsWith(event.target.value.toString().toUpperCase()));
    this.tdList = this.tdList.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
  }

  getDivisionData(): void {
    this._numericReferenceRangeService.getAllDivision().subscribe(res => {
      this.divList = res;
      this.getPrices();
    },
      (error) => {
        console.error('Error loading div list:', error);
      })
  }

  getPrices(): void {
    this.tdList.forEach(x => {
      x.oldNormalPrice = x.uprice;
      x.oldHomePrice = x.upricE2;
    });
  }

  getSectionData(event: any) {
    this._labSiteService.getTestForDivision(parseInt(event.target.value)).subscribe(res => {
      this.sectList = res;
      this.getPrices();
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
        this.getPrices();
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

  // Save the updated price
  saveNormalPrice(): void {
    let saveDatalist = this.tdList.filter(x => x.editedRow);
    if (saveDatalist.length > 0) {
      // Call the API to update the price
      this._addTestDirectoryService.updateTestDirectoryList(saveDatalist).subscribe(
        (response) => {
          if (response.status === 200 || response.status === 204) {
            Swal.fire({
              text: updateSuccessMessage,
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.refresh();
          }
        },
        (error) => {
          console.error('Error updating price:', error);
          Swal.fire({
            text: 'An error occurred while updating the price.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      Swal.fire({
        text: 'update at least one row',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }

    this.tdList.forEach(x => { x.editedRow = false; x.isEditing = false; })
  }

  editPriceList() {
    this.tdList.forEach(x => x.isEditing = true);
  }

  cancelPriceList() {
    this.tdList.forEach(x => { x.isEditing = false; x.editedRow = false; x.upricE2 = x.oldHomePrice; x.uprice = x.oldNormalPrice });
  }

  editedRows(item: TDModel) {
    item.editedRow = true;
  }

  // Handle Pagination
  updatePagination(): void {
    const totalPages = Math.ceil(this.tdList.length / this.itemsPerPage);
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

  // Handle sorting
  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Perform your sorting logic
    this.tdList = this.sortingService.sortData([...this.tdList], column, this.sortDirection);
  }

  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'expand_less' : 'expand_more';
    }
    return 'unfold_more';
  }

  getSortIconClass(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'expand-less' : 'expand-more';
    }
    return '';
  }


  // Method to apply the zero value filter
  applyZeroValueFilter(): void {
    if (this.excludeZeroValues) {
      // Exclude rows that contain zero values in any of the relevant fields
      this.tdList = this.tdList.filter(item =>
        item.uprice != 0
      );
    } else {
      // If unchecked, reset to the original full list
      this.refresh();
    }
  }

  // Function to handle search input changes
  onSearch(): void {
    this.tdList = [...this.filteredList];
    const searchText = this.searchText.toLowerCase().trim();
    this.tdList = this.tdList.filter(item =>
      item.fulL_NAME.includes(searchText) || item.fulL_NAME.toLocaleUpperCase().includes(searchText) ||
      item.ct.toLocaleLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  // Perform your Filter logic
  isFilterVisible(): boolean {
    return Object.values(this.filterVisibility).some(visible => visible);
  }

  toggleFilter(filter: string) {
    this.filterVisibility[filter] = !this.filterVisibility[filter];
  }

  getFilteredItems(): void {
    // Extract unique order lab options from the response
    const FilteredLBills = Array.from(new Set(this.tdList.map(item => item.bill))).map(bill => ({
      name: bill,
      selected: false
    }));

    const FilteredCTData = Array.from(new Set(this.tdList.map(item => item.ct))).map(ctPackageType => ({
      name: this.getDisplayType(ctPackageType),
      selected: false
    }));


    // Assign the filtered data to the respective options
    this.billOptions = [...FilteredLBills];
    // this.processLabOptions = [...FilteredLabSiteData];
    this.ctLabOptions = [...FilteredCTData];
  }

  applyFilters() {
    let filteredData = [...this.filteredList]; // Start with the full list of data

    // Apply Test ID filter
    if (this.testIdFilter) {
      filteredData = filteredData.filter(item =>
        item.tesT_ID && item.tesT_ID.toString().toLowerCase().includes(this.testIdFilter.toLowerCase())
      );
    }

    // Apply Test Code filter
    if (this.testCodeFilter) {
      filteredData = filteredData.filter(item =>
        item.tcode && item.tcode.toString().toLowerCase().includes(this.testCodeFilter.toLowerCase())
      );
    }

    // Define a map to convert display values to their corresponding codes
    const displayToCodeMap = {
      'Profile': 'G',
      'Single': 'D',
      'Package': 'S'
    };
    // Exclude rows where Uprice is 0
    filteredData = filteredData.filter(item => item.uprice !== 0);

    // Apply CT filter (multi-select)
    if (this.selectedCtLabs && this.selectedCtLabs.length > 0) {
      // Map selectedCtLabs to their corresponding codes
      const selectedCtCodes = this.selectedCtLabs.map(lab => displayToCodeMap[lab.name?.trim()]);

      // Filter the data based on the 'ct' field, matching any of the selected codes
      filteredData = filteredData.filter(item =>
        item.ct && selectedCtCodes.some(code => code === item.ct?.trim())
      );
    }

    // Apply Bill filter
    if (this.selectedbill && this.selectedbill.length > 0) {
      const selectedBill = this.selectedbill.map(bill => bill.name.trim().toLowerCase());
      filteredData = filteredData.filter(item =>
        item.bill && selectedBill.includes(item.bill.trim().toLowerCase())
      );
    }

    // Apply Old Normal Price filter
    if (this.oldNormalPriceFilter) {
      filteredData = filteredData.filter(item =>
        item.oldNormalPrice && item.oldNormalPrice.toString().toLowerCase().includes(this.oldNormalPriceFilter.toLowerCase())
      );
    }

    // Apply Uprice filter
    if (this.uPriceFilter) {
      filteredData = filteredData.filter(item =>
        item.uprice && item.uprice.toString().toLowerCase().includes(this.uPriceFilter.toLowerCase())
      );
    }

    // Apply Uprice2 filter
    if (this.uPrice2Filter) {
      filteredData = filteredData.filter(item =>
        item.upricE2 && item.upricE2.toString().toLowerCase().includes(this.uPrice2Filter.toLowerCase())
      );
    }

    // Update the filtered list
    this.tdList = filteredData;

    this.updatePagination(); // Update pagination if needed
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


  // This method will be triggered when a checkbox in the 'bill' select changes
  onBillSelectionChange(selectedItem: any): void {
    // Add or remove from selectedbill based on the checkbox state
    if (selectedItem.selected) {
      if (!this.selectedbill.includes(selectedItem)) {
        this.selectedbill.push(selectedItem);
      }
    } else {
      this.selectedbill = this.selectedbill.filter(item => item !== selectedItem);
    }

    // Apply filters whenever there's a change in the selected items
    this.applyFilters();
  }

}
