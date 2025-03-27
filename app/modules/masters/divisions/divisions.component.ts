import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { DivisionService } from './division.service';
import { divisionModel } from 'src/app/models/divisionModel';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { alertTwoDigits, deleteErrorMessage, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import { pageTrackRecordModel } from 'src/app/models/pageTrackRecordModel';
import { CommonService } from 'src/app/common/commonService';
import moment from 'moment';
import { PageName } from 'src/app/common/enums';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { SortingComponent } from '../../pagination/sorting/sorting.component';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.scss'],
})

export class DivisionsComponent implements OnInit {
  divisionList: divisionModel[] = [];
  required_div_no: string = "";
  required_div_abrv: string = "";
  required_div_desc: string = "";


  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();

  Addrecord: boolean = false
  editRowId: any;
  visible: boolean = false
  editData_: any;

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: divisionModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;
  currentDateTime = moment();


  startTime: string = '';
  endTime: string = '';
  pageTrackRecord: pageTrackRecordModel;

  sortColumn: string = '';
  sortDirection: string = 'asc';

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  constructor(private _divisionService: DivisionService, private _commonService: CommonService, public _commonAlertService: CommonAlertService, private sortingService: SortingComponent) {
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();

    this.divisionList = [];
    this.GetDivisionData();
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Masters_Division, this.startTime, this.endTime);
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
  this.divisionList = this.sortingService.sortData([...this.divisionList], column, this.sortDirection);
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

  rerender(): void {
    this.GetDivisionData();
  }

  // Function to handle search input changes
  onSearch(): void {
    this.divisionList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.divisionList = this.divisionList.filter(item =>
      item.div.toLowerCase().includes(searchText) ||
      item.descrip.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetDivisionData(): void {
    this._divisionService.getAllDivision().subscribe(res => {
      this.divisionList = res;
      this.dtTrigger.next(null);
      this.divisionList.forEach(x => { x.IsAdd = false; x.IsEdit = false });
      this.filteredList = [...this.divisionList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading division list:', error);
      });
  }

  checkAlreadyExisting(event: any) {
    const divnoLength = event.target.value;
    if (this.divisionList.filter(x => x.div == event.target.value).length > 1) {
        this._commonAlertService.warningMessage();
      event.target.value = "";
    } else if (divnoLength.length < 2) {
      this._commonAlertService.alertTwoDigits();
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.divisionList.length / this.itemsPerPage);
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
    // Find any item with IsAdd status
    const existingAddRecordIndex = this.divisionList.findIndex(item => item.IsAdd);

    // Check if there's an existing record with IsAdd status and diV_ID is "0" or empty
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.divisionList[existingAddRecordIndex];
      if (!existingAddRecord.laB_DIV_ID || existingAddRecord.laB_DIV_ID === 0) {
        this.divisionList.splice(existingAddRecordIndex, 1); // Remove the specific row         
        this.Addrecord = false;
      }
    }

    // If no existing record or existing record does not meet the condition, add a new record
    const newrecord = new divisionModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    this.divisionList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;

    // Update pagination after adding a new record
    this.totalItems = this.divisionList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: divisionModel) {
    if (!_item.div && !this.required_div_no) {
      this.required_div_no = "is-invalid";
    } else if (_item.div && this.required_div_no) {
      this.required_div_no = "";
    }

    if (!_item.abrv && !this.required_div_abrv) {
      this.required_div_abrv = "is-invalid";
    } else if (_item.abrv && this.required_div_abrv) {
      this.required_div_abrv = "";
    }

    _item.descrip = _item.descrip.trim();
    if (!_item.descrip && !this.required_div_desc) {
      this.required_div_desc = "is-invalid";
    } else if (_item.descrip && this.required_div_desc) {
      this.required_div_desc = "";
    }

    if (_item.div && _item.descrip && _item.abrv) {
      this._divisionService.addDivision(_item).subscribe(
        (response) => {
          this.divisionList.find(x => {
            if (x.div == _item.div) {
              x.laB_DIV_ID = response.body;
            }
          });
          if (response.status === 200) {
            this._commonAlertService.successMessage();
            this.rerender();
          }
        },
        (error) => {
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          }
        });
      _item.IsAdd = false;
      _item.IsEdit = false;
      this.Addrecord = true;
    }
  }

  CancelAddRow(_id: any) {
    const index = this.divisionList.findIndex((u) => u.laB_DIV_ID == _id);

    if (index !== -1) {
      this.divisionList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.divisionList.find((u) => u.laB_DIV_ID == _id)));
    const index = this.divisionList.findIndex((u) => u.laB_DIV_ID == _id);
    this.divisionList[index].IsEdit = true;
  }

  Update(_item: divisionModel) {
    if (!_item.div && !this.required_div_no) {
      this.required_div_no = "is-invalid";
    } else if (_item.div && this.required_div_no) {
      this.required_div_no = "";
    }

    if (!_item.abrv && !this.required_div_abrv) {
      this.required_div_abrv = "is-invalid";
    } else if (_item.abrv && this.required_div_abrv) {
      this.required_div_abrv = "";
    }

    _item.descrip = _item.descrip.trim();
    if (!_item.descrip && !this.required_div_desc) {
      this.required_div_desc = "is-invalid";
    } else if (_item.descrip && this.required_div_desc) {
      this.required_div_desc = "";
    }
    if (_item.div && _item.descrip && _item.abrv) {
      this._divisionService.updateDivision(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            const index = this.divisionList.findIndex(item => item.laB_DIV_ID === _item.laB_DIV_ID);
            if (index !== -1) {
              this.divisionList[index] = _item;
            }
          }
        },
        (error) => {
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          }
        });
    }
  }

  CancelEditRow(_id: any) {
    const index = this.divisionList.findIndex(u => u.laB_DIV_ID === _id);
    if (index !== -1) {
      this.divisionList[index].IsEdit = false;
      this.divisionList[index].IsAdd = false;
      this.divisionList[index].div = this.editData_.div;
      this.divisionList[index].descrip = this.editData_.descrip;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._divisionService.deleteDivision(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.divisionList = this.divisionList.filter(item => item.laB_DIV_ID !== _id);
            this.divisionList.push();
            this.updatePagination();
            this._commonAlertService.deleteMessage();
            this.rerender();
          }
        },
        (error) => {
          console.error('error caught in component')
          const status = error.status;
          if (status === 400) {
            this._commonAlertService.deleteErrorMessage();
          }
        });
    }
  }
}

