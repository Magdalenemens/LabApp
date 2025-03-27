import { Component } from '@angular/core';
import { sysconfigModel } from 'src/app/models/sysconfigModel';
import { SytemService } from '../../system/system.service';
import { SiteService } from '../site/sites.service';
import { accnPrefixModel } from 'src/app/models/accnPrefixModel';
import moment from 'moment';
import { PageName } from 'src/app/common/enums';
import { CommonService } from 'src/app/common/commonService';
import { Subject } from 'rxjs';
import { SortingComponent } from '../../pagination/sorting/sorting.component';

@Component({
  selector: 'app-accnprefix',
  templateUrl: './accnprefix.component.html',
  styleUrls: ['./accnprefix.component.scss']
})
export class AccnprefixComponent {
  dtTrigger: Subject<any> = new Subject<any>();
  accnList: accnPrefixModel[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: accnPrefixModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';
  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(private _siteService: SiteService, private _commonService: CommonService, private sortingService: SortingComponent) { }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.accnList = [];
    this.GetAllLoginHistory();
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_AccessionPrefix, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  GetAllLoginHistory(): void {
    this._siteService.GetAllAccnPrefix().subscribe(
      res => {
        this.accnList = res;
        this.filteredList = [...this.accnList];
        this.updatePagination();
      },
      (error) => {
        console.error('Error loading login history:', error);
      }
    );
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
  this.accnList = this.sortingService.sortData([...this.accnList], column, this.sortDirection);
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

  onSearch(): void {
    // Use filteredList as the base data
    this.accnList = [...this.filteredList];

    // Get the trimmed and uppercased search text
    const searchText = this.searchText.toUpperCase().trim();

    // If there's search text, filter the list
    if (searchText) {
      this.accnList = this.accnList.filter(item =>
        (item.prfx && item.prfx.toUpperCase().includes(searchText)) ||
        (item.descrip && item.descrip.toLocaleUpperCase().includes(searchText))
      );
    }
    // Update pagination after filtering
    this.updatePagination();
  }


  updatePagination(): void {
    const totalPages = Math.ceil(this.accnList.length / this.itemsPerPage);
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



