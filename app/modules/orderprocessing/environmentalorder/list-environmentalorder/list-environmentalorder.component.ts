import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';

import { Modal } from 'bootstrap';
//import DataTable from 'datatables.net-bs4';
//import { ArrowFunctionExpr } from '@angular/compiler';
import { cleanData } from 'jquery';
import { EnvironmentalorderService } from '../add-environmentalorder/environmentalorder.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AnatomicpathologyService } from 'src/app/modules/Clinical_module/anatomic-pathology/add-pathology/anatomic-pathology.service';
import { SortingComponent } from 'src/app/modules/pagination/sorting/sorting.component';
import { evFilterList } from 'src/app/models/environmentalOrderModel';
import { evSearchModel } from 'src/app/models/environemtalResult';
import { LoaderService } from 'src/app/modules/shared/services/loaderService';

@Component({
  selector: 'app-list-orderentry',
  //standalone: true,
  //imports: [CommonModule],
  templateUrl: './list-environmentalorder.component.html',
  styleUrls: ['./list-environmentalorder.component.scss'],
})
export class ListEnvironmentalorderComponent implements OnInit {

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 50;
  pageSizeOptions: number[] = [50, 100, 150]; // Add page size options
  isPending = true;
  totalItems: number;
  pageChange: any;
  sortColumn: string = '';
  sortDirection: string = 'asc';
  evOrderList = [];
  url = '';
  patientData: any;

  sampleIdFilter: string = '';
  sampleNameFilter: string = '';
  cnFilter: string;
  clientFilter: string = '';
  reqCodeFilter: string = '';
  orderDtmFilter: string;
  refDateFilter: string = '';
  pendingFilter: string;
  pendingDays: string = '30';



  filteredList: evFilterList[] = [];

  constructor(private fb: FormBuilder, private router: Router,
    private _anatomicpathologyService: AnatomicpathologyService,
    private environmentalorderService: EnvironmentalorderService,
    private sortingService: SortingComponent,
    private _loaderService: LoaderService) {

  }

  filterVisibility = {
    sampleId: false,
    sampleName: false,
    cn: false,
    vc: false,
    ordertype: false,
    client: false,
    reqCode: false,
    orderDtm: false,
    refDate: false,
    pending: false,
  };
  ngOnInit(): void {
    this.getEVOrderList();
    $('#btnlistenvironmental').addClass('is-active');
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
    this.evOrderList = this.sortingService.sortData(
      [...this.evOrderList],
      column,
      this.sortDirection
    );
  }

  getEVOrderList(pendingDays: number = 30) {
    this._loaderService.show();

    this.environmentalorderService.getEnvironmentalOrderList(pendingDays, this.isPending).subscribe(res => {
      this._loaderService.hide();
      this.filteredList = res;
      if (res.length > 0) {
        this.evOrderList = res;
        this.updatePagination();
      }
      else {
        this.evOrderList = [];
      }
    },
      (error) => {
        this._loaderService.hide();
        console.error('Error loading TD :', error);
      })
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.evOrderList.length / this.itemsPerPage);
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

  viewEVOrder(id: any) {
    // Store the sample_ID in local storage
    localStorage.setItem('sample_ID', id);

    // Navigate to the AddEnvironmentalOrder tab
    this.url = '../orderprocessing/environmentalorders/AddEnvironmentalOrder';
    this.router.navigate([this.url], { queryParams: { tab: 'AddEnvironmentalOrder' } });
  }


  showEVOrder(obj: any) {
    if (obj) {
      // Fetch patient data based on the ID
      this.getPatientData(obj);
    } else {
      console.warn('No patient ID found in local storage or passed as argument.');
      // Optionally, handle this case, like showing an error message or alert.
    }
  }

  getPatientData(obj: any) {
    const record = new evSearchModel();
    record.accn = obj.accn;
    record.orD_NO = obj.orD_NO;
    record.tcode = obj.reQ_CODE;
    this.environmentalorderService.getEVOrderPatientDetails(record).subscribe(res => {
      this.patientData = res[0];
      const isolModal = document.getElementById('patientModal') as HTMLElement;

      // Check for patient ID in local storage
      const storedPatientId = localStorage.getItem('sample_ID');

      // If local storage has a value, prioritize it; else use the passed Id
      const patientId = storedPatientId ? storedPatientId : obj.samplE_ID;

      if (patientId) {
        // Show the modal
        const myModal = new Modal(isolModal);
        myModal.show();
      } else {
        console.warn('No patient ID found in local storage or passed as argument.');
        // Optionally, handle this case, like showing an error message or alert.
      }
    },
      (error) => {
        console.error('Error loading Patient details:', error);
      })
  }

  orderPendingColor(pending: string) {
    var status = "";
    var value = parseInt(pending, 0);
    switch (true) {
      case (value >= 8 && value <= 11):
        status = "orange";
        break;
      case (value > 11):
        status = "red";
        break;

      default:
        status = "green";
    }

    return status;
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

  // Perform your Filter logic
  isFilterVisible(): boolean {
    return Object.values(this.filterVisibility).some((visible) => visible);
  }

  toggleFilter(filter: string) {
    this.filterVisibility[filter] = !this.filterVisibility[filter];
  }
  reFreshbtn() {
    var days = parseInt(this.pendingDays);
    if (this.pendingDays != '') {
      this.getEVOrderList(days);
    }
    else {
      this.getEVOrderList(0);
    }

  }
  applyFilters() {
    let filteredData = [...this.filteredList]; // Start with the full list of data

    // Apply Sample ID filter
    if (this.sampleIdFilter) {
      filteredData = filteredData.filter(item =>
        item.samplE_ID && item.samplE_ID.toString().toLowerCase().includes(this.sampleIdFilter.toLowerCase())
      );
    }

    if (this.sampleNameFilter) {
      filteredData = filteredData.filter(item =>
        item.samplE_NAME && item.samplE_NAME.toString().toLowerCase().includes(this.sampleNameFilter.toLowerCase())
      );
    }
    if (this.sampleNameFilter) {
      filteredData = filteredData.filter(item =>
        item.samplE_NAME && item.samplE_NAME.toString().toLowerCase().includes(this.sampleNameFilter.toLowerCase())
      );
    }
    if (this.cnFilter) {
      filteredData = filteredData.filter(item =>
        item.cn && item.cn.toString().toLowerCase().includes(this.cnFilter.toLowerCase())
      );
    }
    if (this.clientFilter) {
      filteredData = filteredData.filter(item =>
        item.client && item.client.toString().toLowerCase().includes(this.clientFilter.toLowerCase())
      );
    }
    if (this.reqCodeFilter) {
      filteredData = filteredData.filter(item =>
        item.reQ_CODE && item.reQ_CODE.toString().toLowerCase().includes(this.reqCodeFilter.toLowerCase())
      );
    }
    if (this.orderDtmFilter) {
      filteredData = filteredData.filter(item =>
        item.ordeR_DTM && item.ordeR_DTM.toString().toLowerCase().includes(this.orderDtmFilter.toLowerCase())
      );
    }
    if (this.refDateFilter) {
      filteredData = filteredData.filter(item =>
        item.reF_DATE && item.reF_DATE.toString().toLowerCase().includes(this.refDateFilter.toLowerCase())
      );
    }
    if (this.pendingFilter) {
      filteredData = filteredData.filter(item =>
        item.pending && item.pending.toString().toLowerCase().includes(this.pendingFilter.toLowerCase())
      );
    }

    this.evOrderList = filteredData;
  }
}

