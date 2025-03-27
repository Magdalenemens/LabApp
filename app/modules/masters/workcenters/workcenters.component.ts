import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkCenterService } from './workcenter.service';
import { workcenterModel } from 'src/app/models/workcenterModel';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { alertThreeDigits, alertTwoDigits, deleteErrorMessage, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import moment from 'moment';
import { pageTrackRecordModel } from 'src/app/models/pageTrackRecordModel';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';


@Component({
  selector: 'app-workcenter',
  templateUrl: './workcenters.component.html',
  styleUrls: ['./workcenters.component.scss']
})

export class WorkCentersComponent implements OnInit {
  workcenterList: workcenterModel[] = [];
  required_wc_no: string = "";
  required_wc_desc: string = "";
  // dtOptions: DataTables.Settings = {
  // };
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
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: workcenterModel[] = [];
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

  constructor(private _workCentersService: WorkCenterService, private _commonService: CommonService, public _commonAlertService: CommonAlertService, private sortingService: SortingComponent) { }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.workcenterList = [];
    this.GetWorkCenterData();
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_WorkCenter, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetWorkCenterData();
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
  this.workcenterList = this.sortingService.sortData([...this.workcenterList], column, this.sortDirection);
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
    this.workcenterList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.workcenterList = this.workcenterList.filter(item =>
      item.wc.toLowerCase().includes(searchText) ||
      item.descrip.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetWorkCenterData(): void {
    this._workCentersService.getAllWorkCenter().subscribe(res => {
      this.workcenterList = res;
      this.dtTrigger.next(null);
      this.workcenterList.forEach(x => { x.IsAdd = false; x.IsEdit = false });
      this.filteredList = [...this.workcenterList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading WorkCenter list:', error);
      })
  }

  checkAlreadyExisting(event: any) {
    const wcLength = event.target.value;
    if (this.workcenterList.filter(x => x.wc == event.target.value).length >= 2) {
      this._commonAlertService.warningMessage();
      event.target.value = "";
    } else if (wcLength.length < 3) {
      this._commonAlertService.alertThreeDigits();
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.workcenterList.length / this.itemsPerPage);
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
    const existingAddRecordIndex = this.workcenterList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.workcenterList[existingAddRecordIndex];
      if (!existingAddRecord.laB_WC_ID || existingAddRecord.laB_WC_ID === 0) {
        this.workcenterList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new workcenterModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    this.workcenterList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;
    // Update pagination after adding a new record
    this.totalItems = this.workcenterList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: workcenterModel) {
    if (!_item.wc && !this.required_wc_no) {
      this.required_wc_no = "is-invalid";
    } else if (_item.wc && this.required_wc_no) {
      this.required_wc_no = "";
    }
    _item.descrip = _item.descrip.trim();
    if (!_item.descrip && !this.required_wc_desc) {
      this.required_wc_desc = "is-invalid";
    } else if (_item.descrip && this.required_wc_desc) {
      this.required_wc_desc = "";
    }

    if (_item.wc && _item.descrip) {
      this._workCentersService.addWorkCenter(_item).subscribe(
        (response) => {
          this.workcenterList.find(x => {
            if (x.wc == _item.wc) {
              x.laB_WC_ID = response.body;
            }
          });
          if (response.status === 200) {
            this._commonAlertService.successMessage();
            this.rerender();
          }
        },
        (error) => {
          // Handle error        
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
    const index = this.workcenterList.findIndex((u) => u.laB_WC_ID == _id);
    if (index !== -1) {
      this.workcenterList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
  }

  //hiding info box
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.workcenterList.find((u) => u.laB_WC_ID == _id)));
    const index = this.workcenterList.findIndex((u) => u.laB_WC_ID == _id);
    this.workcenterList[index].IsEdit = true;
  }

  Update(_item: workcenterModel) {
    if (!_item.wc && !this.required_wc_no) {
      this.required_wc_no = "is-invalid";
    } else if (_item.wc && this.required_wc_no) {
      this.required_wc_no = "";
    }
    _item.descrip = _item.descrip.trim();
    if (!_item.descrip && !this.required_wc_desc) {
      this.required_wc_desc = "is-invalid";
    } else if (_item.descrip && this.required_wc_desc) {
      this.required_wc_desc = "";
    }

    if (_item.wc && _item.descrip) {
      this._workCentersService.updateWorkCenter(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            const index = this.workcenterList.findIndex(item => item.laB_WC_ID === _item.laB_WC_ID);
            if (index !== -1) {
              this.workcenterList[index] = _item;
            }
          }
        },
        (error) => {
          // Handle error        
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          }
        });
    }
  }

  CancelEditRow(_id: any) {
    const index = this.workcenterList.findIndex(u => u.laB_WC_ID === _id);
    if (index !== -1) {
      const index = this.workcenterList.findIndex((u) => u.laB_WC_ID == _id);
      this.workcenterList[index].IsEdit = false;
      this.workcenterList[index].IsAdd = false;
      this.workcenterList[index].wc = this.editData_.wC_NO;
      this.workcenterList[index].descrip = this.editData_.descrip;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      const wc_no = this.workcenterList.find(item => item.laB_WC_ID === _id)?.wc;
      this._workCentersService.deleteWorkCenter(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.workcenterList = this.workcenterList.filter(item => item.laB_WC_ID !== _id);
            this.workcenterList.push();
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
