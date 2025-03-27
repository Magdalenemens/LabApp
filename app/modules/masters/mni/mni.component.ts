import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { mniService } from './mni.service';
import { mniModel } from 'src/app/models/mniModel';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BAD_REQUEST_ERROR_MESSAGE, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-mni',
  templateUrl: './mni.component.html',
  styleUrls: ['./mni.component.scss'],
})

export class mniComponent implements OnInit {
  mniList: mniModel[] = [];
  required_isoL_CD: string = "";
  required_div_desc: string = "";
  required_genus: string = "";
  required_family: string = "";
  required_grp: string = "";
  required_num: string = "";

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
  filteredList: mniModel[] = [];
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

  constructor(private _mniService: mniService, private _commonService: CommonService, public _commonAlertService: CommonAlertService, private sortingService: SortingComponent) {
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.mniList = [];
    this.GetmniData();
  }


  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_OrganismsCodes, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
    });
    this.GetmniData();
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
	  this.mniList = this.sortingService.sortData([...this.mniList], column, this.sortDirection);
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
    this.mniList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.mniList = this.mniList.filter(item =>
      item.isoL_CD.toLowerCase().includes(searchText) ||
      item.descrip.toLowerCase().includes(searchText) ||
      item.genus.toLowerCase().includes(searchText) ||
      item.family.toLowerCase().includes(searchText) ||
      item.grp.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetmniData(): void {
    this._mniService.getAllmni().subscribe(res => {

      this.mniList = res;
      this.dtTrigger.next(null);
      this.mniList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.mniList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading mni list:', error);
      })
  }

  checkAlreadyExisting(event: any) {
    if (this.mniList.filter(x => x.isoL_CD.toLowerCase() == event.target.value.toLowerCase()).length > 1) {
      Swal.fire({
        text: 'isoL_CD :  ' + event.target.value + ' already exists.',
      });
      event.target.value = "";
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.mniList.length / this.itemsPerPage);
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
    const existingAddRecordIndex = this.mniList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.mniList[existingAddRecordIndex];
      if (!existingAddRecord.mnI_ID || existingAddRecord.mnI_ID === 0) {
        this.mniList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new mniModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    this.mniList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;
    // Update pagination after adding a new record
    this.totalItems = this.mniList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: mniModel) {
    if (_item.isoL_CD) {
      _item.isoL_CD = _item.isoL_CD.trim();
    }
    if (!_item.isoL_CD && !this.required_isoL_CD) {
      this.required_isoL_CD = "is-invalid";
    } else if (_item.isoL_CD && this.required_isoL_CD) {
      this.required_isoL_CD = ""; // Reset the class if the field is filled
    }
    if (_item.genus) {
      _item.genus = _item.genus.trim();
    }
    if (!_item.genus && !this.required_genus) {
      this.required_genus = "is-invalid";
    } else if (_item.genus && this.required_genus) {
      this.required_genus = ""; // Reset the class if the field is filled
    }
    if (_item.family) {
      _item.family = _item.family.trim();
    }
    if (!_item.family && !this.required_family) {
      this.required_family = "is-invalid";
    } else if (_item.family && this.required_family) {
      this.required_family = ""; // Reset the class if the field is filled
    }
    if (_item.grp) {
      _item.grp = _item.grp.trim();
    }
    if (!_item.grp && !this.required_grp) {
      this.required_grp = "is-invalid";
    } else if (_item.grp && this.required_grp) {
      this.required_grp = ""; // Reset the class if the field is filled
    }
    if (_item.descrip) {
      _item.descrip = _item.descrip.trim();
    }
    if (!_item.descrip && !this.required_div_desc) {
      this.required_div_desc = "is-invalid";
    } else if (_item.descrip && this.required_div_desc) {
      this.required_div_desc = ""; // Reset the class if the field is filled
    }

    if (_item.isoL_CD && _item.descrip && _item.genus && _item.family && _item.grp && _item.descrip) {
      this._mniService.addmni(_item).subscribe(
        (response) => {
          //console.log(response);
          this.mniList.find(x => {
            if (x.isoL_CD == _item.isoL_CD) {
              x.mnI_ID = response.body;
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
    const index = this.mniList.findIndex((u) => u.mnI_ID == _id);
    if (index !== -1) {
      this.mniList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  //hiding info box
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.mniList.find((u) => u.mnI_ID == _id)));
    const index = this.mniList.findIndex((u) => u.mnI_ID == _id);
    this.mniList[index].IsEdit = true;
  }

  Update(_item: mniModel) {
    if (_item.isoL_CD) {
      _item.isoL_CD = _item.isoL_CD.trim();
    }
    if (!_item.isoL_CD && !this.required_isoL_CD) {
      this.required_isoL_CD = "is-invalid";
    } else if (_item.isoL_CD && this.required_isoL_CD) {
      this.required_isoL_CD = ""; // Reset the class if the field is filled
    }
    if (_item.genus) {
      _item.genus = _item.genus.trim();
    }
    if (!_item.genus && !this.required_genus) {
      this.required_genus = "is-invalid";
    } else if (_item.genus && this.required_genus) {
      this.required_genus = ""; // Reset the class if the field is filled
    }
    if (_item.family) {
      _item.family = _item.family.trim();
    }
    if (!_item.family && !this.required_family) {
      this.required_family = "is-invalid";
    } else if (_item.family && this.required_family) {
      this.required_family = ""; // Reset the class if the field is filled
    }
    if (_item.grp) {
      _item.grp = _item.grp.trim();
    }
    if (!_item.grp && !this.required_grp) {
      this.required_grp = "is-invalid";
    } else if (_item.grp && this.required_grp) {
      this.required_grp = ""; // Reset the class if the field is filled
    }
    if (_item.num) {
      _item.num = _item.num.trim();
    }
    if (!_item.num && !this.required_num) {
      this.required_num = "is-invalid";
    } else if (_item.num && this.required_num) {
      this.required_num = ""; // Reset the class if the field is filled
    }
    if (_item.descrip) {
      _item.descrip = _item.descrip.trim();
    }

    if (!_item.descrip && !this.required_div_desc) {
      this.required_div_desc = "is-invalid";
    } else if (_item.descrip && this.required_div_desc) {
      this.required_div_desc = ""; // Reset the class if the field is filled
    }

    if (_item.isoL_CD && _item.descrip && _item.genus && _item.family && _item.grp && _item.num) {
      this._mniService.updatemni(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            const index = this.mniList.findIndex(item => item.mnI_ID === _item.mnI_ID);
            if (index !== -1) {
              this.mniList[index] = _item;
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
    const index = this.mniList.findIndex(u => u.mnI_ID === _id);
    if (index !== -1) {
      this.mniList[index].IsEdit = false;
      this.mniList[index].IsAdd = false;
      this.mniList[index].isoL_CD = this.editData_.isoL_CD;
      this.mniList[index].family = this.editData_.family;
      this.mniList[index].descrip = this.editData_.descrip;
      this.mniList[index].genus = this.editData_.genus;
      this.mniList[index].grp = this.editData_.grp;
      this.mniList[index].num = this.editData_.num;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      const divno = this.mniList.find(item => item.mnI_ID === _id)?.isoL_CD;

      this._mniService.deletemni(_id).subscribe(
        (response: any) => {
          //console.log('response received')          
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.mniList = this.mniList.filter(item => item.mnI_ID !== _id);
            this.mniList.push();
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

