import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Modal } from 'bootstrap';
import { Subject } from 'rxjs';
import { mbListSearchModel, microbiologyListModel } from 'src/app/models/microbiologyListModel';
import { microbiologyModel } from 'src/app/models/microbiologyModel';
import { CytogeneticsService } from '../add-cytogenetics/cytogenetics.service';
import { Router } from '@angular/router';
import { cgListSearchModel, cytogeneticModel } from 'src/app/models/cytogeneticModel';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-list-cytogenetics',
  templateUrl: './list-cytogenetics.component.html',
  styleUrls: ['./list-cytogenetics.component.scss']
})
export class ListCytogeneticsComponent {
  mbListForm!: FormGroup;
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  errorMessage: any;
  resultstemplatesDropDown: any;
  submitted = false;
  IsDisabled = true;
  microBiologyListData: microbiologyListModel[] = [];
  firstDate = new Date();
  firstDateM60 = new Date(new Date().setDate(this.firstDate.getDate() - 60));
  lastDate = new Date(new Date().setDate(this.firstDate.getDate() + 1)); // new Date(this.firstDate.getFullYear(), this.firstDate.getMonth() + 1, 0);
  microbiologyData: cytogeneticModel = new cytogeneticModel();
  order_FDatetime: string = this.firstDateM60.getMonth().toString() + '/' + this.firstDateM60.getDate().toString() + '/' + this.firstDate.getFullYear().toString();
  order_TDatetime: string = (this.lastDate.getMonth() + 1).toString() + '/' + this.lastDate.getDate().toString() + '/' + this.lastDate.getFullYear().toString()
  siteno: string = ''; clientno: string = '';
  url = '';

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: microbiologyListModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;

  constructor(private _cytogeneticService: CytogeneticsService, private fb: FormBuilder,
    private router: Router) {
  }
  ngOnInit(): void {
    this.microBiologyListData = [];
    this.fillMBAllList();
    $('#btnlist').addClass("is-active");
    let orderFDate: Date = new Date(this.order_FDatetime);
    let orderTDate: Date = new Date(this.order_TDatetime);
    this.order_FDatetime = orderFDate.toISOString().slice(0, 10);
    this.order_TDatetime = orderTDate.toISOString().slice(0, 10);;
  }


  fillMBAllList() {
    try {
      const mbSearch = new cgListSearchModel();
      mbSearch.ordeR_FDTTM = this.order_FDatetime;
      mbSearch.ordeR_TDTTM = this.order_TDatetime;


      mbSearch.cn = this.clientno; mbSearch.sitE_NO = this.siteno;
      this._cytogeneticService.getAllCytogeneticsList(mbSearch).subscribe(x => {
        this.microBiologyListData = x;
        this.dtTrigger.next(null);
        this.filteredList = [...this.microBiologyListData];
        this.updatePagination();

      })
    } catch (e) {
      console.log(e);
    }
  }

  addHours(date: Date, hours: number) {
    const hoursToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date;
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.microBiologyListData.length / this.itemsPerPage);
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

  getClientNo(event: any) {
    this._cytogeneticService.GetCient(event.target.value)
      .subscribe({
        next: (res) => {
          document.getElementById("client").innerHTML = res.geT_CLNT_FL.client;
        },
        error: (err) => {
          document.getElementById("client").innerHTML = "";
          alert(err?.error.message);
        }
      })
    //}
  }

  View(_id: any) {
    localStorage.setItem('arfid', _id);
    this.url = '../clinical-module/Cytogenetics/addcytogenetics';
    this.router.navigate([this.url]);

  }

  showPatient(Id: any) {
    const isolModal = document.getElementById('patientModal') as HTMLElement;
    this.getCytogeneticsPatientData(Id);
    const myModal = new Modal(isolModal);
    myModal.show();
  }

  getCytogeneticsPatientData(Id: any) {
    this._cytogeneticService.getCytogeneticById(Id).subscribe(res => {
      this.microbiologyData = res;
    },
      (error) => {
        console.error('Error loading Cytogenetics Patient details:', error);
      })
  }

  calculateAge(dob: string | null): number | null {
    if (!dob) {
      return null;
    }
    const birthDate = this.parseDate(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // If dob format is DD/MM/YYYY, use this method to parse 
  parseDate(dob: string): Date {
    const parts = dob.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day); // Create Date object with corrected month and day
  }

}
