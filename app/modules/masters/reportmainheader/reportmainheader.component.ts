import { Component, OnInit, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { alertThreeDigits, alertTwoDigits, deleteErrorMessage, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import { reportmainHeaderModel } from 'src/app/models/reportmainHeaderModel';
import { ReportmainheaderService } from './reportmainheader.service';
import { DataTableDirective } from 'angular-datatables';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-reportmainheader',
  templateUrl: './reportmainheader.component.html',
  styleUrls: ['./reportmainheader.component.scss']
})
export class ReportmainheaderComponent implements OnInit {
  reportMainHeaderList: reportmainHeaderModel[] = [];
  required_rmh_no: string = "";
  required_rmh_name: string = "";

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
  filteredList: reportmainHeaderModel[] = [];
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

  constructor(private _reportMainHeaderService: ReportmainheaderService, private _commonService: CommonService, public _commonAlertService: CommonAlertService, private sortingService: SortingComponent) { }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.reportMainHeaderList = [];
    this.GetReportMainHeaderData();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_ReportMainHeader, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetReportMainHeaderData();
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
	  this.reportMainHeaderList = this.sortingService.sortData([...this.reportMainHeaderList], column, this.sortDirection);
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
    this.reportMainHeaderList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.reportMainHeaderList = this.reportMainHeaderList.filter(item =>
      item.mhn.toLowerCase().includes(searchText) ||
      item.mhdR_NAME.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetReportMainHeaderData(): void {
    this._reportMainHeaderService.getAllReportMainHeader().subscribe(res => {
      this.reportMainHeaderList = res;
      this.dtTrigger.next(null);
      this.reportMainHeaderList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.reportMainHeaderList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading Report Main Header list:', error);
      })
  }

  checkAlreadyExisting(event: any) {
    const rmhLength = event.target.value;
    if (this.reportMainHeaderList.filter(x => x.mhn == event.target.value).length >= 2) {
      this._commonAlertService.warningMessage();
      event.target.value = "";
    } else if (rmhLength.length < 2) {
      this._commonAlertService.alertTwoDigits();
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.reportMainHeaderList.length / this.itemsPerPage);
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
    const existingAddRecordIndex = this.reportMainHeaderList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.reportMainHeaderList[existingAddRecordIndex];
      if (!existingAddRecord.rpT_MHDR_ID || existingAddRecord.rpT_MHDR_ID === 0) {
        this.reportMainHeaderList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new reportmainHeaderModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    this.reportMainHeaderList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;

    // Update pagination after adding a new record
    this.totalItems = this.reportMainHeaderList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: reportmainHeaderModel) {
    if (!_item.mhn && !this.required_rmh_no) {
      this.required_rmh_no = "is-invalid";
    } else if (_item.mhn && this.required_rmh_no) {
      this.required_rmh_no = "";
    }

    if (!_item.mhdR_NAME && !this.required_rmh_name) {
      this.required_rmh_name = "is-invalid";
    } else if (_item.mhdR_NAME && this.required_rmh_name) {
      this.required_rmh_name = "";
    }

    if (_item.mhn && _item.mhdR_NAME) {
      this._reportMainHeaderService.addReportMainHeader(_item).subscribe(
        (response) => {
          this.reportMainHeaderList.find(x => {
            if (x.mhn == _item.mhn) {
              x.rpT_MHDR_ID = response.body;
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
    const index = this.reportMainHeaderList.findIndex((u) => u.rpT_MHDR_ID == _id);
    if (index !== -1) {
      this.reportMainHeaderList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  //hiding info box
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.reportMainHeaderList.find((u) => u.rpT_MHDR_ID == _id)));
    const index = this.reportMainHeaderList.findIndex((u) => u.rpT_MHDR_ID == _id);
    this.reportMainHeaderList[index].IsEdit = true;
  }

  CancelEditRow(_id: any) {
    const index = this.reportMainHeaderList.findIndex(u => u.rpT_MHDR_ID === _id);
    if (index !== -1) {
      this.reportMainHeaderList[index].IsEdit = false;
      this.reportMainHeaderList[index].IsAdd = false;
      this.reportMainHeaderList[index].mhn = this.editData_.mhn;
      this.reportMainHeaderList[index].mhdR_NAME = this.editData_.mhdR_NAME;
    }
  }

  Update(_item: reportmainHeaderModel) {
    if (!_item.mhn && !this.required_rmh_no) {
      this.required_rmh_no = "is-invalid";
    } else if (_item.mhn && this.required_rmh_no) {
      this.required_rmh_no = "";
    }

    if (!_item.mhdR_NAME && !this.required_rmh_name) {
      this.required_rmh_name = "is-invalid";
    } else if (_item.mhdR_NAME && this.required_rmh_name) {
      this.required_rmh_name = "";
    }

    if (_item.mhn && _item.mhdR_NAME) {
      this._reportMainHeaderService.updateReportMainHeader(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
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
    }
  }

  CancelRow(_id: any) {
    this.editRowId = _id;
    let IsAdd_ = this.reportMainHeaderList.find((u) => u.rpT_MHDR_ID == _id);
    const index = this.reportMainHeaderList.findIndex((u) => u.rpT_MHDR_ID == _id);
    this.reportMainHeaderList[index].IsEdit = false;
    this.reportMainHeaderList[index].IsAdd = false;
    this.reportMainHeaderList[index].mhn = this.editData_.mhn;
    this.reportMainHeaderList[index].mhdR_NAME = this.editData_.mhdR_NAME;
  }

  deleteRow(_id: any) {
    this.Addrecord = false;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      const wc_no = this.reportMainHeaderList.find(item => item.rpT_MHDR_ID === _id)?.mhn;
      this._reportMainHeaderService.deleteReportMainHeader(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.reportMainHeaderList = this.reportMainHeaderList.filter(item => item.rpT_MHDR_ID !== _id);
            this.reportMainHeaderList.push();
            this._commonAlertService.deleteMessage();
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
