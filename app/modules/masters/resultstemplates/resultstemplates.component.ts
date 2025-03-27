import { Component, OnInit, ElementRef } from '@angular/core';
import { ResultTemplateService } from './resulttemplate.service';
import { resulttemplateModel } from 'src/app/models/resulttemplateModel';
import { Subject } from 'rxjs';
import { ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { DivisionService } from '../divisions/division.service';
import { BAD_REQUEST_ERROR_MESSAGE, NOT_FOUND_MESSAGE, deleteMessage, errorMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import { Editor, Toolbar } from 'ngx-editor';
import { DataTableDirective } from 'angular-datatables';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { kolkovEditorService } from 'src/app/common/kolkovEditorService';
import { id } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-resultstemplates',
  templateUrl: './resultstemplates.component.html',
  styleUrls: ['./resultstemplates.component.scss']
})
export class ResultstemplatesComponent implements OnInit {
  data: any;
  editor = new Editor();
  ckEditorData: string = '';

  resulttemplateList: resulttemplateModel[] = [];
  required_tname: string = "";
  required_div_no: string = "";

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  errorMessage: any;
  _id: any;
  _lastEditId: number;
  Addrecord: boolean = false
  editRowId: any = 0;
  resultstemplatesDropDown: any;
  visible: boolean = false
  editData_: any;
  isReadOnly: boolean = true; // Initial state is read-only
  ckEditorId: number = 0;
  originalCkEditorData: string = '';
  isEditing: boolean = false;
  isAddMode: boolean = false;
  isTemplatetBtn: boolean = false;

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: resulttemplateModel[] = [];
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

