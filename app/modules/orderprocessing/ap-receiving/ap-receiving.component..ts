import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Subject, flatMap } from 'rxjs';
import { amendMessage, BAD_REQUEST_ERROR_MESSAGE, deleteErrorMessage, errorMessage, firstRecord, lastRecord, releaseMessage, saveMessage, successMessage, updateSuccessMessage, validateMessage, verifyMessage, warningMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Modal } from 'bootstrap';

import { mnModel } from 'src/app/models/mnModel';
import { AnatomicpathologyService } from '../../Clinical_module/anatomic-pathology/add-pathology/anatomic-pathology.service';
import { AnatomicPathologyReceivingService } from './ap-receivingservice';
import { OrderentryService } from '../orderentry/add-orderentry/orderentry.service';

import { userflModel, userJobTypeModel } from 'src/app/models/userflModel';
import { pathFindingModel } from 'src/app/models/pathFindingModel';
import { clinicalFindingModel } from 'src/app/models/clinicalFindingModel';
import { anatomicModel } from 'src/app/models/anatomicModel';
import { apreceivingmodel } from 'src/app/models/apreceivingmodel';
import { AuthService } from '../../auth/auth.service';
import { data } from 'jquery';
import { SiteService } from '../../masters/site/sites.service';
import { UserService } from '../../system/users/users.service';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-anatomicpathology-receiving.component',
  templateUrl: './ap-receiving.component.html',
  styleUrls: ['./ap-receiving.component.scss']

})

export class APReceivingComponent {
  form: FormGroup;
  accn: string = '';
  apReceivingData: apreceivingmodel = new apreceivingmodel();
  apReceivingAllData: apreceivingmodel[] = [];
  filteredRecord: apreceivingmodel;
  userAllData: userJobTypeModel[] = [];
  userData: userflModel = new userflModel();
  jobType: any[] = [];
  clinicalAllData: clinicalFindingModel[] = [];
  jobTypeDropDown: Array<{ fulL_NAME: string, useR_ID: string }> = [];
  selectedJobType: string | null = null;
  submitted = false;
  searchTerm: string = '';
  //Pagination 
  pathAllData: any[] = []; // Full data set
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizes = [5, 10, 25, 50];

  isAddSpecimenSource: boolean = true
  userId: string;
  selectedSite: string | null = null;
  filteredList: pathFindingModel[] = [];
  currentFilter: string = '';
  datePipe: any;
  loginTime: any;
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';
  isSubmitBtnActive: boolean = true;

