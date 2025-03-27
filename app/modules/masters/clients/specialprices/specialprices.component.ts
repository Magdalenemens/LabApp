import { Component, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { clientModel } from 'src/app/models/clientModel';
import { AddclientService } from '../addclients/addclient.service';
import { SpService } from './sp.service';
import { sp_testModel, specialpricesModel, } from 'src/app/models/specialpricesModel';
import Swal from 'sweetalert2';
import { BAD_REQUEST_MESSAGE, errorMessage, successMessage, warningMessage, warning_alert_message } from 'src/app/common/constant';
import { DivisionService } from '../../divisions/division.service';
import { DataTableDirective } from 'angular-datatables';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { SortingComponent } from 'src/app/modules/pagination/sorting/sorting.component';

@Component({
  selector: 'app-specialprices',
  templateUrl: './specialprices.component.html',
  styleUrls: ['./specialprices.component.scss']
})
export class SpecialpricesComponent {

  clientList!: clientModel[];
  itemList: specialpricesModel[] = [];
  testList: sp_testModel[] = [];
  fromclientId: string = '';
  toclientId: string = '';
  required_dt: string = "";
  required_dscnt: string = "";
  required_dprice: string = "";
  spModel: sp_testModel = new sp_testModel();
  Addrecord: boolean = false
  editRowId: any;
  //hiding info box
  visible: boolean = false
  disabled: boolean = true
  editData_: any;
  isDisabled = false;
  showadd = false;
  response_: any;
  isCodeEditable: boolean = false;

  // dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  totalItems: number;
  pageChange: any;
  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(public services: AddclientService, public sp_services: SpService, public _commonAlertService: CommonAlertService, private sortingService: SortingComponent,
    private _divisionService: DivisionService) {
  }

  ngOnInit(): void {
    this.getClientData();
    this.testList = [];
    this.itemList = [];
    $('#btnspecialprices').addClass("is-active");

    this.getClientDropDownData();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
	  this.clientList = this.sortingService.sortData([...this.clientList], column, this.sortDirection);
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


  getClientDropDownData(): void {
    this.services.getAllclient().subscribe(res => {
      this.clientList = res.clients;
      this.updatePagination();
    },
      (error) => {
        console.error('Error loading Client list:', error);
      })
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.itemList.length / this.itemsPerPage);
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

  sectionDropDown: any;
  fillSectionDropDown() {
    this.sectionDropDown = this._divisionService.getAllDivision().subscribe(x => {
      this.sectionDropDown = x;
    })
  }

  ShowData(): void {
    if (this.fromclientId && this.toclientId) {
      // $('#spclienttable').DataTable().clear();
      // $('#spclienttable').DataTable().destroy();
      this.sp_services.GetSpecialpricesByClient(this.fromclientId, this.toclientId).subscribe(res => {
        this.itemList = [];
        this.itemList = res;
        this.dtTrigger.next(null);
        if (this.itemList.length > 0) {
          this.disabled = false;
          this.showadd = true;
        }
      },
        (error) => {
          console.error('Error loading Client list:', error);
        })
      this.isDisabled = true;
    }
  }

  ShowTests(): void {
    //const cn =  this.testList.findIndex((u) => u.clnT_SP_ID == _id); 
    const cn = this.fromclientId;
    if (!cn) {
      $('#spclienttable').DataTable().clear();
      $('#spclienttable').DataTable().destroy();
      this.sp_services.getAllTests().subscribe(res => {
        this.testList = [];
        this.testList = res;
        this.dtTrigger.next(null);
        if (this.testList.length > 0) {
          this.disabled = false;
          this.showadd = true;
        }
      },
        (error) => {
          console.error('Error loading Client list:', error);
        })
      this.isDisabled = true;
    }
  }


  getClientData(): void {
    this.services.getAllclient().subscribe(res => {
      this.clientList = res.clients;
    },
      (error) => {
        console.error('Error loading Client list:', error);
      })
  }


  addTable() {
    if (!this.Addrecord) {
      if (this.itemList.filter(z => z.cn != '')) {
        const obj = new specialpricesModel();
        obj.IsAdd = true;
        obj.IsEdit = false;
        obj.cn = this.toclientId;
        obj.clnT_SP_ID = this.itemList[this.itemList.length - 1].clnT_SP_ID + 1;
        this.Addrecord = true; //not equal to condition
        this.visible = false;
        this.itemList.unshift(obj);
        // Assign sequential numbers to the diV_ID property of each record
        this.itemList.forEach((record, index) => {
          record.clnT_SP_ID = index + 1; // Assign 1-based index as the ID
          record.cn = this.toclientId;
        });
        this.isDisabled = true;
        this.Addrecord = true;
        this.isCodeEditable = true;
      }
    }
  }


  AddData(isAddCopyFromSource: boolean) {
    //this.testList=this.itemList;
    if (this.fromclientId && this.toclientId && this.itemList.length > 0) {
      const validData = this.itemList.filter(z => z.cn !== '' && z.uprice !== 0 && z.name !== '');
      if (validData.length > 0) {
        const spDataArray: specialpricesModel[] = validData.map(item => {
          const spModel: specialpricesModel = {
            cn: this.fromclientId,
            tocn: this.toclientId,
            code: item.code,
            name: item.name,
            uprice: item.uprice,
            dt: item.dt,
            dscnt: item.dscnt,
            dprice: item.dprice,
            fprice: item.fprice,
            clnT_SP_ID: item.clnT_SP_ID,
            div: '',
            tt: '',
            b_NO: '',
            bill: '',
            IsEdit: false,
            IsAdd: false,
            IsDt_p: false,
            IsDt_s: false
            // dscnt: item.dscnt !== undefined ? item.dscnt : 0, // Optional field
            // dprice: item.dprice !== undefined ? item.dprice : 0,
            ,
            data: ''
          };
          return spModel;
        });
        if (isAddCopyFromSource) {
          this.sp_services.addSpecialPriceFromSourceToDestinations(spDataArray).subscribe(
            (response) => {
              if (response.status === 200) {
                this._commonAlertService.successMessage();
                this.ShowData();
                this.Addrecord = false;
              }
            },
            (error) => {
              const status = error.status;
              if (status === 409) {
                this._commonAlertService.warningMessage();
              } else if (status === 400) {
                this._commonAlertService.errorMessage();
              }
            }
          );
        }
      }
    }
  }

  Edit(_id: any) {
    if (this.editRowId) {
      const index = this.itemList.findIndex((u) => u.clnT_SP_ID == _id);
      this.testList[index].IsEdit = false;
    }
    const index = this.itemList.findIndex((u) => u.clnT_SP_ID == _id);
    this.editData_ = this.itemList.find((u) => u.clnT_SP_ID == _id);
    this.itemList[index].IsEdit = true;
    this.itemList[index].IsDt_s = false;
    this.itemList[index].IsDt_p = false;
    if (this.itemList[index].dt == "S")
      this.itemList[index].IsDt_p = true;
    else if (this.itemList[index].dt == "P")
      this.itemList[index].IsDt_s = true;
  }


  CancelRow(_id: any) {
    this.editRowId = _id;
    let IsAdd_ = this.itemList.find((u) => u.clnT_SP_ID == _id);
    const index = this.itemList.findIndex((u) => u.clnT_SP_ID == _id);
    this.itemList[index].IsEdit = false;
    this.itemList[index].IsAdd = false;
    this.itemList[index].code = this.editData_.code;
    this.itemList[index].name = this.editData_.name;
    this.itemList[index].uprice = this.editData_.uprice;
    this.itemList[index].dt = this.editData_.dt;
    this.itemList[index].dscnt = this.editData_.dscnt;
    this.itemList[index].dprice = this.editData_.dprice;
    this.itemList[index].fprice = this.editData_.fprice;
  }

  changedropdowndt(event: any, _id: any) {
    const index = this.itemList.findIndex((u) => u.clnT_SP_ID == _id);
    this.itemList[index].IsDt_s = false;
    this.itemList[index].IsDt_p = false;
    if (event.target.value == "S")
      this.itemList[index].IsDt_p = true;
    else if (event.target.value == "P")
      this.itemList[index].IsDt_s = true;
  }

  changeunitprice(event: any, _id: any) {
    const index = this.itemList.findIndex((u) => u.clnT_SP_ID == _id);
    const percentage = event.target.value;
    if (this.itemList[index].dt == "P") {
      this.itemList[index].dprice = (event.target.value * this.itemList[index].dscnt) / 100;
      this.itemList[index].dprice = this.testList[index].uprice - this.itemList[index].dprice;
      //this.itemList[index].dprice = this.itemList[index].fprice;
    }
    else if (this.itemList[index].dt == "S")
      this.itemList[index].dprice = this.itemList[index].uprice - this.itemList[index].dprice;
    //this.itemList[index].dprice = this.itemList[index].fprice;
  }

  changediscountpercentage(event: any, _id: any) {
    const index = this.itemList.findIndex((u) => u.clnT_SP_ID == _id);
    const percentage = event.target.value;
    this.itemList[index].dprice = (percentage * this.itemList[index].uprice) / 100;
    this.itemList[index].dprice = this.itemList[index].uprice - this.itemList[index].dprice;
    //this.itemList[index].dprice = this.itemList[index].fprice;
  }

  changediscountprice(event: any, _id: any) {
    const index = this.itemList.findIndex((u) => u.clnT_SP_ID == _id);
    const inputVal = parseFloat(event.target.value); // Convert input value to float
    this.itemList[index].dprice = inputVal;
    // Ensure the discount price is not greater than the original price
    if (inputVal > this.itemList[index].uprice) {
      Swal.fire({
        text: warning_alert_message
      });
      this.itemList[index].dprice = this.itemList[index].uprice
    }
    const discountAmount = this.itemList[index].uprice - inputVal;
    this.itemList[index].dscnt = (discountAmount / this.itemList[index].uprice) * 100;
  }

  ResetForm() {
    window.location.reload()
    localStorage.setItem('ResetForm', "true");
    this.isDisabled = false;
  }


  deleteRow(_id: any) {
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {

      this.itemList = this.itemList.filter(item => item.clnT_SP_ID !== _id);
      this.itemList.push();
    }
  }

  checkAlreadyExisting(event: any, id: number) {
    if (this.itemList.filter(x => x.code.trim() == event.target.value).length > 1) {
      event.target.value = "";
      Swal.fire({
        text: warningMessage,
      });
    }
    else {
      this.sp_services.GetSpecialPricesById(0, event.target.value).subscribe(
        (response: any) => {
          const index = this.itemList.findIndex((u) => u.clnT_SP_ID == id);
          this.response_ = response;
          this.itemList[index] = response as specialpricesModel;
          this.itemList[index].cn = this.toclientId;
          this.itemList[index].IsAdd = false;
          this.itemList[index].IsEdit = true;
          this.itemList[index].code = this.response_.code;
          this.itemList[index].name = this.response_.name;
          this.itemList[index].clnT_SP_ID = this.itemList[this.itemList.length - 1].clnT_SP_ID + 1;
        },
        (error) => {
          console.error('error caught in component')
          const status = error.status;
          if (status === 400) {
            this._commonAlertService.errorMessage();
          }
        });
    }
  }
}
