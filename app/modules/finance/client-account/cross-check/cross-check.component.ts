import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SortingComponent } from 'src/app/modules/pagination/sorting/sorting.component';
import { ClientAccountDataEntryService } from '../data-client-account/data-client-account.service';
import { clientAccountCrossCheckDetails } from 'src/app/models/clientAccountDataEntry';
import { LoaderService } from 'src/app/modules/shared/services/loaderService';

@Component({
  selector: 'app-cross-check',
  templateUrl: './cross-check.component.html',
  styleUrls: ['./cross-check.component.scss']
})
export class CrossCheckComponent {
  crossCheckList: clientAccountCrossCheckDetails[] = []
  sortColumn: string = '';
  sortDirection: string = 'asc';
  displaySince = 6;
  isPositive = true;
  //Pagination
  // currentPage: number = 1;
  // itemsPerPage: number = 10;
  // pageSizeOptions: number[] = [10, 25, 50];

  //Search
  filteredList: clientAccountCrossCheckDetails[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;


  cnFilter: string;
  clientFilter: string;
  invoiceNoFilter: string;
  invoiceDateFilter: string;
  invocieValueFilter: string;
  accountValueFilter: string;
  differenceFilter: string;


  constructor(private fb: FormBuilder, private router: Router,
    private sortingService: SortingComponent,
    private _clientaccountservice: ClientAccountDataEntryService,
    private _loaderService: LoaderService
  ) {

  }
  ngOnInit(): void {
    this.crossCheckList = [];
    this.getClientAccountCrossCheckDetails();
    this._loaderService.ShowHideLoader(1000);
    
  }


  filterVisibility = {
    cn: false,
    client: false,
    vC_NO: false,
    inV_DATE: false,
    granD_VAL: false,
    debit: false,
    diff: false,
  };

  // Handle sorting
  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Perform your sorting logic
    this.crossCheckList = this.sortingService.sortData(
      [...this.crossCheckList],
      column,
      this.sortDirection
    );
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

  toggleFilter(filter: string) {
    this.filterVisibility[filter] = !this.filterVisibility[filter];
  }
  // Perform your Filter logic
  isFilterVisible(): boolean {
    return Object.values(this.filterVisibility).some((visible) => visible);
  }
  // updatePagination(): void {
  //   const totalPages = Math.ceil(this.crossCheckList.length / this.itemsPerPage);
  //   this.currentPage = Math.min(this.currentPage, totalPages) || 1;
  // }

  // goToPage(page: number): void {
  //   this.currentPage = page;
  // }

  // onPageSizeChange(event: any): void {
  //   this.itemsPerPage = event;
  //   this.currentPage = 1;
  //   this.updatePagination();
  // }
  getClientAccountCrossCheckDetails() {
    this._loaderService.show();
    this._clientaccountservice.getClientAccountCrossCheckList(this.displaySince ?? 0, this.isPositive).subscribe(res => {
      this._loaderService.hide();
      this.crossCheckList = res;
      this.filteredList = [...this.crossCheckList];
      // this.updatePagination();
    },
      (error) => {
        this._loaderService.hide();
        console.error('Error loadinng anatomic list:', error);
      })
  }
  applyFilters() {
    let filteredData = [...this.filteredList]; // Start with the full list of data

    // Apply Sample ID filter

    if (this.cnFilter) {
      filteredData = filteredData.filter(item =>
        item.cn && item.cn.toString().toLowerCase().includes(this.cnFilter.toLowerCase())
      );
    }
    if (this.clientFilter) {
      filteredData = filteredData.filter(item =>
        item.client && item.client.toString().toLowerCase().includes(this.clientFilter.toLowerCase())
      );
    }
    if (this.differenceFilter) {
      filteredData = filteredData.filter(item =>
        item.diff && item.diff.toString().toLowerCase().includes(this.differenceFilter.toLowerCase())
      );
    }

    this.crossCheckList = filteredData;
  }
}
