
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ArService } from './ar.service';
import { arModel } from 'src/app/models/arModel';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BAD_REQUEST_ERROR_MESSAGE, deleteErrorMessage, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-ar',
  templateUrl: './ar.component.html',
  styleUrls: ['./ar.component.scss']
})

export class ArComponent implements OnInit {
  arList: arModel[] = [];
  required_cd: string = "";
  required_ar_desc: string = "";

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  errorMessage: any;
  _id: any;
  Addrecord: boolean = false
  editRowId: any;
  visible: boolean = false
  editData_: any;

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  //Search
  filteredList: arModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;

  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';
  sortColumn: string = '';
  sortDirection: string = 'asc';

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  constructor(private _arService: ArService, private _commonService: CommonService, public _commonAlertService: CommonAlertService, private sortingService: SortingComponent) {
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.arList = [];
    this.GetarData();
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_AlphaResponse, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
    });
    this.GetarData();
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
	  this.arList = this.sortingService.sortData([...this.arList], column, this.sortDirection);
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
    this.arList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.arList = this.arList.filter(item =>
      item.cd.toLowerCase().includes(searchText) ||
      item.response.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetarData(): void {
    this._arService.getAllar().subscribe(res => {
      this.arList = res;
      this.dtTrigger.next(null);
      this.arList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.arList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading ar list:', error);
      })
  }

  checkAlreadyExisting(event: any) {
    if (this.arList.filter(x => x.cd == event.target.value).length > 1) {
      Swal.fire({
        text: 'ar number ' + event.target.value + ' already exists.',
      });
      event.target.value = "";
      //this.required_cd = "is-invalid";
    }
    //this.required_cd = "";
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.arList.length / this.itemsPerPage);
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


  addTable() {
    const existingAddRecordIndex = this.arList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.arList[existingAddRecordIndex];
      if (!existingAddRecord.aR_ID || existingAddRecord.aR_ID === 0) {
        this.arList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new arModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    this.arList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;

    // Update pagination after adding a new record
    this.totalItems = this.arList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: arModel) {
    if (_item.cd) {
      _item.cd = _item.cd.trim();
    }
    if (!_item.cd && !this.required_cd) {
      this.required_cd = "is-invalid";
    } else if (_item.cd && this.required_cd) {
      this.required_cd = ""; // Reset the class if the field is filled
    }
    if (_item.response) {
      _item.response = _item.response.trim();
    }
    if (!_item.response && !this.required_ar_desc) {
      this.required_ar_desc = "is-invalid";
    } else if (_item.response && this.required_ar_desc) {
      this.required_ar_desc = ""; // Reset the class if the field is filled
    }

    if (_item.cd && _item.response) {
      this._arService.addar(_item).subscribe(
        (response) => {
          //console.log(response);
          this.arList.find(x => {
            if (x.cd == _item.cd) {
              x.aR_ID = response.body;
            }
          });
          if (response.status === 200) {
            this._commonAlertService.successMessage();
            this.rerender();
          }
        },
        (error) => {
          // Handle error
          //console.error('error caught in component')
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          }
        });
      _item.IsAdd = false;
      _item.IsEdit = false;
      this.Addrecord = false;
    }
  }

  CancelAddRow(_id: any) {
    const index = this.arList.findIndex((u) => u.aR_ID == _id);
    if (index !== -1) {
      this.arList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.arList.find((u) => u.aR_ID == _id)));
    const index = this.arList.findIndex((u) => u.aR_ID == _id);
    this.arList[index].IsEdit = true;
  }

  Update(_item: arModel) {
    if (_item.cd) {
      _item.cd = _item.cd.trim();
    }
    if (!_item.cd)
      this.required_cd = "is-invalid";
    if (_item.response) {
      _item.response = _item.response.trim();
    }
    if (!_item.response)
      this.required_ar_desc = "is-invalid";
    if (_item.cd && _item.response) {
      this._arService.updatear(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            const index = this.arList.findIndex(item => item.aR_ID === _item.aR_ID);
            if (index !== -1) {
              this.arList[index] = _item;
            }
          }
        },
        (error) => {
          // Handle error
          //console.error('error caught in component')
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          }
        });
    }
  }

  CancelEditRow(_id: any) {
    const index = this.arList.findIndex(u => u.aR_ID === _id);
    if (index !== -1) {
      this.arList[index].IsEdit = false;
      this.arList[index].IsAdd = false;
      this.arList[index].cd = this.editData_.cd;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._arService.deletear(_id).subscribe(
        (response: any) => {
          //console.log('response received')          
          const status = response.status;
          if (status === 200 || status === 204) {
            this.arList = this.arList.filter(item => item.aR_ID !== _id);
            this.arList.push();
            this.updatePagination();
            this._commonAlertService.deleteMessage();
            this.rerender();
          }
        },
        (error) => {
          console.error('error caught in component')
          const status = error.status;
          if (status === 400) {
            this._commonAlertService.badRequestMessage();
          }
        });
    }
  }
}
