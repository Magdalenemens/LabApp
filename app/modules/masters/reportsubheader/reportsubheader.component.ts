import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { reportsubHeaderModel } from 'src/app/models/reportsubHeaderModel';
import { ReportsubheaderService } from './reportsubheader.service';
import { ReportmainheaderService } from '../reportmainheader/reportmainheader.service';
import { BAD_REQUEST_ERROR_MESSAGE, alertThreeDigits, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-reportsubheader',
  templateUrl: './reportsubheader.component.html',
  styleUrls: ['./reportsubheader.component.scss']
})
export class ReportsubheaderComponent implements OnDestroy, OnInit {
  reportSubHeaderList: reportsubHeaderModel[] = [];
  required_rsh_no: string = "";
  required__rmh_NO: string = "";
  required_div_desc: string = "";

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  errorMessage: any;
  editable: any;
  uniqueReportMainHeaderNos: string[] = []; // Array to hold unique _report Main header_NO values
  Addrecord: boolean = false
  editRowId: any;
  reportMainHeaderDropDown: any;
  visible: boolean = false
  editData_: any;

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: reportsubHeaderModel[] = [];
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

  constructor(private _reportSubHeaderService: ReportsubheaderService, private sortingService: SortingComponent, public _commonAlertService: CommonAlertService,
    private _reportMainHeaderService: ReportmainheaderService, private _commonService: CommonService) {
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.fillReportMainHeaderDropDown();
    this.reportSubHeaderList = [];
    this.GetReportSubHeaderData();
    this.getUniqueReportMainHeaderNos();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_ReportSubHeader, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetReportSubHeaderData();
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
	  this.reportSubHeaderList = this.sortingService.sortData([...this.reportSubHeaderList], column, this.sortDirection);
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
    this.reportSubHeaderList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.reportSubHeaderList = this.reportSubHeaderList.filter(item =>
      item.mhn.toLowerCase().includes(searchText) ||
      item.shn.toLowerCase().includes(searchText) ||
      item.shdR_NAME.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetReportSubHeaderData(): void {
    this._reportSubHeaderService.getAllReportSubHeader().subscribe(res => {
      this.reportSubHeaderList = res;
      this.dtTrigger.next(null);
      this.reportSubHeaderList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.reportSubHeaderList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading Report SubHeader list:', error);
      })
  }

  getUniqueReportMainHeaderNos(): void {
    this.uniqueReportMainHeaderNos = this.reportSubHeaderList
      .map(item => item.mhn)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.reportSubHeaderList.length / this.itemsPerPage);
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

  checkAlreadyExisting(event: any) {
    const testsiteLength = event.target.value
    if (this.reportSubHeaderList.filter(x => x.shn == event.target.value).length >= 2) {
      this._commonAlertService.warningMessage();
      event.target.value = '';
      this.required_rsh_no = "is-invalid";
    } else if (testsiteLength.length < 3) {
      this._commonAlertService.alertThreeDigits();
    }
  }

  fillReportMainHeaderDropDown() {
    this.reportMainHeaderDropDown = this._reportMainHeaderService.getAllReportMainHeader().subscribe(x => {
      this.reportMainHeaderDropDown = x;
    })
  }

  addTable() {
    const existingAddRecordIndex = this.reportSubHeaderList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.reportSubHeaderList[existingAddRecordIndex];
      if (!existingAddRecord.rpT_SHDR_ID || existingAddRecord.rpT_SHDR_ID === 0) {
        this.reportSubHeaderList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new reportsubHeaderModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    this.reportSubHeaderList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;

    // Update pagination after adding a new record
    this.totalItems = this.reportSubHeaderList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: reportsubHeaderModel) {
    let initialValue = JSON.parse(JSON.stringify(_item));
    if (!_item.shn && !this.required_rsh_no) {
      this.required_rsh_no = "is-invalid";
    } else if (_item.shn && this.required_rsh_no) {
      this.required_rsh_no = "";
    }

    if (!_item.mhn && !this.required__rmh_NO) {
      this.required__rmh_NO = "is-invalid";
    } else if (_item.mhn && this.required__rmh_NO) {
      this.required__rmh_NO = "";
    }

    if (!_item.shdR_NAME && !this.required_div_desc) {
      this.required_div_desc = "is-invalid";
    } else if (_item.shdR_NAME && this.required_div_desc) {
      this.required_div_desc = "";
    }

    if (_item.shn && _item.mhn && _item.shdR_NAME) {
      _item.mhn = _item.mhn.split('-')[0].replace(/\s/g, "");
      //_item.mhn = _item.mhn;
      this._reportSubHeaderService.addReportSubHeader(_item).subscribe(
        (response) => {
          //console.log(response);
          this.reportSubHeaderList.find(x => {
            if (x.shn == _item.shn) {
              x.rpT_SHDR_ID = response.body;
            }
          });

          if (response.status === 200) {
            this._commonAlertService.successMessage();
            this.rerender();
          }
        },
        (error) => {
          // Handle error
          console.error('error caught in component')
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          }
        });
      _item.IsAdd = false;
      _item.IsEdit = false;
      _item.mhn = initialValue.mhn;
      this.Addrecord = false;
    }
  }

  CancelAddRow(_id: any) {
    const index = this.reportSubHeaderList.findIndex((u) => u.rpT_SHDR_ID == _id);
    if (index !== -1) {
      this.reportSubHeaderList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }


  //hiding info box
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.reportSubHeaderList.find((u) => u.rpT_SHDR_ID == _id)));
    const index = this.reportSubHeaderList.findIndex((u) => u.rpT_SHDR_ID == _id);
    this.reportSubHeaderList[index].IsEdit = true;
  }

