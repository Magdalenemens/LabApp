import { Component, OnInit } from '@angular/core';
import { SpecimenSiteService } from './specimentsite.service';
import { specimentsiteModel } from 'src/app/models/specimentsiteModel';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { ViewChild } from '@angular/core';
import { BAD_REQUEST_ERROR_MESSAGE, deleteMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { SortingComponent } from '../../pagination/sorting/sorting.component';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-specimensites',
  templateUrl: './specimensites.component.html',
  styleUrls: ['./specimensites.component.scss']
})
export class SpecimenSitesComponent implements OnInit {
  specimensiteList: specimentsiteModel[] = [];
  required_sp_site: string = "";
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
  pageSizeOptions: number[] = [10, 20, 30]; // Add page size options
  //Search
  filteredList: specimentsiteModel[] = [];
  searchText: string = ''
  totalItems: number;
  pageChange: any;
  startTime: string = '';
  endTime: string = '';
  currentDateTime = moment();
  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(private _spSiteService: SpecimenSiteService, private sortingService: SortingComponent, public _commonAlertService: CommonAlertService,
    private _commonService: CommonService) { }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.specimensiteList = [];
    this.GetSpecimenSiteData();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_SpecimentSites, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
    });
    this.GetSpecimenSiteData();
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
	  this.specimensiteList = this.sortingService.sortData([...this.specimensiteList], column, this.sortDirection);
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
    this.specimensiteList = [...this.filteredList];

    const searchText = this.searchText.toLowerCase().trim();
    this.specimensiteList = this.specimensiteList.filter(item =>
      item.sP_SITE.toLowerCase().includes(searchText)
    );
    this.updatePagination();
  }

  GetSpecimenSiteData(): void {
    this._spSiteService.getAllSPSite().subscribe(res => {
      this.specimensiteList = res;
      this.dtTrigger.next(null);
      this.specimensiteList.forEach(x => { x.IsAdd = false; x.IsEdit = false })
      this.filteredList = [...this.specimensiteList];
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading specimentsite list:', error);
      })
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.specimensiteList.length / this.itemsPerPage);
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
    const existingAddRecordIndex = this.specimensiteList.findIndex(item => item.IsAdd);
    if (existingAddRecordIndex !== -1) {
      const existingAddRecord = this.specimensiteList[existingAddRecordIndex];
      if (!existingAddRecord.sP_SITE_ID || existingAddRecord.sP_SITE_ID === 0) {
        this.specimensiteList.splice(existingAddRecordIndex, 1); // Remove the specific row
        this.Addrecord = false;
      }
    }
    const newrecord = new specimentsiteModel();
    newrecord.IsAdd = true;
    newrecord.IsEdit = false;
    let sno_ = Math.max(...this.specimensiteList.map(record => record.sno));
    newrecord.sno = (sno_ <= 0) ? 1 : sno_ + 1;
    this.specimensiteList.unshift(newrecord);
    this.visible = false;
    this.Addrecord = true;
    // Update pagination after adding a new record
    this.totalItems = this.specimensiteList.length;

    // Navigate to the first page
    this.currentPage = 1;
    this.updatePagination();
    this.pageChange.emit(this.currentPage)
  }

  AddData(_item: specimentsiteModel) {
    if (_item.sP_SITE) {
      _item.sP_SITE = _item.sP_SITE.trim();
    }
    if (!_item.sP_SITE && !this.required_sp_site) {
      this.required_sp_site = "is-invalid";
    } else if (_item.sP_SITE && this.required_sp_site) {
      this.required_sp_site = "";
    }
    if (_item.sP_SITE) {
      this._spSiteService.addSPSite(_item).subscribe(
        (response) => {
          this.specimensiteList.find(x => {
            if (x.sno == _item.sno) {
              x.sP_SITE_ID = response.body;
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
            _item.sP_SITE = _item.sP_SITE;
            _item.IsAdd = true;
          }
        });
      _item.IsAdd = false;
      _item.IsEdit = false;
      this.Addrecord = false;
    }
  }

  CancelAddRow(_id: any) {
    const index = this.specimensiteList.findIndex((u) => u.sP_SITE_ID == _id);
    if (index !== -1) {
      this.specimensiteList.splice(index, 1); // Remove the added row
      this.Addrecord = true;
    }
    this.updatePagination();
  }

  //hiding info box  
  Edit(_id: any) {
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.specimensiteList.find((u) => u.sP_SITE_ID == _id)));
    const index = this.specimensiteList.findIndex((u) => u.sP_SITE_ID == _id);
    this.specimensiteList[index].IsEdit = true;
  }

  Update(_item: specimentsiteModel) {
    if (_item.sP_SITE) {
      _item.sP_SITE = _item.sP_SITE.trim();
    }
    if (!_item.sP_SITE) {
      this.required_sp_site = "is-invalid";
    }
    _item.sP_SITE = _item.sP_SITE.trim();
    if (_item.sP_SITE) {
      this._spSiteService.updateSPSite(_item).subscribe(
        (response) => {
          _item.IsEdit = false;
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            const index = this.specimensiteList.findIndex(item => item.sP_SITE_ID === _item.sP_SITE_ID);
            if (index !== -1) {
              this.specimensiteList[index] = _item;
            }
          }
        },
        (error) => {
          // Handle error         
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
            _item.sP_SITE = _item.sP_SITE;
            _item.IsEdit = true;
          }
        });
    }
  }

  CancelEditRow(_id: any) {
    const index = this.specimensiteList.findIndex(u => u.sP_SITE_ID === _id);
    if (index !== -1) {
      this.specimensiteList[index].IsEdit = false;
      this.specimensiteList[index].IsAdd = false;
      this.specimensiteList[index].sP_SITE_ID = this.editData_.sP_SITE_ID;
      this.specimensiteList[index].sP_SITE = this.editData_.sP_SITE;
    }
  }

  deleteRow(_id: any) {
    this.Addrecord = true;
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._spSiteService.deleteSPSite(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.specimensiteList = this.specimensiteList.filter(item => item.sP_SITE_ID !== _id);
            this.specimensiteList.push();
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


