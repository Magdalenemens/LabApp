import { Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { siteModel } from 'src/app/models/siteModel';
import { SiteService } from './sites.service';
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
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})

export class SitesComponent implements OnInit {
  @ViewChild('siteNoInput', { static: false }) siteNoInput!: ElementRef;
  siteData: siteModel = new siteModel();
  form: FormGroup;
  submitted = false;
  IsDisabled = true;
  operation = 0; // 0 means show, 1 means add,2 means edit, 3 means delete // make enum for operation
  siteAllData: siteModel[] = [];
  isEdit = false;
  isDelete = false;
  _id: any;
  refDropDown: any;
  filteredSites: any[] = [];
  searchTerm: string = '';
  matchedSites: any[] = [];
  isNavigationActive: boolean = false;

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

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  constructor(private formBuilder: FormBuilder, private _siteService: SiteService, public _commonAlertService: CommonAlertService,
    private el: ElementRef, private _commonService: CommonService) {
    this.form = this.formBuilder.group({
      sitE_NO: [new FormControl(), Validators.required],
      sitE_NAME: [new FormControl(), Validators.required],
      shortname: new FormControl(),
      aR_SITE_NAME: new FormControl(),
      sitE_TP: new FormControl(),
      reF_SITE: new FormControl(),
      reF_SITE_NAME: new FormControl(),
      rcvD_COL: new FormControl(),
      city: new FormControl(),
      address: new FormControl(),
      tel: new FormControl(),
      mobile: new FormControl(),
      latitude: new FormControl(),
      longitude: new FormControl(),
      email: [new FormControl(), [Validators.email]],
      sno: new FormControl()
    });
  }


  assignTheData() {
    this.form.reset({
      sitE_NO: this.siteData.sitE_NO,
      sitE_NAME: this.siteData.sitE_NAME,
      shortname: this.siteData.shortname,
      aR_SITE_NAME: this.siteData.aR_SITE_NAME,
      sitE_TP: this.siteData.sitE_TP,
      reF_SITE: this.siteData.reF_SITE,
      reF_SITE_NAME: this.siteData.reF_SITE_NAME,
      rcvD_COL: this.siteData.rcvD_COL,
      city: this.siteData.city,
      address: this.siteData.address,
      tel: this.siteData.tel,
      mobile: this.siteData.mobile,
      latitude: this.siteData.latitude,
      longitude: this.siteData.longitude,
      email: this.siteData.email,
      sno: this.siteData.sno
    })
  };

  emptyTheForm() {
    const userIdValue = this.form.controls['sitE_NO'].value; // Store the current userID value
    this.form.reset({
      sitE_NO: '',
      sitE_NAME: '',
      shortname: '',
      aR_SITE_NAME: '',
      sitE_TP: '',
      reF_SITE: '',
      reF_SITE_NAME: '',
      rcvD_COL: 0,
      city: '',
      address: '',
      tel: '',
      mobile: '',
      latitude: '',
      longitude: '',
      email: '',
      sno: ''
    });
    this.form.controls['sitE_NO'].setValue(userIdValue); // Restore the userID value
  }


  quarterList = ['mobile 1', 'mobile 2', 'mobile 3'];
  isDropdownOpen: boolean = false;
  onDropdownClose() {
    this.isDropdownOpen = false;
    console.log('Dropdown closed');
  }

