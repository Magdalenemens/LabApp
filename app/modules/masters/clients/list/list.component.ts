import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { clientModel } from 'src/app/models/clientModel';
import { AddclientService } from '../addclients/addclient.service';
import { Router } from '@angular/router';
import { SortingComponent } from 'src/app/modules/pagination/sorting/sorting.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  // client: clientModel;
  clientList: clientModel[] = [];

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  totalItems: number;
  pageChange: any;

  //readmore variable, its true than read more string will print
  Addrecord: boolean = false
  editclientListId: any;
  url = '';
  //hiding info box
  visible: boolean = false
  dtTrigger: Subject<any> = new Subject<any>();
  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(public services: AddclientService, private router: Router, private sortingService: SortingComponent) {

  }



  ngOnInit(): void {
    $('#btnlist').addClass("is-active");
    this.GetClientData();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
	  this.clientList = this.sortingService.sortData([...this.clientList], column, this.sortDirection);
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

  GetClientData(): void {
    this.services.getAllclient().subscribe(res => {
      this.clientList = res.clients;
      this.updatePagination();
      this.dtTrigger.next(null);
      this.clientList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
    },
      (error) => {
        console.error('Error loading Client list:', error);
      })
  }


  Edit(_id: any) {
    this.editclientListId = _id;
    let IsAdd_ = this.clientList.find((u) => u.clnT_FL_ID == _id);
    const index = this.clientList.findIndex((u) => u.clnT_FL_ID == _id);
    this.clientList[index].IsEdit = true;
    localStorage.setItem('Client_id', _id);
    this.url = '../masters/clients/addclient';
    this.router.navigate([this.url]);
  }

  CancelclientList(_id: any) {
    this.editclientListId = _id;
    let IsAdd_ = this.clientList.find((u) => u.clnT_FL_ID == _id);
    const index = this.clientList.findIndex((u) => u.clnT_FL_ID == _id);
    this.clientList[index].IsEdit = false;
    this.clientList[index].IsAdd = false;

  }

  addTable() {

    if (!this.Addrecord) {
      console.log(this.clientList.length);
      const obj = {
        Division_No: '',
        Division_name: '',
        IsAdd: true,
        IsEdit: false
      };
      this.Addrecord = true; //not equal to condition
      this.visible = false;
      //this.clientList.push(obj);
      //this.clientList[this.clientList.length - 1].clnT_FL_ID = this.clientList.length.toString();
      this.Addrecord = true;
    }
    // else
    // alert("Required");
  }

  deleteclientList(_id: any) {

    var delBtn = confirm(" Do you want to delete ?");
    if (delBtn == true) {
      this.clientList.splice(_id, 1);
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.clientList.length / this.itemsPerPage);
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

  AddData() {
  }

  Update() {
  }
}
