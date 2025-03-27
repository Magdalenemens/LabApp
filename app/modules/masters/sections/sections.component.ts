import { Component, OnInit, ViewChild } from '@angular/core';
import { sectionModel } from 'src/app/models/sectionModel';
import { BAD_REQUEST_ERROR_MESSAGE, alertThreeDigits, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { DivisionService } from '../divisions/division.service';
import { SectionService } from './section.service';
import { DataTableDirective } from 'angular-datatables';
import moment from 'moment';
import { pageTrackRecordModel } from 'src/app/models/pageTrackRecordModel';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})

export class SectionsComponent implements OnInit {
  sectionList: sectionModel[] = [];
  required_sec_no: string = "";
  required_sec_abrv: string = "";
  required_div_no: string = "";
  required_sec_desc: string = "";

  // dtOptions: DataTables.Settings = {
  // };
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  errorMessage: any;
  editable: any;
  uniqueDivNos: string[] = []; // Array to hold unique div_no values
  //hiding info box
  visible: boolean = false
  editData_: any;

  Addrecord: boolean = false
  editRowId: any;
  sectionDropDown: any;

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 20, 30]; // Add page size options
  //Search
  filteredList: sectionModel[] = [];
  searchText: string = ''
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

  constructor(private _sectionService: SectionService, public _commonAlertService: CommonAlertService, private sortingService: SortingComponent,
    private _divisionService: DivisionService, private _commonService: CommonService) {
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.fillSectionDropDown();
    this.sectionList = [];
    this.GetSectionData();
    this.getUniqueDivNos();
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_Section, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetSectionData();
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
  this.sectionList = this.sortingService.sortData([...this.sectionList], column, this.sortDirection);
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
    this.sectionList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.sectionList = this.sectionList.filter(item =>
      item.div.toLowerCase().includes(searchText) ||
      item.descrip.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetSectionData(): void {
    this._sectionService.getAllSection().subscribe(res => {
      this.sectionList = res;
      this.dtTrigger.next(null);
      this.sectionList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.sectionList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading section list:', error);
      })
  }

  checkAlreadyExisting(event: any) {
    const secLength = event.target.value
    if (this.sectionList.filter(x => x.sect == event.target.value).length >= 2) {
      Swal.fire({
        text: warningMessage,
      });
      event.target.value = '';
      this.required_sec_no = "is-invalid";
    } else if (secLength.length < 3) {
      this._commonAlertService.alertThreeDigits();
      Swal.fire({
        text: alertThreeDigits,
      });
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.sectionList.length / this.itemsPerPage);
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

  getUniqueDivNos(): void {
    this.uniqueDivNos = this.sectionList
      .map(item => item.div)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  fillSectionDropDown() {
    this.sectionDropDown = this._divisionService.getAllDivision().subscribe(x => {
      this.sectionDropDown = x;
    })
  }

  addTable() {
    const existingAddRecordIndex = this.sectionList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.sectionList[existingAddRecordIndex];
      if (!existingAddRecord.laB_SECT_ID || existingAddRecord.laB_SECT_ID === 0) {
        this.sectionList.splice(existingAddRecordIndex, 1);
        this.Addrecord = false;
      }
    }
    const newrecord = new sectionModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    this.sectionList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;
    // Update pagination after adding a new record
    this.totalItems = this.sectionList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: sectionModel) {
    let initialValue = JSON.parse(JSON.stringify(_item));

    if (!_item.sect && !this.required_sec_no) {
      this.required_sec_no = "is-invalid";
    } else if (_item.sect && this.required_div_no) {
      this.required_sec_no = "";
    }

    if (!_item.abrv && !this.required_sec_abrv) {
      this.required_sec_abrv = "is-invalid";
    } else if (_item.abrv && this.required_div_no) {
      this.required_sec_abrv = "";
    }

    if (!_item.div && !this.required_div_no) {
      this.required_div_no = "is-invalid";
    } else if (_item.div && this.required_div_no) {
      this.required_div_no = "";
    }
    _item.descrip = _item.descrip.trim();
    if (!_item.descrip && !this.required_sec_desc) {
      this.required_sec_desc = "is-invalid";
    } else if (_item.descrip && this.required_sec_desc) {
      this.required_sec_desc = "";
    }

    if (_item.sect && _item.div && _item.descrip && _item.abrv) {
      _item.div = _item.div.split('-')[0].replace(/\s/g, "");
      this._sectionService.addSection(_item).subscribe(
        (response) => {
          this.sectionList.find(x => {
            if (x.sect == _item.sect) {
              x.laB_SECT_ID = response.body;
            }
          });

          if (response.status === 200) {
            this._commonAlertService.successMessage();
            // Filter to get the actual description for the given div
            const division = this.sectionDropDown.find(d => d.div === _item.div);
            if (division) {
              _item.div = `${division.div} - ${division.descrip}`;
            } else {
              console.error(`Division with divno ${_item.div} not found.`);
            }
            this.rerender();
          }
        },
        (error) => {
          // Handle error
          console.error('error caught in component')
          const status = error.status;
          this._commonAlertService.warningMessage();
        });
      _item.IsAdd = false;
      _item.IsEdit = false;
      _item.div = initialValue.div;

      this.Addrecord = false;
    }
  }

  CancelAddRow(_id: any) {
    const index = this.sectionList.findIndex((u) => u.laB_SECT_ID == _id);
    if (index !== -1) {
      this.sectionList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }


  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.sectionList.find((u) => u.laB_SECT_ID == _id)));
    const index = this.sectionList.findIndex((u) => u.laB_SECT_ID == _id);
    this.sectionList[index].IsEdit = true;
  }

  Update(_item: sectionModel) {
    // Validate inputs
    if (!_item.sect && !this.required_sec_no) {
      this.required_sec_no = "is-invalid";
    } else if (_item.sect && this.required_div_no) {
      this.required_sec_no = "";
    }

    if (!_item.abrv && !this.required_sec_abrv) {
      this.required_sec_abrv = "is-invalid";
    } else if (_item.abrv && this.required_div_no) {
      this.required_sec_abrv = "";
    }

    if (!_item.div && !this.required_div_no) {
      this.required_div_no = "is-invalid";
    } else if (_item.div && this.required_div_no) {
      this.required_div_no = "";
    }
    _item.descrip = _item.descrip.trim();
    if (!_item.descrip && !this.required_sec_desc) {
      this.required_sec_desc = "is-invalid";
    } else if (_item.descrip && this.required_sec_desc) {
      this.required_sec_desc = "";
    }


    if (_item.sect && _item.div && _item.descrip && _item.abrv) {
      // Extract the division number without the description for updating
      const divNo = _item.div.split(' - ')[0].trim();
      _item.div = divNo;
      this._sectionService.updateSection(_item).subscribe(
        (response) => {
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage()
            // Restore the original diV_NO with description for display
            const matchedItem = this.sectionList.find(item => item.div.split(' - ')[0].trim() === divNo);
            if (matchedItem) {
              _item.div = `${divNo} - ${matchedItem.div.split(' - ')[1].trim()}`;
            }
            _item.IsEdit = false;

            const index = this.sectionList.findIndex(item => item.laB_SECT_ID === _item.laB_SECT_ID);
            if (index !== -1) {
              // Update the section list with the modified item
              this.sectionList[index] = _item;
            }
          }
        },
        (error) => {
          if (error.status === 409) {
            this._commonAlertService.warningMessage()
          }
        }
      );
    }
  }


  CancelEditRow(_id: any) {
    const index = this.sectionList.findIndex(u => u.laB_SECT_ID === _id);
    if (index !== -1) {
      this.sectionList[index].IsEdit = false;
      this.sectionList[index].IsAdd = false;
      this.sectionList[index].sect = this.editData_.secT_NO;
      this.sectionList[index].div = this.editData_.diV_NO;
      this.sectionList[index].descrip = this.editData_.descrip;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._sectionService.deleteSection(_id).subscribe(
        (response: any) => {
          console.log('response received')
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.sectionList = this.sectionList.filter(item => item.laB_SECT_ID !== _id);
            this.sectionList.push();
            this.updatePagination();
            this._commonAlertService.deleteMessage()
            this.rerender();
          }
        },
        (error) => {
          console.error('error caught in component')
          const status = error.status;
          if (status === 400) {
            this._commonAlertService.badRequestMessage()
          }
        });
    }
  }
}



