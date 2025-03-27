import { Component, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Modal } from 'bootstrap';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/common/commonService';
import { deleteErrorMessage } from 'src/app/common/constant';
import { GetpageTrackRecordModel, pageTrackRecordModel } from 'src/app/models/pageTrackRecordModel';
import { userflModel } from 'src/app/models/userflModel';
import { SiteService } from 'src/app/modules/masters/site/sites.service';
 import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { UserService } from '../users.service';
import { SortingComponent } from 'src/app/modules/pagination/sorting/sorting.component';


@Component({
  selector: 'app-pagetracking',
  templateUrl: './pagetracking.component.html',
  styleUrl: './pagetracking.component.scss'
})
export class PagetrackingComponent {
  userList: GetpageTrackRecordModel[] = [];

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
  router: any;
  userIdFromRoute: number;
  //Search
  filteredList: GetpageTrackRecordModel[] = [];
  searchText: string = '';

  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(public _userService: UserService, private sortingService: SortingComponent,
    private _siteService: SiteService, private route: ActivatedRoute) {
    // First get the product id from the current route.

  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.userIdFromRoute = Number(routeParams.get('userId'));
    this.GetAllPageTrackData();

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
	  this.userList = this.sortingService.sortData([...this.userList], column, this.sortDirection);
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  GetAllPageTrackData(): void {
    this._siteService.GetAllPageTrackData().subscribe(res => {
      this.userList = res;
      this.filteredList = [...this.userList];
      this.updatePagination();
      this.dtTrigger.next(null);
      this.userList.forEach(x => { x.IsAdd = false; x.IsEdit = false })

      if (this.userIdFromRoute && this.userIdFromRoute != 0) {
        this.userList = this.userList.filter(x => x.useR_ID === this.userIdFromRoute.toString());
      }
    },
      (error) => {
        console.error('Error loading page tracking list:', error);
      })
  }

  // Function to handle search input changes
  onSearch(): void {
    this.userList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.userList = this.userList.filter(item =>
      item.useR_ID.includes(searchText) ||
      item.pagE_NAME.toLocaleLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  convertSecondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}:${minutes}:${remainingSeconds}`;
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.userList.length / this.itemsPerPage);
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