  constructor(private _resulttemplateService: ResultTemplateService, private sortingService: SortingComponent, public _commonAlertService: CommonAlertService,
    private _divisionService: DivisionService, private _commonService: CommonService, public editorService: kolkovEditorService) { }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.fillSectionDropDown();
    this.resulttemplateList = [];
    this.GetResultsTemplatesData();
  }

  ngAfterViewInit(): void {
  }

  onLineSpacingChange(event: Event) {
    const spacing = (event.target as HTMLSelectElement).value;
    if (spacing) {
      this.editorService.setLineSpacing(spacing);
    }
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetResultsTemplatesData();
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
    this.resulttemplateList = this.sortingService.sortData([...this.resulttemplateList], column, this.sortDirection);
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
    this.resulttemplateList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.resulttemplateList = this.resulttemplateList.filter(item =>
      item.tname.toLowerCase().includes(searchText) ||
      item.div.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetResultsTemplatesData(): void {
    this._resulttemplateService.gettAllResultsTemplates().subscribe(res => {
      this.resulttemplateList = res;
      this.dtTrigger.next(null);
      this.resulttemplateList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.resulttemplateList];
      this.updatePagination();
      this.selectRecord(this.filteredList[0]);
    },
      (error) => {
        console.error('Error loading division list:', error);
      })
  }

  checkAlreadyExisting(event: any) {
    if (this.resulttemplateList.filter(x => x.tno == event.target.value).length > 1) {
      this._commonAlertService.warningMessage();
      event.target.value = "";
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.resulttemplateList.length / this.itemsPerPage);
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

  fillSectionDropDown() {
    this.resultstemplatesDropDown = this._divisionService.getAllDivision().subscribe(x => {
      this.resultstemplatesDropDown = x;
    })
  }

  addTable() {
    const existingAddRecordIndex = this.resulttemplateList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.resulttemplateList[existingAddRecordIndex];
      if (!existingAddRecord.tno || existingAddRecord.rS_TMPLT_ID === 0) {
        this.resulttemplateList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new resulttemplateModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    let sno_ = Math.max(...this.resulttemplateList.map(record => record.sno));
    newrecord.sno = (sno_ <= 0) ? 1 : sno_ + 1;
    this.resulttemplateList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;

    // Update pagination after adding a new record
    this.totalItems = this.resulttemplateList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  selectRecord(item) {
    this._lastEditId = this._id;
    if (this.editRowId > 0) {
      return;
    }
    this._id = item.rS_TMPLT_ID;
    this.bindCkEditor(item.template, item.rS_TMPLT_ID, this.isEditing);
  }

  AddData(_item: resulttemplateModel) {
    if (!_item.tname && !this.required_tname) {
      this.required_tname = "is-invalid";
    } else if (_item.tname && this.required_tname) {
      this.required_tname = "";
    }
    if (_item.tname) {
      _item.tname = _item.tname.trim();
    }
    if (_item.tno) {
      _item.tno = _item.tno;
    }
    if (!_item.div && !this.required_div_no) {
      this.required_div_no = "is-invalid";
    } else if (_item.div && this.required_div_no) {
      this.required_div_no = "";
    }
    if (_item.tname && _item.div) {
      _item.div = _item.div.split('-')[0].replace(/\s/g, "");
      this._resulttemplateService.addresultstemplates(_item).subscribe(
        (response) => {
          this.resulttemplateList.find(x => {
            if (x.sno == _item.sno) {
              x.tno = response.body;
            }
          });
          if (response.status === 200) {
            this._commonAlertService.successMessage();
            this.GetResultsTemplatesData();
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
    const index = this.resulttemplateList.findIndex((u) => u.rS_TMPLT_ID == _id);
    if (index !== -1) {
      this.resulttemplateList.splice(index, 1); // Remove the added row
      this.Addrecord = false;
    }
    this.updatePagination();
  }

  //hiding info box
  Edit(_id: any) {
    this.isTemplatetBtn = true;
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.resulttemplateList.find((u) => u.rS_TMPLT_ID == _id)));
    const index = this.resulttemplateList.findIndex((u) => u.rS_TMPLT_ID == _id);
    this.resulttemplateList[index].IsEdit = true;
  }

  Update(_item: resulttemplateModel) {
    if (!_item.tname && !this.required_tname) {
      this.required_tname = "is-invalid";
    } else if (_item.tname && this.required_tname) {
      this.required_tname = "";
    }
    // if (_item.tname) {
    //   _item.tname = _item.tname.trim();
    // }
    if (!_item.div && !this.required_div_no) {
      this.required_div_no = "is-invalid";
    } else if (_item.div && this.required_div_no) {
      this.required_div_no = "";
    }
    if (_item.tname && _item.div) {
      const divNo = _item.div.split(' - ')[0].trim();
      _item.div = divNo;
      this._resulttemplateService.updateresultstemplates(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          this.editRowId = 0;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            // Restore the original diV_NO with description for display
            const matchedItem = this.resultstemplatesDropDown.find(item => item.div === divNo);
            if (matchedItem) {
              _item.div = `${divNo} - ${matchedItem.descrip}`;
            }
            const index = this.resulttemplateList.findIndex(item => item.rS_TMPLT_ID === _item.rS_TMPLT_ID);
            if (index !== -1) {
              this.resulttemplateList[index] = _item;
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
    const index = this.resulttemplateList.findIndex(u => u.rS_TMPLT_ID === _id);
    if (index !== -1) {
      this.resulttemplateList[index].IsEdit = false;
      this.resulttemplateList[index].IsAdd = false;
      this.resulttemplateList[index].tno = this.editData_.tno;
      this.resulttemplateList[index].tname = this.editData_.tname;
      this.resulttemplateList[index].div = this.editData_.div;
      this.resulttemplateList[index].template = this.editData_.template;
      this.editRowId =0;
    }
  }

  UpdateRecord(_id: any) {
    var record = this.resulttemplateList.find(u => u.rS_TMPLT_ID === _id);
    if (record) {
      record.template = this.ckEditorData;
    }
    this.Update(record);
  }

  AddInsertRecord() {
    var record = this.resulttemplateList[0];
    if (record) {
      record.template = this.ckEditorData;
    }
    this.AddData(record);
  }

  deleteRow(_id: any) {
    this.Addrecord = false;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._resulttemplateService.deleteresultstemplates(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.resulttemplateList = this.resulttemplateList.filter(item => item.rS_TMPLT_ID !== _id);
            this.resulttemplateList.push();
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
          if (status === 404) {
            this._commonAlertService.deleteErrorMessage();
          }
        });
    }
  }


  bindCkEditor(data: any, _id: any, isAdd: boolean) {
    this.ckEditorData = data;
    this.ckEditorId = _id;
    if (isAdd) {
      this.isReadOnly = false;
    } else {
      this.isReadOnly = true;
    }
  }

  toggleEditMode() {
    if (this.isReadOnly) {
      this.isReadOnly = false;
      this.isEditing = true;
      this.originalCkEditorData = this.ckEditorData;
    } else {
      this.isReadOnly = true;
      this.isEditing = false;
      this.ckEditorData = this.originalCkEditorData;
      this.originalCkEditorData = '';
      const element = document.getElementById("exampleModal");
    }
  }

  saveCkEditorData() {
    const editedItem = this.resulttemplateList.find(u => u.rS_TMPLT_ID === this.ckEditorId);
    if (editedItem.rS_TMPLT_ID > 0) {
      editedItem.template = this.ckEditorData;

      if (editedItem.div) {
        const divNo = editedItem.div.split('-')[0].trim();
        editedItem.div = divNo;
      }

      this._resulttemplateService.updateresultstemplates(editedItem).subscribe(
        (response) => {
          if (response.status === 200 || response.status === 204) {

            this.isReadOnly = true;
            this.isEditing = false;
            this.originalCkEditorData = '';
            this._commonAlertService.updateMessage();
            this.rerender();
          }
        },
        (error) => {
          // Handle update error
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          } else if (status === 404) {
            this._commonAlertService.notFoundMessage();
          } else {
            this._commonAlertService.errorMessage();
          }
        }
      );
    }
    else {
      editedItem.template = this.ckEditorData;
      this.AddData(editedItem);
      this._commonAlertService.successMessage();
    }
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_ResultTemplates, this.startTime, this.endTime);
    this.editor.destroy();
    this.dtTrigger.unsubscribe();
  }
}

