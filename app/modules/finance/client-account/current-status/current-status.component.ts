import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { clientAccountCurrentStatusDetails } from 'src/app/models/clientAccountDataEntry';
import { SortingComponent } from 'src/app/modules/pagination/sorting/sorting.component';
import { ClientAccountDataEntryService } from '../data-client-account/data-client-account.service';
@Component({
  selector: 'app-current-status',
  templateUrl: './current-status.component.html',
  styleUrls: ['./current-status.component.scss'],
})
export class CurrentStatusComponent {
  currentStatusList: clientAccountCurrentStatusDetails[] = [];
  filteredList:clientAccountCurrentStatusDetails[] = [];
  sortColumn: string = '';
  sortDirection: string = 'asc';

  //Search
  searchText: string = '';
  totalItems: number;
  pageChange: any;

  cnFilter: string;
  clientFilter: string;
  totalDebitFilter: string;
  totalCreditFilter: string;
  totalBalanceFilter: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sortingService: SortingComponent,
    private _clientaccountservice: ClientAccountDataEntryService
  ) {}

  ngOnInit(): void {
    this.currentStatusList = [];
    this.getClientAccountCurrentstatusDetails();
  }

  filterVisibility = {
    cn: false,
    client: false,
    totdebit: false,
    totcredit: false,
    totbalance: false,
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
    this.currentStatusList = this.sortingService.sortData(
      [...this.currentStatusList],
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
  getClientAccountCurrentstatusDetails() {
    this._clientaccountservice.getClientAccountCurrentStatusList().subscribe(res => {
      this.currentStatusList = res;
      this.filteredList = [...this.currentStatusList];
      // this.updatePagination();
    },
      (error) => {
        console.error('Error loadinng anatomic list:', error);
      })
  }

  applyFilters()
    {
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
      if (this.totalDebitFilter) {
        filteredData = filteredData.filter(item =>
          item.totdebit && item.totdebit.toString().toLowerCase().includes(this.totalDebitFilter.toLowerCase())
        );
      }
      if (this.totalCreditFilter) {
        filteredData = filteredData.filter(item =>
          item.totcredit && item.totcredit.toString().toLowerCase().includes(this.totalCreditFilter.toLowerCase())
        );
      }
      if (this.totalBalanceFilter) {
        filteredData = filteredData.filter(item =>
          item.totbalance && item.totbalance.toString().toLowerCase().includes(this.totalBalanceFilter.toLowerCase())
        );
      }
  
      this.currentStatusList = filteredData;
  }
}


