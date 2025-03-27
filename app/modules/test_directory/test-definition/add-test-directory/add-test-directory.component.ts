import { Component, ElementRef } from '@angular/core';
import { TDModel } from 'src/app/models/tdmodel';

import { AbstractControl, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, Observable, of, Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { OrderentryService } from 'src/app/modules/orderprocessing/orderentry/add-orderentry/orderentry.service';
import { tdComboModel } from 'src/app/models/tdComboModel';
import { deleteErrorMessage, deleteMessage, errorMessage, REQUIRED_FIELDS, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import { Operation, PageName } from 'src/app/common/enums';
import { specimentypeModel } from 'src/app/models/specimentypeModel';
import { AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { AddTestDirectoryService } from './add-test-directory.service';
import { debounce } from 'lodash';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-test-directory',
  templateUrl: './add-test-directory.component.html',
  styleUrls: ['./add-test-directory.component.scss']
})

export class AddTestDirectoryComponent implements AfterViewInit {
  private searchSubject = new Subject<string>();
  maleText: string = '';
  femaleText: string = '';
  tdModelData: any;
  testDirectoryData: TDModel = new TDModel();
  tdAllData: TDModel[] = [];
  tdSearchList: TDModel[] = [];
  form: any;
  isNavigationActive: boolean = false;
  selectedPatient: specimentypeModel | undefined;
  operation = 0; // 0 means show, 1 means add,2 means edit, 3 means delete // make enum for operation
  isAddBtnActive: boolean = false;
  isEditBtnActive: boolean = false;
  isDeleteBtnActive: boolean = false;
  isSaveBtnActive: boolean = true;
  isCancelBtnActive: boolean = true;
  submitted = false;
  IsDisabled = true;
  isEdit = false;
  isDelete = false;
  istCodeReadonly = false;
  sectionId: string = "0";
  divID: string = "0";
  selectedComboValue: string = "";
  selectedLabDivision: string = "";
  selectedSection: string = "";
  selectedWorkCenter: string = "";
  selectedTestSite: string = "";
  selectedAccnPrefix: string = "";
  selectedtestTemp: string = "";
  selectedMainHeader: string = "";
  selectedSubHeader: string = "";
  objDiv: string = "";
  objSection: string = "";
  objSpecTypes: string = "";
  objWorkCenter: string = "";
  objTestSite: string = "";
  objAccnPrefix: string = "";
  objTestTemplate: string = "";
  objMHN: string = "";
  objSHN: string = "";
  objLabModule: string = "";
  objResultType: string = "";
  prevDivvalue: string = "";
  public specimenstypes: any[] = [];
  public ordertype: any[] = [];
  public ArrayLabModule: any[] = [];
  public ArrayResultType: any[] = [];
  public ArrayLabDivision: any[] = [];
  public ArrayLabSection: any[] = [];
  public ArrayWorkCenter: any[] = [];
  public ArrayTestSite: any[] = [];
  public ArrayAccnPrefix: any[] = [];
  public ArrayTestTemplate: any[] = [];
  public ArrayMainHeader: any[] = [];
  public ArraySubHeader: any[] = [];
  tdCombos: tdComboModel = new tdComboModel();
  isLoaded = false;
  isAddModal: any;
  maxTestId: number;
  //Search
  filteredList: TDModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;
  tCodeCheckSubscription: Subscription | null = null;
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';
  formGroup: any;
  isEditing: boolean = false;
  matchedTests$!: Observable<TDModel[]>;
  hit: number = 0;
  constructor(private formBuilder: FormBuilder, private _testDirectoryService: AddTestDirectoryService,
    private auth: OrderentryService, public _commonAlertService: CommonAlertService,
    private el: ElementRef, private router: Router, private _commonService: CommonService) {
    this.form = this.formBuilder.group
      ({
        txtCode: new FormControl(),
        txtdtNumber: new FormControl(),
        txtFullName: new FormControl(),
        txtFullNameArabic: new FormControl(),
        txtSynm: new FormControl(),
        cmbSpecimenstypes: new FormControl(this.specimenstypes[0]),
        cmblabModule: new FormControl(this.tdCombos[0]),
        cmbResultType: new FormControl(this.tdCombos[0]),
        txtUnits: new FormControl(),
        cmbPriority: new FormControl(),
        cmbStatus: new FormControl(),
        cmbOrderable: new FormControl(),
        cmbPrintResult: new FormControl(),
        // txtBillingCode: new FormControl(),
        cmblabDivision: new FormControl(),
        cmbSection: new FormControl(),
        cmbWorkCenter: new FormControl(),
        cmbTestSite: new FormControl(),
        cmbAccnPrefix: new FormControl(),
        cmbTestTemplate: new FormControl(),
        cmbMainHeader: new FormControl(),
        cmbSubHeader: new FormControl(),
        txtnoofDecimals: new FormControl(),
        txtTestSequence: new FormControl(),
        txtCUnits: new FormControl(),
        txtCFactor: new FormControl(),
        txtNDecimal: new FormControl(),
        txtDefResult: new FormControl(),
        txtAvgTAT: new FormControl(),
        cmbDeltaType: new FormControl(),
        txtValue: new FormControl(),
        txtDaysLimit: new FormControl(),
        cmbBillTest: new FormControl(),
        txtTestGroup: new FormControl(),
        txtUnitPrice: new FormControl(),
        txtUnitCost: new FormControl(),
        txtAreaMale: new FormControl(),
        txtAreaFeMale: new FormControl(),
        txtAreaTestInfo: new FormControl(),
        txtlblDivision: new FormControl(),
        txtsectionName: new FormControl(),
        searchInput: new FormControl(),
        txtSearchDefnName: new FormControl(),
      });
  }

  ngOnInit(): void {
    $('#btnaddtestdefinition').addClass("is-active");
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.getAllTestDirectoryData();
    this.bindSpecimenstypes();
    this.bindCombos("SYS_MDL", "1", this.ArrayLabModule);
    this.bindCombos("RESTYPE", "1", this.ArrayResultType);
    this.bindCombos("LAB_DIV", "1", this.ArrayLabDivision);
    this.bindCombos("LAB_SECT", "1", this.ArrayLabSection);
    this.bindCombos("LAB_WC", "1", this.ArrayWorkCenter);
    this.bindCombos("ACCNPRFX", "1", this.ArrayAccnPrefix);
    this.bindCombos("RS_TMPLT", "1", this.ArrayTestTemplate);
    this.bindCombos("RPT_MHDR", "1", this.ArrayMainHeader);
  }

  ngAfterViewInit() {
    const secondModal = document.getElementById('secondModal');
    if (secondModal) {
      secondModal.addEventListener('hidden.bs.modal', () => {
        if (document.querySelectorAll('.modal.show').length) {
          document.body.classList.add('modal-open');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.TestDirectory_TestDefinition, this.startTime, this.endTime);

  }

  getAllTestDirectoryData(): void {
    this._testDirectoryService.getAllTD().subscribe(res => {
      this.tdAllData = res;
      this.tdModelData = res;
      this.tdSearchList = res;
      this.matchedTests$ = this.getFilteredTests('');
      this.testDirectoryData = this.tdAllData[this.tdAllData.length - 1];
      this.getRecord("last", this.tdAllData.length - 1);
      this.maxTestId = Number(this.testDirectoryData.tesT_ID) + 1;
      this.bindChildDropdowns();

    },
      (error) => {
        console.error('Error loading user list:', error);
      })
  }

  assignTheValueUsingFormControl() {
    const getValue = (controlName: string, defaultValue: string = "0") =>
      this.form.get(controlName)?.value ?? defaultValue;

    this.tdModelData = {
      sno: 0,
      tD_ID: 0,
      tcode: getValue('txtCode'),
      tesT_ID: getValue('txtdtNumber'),
      full_Name: getValue('txtFullName'),
      aFull_Name: getValue('txtFullNameArabic'),
      synm: getValue('txtSynm'),
      s_TYPE: getValue('cmbSpecimenstypes'),
      units: getValue('txtUnits'),
      prty: getValue('cmbPriority'),
      status: getValue('cmbStatus'),
      ordable: getValue('cmbOrderable'),
      pr: getValue('cmbPrintResult'),
      mdl: getValue('cmblabModule'),
      rstp: getValue('cmbResultType'),
      dec: getValue('txtnoofDecimals'),
      diVs: "0",
      div: getValue('cmblabDivision'),
      sect: getValue('cmbSection'),
      wc: getValue('cmbWorkCenter'),
      ts: getValue('cmbTestSite'),
      prfx: getValue('cmbAccnPrefix'),
      tno: getValue('cmbTestTemplate'),
      mhn: getValue('cmbMainHeader'),
      shn: getValue('cmbSubHeader'),
      seq: getValue('txtTestSequence'),
      cnvunits: getValue('txtCUnits'),
      cnvtfctr: getValue('txtCFactor'),
      cnvtdec: getValue('txtNDecimal'),
      result: getValue('txtDefResult'),
      tat: getValue('txtAvgTAT'),
      ptn: "1",
      deltatp: getValue('cmbDeltaType', this.testDirectoryData.deltatp),
      deltaval: getValue('txtValue'),
      daysval: getValue('txtDaysLimit'),
      bill: getValue('cmbBillTest', this.testDirectoryData.bill),
      // bilL_NAME: getValue('txtBillingCode', this.testDirectoryData.bill),
      dscntg: "d",
      uprice: getValue('txtUnitPrice'),
      ucost: getValue('txtUnitCost'),
      mnotes: getValue('txtAreaMale', this.testDirectoryData.mnotes),
      fnotes: getValue('txtAreaFeMale', this.testDirectoryData.fnotes),
      sts: "0",
      minterp: "0",
      finterp: "0",
      b_NO: "0",
      tesT_INF: getValue('txtAreaTestInfo', this.testDirectoryData.tesT_INF)
    };
  }

  bindChildDropdowns() {
    this.bindCombos("LAB_SECT", this.testDirectoryData.div, this.ArrayLabSection);
    this.bindCombos("LAB_TS", this.testDirectoryData.wc, this.ArrayTestSite);
    if (this.testDirectoryData.mhn) {
      this.bindCombos("RPT_SHDR", this.testDirectoryData.mhn, this.ArraySubHeader);
    }
  }

  //Bind specimentypes dropdown--from masters
  bindSpecimenstypes() {
    this.auth.GetSpecimensTypes()
      .subscribe({
        next: (res) => {
          this.isLoaded = true;
          this.specimenstypes = res;
          this.isLoaded = false;
        },
        error: (err) => {
          console.log('error order type')
        }
      })
  }

  bindCombos(TableName: string, ID: string = "1", ComboArray: any[]) {
    ComboArray.length = 0;
    this._testDirectoryService.getTDComboswithTableName(TableName, ID).subscribe({
      next: (res) => {
        this.isLoaded = true;
        for (var i = 0; i < res.length; i++) {  // loop through the object array
          ComboArray.push(res[i]);        // push each element to sys_id
        }
        this.isLoaded = false;
      },
      error: (err) => {
        console.log('error order type')
      }
    })
  }

  onComboSelected(event: any, comboname: any) {
    switch (comboname) {
      case 'Division':
        this.objDiv = event;
        this.bindCombos("LAB_SECT", event, this.ArrayLabSection);
        break;
      case 'Section':
        this.objSection = event;
        break;
      case 'WorkCenter':
        this.objWorkCenter = event;
        this.bindCombos("LAB_TS", event, this.ArrayTestSite);
        break;
      case 'TestSite':
        this.objTestSite = event;
        break;
      case 'AccnPrefix':
        this.objAccnPrefix = event;
        break;
      case 'TestTemplate':
        this.objTestTemplate = event;
        break;
      case 'MainHeader':
        this.objMHN = event;
        this.bindCombos("RPT_SHDR", event, this.ArraySubHeader);
        break;
      case 'SubHeader':
        this.objSHN = event;
        break;
      case 'LabModule':
        this.objLabModule = event;
        break;
      case 'ResultType':
        this.objResultType = event;
        break;
    }
  }

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  preventNumberInput(event: { which: any; keyCode: any; }): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    // Check if the charCode corresponds to a number (48-57 is the range for digits 0-9)
    if (charCode >= 48 && charCode <= 57) {
      return false; // Prevent the default action (entering the digit)
    }

    return true; // Allow other characters
  }

  checkAlreadyExistingDebounced: (event: Event) => void;

  onTCodeInput(event: Event): void {
    this.checkAlreadyExistingDebounced(event);
  }

  onAddRecord() {
    this.submitted = true;
    this.operation = Operation.add;
    this.isSaveBtnActive = false;
    this.istCodeReadonly = false;
    this.isCancelBtnActive = false;
    this.isEditBtnActive = true;
    this.isDeleteBtnActive = true;
    this.emptyTheForm();
    this.isNavigationActive = true;
    setTimeout(() => {
      this.el.nativeElement.querySelector('#tcode').focus();
    }, 500);
  }

  onSubmit() {
    this.isEditing = false;

    this.operation = Operation.submit;
    if (!this.isEdit) {
      this.isSaveBtnActive = true;
      this.isCancelBtnActive = true;
      this.isEditBtnActive = false;
      this.isDeleteBtnActive = false;
      this.isNavigationActive = false;
      this.isAddBtnActive = false;
      this.Add();
      this.IsDisabled = true;
      this.assignTheValueUsingFormControl();
      //if Result type is Numeric then Decimals should be selected -- 
      if (this.tdModelData.rstp == 'N' && (this.form.get('txtnoofDecimals')?.value == null)) {
        Swal.fire({
          text: "Please select Number of Decimals",
        });
        //  this.txtnoofDecimals.nativeElement.focus();
        return;
      }
    }
    else {  //Edit 
      this.Update(this.testDirectoryData);
    }
  }

  Add() {
    if (this.testDirectoryData.tcode && this.testDirectoryData.div && this.testDirectoryData.sect
      && this.testDirectoryData.wc && this.testDirectoryData.ts
      && this.testDirectoryData.mdl && this.testDirectoryData.prfx && this.testDirectoryData.rstp) {
      this._testDirectoryService.insertTestDirectory(this.testDirectoryData).subscribe(response => {
        if (response.status === 200 || response.status === 204) {
          this.getAllTestDirectoryData();
          this._commonAlertService.successMessage();
        }
        this.IsDisabled = false;
      },
        error => {
          this.IsDisabled = false;
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          } else {
            this._commonAlertService.errorMessage();
          }
        }
      );
    } else {
      this._commonAlertService.requiredFieldMessage();
      this.IsDisabled = false;
      this.isSaveBtnActive = false;
    }
  }


  onEditRecord() {
    this.isAddBtnActive = true;
    this.IsDisabled = false;
    this.isEdit = true;
    this.isEditing = true;
    this.isSaveBtnActive = false;
    this.isEditBtnActive = true;
    this.istCodeReadonly = true;
    //this.assignTheData();
    this.operation = Operation.edit;
    this.isNavigationActive = true;
    this.isSaveBtnActive = false;
    this.isCancelBtnActive = false;
  }

  Update(testDirectoryData: TDModel) {
    if (this.testDirectoryData.tcode && this.testDirectoryData.div && this.testDirectoryData.sect
      && this.testDirectoryData.wc && this.testDirectoryData.ts
      && this.testDirectoryData.mdl && this.testDirectoryData.prfx && this.testDirectoryData.rstp) {
      this._testDirectoryService.updateTestDirectory(testDirectoryData).subscribe(response => {
        if (response.status === 200 || response.status === 204) {
          this.getAllTestDirectoryData();
          this._commonAlertService.successMessage();
          this.isSaveBtnActive = true;
          this.isEditBtnActive = false;
          this.isCancelBtnActive = true;
          this.isAddBtnActive = false;
          this.IsDisabled = false;
        }
      },
        error => {
          this.IsDisabled = false;
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          } else {
            this._commonAlertService.errorMessage();
          }
        }
      );
    } else {
      this._commonAlertService.requiredFieldMessage();
      this.IsDisabled = false;
      this.isSaveBtnActive = false;
    }
  }

  onDeleteRecord(_id: number) {
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._testDirectoryService.deleteTestDirectory(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.isEditBtnActive = false;
            this.isAddBtnActive = false;
            this.isDeleteBtnActive = false;
            this.isCancelBtnActive = true;
            this.isSaveBtnActive = true;
            this.getAllTestDirectoryData();
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

  onCancelRecord(_id: number) {
    this.isEditing = false;
    this.isEditBtnActive = false;
    if (this.isEdit) {
      this.operation = Operation.cancel;
      this.testDirectoryData = this.tdAllData[this.tdAllData.length - 1]
      const index = this.tdAllData.findIndex(x => x.tD_ID === _id);
      if (index !== -1) {
        // Restore the original user data
        this.testDirectoryData = this.tdAllData[index]; // Deep copy to prevent mutation
        this.assignTheValueUsingFormControl();
        this.isCancelBtnActive = true;
        this.isSaveBtnActive = true;
        this.isAddBtnActive = false;
        this.isNavigationActive = false;
      }
    }
    else {
      this.getAllTestDirectoryData();
      this.isAddBtnActive = false;
      this.isNavigationActive = true;
      this.isEditBtnActive = false;
      this.isDeleteBtnActive = false;
      this.isCancelBtnActive = true;
      this.isSaveBtnActive = true;
      //this.emptyTheForm();
    }
  }

  emptyTheForm() {
    this.form.reset({
    });
  }

  copyMtoF() {
    this.femaleText = this.maleText;
  }

  copyFtoM() {
    this.maleText = this.femaleText;
  }

  onChange(event: any) {
    this.objSpecTypes = event;
  }

  closeModal() {
    this.isAddModal = false;
  }

  redirectToTestAssignment() {
    this.router.navigate(['test-directory/testdefination/test-assignment']);
  }

  openFirstModal() {
    const modalElement = document.getElementById('firstModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  openSecondModal() {
    const modalElement = document.getElementById('secondModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  findTestDefinitionName(pr) {
    this.searchText = this.form.get('searchInput')?.value;
    //alert(this.searchText);
    const searchModal = document.getElementById('SearchModal') as HTMLElement;
    const myModal = new Modal(searchModal);
    myModal.show();
    return;
  }

  selectedTestDefinitionName(sno: number) {
    this.getRecord('search', sno);
    this.tdSearchList = this.tdAllData;
    const searchModal = document.getElementById('SearchModal') as HTMLElement;
    const myModal = new Modal(searchModal);
    myModal.hide();
  }

  testCodeChange() {
    if (!this.isEdit) {
      this.testDirectoryData.tesT_ID = String(this.maxTestId);
      const txtdtNumber = document.getElementById('txtdtNumber') as HTMLElement;
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  calculateCurrentIndex(currentSNO: number): number {
    let currentIndex = this.tdAllData.findIndex(x => x.sno === currentSNO);
    return currentIndex + 1; // Start index is one-based
  }

  // Custom search function
  customSearch(term: string, item: TDModel): boolean {
    if (typeof term !== 'string') {
      // Handle non-string term, such as when event is passed as term
      return false;
    }
    term = term.toLowerCase();
    return item.tcode.toLowerCase().includes(term) || item.full_Name.toLowerCase().includes(term);
  }

  onTestSearch(event: any): void {
    this.matchedTests$ = this.getFilteredTests(event.term); // Update the matchedTests$ observable with filtered results
  }

    onTestSelection(event: any, select: NgSelectComponent): void {
      if (event && event.tcode && event.full_Name) {
        const selectedTest = this.tdAllData.find(test =>
          test.tcode === event.tcode && test.full_Name === event.full_Name
        );

        if (selectedTest) {
          this.testDirectoryData = selectedTest; // Store the selected test details
        } else {
          // Handle case where selectedTest is not found
          console.warn('Selected test not found');
        }
      } else {
        // Handle case where event is undefined or missing necessary properties
        console.warn('Invalid selection event:', event);
        if (this.hit !== 1) {
          this.getRecord("last", this.tdAllData.length - 1);
        }
      }

      select.handleClearClick(); // Clear the selection after processing
      this.hit = 1;
    }

  getFilteredTests(term: string): Observable<any[]> {
    const filteredTests = this.tdAllData.filter(test => this.customSearch(term, test));

    const transformedTests = filteredTests.map(test => ({
      ...test,
      combinedLabel: `${test.tcode} - ${test.full_Name}`
    }));

    return of(transformedTests);
  }

  getRecord(input: any, SNO: number) {
    let totalNumberOfRec = this.tdAllData.length;
    if (input == 'first') {
      if (SNO === 1) {
        Swal.fire({
          text: "You are already at the first record.",
        })
      } else {
        this.testDirectoryData = this.tdAllData[0];
        this.bindChildDropdowns();
      }
    }
    else if (input == 'search') {
      const searchRecord = this.tdAllData.find(x => x.sno == (SNO));
      if (searchRecord) {
        this.testDirectoryData = searchRecord;
        this.bindChildDropdowns();
      }
    }
    else if (input == 'prev' && SNO != 1) {
      const prevRecord = this.tdAllData.find(x => x.sno == (SNO - 1));
      if (prevRecord) {
        this.testDirectoryData = prevRecord;
        this.bindChildDropdowns();
      }
    }
    else if (input == 'next' && totalNumberOfRec > SNO) {
      const nextRecord = this.tdAllData.find(x => x.sno == (SNO + 1));
      if (nextRecord) {
        this.testDirectoryData = nextRecord;
        this.bindChildDropdowns();
        if (SNO === totalNumberOfRec) {
          Swal.fire({
            text: "You are already at the last record.",
          })
        }
      }
    }
    else if (input == 'last') {
      if (SNO === totalNumberOfRec) {
        Swal.fire({
          text: "You are already at the last record.",
        })
      } else {
        const lastRecord = this.tdAllData.find(x => x.sno == totalNumberOfRec);
        if (lastRecord) {
          this.testDirectoryData = lastRecord;
          this.bindChildDropdowns();
        }
      }
    }
  }
}
