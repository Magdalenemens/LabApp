import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import moment from 'moment';
import { Subject } from 'rxjs';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { reportsubHeaderModel } from 'src/app/models/reportsubHeaderModel';
import { ReportmainheaderService } from 'src/app/modules/masters/reportmainheader/reportmainheader.service';
import { ReportsubheaderService } from 'src/app/modules/masters/reportsubheader/reportsubheader.service';
import { SortingComponent } from 'src/app/modules/pagination/sorting/sorting.component';
import { AddTestDirectoryService } from '../../test-definition/add-test-directory/add-test-directory.service';
import { anlMethodModel, evSubHeaderModel } from 'src/app/models/evSetupModel';

@Component({
  selector: 'app-seteupevtestdefinition',
  templateUrl: './seteupevtestdefinition.component.html',
  styleUrls: ['./seteupevtestdefinition.component.scss']
})
export class SeteupevtestdefinitionComponent {
  @ViewChild('sopField') inputField!: ElementRef;
  @ViewChild('headerInputField') headerInputField!: ElementRef;
  evSubHeaderList: evSubHeaderModel[] = [];
  required_subheader_shn: string = "";
  required_subheader_name: string = "";

  anlMethodList: anlMethodModel[] = [];
  required_sop_code: string = "";
  required_method: string = "";
  required_mthd_name: string = "";


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
  itemsPerPage: number = 1000;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: evSubHeaderModel[] = [];
  filteredMethodList: anlMethodModel[] = [];
  searchText: string = '';
  searchMethodText: string = '';
  totalItems: number;
  pageChange: any;
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';
  sortColumn: string = '';
  sortDirection: string = 'asc';
  sortKey: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  constructor(private _reportSubHeaderService: ReportsubheaderService,
    private sortingService: SortingComponent, public _commonAlertService: CommonAlertService,
    private _reportMainHeaderService: ReportmainheaderService, private _addtestDirectoryService: AddTestDirectoryService,
    private _commonService: CommonService) {
  }


  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();

    this.anlMethodList = [];
    this.getAllANLData();

