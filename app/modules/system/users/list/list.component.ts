import { Component, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { clientModel } from 'src/app/models/clientModel';
import { AddclientService } from 'src/app/modules/masters/clients/addclients/addclient.service';
import { userflModel } from 'src/app/models/userflModel';
import { FormBuilder } from '@angular/forms';
 import { SiteService } from 'src/app/modules/masters/site/sites.service';
import { SharedService } from 'src/app/modules/shared/services/sharedService';
import { UserService } from '../users.service';
import { SortingComponent } from 'src/app/modules/pagination/sorting/sorting.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class UserListComponent {
  userList: userflModel[] = [];

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
  filteredList: userflModel[] = [];
  searchText: string = '';

  sortColumn: string = '';
  sortDirection: string = 'asc';


  constructor(private formBuilder: FormBuilder, public _userService: UserService, private sortingService: SortingComponent,
    private el: ElementRef, private _siteService: SiteService, private route: Router, private _sharedservice: SharedService) {

  }

  ngOnInit(): void {
    $('#btnlist').addClass("is-active");
    this.getUserListData();
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

  getUserListData(): void {
    this._userService.getAllUser().subscribe(res => {
      this.userList = res;
      this.filteredList = [...this.userList];
      this.updatePagination();
      this.dtTrigger.next(null);
      this.userList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
    },
      (error) => {
        console.error('Error loading User list:', error);
      })
  }

  // Function to handle search input changes
  onSearch(): void {
    this.userList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.userList = this.userList.filter(item =>
      item.useR_ID.includes(searchText) || item.useR_NAME.toLocaleLowerCase().includes(searchText) ||
      item.fulL_NAME.toLocaleLowerCase().includes(searchText)
    );
    this.updatePagination();
  }



  Edit(_id: any) {
    this.edituserListId = _id;
    let IsAdd_ = this.userList.find((u) => u.useR_FL_ID == _id);
    const index = this.userList.findIndex((u) => u.useR_FL_ID == _id);
    this.userList[index].IsEdit = true;
    localStorage.setItem('useRfl_ID', _id);
    this.url = '../users/adduser';
    // this.router.navigate([this.url]);
  }

  routePath(url: any, _id: any) {
    this._sharedservice.selected = url;
    this.route.navigateByUrl('/system/users/' + url + _id);
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
