import { Component, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { userflModel } from 'src/app/models/userflModel';
import { SiteService } from 'src/app/modules/masters/site/sites.service';
import { SharedService } from 'src/app/modules/shared/services/sharedService';
import { UserService } from '../../users/users.service';
import { siteModel } from 'src/app/models/siteModel';
import { SortingComponent } from 'src/app/modules/pagination/sorting/sorting.component';

@Component({
  selector: 'app-site-ist',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent {
  siteList: siteModel[] = [];

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
  filteredList: siteModel[] = [];
  searchText: string = '';
  
  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(private _siteService: SiteService,  private sortingService: SortingComponent, 
    private route: Router, private _sharedservice: SharedService) {

  }

  ngOnInit(): void {
    $('#siteList').addClass("is-active");
    this.getSiteListData();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getSiteListData(): void {
    this._siteService.getAllSite().subscribe(res => {
      this.siteList = res;
      this.filteredList = [...this.siteList];
      this.updatePagination();
      this.dtTrigger.next(null);

    },
      (error) => {
        console.error('Error loading User list:', error);
      })
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
  this.siteList = this.sortingService.sortData([...this.siteList], column, this.sortDirection);
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

  // Function to handle search input changes
  onSearch(): void {
    this.siteList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.siteList = this.siteList.filter(item =>
       item.reF_SITE_NAME.includes(searchText) ||
      item.sitE_NAME.toLocaleLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  routePath( _id: any) {
    localStorage.setItem('siteId', _id);
    // this._sharedservice.selected = url;
    this.url = ('../system/Labsites/addData');
    this.route.navigate([this.url]);
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.siteList.length / this.itemsPerPage);
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

