import { Component, OnInit } from '@angular/core';
import { AccountManagerService } from './accountmanager.service';
import { accountManagernModel } from 'src/app/models/accountManagerModel';
import { ViewChild } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import Swal from 'sweetalert2';
import { deleteErrorMessage, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import { DataTableDirective } from 'angular-datatables';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-accountmanagers',
  templateUrl: './accountmanagers.component.html',
  styleUrls: ['./accountmanagers.component.scss']
})
export class AccountmanagersComponent implements OnInit {
  accountManagerList: accountManagernModel[] = [];
  required_smc: string = "";
  required_salesman: string = "";

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();

  errorMessage: any;
  _id: any;
  isInputValid: boolean = true;
  Addrecord: boolean = false

  editRowId: any;
  visible: boolean = false
  editData_: any;

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  //Search
  filteredList: accountManagernModel[] = [];
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

  constructor(private _accountManagerService: AccountManagerService, private _commonService: CommonService,public _commonAlertService: CommonAlertService, private sortingService: SortingComponent) { }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.accountManagerList = [];
    this.GetAcoountManagerData();
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_AccountManagers, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetAcoountManagerData();
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
	  this.accountManagerList = this.sortingService.sortData([...this.accountManagerList], column, this.sortDirection);
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
    this.accountManagerList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.accountManagerList = this.accountManagerList.filter(item =>
      item.salesman.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetAcoountManagerData(): void {
    this._accountManagerService.getAllAccountManager().subscribe(res => {
      this.accountManagerList = res;
      this.dtTrigger.next(null);
      this.accountManagerList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.accountManagerList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading accountmanager list:', error);
      })
  }

  checkAlreadyExisting(event: any) {
    if (this.accountManagerList.filter(x => x.smc == event.target.value).length > 1) {
      this._commonAlertService.warningMessage();
      event.target.value = "";
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.accountManagerList.length / this.itemsPerPage);
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
    const existingAddRecordIndex = this.accountManagerList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.accountManagerList[existingAddRecordIndex];
      if (!existingAddRecord.salesmeN_ID || existingAddRecord.salesmeN_ID === 0) {
        this.accountManagerList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new accountManagernModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    let sno_ = Math.max(...this.accountManagerList.map(record => record.sno));
    newrecord.sno = (sno_ <= 0) ? 1 : sno_ + 1;
    this.accountManagerList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;
    // Update pagination after adding a new record
    this.totalItems = this.accountManagerList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: accountManagernModel) {
    if (_item.salesman) {
      _item.salesman = _item.salesman.trim();
    }
    if (!_item.salesman && !this.required_salesman) {
      this.required_salesman = "is-invalid";
    } else if (_item.salesman && this.required_salesman) {
      this.required_salesman = "";
    }

    if (_item.salesman) {
      this._accountManagerService.addAccountManager(_item).subscribe(
        (response) => {
          this.accountManagerList.find(x => {
            if (x.sno == _item.sno) {
              x.salesmeN_ID = response.body;
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
    const index = this.accountManagerList.findIndex((u) => u.salesmeN_ID == _id);
    if (index !== -1) {
      this.accountManagerList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  //hiding info box
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.accountManagerList.find((u) => u.salesmeN_ID == _id)));
    const index = this.accountManagerList.findIndex((u) => u.salesmeN_ID == _id);
    this.accountManagerList[index].IsEdit = true;
  }

  Update(_item: accountManagernModel) {
    if (_item.salesman) {
      _item.salesman = _item.salesman.trim();
    }
    if (!_item.salesman && !this.required_salesman) {
      this.required_salesman = "is-invalid";
    } else if (_item.salesman && this.required_salesman) {
      this.required_salesman = "";
    }
    if (_item.salesman) {
      this._accountManagerService.updateAccountManager(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          this.updatePagination();
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            const index = this.accountManagerList.findIndex(item => item.salesmeN_ID === _item.salesmeN_ID);
            if (index !== -1) {
              this.accountManagerList[index] = _item;
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
    const index = this.accountManagerList.findIndex(u => u.salesmeN_ID === _id);
    if (index !== -1) {
      this.accountManagerList[index].IsEdit = false;
      this.accountManagerList[index].IsAdd = false;
      this.accountManagerList[index].smc = this.editData_.smc;
      this.accountManagerList[index].salesman = this.editData_.salesman;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._accountManagerService.deleteAccountManager(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.accountManagerList = this.accountManagerList.filter(item => item.salesmeN_ID !== _id);
            this.accountManagerList.push();
            this.updatePagination();
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