  constructor(private formBuilder: FormBuilder,
    private _apReceivingService: AnatomicPathologyReceivingService, public _commonAlertService: CommonAlertService,
    private _anatomicpathologyService: AnatomicpathologyService, private _siteService: SiteService, private _commonService: CommonService,
    public _userService: UserService,
    private _authService: AuthService) {
    this.form = this.formBuilder.group({
      orD_NO: new FormControl(),
      reQ_CODE: new FormControl(),
      accn: new FormControl(),
      clN_IND: new FormControl(),
      pthgsT_NAM: new FormControl(),
      mdl: new FormControl(),
      paT_ID: new FormControl(),
      paT_NAME: new FormControl(),
      drawN_DTTM: this.addHours(new Date(), 3).toISOString().substring(0, 16),
      prcvD_ID: new FormControl(),
      prcvD_DTTM: this.addHours(new Date(), 3).toISOString().substring(0, 16),
    });
    // this.apReceivingData.prcvD_DTTM = this.getCurrentDateTime();
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.userId = this._authService.getuserId();
    this.selectedSite = this._authService.getSiteNo();
    this.assignJobTypeToUser();
    this.getAllAPReceivingData();
    this.form = this.formBuilder.group({
      fulL_NAME: ['', Validators.required]
    });
    this.getAllPathFinding('T');
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.OderProcessing_ApReceiving, this.startTime, this.endTime);
  }

  assignJobTypeToUser(): void {
    this._userService.getAllUser().subscribe({
      next: (res) => {
        // Filter users to only include those with jobcd = 'PG'
        this.userData = res.filter(user => user.joB_CD === 'PG');
        if (this.userAllData.length === 0) {
          this.userData.fulL_NAME = '';
        }
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.userAllData = []; // Ensure userData is an empty array on error
      }
    });
  }

  getAllAPReceivingData() {
    this._apReceivingService.getAllAPReceiving().subscribe(res => {
      this.apReceivingAllData = res; // 
      this.apReceivingData = res; //    
      this.apReceivingData.prcvD_DTTM = this.formatDate(new Date());
    },
      (error) => {
        console.error('Error loading Site list:', error);
      })
  }

  getAllPathFinding(axisType: string) {
    this._anatomicpathologyService.getAllPathFindingsByAxisType(axisType).subscribe(res => {
      this.pathAllData = res; // 
      this.filteredList = [...this.pathAllData];
    },
      (error) => {
        console.error('Error loading Site list:', error);
      })
  }

  findTAxis() {
    const isolModal = document.getElementById('taxismodel') as HTMLElement;
    const myModal = new Modal(isolModal);
    myModal.show();
    this.currentFilter = 'T';
    this.getAllPathFinding('T');
  }

  // Search based on T & M-Axis Data
  searchAllFindings() {
    this.pathAllData = [...this.filteredList];
    const searchText = this.searchTerm.toLowerCase().trim();
    if (this.pathAllData[0].ax.toUpperCase() === 'T') {
      this.pathAllData = this.pathAllData.filter(item =>
        item.aX_NMBR.toLowerCase().includes(searchText) ||
        item.t_Description.toLowerCase().includes(searchText)
      );
    }
  }

  onJobTypeChange(event): void {
    this.selectedJobType = event.target.value;
    this.form.controls['fulL_NAME'].setValue(event.target.value);
  }

  addHours(date: Date, hours: number) {
    const hoursToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date;
  }

  // onReset(event: any) {
  //   if (event.target.value === '') {
  //     this.isAddSpecimenSource = true;
  //   }
  //   else {
  //     this.filterRecordByAccnNo(event.target.value);
  //   }
  // }

  filterRecordByAccnNo(accnNo: string): void {
    if (accnNo) {
      this._apReceivingService.getAPReceivingByAccessionNumber(accnNo).subscribe({
        next: (res) => {
          this.apReceivingData = res;
          if (res.paT_ID && res.orD_NO) {
            this.isAddSpecimenSource = false;
            if (this.apReceivingData && this.apReceivingData.prcvD_DTTM) {
              this.apReceivingData.prcvD_DTTM = this.formatDateTime(this.apReceivingData.prcvD_DTTM);
            }
            this.loadJobTypes(this.apReceivingData.pthgsT_NAM);
            this.filterRecordByTAxisAccnNo(accnNo);
            if (this.selectedJobType === '') {
              this.isSubmitBtnActive = true;
            }
            else{
              this.isSubmitBtnActive = false;
            }
          }
          else {
            Swal.fire({
              text: `Accession number [ '${accnNo}' ] not found!`,
            });
          }
        },
      });
    } else {
      Swal.fire({
        text: "Please enter the accession number!",
      });
      this.isAddSpecimenSource = true;
    }
  }

  loadJobTypes(pathname: string): void {
    this._userService.getAllUserJobType().subscribe({
      next: (data) => {
        // Process and filter job types
        const filteredJobTypes = data
          .filter(jobType => jobType.joB_CD === 'PG' && jobType.fulL_NAME)
          .map(jobType => {
            jobType.fulL_NAME = jobType.fulL_NAME.trim();
            return jobType;
          });

        this.jobTypeDropDown = filteredJobTypes;

        // Log job type dropdown to verify data
        // console.log('Job Type Dropdown:', this.jobTypeDropDown);

        if (pathname) {
          const matchingJobType = filteredJobTypes.find(job => job.fulL_NAME === pathname.trim());
          if (matchingJobType) {
            this.selectedJobType = `${matchingJobType.fulL_NAME}`;
          } else {
            this.selectedJobType = null; // Handle as needed if not found
          }
        }
        // console.log('Selected Job Type:', this.selectedJobType);
      },
      error: (err) => {
        console.error('Error loading job types:', err);
        this.jobTypeDropDown = []; // Clear the dropdown on error
      }
    });
  }

  // Optional: Format the date-time if needed
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const currentDate = new Date();

    // Check if the date is the current date
    const isCurrentDate = date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getDate() === currentDate.getDate();

    // Add 5 hours and 30 minutes only if it is the current date
    if (isCurrentDate) {
      date.setHours(date.getHours() + 5);
      date.setMinutes(date.getMinutes() + 30);
    }

    // Format the date as 'yyyy-MM-ddTHH:mm'
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T` +
      `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
  }


  // Method to format the date 
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month as a number (1-12) with leading zero
    const year = date.getFullYear(); // Year
    const hours = String(date.getHours()).padStart(2, '0'); // Hours with leading zero
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes with leading zero
    const receivingDate = `${day}:${month}:${year} ${hours}:${minutes}`;
    this.apReceivingData.prcvD_DTTM = receivingDate;
    return this.apReceivingData.prcvD_DTTM;
  }

  filterRecordByTAxisAccnNo(accnNo: string): void {
    const trimmedAccnNo = accnNo.replace(/-/g, ""); // Trim the accn number if necessary
    this._anatomicpathologyService.getClinicalFindingByAccessionNumber(trimmedAccnNo).subscribe({
      next: (res) => {
        this.clinicalAllData = res;
        if (this.clinicalAllData) {
          this.clinicalAllData = res; // Assign the filtered data
        } else {
          console.error('No matching TAxis records found for the provided accession number:', trimmedAccnNo);
          this.clinicalAllData = []; // Clear the data if no matches found
        }
      },
      error: (err) => {
        console.error('Error loading TAxis by accession number:', err);
        this.clinicalAllData = []; // Clear the grid on error
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  onRoleChange(event: string): void {
    if (event === undefined) {
      this.isSubmitBtnActive = true;
    }
    const [fulL_NAME, useR_ID] = event.split('|');
    this.apReceivingData.pthgsT_NAM = fulL_NAME || ''; // Store full name
    this.apReceivingData.prcvD_ID = useR_ID || ''; // Store userId in the appropriate field  
    this.selectedJobType = fulL_NAME;
    if (this.selectedJobType != '') {
      // Update submit button state
      this.updateSubmitButtonState();
    }
  }

  // Method to update the submit button state based on current selection
  private updateSubmitButtonState(): void {
    this.isSubmitBtnActive = !this.selectedJobType; // Disable if empty
  }

  inserclinicalData(item: pathFindingModel) {
    const orderNO = this.apReceivingData.orD_NO;
    const accnNo = this.apReceivingData.accn;
    if (orderNO && accnNo && item.ax === 'T') {
      // Assign values to the item
      item.orD_NO = orderNO;
      item.accn = accnNo;
      item.m_Description = '';
      this._anatomicpathologyService.addPathFinding(item).subscribe({
        next: (res) => {
          if (res.status === 200) {
            this._commonAlertService.successMessage();
            this.filterRecordByTAxisAccnNo(item.accn);
          } else {
            this._commonAlertService.errorMessage();
            console.error('Unexpected response status:', res.status);
          }
        },
        error: (err) => {
          this._commonAlertService.errorMessage();
          console.error('Error inserting data:', err);
        }
      });
    } else {
      Swal.fire({
        text: 'Invalid data or operation',
      });
      console.error('Invalid data or operation');
    }
  }

  reset() {
    this.apReceivingData.sno = 0;
    this.apReceivingData.mdl = '';
    this.apReceivingData.paT_ID = '';
    this.apReceivingData.paT_NAME = '';
    this.apReceivingData.sect = ''; 
  }

  onAbort() {
    // Clear the below fields
    this.selectedJobType = null;
    this.selectedJobType = '';
    this.apReceivingData.paT_ID = '';
    this.apReceivingData.paT_NAME = '';
    this.apReceivingData.clN_IND = '';
    this.apReceivingData.drawN_DTTM = '';
    this.apReceivingData.prcvD_DTTM = '';

  }

  onSubmit() {
    if (this.apReceivingData.accn != null) {
      // Fallback to empty string if undefined
      this.apReceivingData.pthgsT_NAM = this.apReceivingData.pthgsT_NAM;
      this.apReceivingData.prcvD_ID = this.apReceivingData.prcvD_ID;
      this.apReceivingData.sitE_NO = this.selectedSite;
      this.apReceivingData.prcvD_DTTM = this.apReceivingData.prcvD_DTTM;
      this.apReceivingData.u_ID = this.userId;
      this.isSubmitBtnActive = false;
      this.reset();
      Swal.fire({
        title: 'Confirmation',
        text: 'Do you want to submit?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this._apReceivingService.updateAPReceiving(this.apReceivingData).subscribe(
            (response) => {
              if (response.status === 200 || response.status === 204) {
                this._commonAlertService.updateMessage();
              }
              this.filterRecordByAccnNo(this.apReceivingData.accn);
              this.loadJobTypes(this.apReceivingData.pthgsT_NAM);
              this.isSubmitBtnActive = true;
            },
            (error) => {
              const status = error.status;
              if (status === 409) {
                this._commonAlertService.warningMessage();
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            text: 'Not amended by the User!!!.',
          });
        }

      });
    }
  }

  deleteRow(_id: any) {
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._anatomicpathologyService.deletePathAxis(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.clinicalAllData = this.clinicalAllData.filter(item => item.clncfndG_ID !== _id);
            this.clinicalAllData.push();
            this.filterRecordByAccnNo(this.apReceivingData.accn);
            this._commonAlertService.deleteErrorMessage();
          }
        },
        (error) => {
          console.error('error caught in component', error)
          const status = error.status;
          if (status === 400) {
            this._commonAlertService.badRequestMessage();
          }
        });
    }
  }

  resetSearch() {
    this.searchTerm = '';
    this.pathAllData = [...this.filteredList];
    setTimeout(() => {
    }, 100); // 1000 milliseconds = 1 second (adjust as needed)
  }

  get totalPages(): number {
    return Math.ceil(this.pathAllData.length / this.itemsPerPage);
  }

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.pathAllData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get pagesArray(): number[] {
    if (this.totalPages <= 5) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const pages: number[] = [];
    const isStart = this.currentPage <= 3;
    const isEnd = this.currentPage >= this.totalPages - 2;

    if (isStart) {
      pages.push(1, 2);
      if (this.totalPages > 3) {
        pages.push(3, 4, 5);
      }
    } else if (isEnd) {
      pages.push(this.totalPages - 4, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages);
    } else {
      pages.push(this.currentPage - 2, this.currentPage - 1, this.currentPage, this.currentPage + 1, this.currentPage + 2);
    }

    return pages;
  }

  goToPreviousPage(event: Event) {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(event: Event) {
    event.preventDefault();
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(event: Event, page: number) {
    event.preventDefault();
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(event: Event) {
    const newSize = +(event.target as HTMLSelectElement).value;
    this.itemsPerPage = newSize;
    this.currentPage = 1; // Reset to the first page when page size changes
  }
}