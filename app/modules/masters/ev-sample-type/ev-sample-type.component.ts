import { Component, DebugEventListener, OnInit, ViewChild } from '@angular/core';
import { evsampletestModel } from 'src/app/models/evsampletestModel'
import { EVSampleTestService } from './evsampletest.service';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-ev-sample-type',
  templateUrl: './ev-sample-type.component.html',
  styleUrls: ['./ev-sample-type.component.scss']
})
export class EvSampleTypeComponent implements OnInit {
  evsampletestList: evsampletestModel[] = [];
  required_s_TYPE: string = "";
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
  filteredList: evsampletestModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;
  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(private _evsampleTesteService: EVSampleTestService, public _commonAlertService: CommonAlertService) { }

  ngOnInit(): void {
    this.evsampletestList = [];
    this.GetSampleTestData();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetSampleTestData();
  }

  GetSampleTestData(): void {
    this._evsampleTesteService.getAllEVSampleTest().subscribe(res => {
      this.evsampletestList = res;
      console.log("res", res);
      this.dtTrigger.next(null);
      this.evsampletestList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.evsampletestList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading Specimen Type list:', error);
      })
  }
  updatePagination(): void {
    const totalPages = Math.ceil(this.evsampletestList.length / this.itemsPerPage);
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
    const existingAddRecordIndex = this.evsampletestList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.evsampletestList[existingAddRecordIndex];
      if (!existingAddRecord.eV_SMPLS_ID || existingAddRecord.eV_SMPLS_ID === 0) {
        this.evsampletestList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new evsampletestModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    let sno_ = Math.max(...this.evsampletestList.map(record => record.sno));
    newrecord.sno = (sno_ <= 0) ? 1 : sno_ + 1;
    this.evsampletestList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;
    // Update pagination after adding a new record
    this.totalItems = this.evsampletestList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)

  }
  AddData(_item: evsampletestModel) {
    if (_item.s_TYPE) {
      _item.s_TYPE = _item.s_TYPE.trim();
    }
    if (!_item.s_TYPE && !this.required_s_TYPE) {
      this.required_s_TYPE = "is-invalid";
    } else if (_item.s_TYPE && this.required_s_TYPE) {
      this.required_s_TYPE = "";
    }
    if (_item.s_TYPE) {
      this._evsampleTesteService.addEVSampleTest(_item).subscribe(
        (response) => {
          this.evsampletestList.find(x => {
            if (x.sno == _item.sno) {
              x.eV_SMPLS_ID = response.body;
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
            _item.s_TYPE = _item.s_TYPE;
            _item.IsAdd = true;
          }
        });
      _item.IsAdd = false;
      _item.IsEdit = false;
      this.Addrecord = false;
    }
  }

  CancelAddRow(_id: any) {
    const index = this.evsampletestList.findIndex((u) => u.eV_SMPLS_ID == _id);
    if (index !== -1) {
      this.evsampletestList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  //hiding info box
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.evsampletestList.find((u) => u.eV_SMPLS_ID == _id)));
    const index = this.evsampletestList.findIndex((u) => u.eV_SMPLS_ID == _id);
    this.evsampletestList[index].IsEdit = true;
  }

  Update(_item: evsampletestModel) {
    if (_item.s_TYPE) {
      _item.s_TYPE = _item.s_TYPE.trim();
    }
    if (!_item.s_TYPE) {
      this.required_s_TYPE = "is-invalid";
    }
    if (_item.s_TYPE) {
      this._evsampleTesteService.updateEVSampleTest(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            const index = this.evsampletestList.findIndex(item => item.eV_SMPLS_ID === _item.eV_SMPLS_ID);
            if (index !== -1) {
              this.evsampletestList[index] = _item;
            }
          }
        },
        (error) => {
          // Handle error        
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
            _item.s_TYPE = _item.s_TYPE;
            _item.IsEdit = true;
          }
        });
    }
  }

  CancelEditRow(_id: any) {
    const index = this.evsampletestList.findIndex(u => u.eV_SMPLS_ID === _id);
    if (index !== -1) {
      this.evsampletestList[index].IsEdit = false;
      this.evsampletestList[index].IsAdd = false;
      this.evsampletestList[index].eV_SMPLS_ID = this.editData_.eV_SMPLS_ID;
      this.evsampletestList[index].s_TYPE = this.editData_.s_TYPE;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._evsampleTesteService.deleteEVSampleTest(_id).subscribe({
        next: (response: any) => {
          const status = response.status;

          if (status === 200 || status === 204) {
            // Remove the deleted item from the list
            this.evsampletestList = this.evsampletestList.filter(item => item.eV_SMPLS_ID !== _id);

            // Optional: Reinitialize the list if required
            this.updatePagination();

            // Notify user of successful deletion
            this._commonAlertService.deleteMessage();

            // Rerender the table or UI element
            this.rerender();
          } else if (status === 404) {
            // Handle 404 Not Found case
            this._commonAlertService.deleteErrorMessage();
          }
        },
        error: (error) => {
          console.error('Error caught in component:', error);

          const status = error.status;

          if (status === 400) {
            // Handle 400 Bad Request case
            this._commonAlertService.badRequestMessage();
          } else {
            // Optional: Handle other errors
            this._commonAlertService.deleteErrorMessage();
          }
        }
      });
    }
  }

}