    this.evSubHeaderList = [];
    this.getEVSubHeaderData();
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
    this.getEVSubHeaderData();
  }

  sortData(key: string, dataList: any[]) {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }

    dataList.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      const compare = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return this.sortOrder === 'asc' ? compare : -compare;
    });
  }

  getSortIcon(column: string) {
    if (this.sortKey === column) {
      return this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    }
    return 'unfold_more';
  }

  getSortIconClass(column: string) {
    return this.sortKey === column ? 'active-sort' : '';
  }

  // Function to handle search input changes
  onSearch(): void {
    this.evSubHeaderList = [...this.filteredList];
    const searchText = this.searchText.toLowerCase().trim();
    this.evSubHeaderList = this.evSubHeaderList.filter(item =>
      item.shn.toLowerCase().includes(searchText) ||
      item.shdR_NAME.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  onSearchMethod(): void {
    this.anlMethodList = [...this.filteredMethodList];
    const searchMethod = this.searchMethodText.toLowerCase().trim();
    this.anlMethodList = this.anlMethodList.filter(item =>
      item.mthD_NAME.toLowerCase().includes(searchMethod) ||
      item.r_MTHD.toLowerCase().includes(searchMethod)
    );
    this.updatePagination();
  }

  getAllANLData(): void {
    this._addtestDirectoryService.getAllAnlMethod().subscribe(res => {
      this.anlMethodList = res;
      this.dtTrigger.next(null);
      this.evSubHeaderList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.evSubHeaderList];
      this.filteredMethodList = [...this.anlMethodList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading Report SubHeader list:', error);
      })
  }

  //
  addANLMethodTable() {
    // Wait a tick to ensure the element is added to the DOM
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    });
    const existingAddRecordIndex = this.anlMethodList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.anlMethodList[existingAddRecordIndex];
      if (!existingAddRecord.anL_MTHD_ID || existingAddRecord.anL_MTHD_ID === 0) {
        this.anlMethodList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new anlMethodModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;

    let subHeaderId_ = this.anlMethodList.length === 0
      ? 100
      : Math.max(...this.anlMethodList.map(record => Number(record.anL_MTHD_ID)));

    // Set `shn` to 101 if it’s the first record; otherwise, increment the maximum found
    newrecord.anL_MTHD_ID = (subHeaderId_ + 1);

    this.anlMethodList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;

    // Update pagination after adding a new record
    this.totalItems = this.anlMethodList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: anlMethodModel) {
    if (!_item.r_MTHD || !_item.soP_CODE) {
      // Add validation error class if anL_SNO is empty or not a valid 1-4 digit number
      this.required_sop_code = "is-invalid";
    } else {
      // Reset validation error class if anL_SNO is a valid 1-4 digit number
      this.required_sop_code = "";
    }
    if (!_item.r_MTHD && !this.required_method) {
      this.required_method = "is-invalid";
    } else if (_item.r_MTHD && this.required_method) {
      this.required_method = "";
    }

    if (!_item.mthD_NAME && !this.required_mthd_name) {
      this.required_mthd_name = "is-invalid";
    } else if (_item.mthD_NAME && this.required_mthd_name) {
      this.required_mthd_name = "";
    }

    if (_item.r_MTHD && _item.mthD_NAME) {
      //_item.mhn = _item.mhn;
      this._addtestDirectoryService.addAnlMethod(_item).subscribe(
        (response) => {
          //console.log(response);
          this.anlMethodList.find(x => {
            if (x.r_MTHD == _item.r_MTHD) {
              x.anL_MTHD_ID = response.body;
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
      this.Addrecord = false;
    }
  }

  CancelAddRow(_id: any) {
    const index = this.anlMethodList.findIndex((u) => u.anL_MTHD_ID == _id);
    if (index !== -1) {
      this.anlMethodList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }


  //hiding info box
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.anlMethodList.find((u) => u.anL_MTHD_ID == _id)));
    const index = this.anlMethodList.findIndex((u) => u.anL_MTHD_ID == _id);
    this.anlMethodList[index].IsEdit = true;
  }

  CancelEditRow(_id: any) {
    const index = this.anlMethodList.findIndex(u => u.anL_MTHD_ID === _id);
    if (index !== -1) {
      this.anlMethodList[index].IsEdit = false;
      this.anlMethodList[index].IsAdd = false;
      this.anlMethodList[index].soP_CODE = this.editData_.soP_CODE;
      this.anlMethodList[index].r_MTHD = this.editData_.r_MTHD;
      this.anlMethodList[index].mthD_NAME = this.editData_.mthD_NAME;
    }
  }

  Update(_item: anlMethodModel) {
    if (!_item.r_MTHD && !this.required_method) {
      this.required_method = "is-invalid";
    } else if (_item.r_MTHD && this.required_method) {
      this.required_method = "";
    }
    if (!_item.mthD_NAME && !this.required_mthd_name) {
      this.required_mthd_name = "is-invalid";
    } else if (_item.mthD_NAME && this.required_mthd_name) {
      this.required_mthd_name = "";
    }

    if (_item.r_MTHD && _item.mthD_NAME) {
      this._addtestDirectoryService.updateAnlMethod(_item).subscribe(
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
    let IsAdd_ = this.anlMethodList.find((u) => u.anL_MTHD_ID == _id);
    const index = this.anlMethodList.findIndex((u) => u.anL_MTHD_ID == _id);
    this.anlMethodList[index].IsEdit = false;
    this.anlMethodList[index].IsAdd = false;
    this.anlMethodList[index].r_MTHD = this.editData_.r_MTHD;
    this.anlMethodList[index].mthD_NAME = this.editData_.mthD_NAME;
  }

  deleteRow(_id: any) {
    this.Addrecord = false;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._addtestDirectoryService.deleteAnlMethod(_id).subscribe(
        (response: any) => {
          console.log('response received')
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.anlMethodList = this.anlMethodList.filter(item => item.anL_MTHD_ID !== _id);
            this.anlMethodList.push();
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

  updatePagination(): void {
    const totalPages = Math.ceil(this.evSubHeaderList.length / this.itemsPerPage);
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
    if (this.evSubHeaderList.filter(x => x.shn == event.target.value).length >= 2) {
      this._commonAlertService.warningMessage();
      event.target.value = '';
      this.required_subheader_shn = "is-invalid";
    } else if (testsiteLength.length < 3) {
      this._commonAlertService.alertThreeDigits();
    }
  }


  addEVSubHeaderTable() {
    // Wait a tick to ensure the element is added to the DOM
    setTimeout(() => {
      this.headerInputField.nativeElement.focus();
    });
    const existingAddRecordIndex = this.evSubHeaderList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.evSubHeaderList[existingAddRecordIndex];
      if (!existingAddRecord.eV_SUBHDR_ID || existingAddRecord.eV_SUBHDR_ID === 0) {
        this.evSubHeaderList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new evSubHeaderModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    // Check if the list is empty and set initial value as 101 if it is, otherwise find the max
    let subHeaderId_ = this.evSubHeaderList.length === 0
      ? 100
      : Math.max(...this.evSubHeaderList.map(record => Number(record.shn)));

    // Set `shn` to 101 if it’s the first record; otherwise, increment the maximum found
    newrecord.shn = (subHeaderId_ + 1).toString();
    this.evSubHeaderList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;

    // Update pagination after adding a new record
    this.totalItems = this.evSubHeaderList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  onAddEVSubHeaderData(_item: evSubHeaderModel) {
    if (!_item.shn && !this.required_subheader_shn) {
      this.required_subheader_shn = "is-invalid";
    } else if (_item.shn && this.required_subheader_shn) {
      this.required_subheader_shn = "";
    }

    if (!_item.shdR_NAME && !this.required_subheader_name) {
      this.required_subheader_name = "is-invalid";
    } else if (_item.shdR_NAME && this.required_subheader_name) {
      this.required_subheader_name = "";
    }

    if (_item.shn && _item.shdR_NAME) {
      //_item.mhn = _item.mhn;
      this._addtestDirectoryService.addEVSubHeader(_item).subscribe(
        (response) => {
          //console.log(response);
          this.evSubHeaderList.find(x => {
            if (x.shn == _item.shn) {
              x.eV_SUBHDR_ID = response.body;
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
      this.Addrecord = false;
    }
  }

  onCancelEVSubHeaderAddRow(_id: any) {
    const index = this.evSubHeaderList.findIndex((u) => u.eV_SUBHDR_ID == _id);
    if (index !== -1) {
      this.evSubHeaderList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  //hiding info box
  onEditEVSubHeader(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.evSubHeaderList.find((u) => u.eV_SUBHDR_ID == _id)));
    const index = this.evSubHeaderList.findIndex((u) => u.eV_SUBHDR_ID == _id);
    this.evSubHeaderList[index].IsEdit = true;
  }

  onCancelEVSubHeaderEditRow(_id: any) {
    const index = this.evSubHeaderList.findIndex(u => u.eV_SUBHDR_ID === _id);
    if (index !== -1) {
      this.evSubHeaderList[index].IsEdit = false;
      this.evSubHeaderList[index].IsAdd = false;
      this.evSubHeaderList[index].shn = this.editData_.shn;
      this.evSubHeaderList[index].shdR_NAME = this.editData_.shdR_NAME;
    }
  }

  onUpdateEVSubHeader(_item: evSubHeaderModel) {
    if (!_item.shn && !this.required_subheader_shn) {
      this.required_subheader_shn = "is-invalid";
    } else if (_item.shn && this.required_subheader_shn) {
      this.required_subheader_shn = "";
    }

    if (!_item.shdR_NAME && !this.required_subheader_name) {
      this.required_subheader_name = "is-invalid";
    } else if (_item.shdR_NAME && this.required_subheader_name) {
      this.required_subheader_name = "";
    }

    if (_item.shn && _item.shdR_NAME) {
      this._addtestDirectoryService.updateEVSubHeader(_item).subscribe(
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

  // CancelRow(_id: any) {
  //   this.editRowId = _id;
  //   let IsAdd_ = this.evSubHeaderList.find((u) => u.eV_SUB_HDR_ID == _id);
  //   const index = this.evSubHeaderList.findIndex((u) => u.eV_SUB_HDR_ID == _id);
  //   this.evSubHeaderList[index].IsEdit = false;
  //   this.evSubHeaderList[index].IsAdd = false;
  //   this.evSubHeaderList[index].shn = this.editData_.shn;
  //   this.evSubHeaderList[index].shdR_NAME = this.editData_.shdR_NAME;
  // }

  onDeleteEVSubHeaderRow(_id: any) {
    this.Addrecord = false;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._addtestDirectoryService.deleteEVSubHeader(_id).subscribe(
        (response: any) => {
          console.log('response received')
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.evSubHeaderList = this.evSubHeaderList.filter(item => item.eV_SUBHDR_ID !== _id);
            this.evSubHeaderList.push();
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


  getEVSubHeaderData(): void {
    this._addtestDirectoryService.getAllEVSubHeader().subscribe(res => {
      this.evSubHeaderList = res;
      this.dtTrigger.next(null);
      this.evSubHeaderList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.evSubHeaderList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading Report SubHeader list:', error);
      })
  }


}

