import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TestSiteService } from './testsite.service';
import { WorkCenterService } from '../workcenters/workcenter.service';
import { testsiteModel } from 'src/app/models/testsiteModel';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { BAD_REQUEST_ERROR_MESSAGE, alertThreeDigits, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import { DataTableDirective } from 'angular-datatables';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-testsites',
  templateUrl: './testsites.component.html',
  styleUrls: ['./testsites.component.scss']
})

export class TestsitesComponent implements OnDestroy, OnInit {
  testsiteList: testsiteModel[] = [];
  required_ts_no: string = "";
  required__wC_NO: string = "";
  required_desc: string = "";
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  errorMessage: any;
  editable: any;
  uniqueWcNos: string[] = []; // Array to hold unique _wC_NO values
  Addrecord: boolean = false
  editRowId: any;
  workcenterDropDown: any;
  visible: boolean = false
  editData_: any;

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: testsiteModel[] = [];
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

  constructor(private _testsiteService: TestSiteService, private sortingService: SortingComponent, public _commonAlertService: CommonAlertService,
    private _workCenterService: WorkCenterService,private _commonService: CommonService) {
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.fillWorkCenterDropDown();
    this.testsiteList = [];
    this.GetTestSiteData();
    this.getUniqueWCNos();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_TestSites, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetTestSiteData();
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
  this.testsiteList = this.sortingService.sortData([...this.testsiteList], column, this.sortDirection);
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
    this.testsiteList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.testsiteList = this.testsiteList.filter(item =>
      item.ts.toLowerCase().includes(searchText) ||
      item.wc.toLowerCase().includes(searchText) ||
      item.descrip.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetTestSiteData(): void {
    this._testsiteService.getAllTestSite().subscribe(res => {
      this.testsiteList = res;
      this.dtTrigger.next(null);
      this.testsiteList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.testsiteList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading Testsite list:', error);
      })
  }

  checkAlreadyExisting(event: any) {
    const testsiteLength = event.target.value
    if (this.testsiteList.filter(x => x.ts == event.target.value).length >= 2) {
      this._commonAlertService.warningMessage();
      event.target.value = '';
      this.required_ts_no = "is-invalid";
    } else if (testsiteLength.length < 3) {
      this._commonAlertService.alertThreeDigits();
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.testsiteList.length / this.itemsPerPage);
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

  getUniqueWCNos(): void {
    this.uniqueWcNos = this.testsiteList
      .map(item => item.wc)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  fillWorkCenterDropDown() {
    this.workcenterDropDown = this._workCenterService.getAllWorkCenter().subscribe(x => {
      this.workcenterDropDown = x;
    })
  }

  addTable() {
    const existingAddRecordIndex = this.testsiteList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.testsiteList[existingAddRecordIndex];
      if (!existingAddRecord.laB_TS_ID || existingAddRecord.laB_TS_ID === 0) {
        this.testsiteList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new testsiteModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    this.testsiteList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;
    // Update pagination after adding a new record
    this.totalItems = this.testsiteList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: testsiteModel) {
    let initialValue = JSON.parse(JSON.stringify(_item));
    if (!_item.ts && !this.required_ts_no) {
      this.required_ts_no = "is-invalid";
    } else if (_item.ts && this.required_ts_no) {
      this.required_ts_no = "";
    }

    if (!_item.wc && !this.required__wC_NO) {
      this.required__wC_NO = "is-invalid";
    } else if (_item.wc && this.required__wC_NO) {
      this.required__wC_NO = "";
    }
    _item.descrip = _item.descrip.trim();
    if (!_item.descrip && !this.required_desc) {
      this.required_desc = "is-invalid";
    } else if (_item.descrip && this.required_desc) {
      this.required_desc = "";
    }

    if (_item.ts && _item.wc && _item.descrip) {
      _item.wc = _item.wc.split('-')[0].replace(/\s/g, "");
      this._testsiteService.addTestSite(_item).subscribe(
        (response) => {
          //console.log(response);
          this.testsiteList.find(x => {
            if (x.ts == _item.ts) {
              x.laB_TS_ID = response.body;
            }
          });

          if (response.status === 200) {
            this._commonAlertService.successMessage();
            // Filter to get the actual description for the given div
            const workCenter = this.workcenterDropDown.find(_workCenter => _workCenter.wc === _item.wc);
            if (workCenter) {
              _item.wc = `${workCenter.wc} - ${workCenter.descrip}`;
            } else {
              console.error(`WorkCenter with wcno ${_item.wc} not found.`);
            }
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
      _item.wc = initialValue.wc;
      this.Addrecord = false;
    }
  }

  CancelAddRow(_id: any) {
    const index = this.testsiteList.findIndex((u) => u.laB_TS_ID == _id);
    if (index !== -1) {
      this.testsiteList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  //hiding info box
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.testsiteList.find((u) => u.laB_TS_ID == _id)));
    const index = this.testsiteList.findIndex((u) => u.laB_TS_ID == _id);
    this.testsiteList[index].IsEdit = true;
  }


  Update(_item: testsiteModel) {
    let initialValue = JSON.parse(JSON.stringify(_item));
    if (!_item.ts && !this.required_ts_no) {
      this.required_ts_no = "is-invalid";
    } else if (_item.ts && this.required_ts_no) {
      this.required_ts_no = "";
    }

    if (!_item.wc && !this.required__wC_NO) {
      this.required__wC_NO = "is-invalid";
    } else if (_item.wc && this.required__wC_NO) {
      this.required__wC_NO = "";
    }
    _item.descrip = _item.descrip.trim();
    if (!_item.descrip && !this.required_desc) {
      this.required_desc = "is-invalid";
    } else if (_item.descrip && this.required_desc) {
      this.required_desc = "";
    }

    if (_item.ts && _item.wc && _item.descrip) {
      const wcNo = _item.wc.split(' - ')[0].trim();
      _item.wc = wcNo;
      this._testsiteService.updateTestSite(_item).subscribe(
        (response) => {
          _item.wc = initialValue.wC_NO;
          _item.IsEdit = false;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            // Restore the original diV_NO with description for display
            const matchedItem = this.testsiteList.find(item => item.wc.split(' - ')[0].trim() === wcNo);
            if (matchedItem) {
              _item.wc = `${wcNo} - ${matchedItem.wc.split(' - ')[1].trim()}`;
            }
            _item.IsEdit = false;
            const index = this.testsiteList.findIndex(item => item.laB_TS_ID === _item.laB_TS_ID);
            if (index !== -1) {
              this.testsiteList[index] = _item;
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
    const index = this.testsiteList.findIndex(u => u.laB_TS_ID === _id);
    if (index !== -1) {
      this.testsiteList[index].IsEdit = false;
      this.testsiteList[index].IsAdd = false;
      this.testsiteList[index].ts = this.editData_.tS_NO;
      this.testsiteList[index].wc = this.editData_.wC_NO;
      this.testsiteList[index].descrip = this.editData_.descrip;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      const ts_no = this.testsiteList.find(item => item.laB_TS_ID === _id)?.ts;
      this._testsiteService.deleteTestSite(_id).subscribe(
        (response: any) => {
          console.log('response received')
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.testsiteList = this.testsiteList.filter(item => item.laB_TS_ID !== _id);
            this.testsiteList.push();
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
