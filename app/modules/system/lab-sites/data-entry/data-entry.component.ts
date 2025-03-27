import { Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { siteModel } from 'src/app/models/siteModel';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { deleteErrorMessage, deleteMessage, errorMessage, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { Operation, PageName } from 'src/app/common/enums';
import { Observable } from 'rxjs';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { LabSiteService } from '../lab-sites.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { companyModel } from 'src/app/models/companyModel';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';


@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})

export class DataEntryComponent implements OnInit {
  @ViewChild('siteNoInput', { static: false }) siteNoInput!: ElementRef;
  siteData: siteModel = new siteModel();
  form: FormGroup;
  submitted = false;
  IsDisabled = true;
  operation = 0; // 0 means show, 1 means add,2 means edit, 3 means delete // make enum for operation
  siteAllData: siteModel[] = [];
  companyAllData: companyModel[] = [];
  selectedCompany: any;
  isEdit = false;
  isDelete = false;
  _id: any;
  refDropDown: any;
  refSecSiteDropDown: any;
  filteredSites: any[] = [];
  searchTerm: string = '';
  matchedSites: any[] = [];
  isNavigationActive: boolean = false;
  hit: number = 0;

  isAddBtnActive: boolean = false;
  isEditBtnActive: boolean = false;
  isDeleteBtnActive: boolean = false;
  isSaveBtnActive: boolean = true;
  isCancelBtnActive: boolean = true;

  matchedSites$!: Observable<siteModel[]>;
  selectedSite: siteModel | undefined; // Property to hold the selected site

  refSiteDisabled: boolean = true; // Initially disabled
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';
  siteIdFromRoute: number;
  isRefDropdownActive: boolean = true;
  isRefDropdownInActive: boolean = true;
  selected: string = '';
  isActive: boolean = false;

  quarterList = ['mobile 1', 'mobile 2', 'mobile 3'];
  DiscountMobileList = ['Discount Mobile 1', 'Discount Mobile 2', 'Discount Mobile 3'];
  paymentApprovalList = ['payment mobile 1', 'payment mobile 2', 'payment mobile 3'];
  clientApprovalList = ['client mobile 1', 'client mobile 2', 'client mobile 3'];

  isDropdownOpen: boolean = false;

