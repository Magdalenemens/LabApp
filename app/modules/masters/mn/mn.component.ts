import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MnService } from './mn.service';
import { mnModel } from 'src/app/models/mnModel';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BAD_REQUEST_MESSAGE, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-mn',
  templateUrl: './mn.component.html',
  styleUrls: ['./mn.component.scss'],

})

export class MnComponent implements OnInit {
  mnList: mnModel[] = [];
  required_mncd: string = "";
  required_div_desc: string = "";

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
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: mnModel[] = [];
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

  constructor(private _mnService: MnService, private _commonService: CommonService, public _commonAlertService: CommonAlertService, private sortingService: SortingComponent) {
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.mnList = [];
    this.GetmnData();
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_MedicalNomeniclature, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetmnData();
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
	  this.mnList = this.sortingService.sortData([...this.mnList], column, this.sortDirection);
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
    this.mnList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.mnList = this.mnList.filter(item =>
      item.mncd.toLowerCase().includes(searchText) ||
      item.mN_DESCRP.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetmnData(): void {
    this._mnService.getAllmn().subscribe(res => {

      this.mnList = res;
      this.dtTrigger.next(null);
      this.mnList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
    },
      (error) => {
        console.error('Error loading mn list:', error);
      })
  }

  checkAlreadyExisting(event: any) {
    if (this.mnList.filter(x => x.mncd.toLowerCase() == event.target.value.toLowerCase()).length > 1) {
      Swal.fire({
        text: 'mn number ' + event.target.value + ' already exists.',
      });
      event.target.value = "";
    }
  }
  visiblePages: number[] = [];

  updatePagination(): void {
    const totalPages = Math.ceil(this.mnList.length / this.itemsPerPage);
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
    const existingAddRecordIndex = this.mnList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.mnList[existingAddRecordIndex];
      if (!existingAddRecord.mN_ID || existingAddRecord.mN_ID === 0) {
        this.mnList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new mnModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    this.mnList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;

    // Update pagination after adding a new record
    this.totalItems = this.mnList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }


  AddData(_item: mnModel) {
    if (_item.mncd) {
      _item.mncd = _item.mncd.trim();
    }
    if (!_item.mncd && !this.required_mncd) {
      this.required_mncd = "is-invalid";
    } else if (_item.mncd && this.required_mncd) {
      this.required_mncd = "";
    }
    if (_item.mN_DESCRP) {
      _item.mN_DESCRP = _item.mN_DESCRP.trim();
    }
    if (!_item.mN_DESCRP && !this.required_div_desc) {
      this.required_div_desc = "is-invalid";
    } else if (_item.mN_DESCRP && this.required_div_desc) {
      this.required_div_desc = "";
    }

    if (_item.mncd && _item.mN_DESCRP) {
      this._mnService.addmn(_item).subscribe(
        (response) => {
          //console.log(response);
          this.mnList.find(x => {
            if (x.mncd == _item.mncd) {
              x.mN_ID = response.body;
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
    const index = this.mnList.findIndex((u) => u.mN_ID == _id);
    if (index !== -1) {
      this.mnList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  //hiding info box
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.mnList.find((u) => u.mN_ID == _id)));
    const index = this.mnList.findIndex((u) => u.mN_ID == _id);
    this.mnList[index].IsEdit = true;
  }

  Update(_item: mnModel) {
    if (_item.mncd) {
      _item.mncd = _item.mncd.trim();
    }
    if (!_item.mncd && !this.required_mncd) {
      this.required_mncd = "is-invalid";
    } else if (_item.mncd && this.required_mncd) {
      this.required_mncd = ""; // Reset the class if the field is filled
    }
    if (_item.mN_DESCRP) {
      _item.mN_DESCRP = _item.mN_DESCRP.trim();
    }
    if (!_item.mN_DESCRP && !this.required_div_desc) {
      this.required_div_desc = "is-invalid";
    } else if (_item.mN_DESCRP && this.required_div_desc) {
      this.required_div_desc = ""; // Reset the class if the field is filled
    }

    if (_item.mncd && _item.mN_DESCRP) {
      this._mnService.updatemn(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            const index = this.mnList.findIndex(item => item.mN_ID === _item.mN_ID);
            if (index !== -1) {
              this.mnList[index] = _item;
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
    const index = this.mnList.findIndex(u => u.mN_ID === _id);
    if (index !== -1) {
      this.mnList[index].IsEdit = false;
      this.mnList[index].IsAdd = false;
      this.mnList[index].mncd = this.editData_.mncd;
      this.mnList[index].mN_DESCRP = this.editData_.mN_DESCRP;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      const divno = this.mnList.find(item => item.mN_ID === _id)?.mncd;

      this._mnService.deletemn(_id).subscribe(
        (response: any) => {
          //console.log('response received')          
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.mnList = this.mnList.filter(item => item.mN_ID !== _id);
            this.mnList.push();
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