  selectedQuarterList: string[] = [];
  onItemSelect(event: any, checked: boolean) {
    if (this.selectedQuarterList.length > 1) {
      const value=this.quarterList.filter(x=>this.selectedQuarterList.indexOf(x)>=0)
      let first = this.quarterList.findIndex((x) => x == value[0]);
      let last = this.quarterList.findIndex(
        (x) => x == value[value.length - 1]
      );
      if (last - first + 1 > value.length && !checked) {
        const index = this.quarterList.findIndex((x) => x == event);
        if (index < this.quarterList.length / 2) {
          first = index + 1;
        } else
          last =index-1;
      }
      this.selectedQuarterList = this.quarterList.filter(
        (_, index) => index >= first && (last < 0 || index <= last)
      );
    }
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

  ngOnInit(): void {
    // this.currentDateTime = moment();
    // this.startTime = this.currentDateTime.format();
    // this.getAllSiteData();
    // this._siteService.getAllSite().subscribe(res => {
    //   this.siteAllData = res;
    //   this.matchedSites$ = this.getFilteredSites('');
    // })

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
    const filteredSites = this.siteAllData.filter(site =>
      this.customSearch(event, site)
    );
    return new Observable(observer => {
      observer.next(filteredSites);
      observer.complete();
    });
  }

  onSiteSelection(event: any) {
    if (event && event.sitE_NAME !== undefined) {
      const selectedValue = event.sitE_NAME;
      const selectedSite = this.siteAllData.find(site => site.sitE_NAME === selectedValue);

      if (selectedSite) {
        this.siteData = selectedSite;
      } else {
        // Handle case where selectedSite is not found
      }
    } else {
      // Handle case where event or event.sitE_NAME is undefined
      this.getRecord("last", this.siteAllData.length - 1);
    }
  }

  fillrefDropDown(filterFn?: (site: any) => boolean): void {
    this._siteService.getAllSite().subscribe(sites => {
      if (filterFn) {
        // If a filter function is provided, use it to filter the sites
        this.refDropDown = sites.filter(filterFn);
      } else {
        // Otherwise, assign all sites
        this.refDropDown = sites;
      }
    });
  }

  onSiteChange(event: any): void {
    this.siteData.reF_SITE = event;
  }

  onTypeChange(): void {
    if (this.siteData.sitE_TP === 'LS' || this.siteData.sitE_TP === 'FS') {
      // this.siteData.reF_SITE_NAME = '';
      this.fillrefDropDown();
      this.siteData.reF_SITE = '';

    }
    else {
      this.fillrefDropDown(site => site.sitE_TP === 'LS');
      this.siteData.reF_SITE = '';

    }
  }



  toggleReadonlyState(isEditable: boolean) {
    for (const controlName in this.form.controls) {
      if (this.form.controls.hasOwnProperty(controlName)) {
        const control = this.form.get(controlName);
        if (isEditable) {
          control?.enable();
        } else {
          control?.disable();
        }
      }
    }
  }


  onAddRecord() {
    this.siteData.reF_SITE = '';
    this.IsDisabled = false;
    const maxSiteNo = Math.max(...this.siteAllData.map(record => parseInt(record.sitE_NO, 10)), 0);
    const newSiteNo = (maxSiteNo + 1).toString();
    this.form.controls['sitE_NO'].setValue(newSiteNo);
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

  onEditRecord() {
    this.toggleReadonlyState(true);
    this.isAddBtnActive = true;
    this.IsDisabled = false;
    this.isEdit = true;
    this.siteData.reF_SITE = this.siteData.reF_SITE + ' - ' + this.siteData.reF_SITE_NAME
    this.assignTheData();
    this.operation = Operation.edit;
    this.isNavigationActive = true;
    this.isSaveBtnActive = false;
    this.isCancelBtnActive = false;
  }

  isDisableButtonOnEdit() {
    // on view and edit button should disable    
    let isdisablebutton = null;
    switch (this.operation) {
      case Operation.edit:
      case Operation.view:
      case Operation.submit:
      case Operation.cancel:
        isdisablebutton = true;
        break;
      case Operation.add:
        isdisablebutton = null;
        break;
      default:
        isdisablebutton = null;
    }
    return isdisablebutton;
  }

  isDisableDropDownOnEdit() {
    let isdisablebutton = false;
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
    if (this.form.invalid) {
      return;
    }
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
      this.siteData = this.siteAllData[index]
      this.assignTheData();
      this.operation = Operation.cancel;
      this.IsDisabled = true;
      this.isEdit = false;
      this.isCancelBtnActive = true;
      this.isSaveBtnActive = true;
      this.isAddBtnActive = false;
      this.isNavigationActive = false;
    }
    else {
      this.emptyTheForm();
      this.isAddBtnActive = false;
      this.isEditBtnActive = false;
      this.isDeleteBtnActive = false;
      this.isCancelBtnActive = true;
      this.isNavigationActive = false;
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

  getAllSiteData(): void {
    this._siteService.getAllSite().subscribe(res => {
      this.siteAllData = res;
      this.getRecord("last", this.siteAllData.length - 1);
    },
      (error) => {
        console.error('Error loading Site list:', error);
      })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  toggleDefaultSpecimen(event: Event) {
    const target = event.target as HTMLInputElement;
    this.siteData.rcvD_COL = target.checked ? 1 : 0;
  }
  AssignTheValueUsingFormControl() {
    this.siteData.rcvD_COL = this.form.get('rcvD_COL')?.value;
    this.siteData.reF_SITE = this.form.get('reF_SITE')?.value;

    if (this.siteData.reF_SITE_NAME == '' || this.form.invalid) {
      let sitedata = this.siteData.reF_SITE.split("-");
      this.siteData.reF_SITE = sitedata[0].replace(/\s/g, "");
      let removeFirstElement = sitedata.slice(1);
      this.siteData.reF_SITE_NAME = removeFirstElement?.join();
      if (this.operation == Operation.add) {

        this.siteData.reF_SITE = this.siteData.reF_SITE.split("-")[0].replace(/\s/g, "");
      }
    }
  }

  Add() {
    this.AssignTheValueUsingFormControl();
    if (this.siteData.sitE_TP == 'LS') {
      this.siteData.reF_SITE = '';
      this.siteData.reF_SITE_NAME = '';
    }
    this._siteService.addSite(this.siteData).subscribe(response => {

      if (response.status === 200 || response.status === 204) {
        this._commonAlertService.successMessage();
      }
      this.toggleReadonlyState(false);
      this.isAddBtnActive = false;
      this.isEditBtnActive = false;
      this.isCancelBtnActive = true;
      this.isSaveBtnActive = true;
      this.IsDisabled = true;
    },
      error => {
        const status = error.status;
        if (status === 409) {
          this._commonAlertService.warningMessage();
        }
      });
    this.toggleReadonlyState(true);
  }

  Update(updatedata: siteModel) {
    if (this.siteData.rcvD_COL) {
      this.siteData.rcvD_COL = 1;
    } else {
      this.siteData.rcvD_COL = 0;
    }
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

  // refdropdownreset()
  // {
  //   if (this.siteData.sitE_TP === 'LS') {
  //     this.siteData.reF_SITE = '';
  //   }
  // }

  getRecord(input: any, SNO: number) {
    this.toggleReadonlyState(false);
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
        }
      }
    }
  }

  calculateCurrentIndex(currentSNO: number): number {
    let currentIndex = this.siteAllData.findIndex(x => x.sno === currentSNO);
    return currentIndex + 1; // Start index is one-based
  }

}



