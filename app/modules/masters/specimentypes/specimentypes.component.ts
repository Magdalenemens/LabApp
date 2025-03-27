import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { specimentypeModel } from 'src/app/models/specimentypeModel';
import { SpecimenTypeService } from './specimentype.service';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { ViewChild } from '@angular/core';
import { BAD_REQUEST_ERROR_MESSAGE, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';


@Component({
  selector: 'app-specimentypes',
  templateUrl: './specimentypes.component.html',
  styleUrls: ['./specimentypes.component.scss']
})
export class SpecimenTypesComponent implements OnInit {
  specimentypeList: specimentypeModel[] = [];
  required_sp_type: string = "";
  // dtOptions: DataTables.Settings = {};
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
  filteredList: specimentypeModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;
  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(private _specimenTypeService: SpecimenTypeService, public _commonAlertService: CommonAlertService, private sortingService: SortingComponent) { }

  ngOnInit(): void {
    this.specimentypeList = [];
    this.GetSpecimenTypeData();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetSpecimenTypeData();
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
  this.specimentypeList = this.sortingService.sortData([...this.specimentypeList], column, this.sortDirection);
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
    this.specimentypeList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.specimentypeList = this.specimentypeList.filter(item =>
      item.sP_CODE.toLowerCase().includes(searchText) ||
      item.sP_DESCRP.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetSpecimenTypeData(): void {
    this._specimenTypeService.getAllSpecimenType().subscribe(res => {
      this.specimentypeList = res;
      this.dtTrigger.next(null);
      this.specimentypeList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.specimentypeList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading Specimen Type list:', error);
      })
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.specimentypeList.length / this.itemsPerPage);
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
    const existingAddRecordIndex = this.specimentypeList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.specimentypeList[existingAddRecordIndex];
      if (!existingAddRecord.sP_TYPE_ID || existingAddRecord.sP_TYPE_ID === 0) {
        this.specimentypeList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new specimentypeModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    let sno_ = Math.max(...this.specimentypeList.map(record => record.sno));
    newrecord.sno = (sno_ <= 0) ? 1 : sno_ + 1;
    this.specimentypeList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;
    // Update pagination after adding a new record
    this.totalItems = this.specimentypeList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: specimentypeModel) {
    if (_item.sP_CODE) {
      _item.sP_CODE = _item.sP_CODE.trim();
    }
    if (!_item.sP_CODE && !this.required_sp_type) {
      this.required_sp_type = "is-invalid";
    } else if (_item.sP_CODE && this.required_sp_type) {
      this.required_sp_type = "";
    }
    if (_item.sP_CODE) {
      this._specimenTypeService.addSpecimenType(_item).subscribe(
        (response) => {
          this.specimentypeList.find(x => {
            if (x.sno == _item.sno) {
              x.sP_TYPE_ID = response.body;
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
            _item.sP_CODE = _item.sP_CODE;
            _item.IsAdd = true;
          }
        });
      _item.IsAdd = false;
      _item.IsEdit = false;
      this.Addrecord = false;
    }
  }

  CancelAddRow(_id: any) {
    const index = this.specimentypeList.findIndex((u) => u.sP_TYPE_ID == _id);
    if (index !== -1) {
      this.specimentypeList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  //hiding info box
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.specimentypeList.find((u) => u.sP_TYPE_ID == _id)));
    const index = this.specimentypeList.findIndex((u) => u.sP_TYPE_ID == _id);
    this.specimentypeList[index].IsEdit = true;
  }

  Update(_item: specimentypeModel) {
    if (_item.sP_CODE) {
      _item.sP_CODE = _item.sP_CODE.trim();
    }
    if (!_item.sP_CODE) {
      this.required_sp_type = "is-invalid";
    }
    if (_item.sP_CODE) {
      this._specimenTypeService.updateSpecimenType(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            const index = this.specimentypeList.findIndex(item => item.sP_TYPE_ID === _item.sP_TYPE_ID);
            if (index !== -1) {
              this.specimentypeList[index] = _item;
            }
          }
        },
        (error) => {
          // Handle error        
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
            _item.sP_CODE = _item.sP_CODE;
            _item.IsEdit = true;
          }
        });
    }
  }

  CancelEditRow(_id: any) {
    const index = this.specimentypeList.findIndex(u => u.sP_TYPE_ID === _id);
    if (index !== -1) {
      this.specimentypeList[index].IsEdit = false;
      this.specimentypeList[index].IsAdd = false;
      this.specimentypeList[index].sP_TYPE_ID = this.editData_.sP_TYPE_ID;
      this.specimentypeList[index].sP_CODE = this.editData_.sP_CODE;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._specimenTypeService.deleteSpecimenTypee(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.specimentypeList = this.specimentypeList.filter(item => item.sP_TYPE_ID !== _id);
            this.specimentypeList.push();
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