  selectedQuarterList: string[] = [];
  selectedDiscountMobileList: string[] = [];
  selectedPaymentApprovalList: string[] = [];
  selectedClientApprovalList: string[] = [];
  isReadOnly: boolean = true;  // Default readonly state
  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  constructor(private formBuilder: FormBuilder, private _siteService: LabSiteService,
    public _commonAlertService: CommonAlertService, private el: ElementRef,
    private _commonService: CommonService, private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      selectedSite: new FormControl(),
      sitE_NO: [new FormControl(), Validators.required],
      sitE_NAME: [new FormControl(), Validators.required],
      abrv: new FormControl(),
      shortname: new FormControl(),
      aR_SITE_NAME: new FormControl(),
      sitE_TP: new FormControl(),
      reF_SITE: new FormControl(),
      reF_SITE_NAME: new FormControl(),
      reF_SITE_SECONDARY_NAME: new FormControl(),
      reF_SITE_S: new FormControl(),
      rcvD_COL: new FormControl(),
      city: new FormControl(),
      address: new FormControl(),
      tel: new FormControl(),
      mobile: new FormControl(),
      latitude: new FormControl(),
      longitude: new FormControl(),
      email: [new FormControl(), [Validators.email]],
      sno: new FormControl(),
      company: new FormControl(),
      selectedCompany: new FormControl()
    });
  }

  ngOnInit(): void {
    $('#addData').addClass("is-active");
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.bindData();
  }

  bindData(): void {
    this.getAllSiteData();
    this.checkSiteType();
    this.fillRefSecDropDown();
    this.companyDropdown();
  }

  ngAfterViewInit(): void {
    let hidearrow = document.getElementsByClassName('ng-arrow-wrapper')[0] as HTMLElement;
    hidearrow?.style.setProperty('Display', 'none')
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.System_LabSites, this.startTime, this.endTime);
  }

  assignTheData() {
    this.form.reset({
      sitE_NO: this.siteData.sitE_NO,
      sitE_NAME: this.siteData.sitE_NAME,
      abrv: this.siteData.abrv,
      shortname: this.siteData.shortname,
      aR_SITE_NAME: this.siteData.aR_SITE_NAME,
      sitE_TP: this.siteData.sitE_TP,
      reF_SITE: this.siteData.reF_SITE,
      reF_SITE_S: this.siteData.reF_SITE_S,
      reF_SITE_NAME: this.siteData.reF_SITE_NAME,
      reF_SITE_SECONDARY_NAME: this.siteData.reF_SITE_SECONDARY_NAME,
      rcvD_COL: this.siteData.rcvD_COL,
      city: this.siteData.city,
      address: this.siteData.address,
      tel: this.siteData.tel,
      mobile: this.siteData.mobile,
      latitude: this.siteData.latitude,
      longitude: this.siteData.longitude,
      email: this.siteData.email,
      sno: this.siteData.sno,
      cmpnY_NO: this.siteData.cmpnY_NO,
      company: this.siteData.company
    })
  };

  emptyTheForm() {
    const userIdValue = this.form.controls['sitE_NO'].value; // Store the current userID value
    this.form.reset({
      sitE_NO: '',
      sitE_NAME: '',
      abrv: '',
      shortname: '',
      aR_SITE_NAME: '',
      sitE_TP: '',
      reF_SITE: '',
      reF_SITE_S: '',
      reF_SITE_NAME: '',
      reF_SITE_SECONDARY_NAME: '',
      rcvD_COL: 0,
      city: '',
      address: '',
      tel: '',
      mobile: '',
      latitude: '',
      longitude: '',
      email: '',
      sno: '',
      company: '',
      selectedCompany: ''
    });
    // this.form.controls['sitE_NO'].setValue(userIdValue); // Restore the userID value
  }

  getAllSiteData(): void {
    // Retrieve siteId from local storage
    const siteId = localStorage.getItem('siteId')?.toString();

    this._siteService.getAllSite().subscribe(res => {
      this.siteAllData = res;
      this.matchedSites$ = this.getFilteredSites('');
      // If we have site data and a valid siteId from local storage
      if (this.siteAllData.length > 0 && siteId && siteId > "0") {
        this.siteData = this.siteAllData.find(x => x.sitE_DTL_ID == Number(siteId));

        // Clear siteId from local storage after it's used
        localStorage.removeItem('siteId');

        if (!this.siteData) {
          // If no matching site is found for the siteId, fallback to the last record
          this.siteData = this.siteAllData[this.siteAllData.length - 1];
          this.getRecord("last", this.siteAllData.length - 1);

        }

      } else {
        // If no valid siteId, fallback to the last site
        this.siteData = this.siteAllData[this.siteAllData.length - 1];
        this.getRecord("last", this.siteAllData.length - 1);
        this.filteredSites = [...this.siteAllData];
        // Clear the siteId from local storage just in case
        localStorage.removeItem('siteId');
      }
    },
      (error) => {
        console.error('Error loading Site list:', error);
      });
  }

  onDropdownClose() {
    this.isDropdownOpen = false;
  }

  determineSelectedList(event: any): string[] {
    if (this.quarterList.includes(event)) {
      return this.selectedQuarterList;
    } else if (this.DiscountMobileList.includes(event)) {
      return this.selectedDiscountMobileList;
    } else if (this.paymentApprovalList.includes(event)) {
      return this.selectedPaymentApprovalList;
    } else if (this.clientApprovalList.includes(event)) {
      return this.selectedClientApprovalList;
    }
    return [];
  }

  determineFullList(event: any): string[] {
    if (this.quarterList.includes(event)) {
      return this.quarterList;
    } else if (this.DiscountMobileList.includes(event)) {
      return this.DiscountMobileList;
    } else if (this.paymentApprovalList.includes(event)) {
      return this.paymentApprovalList;
    } else if (this.clientApprovalList.includes(event)) {
      return this.clientApprovalList;
    }
    return [];
  }

  updateSelectedList(selectedList: string[], fullList: string[], first: number, last: number) {
    selectedList.length = 0;
    selectedList.push(...fullList.filter(
      (_, index) => index >= first && (last < 0 || index <= last)
    ));
  }

  dropdownSettings = {
    singleSelection: false,
    idField: 'quarterId',
    textField: 'title',
    selectAllText: 'Select All',
    unSelectAllText: 'Clear selection',
    itemsShowLimit: 4,
    allowSearchFilter: false,
  };


  // Custom search function
  customSearch(term: string, item: siteModel): boolean {
    if (typeof term !== 'string') {
      // Handle non-string term, such as when event is passed as term
      return false;
    }
    term = term.toLowerCase();
    return item.sitE_NAME.toLowerCase().includes(term);
  }

  // Function to filter sites based on search term
  getFilteredSites(term: string): Observable<siteModel[]> {
    const filteredSites = this.siteAllData.filter(site =>
      this.customSearch(term, site)
    );
    return new Observable(observer => {
      observer.next(filteredSites);
      observer.complete();
    });
  }

  onSearch(event: any) {
    this.siteAllData = [...this.filteredSites];
    const filteredSites = this.siteAllData.filter(site =>
      this.customSearch(event, site)
    );
    return new Observable(observer => {
      observer.next(filteredSites);
      observer.complete();
    });
  }

  onSiteSelection(event: any, select: NgSelectComponent) {
    if (event.sitE_NAME !== undefined) {
      const selectedValue = event.sitE_NAME;
      const selectedSite = this.siteAllData.find(site => site.sitE_NAME === selectedValue);

      if (selectedSite) {
        this.siteData = selectedSite;
      } else {
        // Handle case where selectedSite is not found
      }
    } else {
      // Handle case where event or event.paT_NAME is undefined
      if (this.hit != 1) {
        this.getRecord("last", this.siteAllData.length - 1);
      }
    }
    select.handleClearClick();
    this.hit = 1;
  }

  companyDropdown() {
    this._siteService.getAllCompany().subscribe(res => {
      this.companyAllData = res;
      // Optionally, process privileges or display them in the UI
    });
  }

  onCompanyChange(event: any): void {
    if (!event) {
      this.siteData.cmpnY_NO = ''; // Clear cmpnY_NO if no selection
      this.siteData.company = '';
      return;
    }

    const selectedSite = this.companyAllData.find(c => c.cmP_DTLS_ID === event);

    if (selectedSite) {
      this.siteData.cmpnY_NO = '0' + selectedSite.cmP_DTLS_ID; // Ensure correct format
      this.siteData.company = selectedSite.company;
    } else {
      console.warn('Site not found for the selected ID:', event);
    }
  }


  fillrefDropDown() {
    this._siteService.getAllSite().subscribe(labSites => {
      // Filter labSites to only include sites where site_tp is 'LS'
      this.refDropDown = labSites.filter(site => site.sitE_TP === 'LS');
    });
  }

  fillRefSecDropDown() {
    this._siteService.getAllSite().subscribe(labSites => {
      this.refSecSiteDropDown = labSites.filter(site => site.sitE_TP === 'LS');

    });
  }

  // get refSiteDisplay(): string {
  //   if (this.siteData.sitE_TP === 'CS' || this.siteData.sitE_TP === 'FS') {
  //     return `${this.siteData.reF_SITE} - ${this.siteData.reF_SITE_NAME}`;
  //   } else if (this.siteData.sitE_TP === 'LS') {
  //     return `${this.siteData.reF_SITE} - ${this.siteData.sitE_NAME}`;
  //   }
  //   else {
  //     return null;
  //   }
  // }

  // get refSiteSecondaryDisplay(): string {
  //   const secondarySite = this.siteAllData?.find(s => s.reF_SITE === this.siteData.reF_SITE_S);
  //   const secondarySiteName = secondarySite ? `${this.siteData.reF_SITE_S} - ${secondarySite.sitE_NAME}` : (this.siteData.reF_SITE_S ? `${this.siteData.reF_SITE_S}` : '');
  //   return `${secondarySiteName}`;
  // }

  onSiteChange(event: any): void {
    // Find the site object based on the selected site_dtl_id 
    const selectedSite = this.refDropDown.find(site => site.reF_SITE === event);
    // If the site is found, map the reF_SITE value
    if (selectedSite) {
      this.siteData.reF_SITE = selectedSite.reF_SITE;
    } else {
      console.warn('Site not found for the selected ID:', event);
    }
  }

  onSecSiteChange(event: any): void {
    if (!event) {
      this.siteData.reF_SITE_S = ''; // Clear value if no selection
      this.siteData.reF_SITE_SECONDARY_NAME = '';
      return;
    }
  
    const selectedSite = this.refSecSiteDropDown.find(site => site.reF_SITE === event);
  
    if (selectedSite) {
      if (this.siteData.sitE_TP === 'LS') {
        this.siteData.reF_SITE_S = selectedSite.reF_SITE;
      } else {
        this.siteData.reF_SITE_S = selectedSite.reF_SITE;
      }
    } else {
      this.siteData.reF_SITE_S = ''; // Ensure it doesn't keep an invalid value
    }
  }
  

  onTypeChange(): void {
    const { sitE_TP, sitE_DTL_ID, sitE_NAME } = this.siteData;

    // Handle 'LS' type when not adding
    if (!this.isAddBtnActive && sitE_TP === 'LS') {
      this.isReadOnly = true;
      this.siteData.reF_SITE = ''; // Clear ref site for LS when not adding
      return; // Early return to prevent further checks
    }

    // Handle editable types 'FS' and 'CS'
    if (sitE_TP === 'FS' || sitE_TP === 'CS') {
      this.isReadOnly = false;
      this.fillrefDropDown(); // Populate dropdown options
      this.siteData.reF_SITE = ''; // Clear ref site for editable types
      return; // Early return to prevent further checks
    }

    // Handle 'LS' type when editing
    if (sitE_TP === 'LS' && !this.isEditBtnActive) {
      this._siteService.getSiteById(sitE_DTL_ID).subscribe(
        res => {
          const refSite = res.reF_SITE; // Get ref site from response
          this.siteData.reF_SITE = refSite ? `${refSite} - ${sitE_NAME}` : this.siteData.reF_SITE; // Update ref site
          this.isRefDropdownActive = true; // Activate dropdown
          this.refDropDown = []; // Clear dropdown options
          this.isReadOnly = true; // Set to read-only for LS
        },
        error => {
          console.error('Error fetching site data:', error); // Error handling
        }
      );
    }
  }

  toggleReadonlyState(isEditable: boolean) {
    // Loop through all form controls
    for (const controlName in this.form.controls) {
      if (this.form.controls.hasOwnProperty(controlName)) {
        const control = this.form.get(controlName);

        // Always enable 'selectedSite' by default
        if (controlName === 'selectedSite') {
          control?.enable();
        } else {
          // Enable or disable other controls based on isEditable
          if (isEditable) {
            control?.enable();
          } else {
            control?.disable();
          }
        }
      }
    }
  }


  onAddRecord() {
    this.siteData.reF_SITE = '';
    this.siteData.sitE_NO = '';
    this.IsDisabled = false;
    this.toggleReadonlyState(true);
    this.operation = Operation.add;
    this.isSaveBtnActive = false;
    this.isCancelBtnActive = false;
    this.isEditBtnActive = true;
    this.isDeleteBtnActive = true;
    this.isNavigationActive = true;
    this.emptyTheForm();
    setTimeout(() => {
      this.el.nativeElement.querySelector('#siteNo').focus();
    }, 500);
    this.isNavigationActive = true;
  }

  // Method to check if dropdown should be disabled based on 'siteData.sitE_TP'
  checkSiteType() {
    //console.log('Site Type:', this.siteData.sitE_TP); // Debugging line
    if (this.siteData.sitE_TP === 'CS' || this.siteData.sitE_TP === 'FS') {
      this.isReadOnly = false;  // Enable dropdown if site type is 'CS'
    } else if (this.siteData && this.siteData.sitE_TP === 'LS') {
      this.isReadOnly = true;   // Keep it readonly for 'LS'
    }
  }

  onEditRecord() {
    this.toggleReadonlyState(true);
    this.isAddBtnActive = true;
    this.IsDisabled = false;
    this.isEdit = true;
    this.assignTheData();
    this.operation = Operation.edit;
    this.checkSiteType();
    this.isNavigationActive = true;
    this.isSaveBtnActive = false;
    this.isCancelBtnActive = false;
  }

  isDisableDropDownOnEdit() {
    let isdisablebutton = true;
    switch (this.operation) {
      case Operation.edit:
      case Operation.add:
        isdisablebutton = false;
        break;
      case Operation.view:
      case Operation.submit:
      case Operation.cancel:
        isdisablebutton = true;
        break;
      default:
        isdisablebutton = false;
        return isdisablebutton;
    }
    return isdisablebutton;
  }

  onSubmit() {
    this.AssignTheValueUsingFormControl();
    this.assignTheData();
    this.submitted = true;
    this.operation = Operation.submit;
    this.IsDisabled = true;
    // if (this.form.invalid) {
    //   return;
    // }
    if (!this.isEdit) {
      this.isSaveBtnActive = false;
      this.isCancelBtnActive = false;
      this.isEditBtnActive = true;
      this.isDeleteBtnActive = false;
      this.isNavigationActive = false;
      this.Add();
    }
    else {
      this.Update(this.siteData)
    }
  }

  onCancelRecord(sitE_DTL_ID: number) {
    this.isAddBtnActive = false;
    if (this.isEdit) {
      let index = this.siteAllData.findIndex(x => x.sitE_DTL_ID == sitE_DTL_ID);
      this.siteData = this.siteAllData[index];
      this.assignTheData();
      this.operation = Operation.cancel;
      this.IsDisabled = true;
      this.isEdit = false;
      this.isCancelBtnActive = true;
      this.isSaveBtnActive = true;
      this.isAddBtnActive = false;
      this.isNavigationActive = false;
      this.toggleReadonlyState(false);
    }
    else {
      this.emptyTheForm();
      this.isAddBtnActive = false;
      this.isEditBtnActive = false;
      this.isDeleteBtnActive = false;
      this.isCancelBtnActive = true;
      this.isNavigationActive = false;
      this.getAllSiteData();
    }
  }

  checkAlreadyExisting(event: any) {
    const inputSiteNo = event.target.value;
    this._siteService.getAllSite().subscribe(res => {
      this.siteAllData = res;
      const duplicateCount = this.siteAllData.filter(x => x.sitE_NO === inputSiteNo).length;
      if (duplicateCount >= 1) {
        this._commonAlertService.warningMessage();
        event.target.value = ''; // Clear input value
      }
    },
      (error) => {
        console.error('Error loading Site list:', error);
      });
  }

  getSiteDetailById(siteId: number) {
    this._siteService.getSiteById(siteId).subscribe(data => {
      this.siteData = data as siteModel
    })
    localStorage.removeItem('siteId');
  }


  toggleDefaultSpecimen(event: Event) {
    const target = event.target as HTMLInputElement;
    this.siteData.rcvD_COL = target.checked ? 1 : 0;
  }

  AssignTheValueUsingFormControl() {
    this.siteData.rcvD_COL = this.form.get('rcvD_COL')?.value;
    // this.siteData.reF_SITE = this.form.get('reF_SITE')?.value;

    //if (this.siteData.reF_SITE_NAME == '' || this.form.invalid) {
    // let sitedata = this.siteData.reF_SITE.split("-");
    // this.siteData.reF_SITE = sitedata[0].replace(/\s/g, "");
    // let removeFirstElement = sitedata.slice(1);
    // this.siteData.reF_SITE_NAME = removeFirstElement?.join();
    // if (this.operation == Operation.add) {

    // this.siteData.reF_SITE = this.siteData.reF_SITE.split("-")[0].replace(/\s/g, "");
    // }
    //}
  }

  Add() {   
    if (this.siteData.sitE_NO && this.siteData.sitE_NAME) {
      
      // Reset fields to prevent unintended values
      this.siteData.cmpnY_NO = this.siteData.company ? this.siteData.cmpnY_NO : '';
      this.siteData.reF_SITE_S = this.siteData.reF_SITE_SECONDARY_NAME ? this.siteData.reF_SITE_S : '';
  
      this._siteService.addSite(this.siteData).subscribe(response => {
        if (response.status === 200 || response.status === 204) {
          this._commonAlertService.successMessage();
        }
        
        this.getAllSiteData();
        this.toggleReadonlyState(false);
        this.isAddBtnActive = false;
        this.isEditBtnActive = false;
        this.isCancelBtnActive = true;
        this.isSaveBtnActive = true;
        this.IsDisabled = true;
  
      }, error => {
        if (error.status === 409) {
          this._commonAlertService.warningMessage();
        }
      });
  
      this.toggleReadonlyState(true);
    }
  }
  

  Update(updatedata: siteModel) {
    if (this.siteData.rcvD_COL) {
      this.siteData.rcvD_COL = 1;
    } else {
      this.siteData.rcvD_COL = 0;
    }
    if (this.siteData.sitE_NO && this.siteData.sitE_NAME)
      this._siteService.updateSite(updatedata).subscribe(
        (response) => {
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
          }
          this.toggleReadonlyState(false);
          this.isAddBtnActive = false;
          this.isNavigationActive = false;
          this.IsDisabled = false;
          this.isSaveBtnActive = true;
          this.isCancelBtnActive = true;
          // this.refSiteDisplay;
          // this.refSiteSecondaryDisplay;
        },
        (error) => {
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          }
        });
    this.toggleReadonlyState(true);
    this.IsDisabled = false;
  }

  onDeleteRecord(_id: number) {
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._siteService.deleteSite(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.siteAllData = this.siteAllData.filter(item => item.sitE_DTL_ID !== _id);
            this.siteAllData.push();
            this.getRecord('last', -1);
            this._commonAlertService.deleteMessage();
          }
        },
        (error) => {
          console.error('error caught in component')
          const status = error.status;
          if (status === 400) {
            this._commonAlertService.deleteErrorMessage();
          }
        });
    }
  }

  getRecord(input: any, SNO: number) {
    let totalNumberOfRec = this.siteAllData.length;
    if (input == 'first') {
      if (SNO === 1) {
        Swal.fire({
          text: "You are already at the first record.",
        })
      } else {
        this.siteData = this.siteAllData[0];
      }
    }
    else if (input == 'prev' && SNO != 1) {
      const prevRecord = this.siteAllData.find(x => x.sno == (SNO - 1));
      if (prevRecord) {
        this.siteData = prevRecord;
      }
    }
    else if (input == 'next' && totalNumberOfRec > SNO) {
      const nextRecord = this.siteAllData.find(x => x.sno == (SNO + 1));
      if (nextRecord) {
        this.siteData = nextRecord;
      }
    }
    else if (input == 'last') {
      if (SNO === totalNumberOfRec) {
        Swal.fire({
          text: "You are already at the last record.",
        })
      } else {
        const lastRecord = this.siteAllData.find(x => x.sno == totalNumberOfRec);
        if (lastRecord) {
          this.siteData = lastRecord;
          this.toggleReadonlyState(false);
        }
      }
    }
  }

  calculateCurrentIndex(currentSNO: number): number {
    let currentIndex = this.siteAllData.findIndex(x => x.sno === currentSNO);
    return currentIndex + 1; // Start index is one-based
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}