  CancelEditRow(_id: any) {
    const index = this.reportSubHeaderList.findIndex(u => u.rpT_SHDR_ID === _id);
    if (index !== -1) {
      this.reportSubHeaderList[index].IsEdit = false;
      this.reportSubHeaderList[index].IsAdd = false;
      this.reportSubHeaderList[index].mhn = this.editData_.mhn;
      this.reportSubHeaderList[index].shn = this.editData_.shn;
      this.reportSubHeaderList[index].shdR_NAME = this.editData_.shdR_NAME;
    }
  }

  Update(_item: reportsubHeaderModel) {
    let initialValue = JSON.parse(JSON.stringify(_item));
    if (!_item.shn && !this.required_rsh_no) {
      this.required_rsh_no = "is-invalid";
    } else if (_item.shn && this.required_rsh_no) {
      this.required_rsh_no = "";
    }

    if (!_item.mhn && !this.required_rsh_no) {
      this.required_rsh_no = "is-invalid";
    } else if (_item.mhn && this.required_rsh_no) {
      this.required_rsh_no = "";
    }

    if (!_item.shdR_NAME && !this.required_div_desc) {
      this.required_div_desc = "is-invalid";
    } else if (_item.shdR_NAME && this.required_div_desc) {
      this.required_div_desc = "";
    }

    if (_item.shn && _item.mhn && _item.shdR_NAME) {
      _item.mhn = _item.mhn.split('-')[0].replace(/\s/g, "");
      this._reportSubHeaderService.updateReportSubHeader(_item).subscribe(
        (response) => {
          _item.mhn = initialValue.mhn;
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
    let IsAdd_ = this.reportSubHeaderList.find((u) => u.rpT_SHDR_ID == _id);
    const index = this.reportSubHeaderList.findIndex((u) => u.rpT_SHDR_ID == _id);
    this.reportSubHeaderList[index].IsEdit = false;
    this.reportSubHeaderList[index].IsAdd = false;
    this.reportSubHeaderList[index].shn = this.editData_.shn;
    this.reportSubHeaderList[index].mhn = this.editData_.mhn;
    this.reportSubHeaderList[index].shdR_NAME = this.editData_.shdR_NAME;
  }

  deleteRow(_id: any) {
    this.Addrecord = false;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      const ts_no = this.reportSubHeaderList.find(item => item.rpT_SHDR_ID === _id)?.shn;
      this._reportSubHeaderService.deleteReportSubHeader(_id).subscribe(
        (response: any) => {
          console.log('response received')
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.reportSubHeaderList = this.reportSubHeaderList.filter(item => item.rpT_SHDR_ID !== _id);
            this.reportSubHeaderList.push();
            this.updatePagination();
            this._commonAlertService.deleteMessage();
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
