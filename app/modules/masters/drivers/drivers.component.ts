import { Component, OnInit } from '@angular/core';
import { DriverService } from './driver.service';
import { driverModel } from 'src/app/models/driverModel';
import { DataTableDirective } from 'angular-datatables';
import { ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { BAD_REQUEST_ERROR_MESSAGE, deleteErrorMessage, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  driverList: driverModel[] = [];
  required_drvrc: string = "";
  required_drvrname: string = "";

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
  filteredList: driverModel[] = [];
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

  constructor(private _driverService: DriverService, private _commonService: CommonService, public _commonAlertService: CommonAlertService, private sortingService: SortingComponent) { }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.driverList = [];
    this.GetDriverData();
  }

  ngOnDestroy(): void {

    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_Drivers, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetDriverData();
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
	  this.driverList = this.sortingService.sortData([...this.driverList], column, this.sortDirection);
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
    this.driverList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.driverList = this.driverList.filter(item =>
      item.drvrc.toLowerCase().includes(searchText) ||
      item.drvrname.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetDriverData(): void {
    this._driverService.getAllDriver().subscribe(res => {
      this.driverList = res;
      this.dtTrigger.next(null);
      this.driverList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
    },
      (error) => {
        console.error('Error loading division list:', error);
      })
  }

  checkAlreadyExisting(event: any) {
    if (this.driverList.filter(x => x.drvrc == event.target.value).length > 1) {
      this._commonAlertService.warningMessage();
      event.target.value = "";
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.driverList.length / this.itemsPerPage);
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
    const existingAddRecordIndex = this.driverList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.driverList[existingAddRecordIndex];
      if (!existingAddRecord.drvrS_ID || existingAddRecord.drvrS_ID === 0) {
        this.driverList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new driverModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    let sno_ = Math.max(...this.driverList.map(record => record.sno));
    newrecord.sno = (sno_ <= 0) ? 1 : sno_ + 1;
    this.driverList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;

    // Update pagination after adding a new record
    this.totalItems = this.driverList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: driverModel) {
    if (_item.drvrname) {
      _item.drvrname = _item.drvrname.trim();
    }
    if (!_item.drvrname && !this.required_drvrname) {
      this.required_drvrname = "is-invalid";
    } else if (_item.drvrname && this.required_drvrname) {
      this.required_drvrname = "";
    }

    if (_item.drvrname) {
      this._driverService.addDriver(_item).subscribe(
        (response) => {
          this.driverList.find(x => {
            if (x.sno == _item.sno) {
              x.drvrS_ID = response.body;
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
    const index = this.driverList.findIndex((u) => u.drvrS_ID == _id);
    if (index !== -1) {
      this.driverList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  //hiding info box
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.driverList.find((u) => u.drvrS_ID == _id)));
    const index = this.driverList.findIndex((u) => u.drvrS_ID == _id);
    this.driverList[index].IsEdit = true;
  }

  Update(_item: driverModel) {
    if (_item.drvrname) {
      _item.drvrname = _item.drvrname.trim();
    }
    if (!_item.drvrname) {
      this.required_drvrname = "is-invalid";
    }
    if (_item.drvrname) {
      this._driverService.updateDriver(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            const index = this.driverList.findIndex(item => item.drvrS_ID === _item.drvrS_ID);
            if (index !== -1) {
              this.driverList[index] = _item;
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
    const index = this.driverList.findIndex(u => u.drvrS_ID === _id);
    if (index !== -1) {
      this.driverList[index].IsEdit = false;
      this.driverList[index].IsAdd = false;
      this.driverList[index].drvrc = this.editData_.drvrc;
      this.driverList[index].drvrname = this.editData_.drvrname;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._driverService.deleteDriver(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.driverList = this.driverList.filter(item => item.drvrS_ID !== _id);
            this.driverList.push();
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

