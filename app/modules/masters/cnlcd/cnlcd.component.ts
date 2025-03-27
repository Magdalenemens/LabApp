
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CnlcdService } from './cnlcd.service';
import { cnlcdModel } from 'src/app/models/cnlcdModel';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BAD_REQUEST_ERROR_MESSAGE, deleteMessage, errorMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-cnlcds',
  templateUrl: './cnlcd.component.html',
  styleUrls: ['./cnlcd.component.scss'],

})

export class CnlcdComponent implements OnInit {
  cnlcdList: cnlcdModel[] = [];
  required_cc: string = "";
  required_div_desc: string = "";
  required_reason: string = "";

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  errorMessage: any;
  _id: any;
  visible: boolean = false
  editData_: any;
  Addrecord: boolean = false
  editRowId: any;

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number;
  pageChange: any;

  //Search
  filteredList: cnlcdModel[] = [];
  searchText: string = '';
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

  constructor(private _cnlcdService: CnlcdService, private _commonService: CommonService, public _commonAlertService: CommonAlertService, private sortingService: SortingComponent) {
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.cnlcdList = [];
    this.GetcnlcdData();
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_CancellationReasons, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetcnlcdData();
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
	  this.cnlcdList = this.sortingService.sortData([...this.cnlcdList], column, this.sortDirection);
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
    this.cnlcdList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.cnlcdList = this.cnlcdList.filter(item =>
      item.cc.toLowerCase().includes(searchText) ||
      item.reason.toLowerCase().includes(searchText) ||
      item.descrip.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetcnlcdData(): void {
    this._cnlcdService.getAllcnlcd().subscribe(res => {
      this.cnlcdList = res;
      this.dtTrigger.next(null);
      this.cnlcdList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.cnlcdList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading cnlcd list:', error);
      })
  }

  checkAlreadyExisting(event: any) {
    if (this.cnlcdList.filter(x => x.cc == event.target.value).length > 1) {
      Swal.fire({
        text: 'cnlcd number ' + event.target.value + ' already exists.',
      });
      event.target.value = "";
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.cnlcdList.length / this.itemsPerPage);
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
    const existingAddRecordIndex = this.cnlcdList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.cnlcdList[existingAddRecordIndex];
      if (!existingAddRecord.cc || !existingAddRecord.reason && !existingAddRecord.descrip) {
        this.cnlcdList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new cnlcdModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    this.cnlcdList.unshift(newrecord);
    newrecord.cnlcD_ID = this.cnlcdList.slice(-1)[0].cnlcD_ID + 1;
    this.visible = false;
    this.Addrecord = true;
    // Update pagination after adding a new record
    this.totalItems = this.cnlcdList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: cnlcdModel) {
    if (_item.cc) {
      _item.cc = _item.cc.trim();
    }
    if (!_item.cc && !this.required_cc) {
      this.required_cc = "is-invalid";
    } else if (_item.cc && this.required_cc) {
      this.required_cc = "";
    }
    if (_item.reason) {
      _item.reason = _item.reason.trim();
    }
    if (!_item.reason && !this.required_reason) {
      this.required_reason = "is-invalid";
    } else if (_item.reason && this.required_reason) {
      this.required_reason = "";
    }
    if (_item.descrip) {
      _item.descrip = _item.descrip.trim();
    }
    if (!_item.descrip && !this.required_div_desc) {
      this.required_div_desc = "is-invalid";
    } else if (_item.descrip && this.required_div_desc) {
      this.required_div_desc = "";
    }

    if (_item.cc && _item.descrip) {
      this._cnlcdService.addcnlcd(_item).subscribe(
        (response) => {
          //console.log(response);
          this.cnlcdList.find(x => {
            if (x.cc == _item.cc) {
              x.cnlcD_ID = response.body;
            }
          });
          if (response.status === 200) {
            this._commonAlertService.successMessage();
            this.rerender();
          }
          else {
            this._commonAlertService.errorMessage();

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
    const index = this.cnlcdList.findIndex((u) => u.cnlcD_ID == _id);
    if (index !== -1) {
      this.cnlcdList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  //hiding info box
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.cnlcdList.find((u) => u.cnlcD_ID == _id)));
    const index = this.cnlcdList.findIndex((u) => u.cnlcD_ID == _id);
    this.cnlcdList[index].IsEdit = true;
  }

  Update(_item: cnlcdModel) {
    if (_item.cc) {
      _item.cc = _item.cc.trim();
    }
    if (!_item.cc)
      this.required_cc = "is-invalid";
    if (_item.descrip) {
      _item.descrip = _item.descrip.trim();
    }
    if (!_item.descrip)
      this.required_div_desc = "is-invalid";

    if (!_item.reason && !this.required_reason) {
      this.required_reason = "is-invalid";
    } else if (_item.reason && this.required_reason) {
      this.required_reason = ""; // Reset the class if the field is filled
    }

    if (_item.cc && _item.descrip) {
      this._cnlcdService.updatecnlcd(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            const index = this.cnlcdList.findIndex(item => item.cnlcD_ID === _item.cnlcD_ID);
            if (index !== -1) {
              this.cnlcdList[index] = _item;
            }
          }
          else {
            this._commonAlertService.errorMessage();

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
    const index = this.cnlcdList.findIndex(u => u.cnlcD_ID === _id);
    if (index !== -1) {
      this.cnlcdList[index].IsEdit = false;
      this.cnlcdList[index].IsAdd = false;
      this.cnlcdList[index].cc = this.editData_.cc;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._cnlcdService.deletecnlcd(_id).subscribe(
        (response: any) => {
          //console.log('response received')          
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.cnlcdList = this.cnlcdList.filter(item => item.cnlcD_ID !== _id);
            this.cnlcdList.push();
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
