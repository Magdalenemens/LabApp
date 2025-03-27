import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common/commonService';
import { OrderentryService } from 'src/app/modules/orderprocessing/orderentry/add-orderentry/orderentry.service';
import { AddTestDirectoryService } from '../../test-definition/add-test-directory/add-test-directory.service';
import { TDModel } from 'src/app/models/tdmodel';
import Swal from 'sweetalert2';
import { AbstractControl, FormBuilder, FormControl } from '@angular/forms';
import { tdComboModel } from 'src/app/models/tdComboModel';
import { successMessage, warningMessage, errorMessage, REQUIRED_FIELDS, updateSuccessMessage, deleteMessage, deleteErrorMessage } from 'src/app/common/constant';
import { Operation } from 'src/app/common/enums';
import { apTestDefinitionModel } from 'src/app/models/apTestDefinitionModel';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-addaptestdefinition',
  templateUrl: './addaptestdefinition.component.html',
  styleUrls: ['./addaptestdefinition.component.scss']
})
export class AddAPTestDefinitionComponent {
  form: any;
  formGroup: any;
  tdModelData: any;
  operation = 0; // 0 means show, 1 means add,2 means edit, 3 means delete // make enum for operation
  apTestDefinitionData: apTestDefinitionModel = new apTestDefinitionModel();
  apTestDefinitionAllData: apTestDefinitionModel[] = [];
  tdSearchList: apTestDefinitionModel[] = [];
  isNavigationActive: boolean = false;
  objSpecTypes: string = "";
  submitted = false;
  public specimenstypes: any[] = [];
  isAddBtnActive: boolean = false;
  isEditBtnActive: boolean = false;
  isDeleteBtnActive: boolean = false;
  isSaveBtnActive: boolean = true;
  isCancelBtnActive: boolean = true;
  tdCombos: tdComboModel = new tdComboModel();

  isViewMode: boolean = true;
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

  objWorkCenter: string = "";
  objTestSite: string = "";
  objAccnPrefix: string = "";
  objTestTemplate: string = "";
  objMHN: string = "";
  objSHN: string = "";
  objLabModule: string = "";
  objResultType: string = "";
  prevDivvalue: string = "";

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

  isLoaded = false;
  isAddModal: any;
  maxTestId: number;
  //Search
  filteredList: TDModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;

  startTime: string = '';
  endTime: string = '';

  isEditing: boolean = false;

  matchedTests$!: Observable<apTestDefinitionModel[]>;
  hit: number = 0;

  constructor(private formBuilder: FormBuilder, private el: ElementRef,
    private _testDirectoryService: AddTestDirectoryService, private _commonAlertService: CommonAlertService,
    private auth: OrderentryService) {
    this.form = this.formBuilder.group
      ({
        txtCode: new FormControl(),
        txtdtNumber: new FormControl(),
        txtFullName: new FormControl(),
        txtSynm: new FormControl(),
        cmbSpecimenstypes: new FormControl(this.specimenstypes[0]),
        cmblabModule: new FormControl(this.tdCombos[0]),
        cmbResultType: new FormControl(this.tdCombos[0]),
        cmbPriority: new FormControl(),
        cmbStatus: new FormControl(),
        cmbOrderable: new FormControl(),
        cmbPrintResult: new FormControl(),
        cmblabDivision: new FormControl(),
        cmbSection: new FormControl(),
        cmbWorkCenter: new FormControl(),
        cmbTestSite: new FormControl(),
        cmbAccnPrefix: new FormControl(),
        cmbTestTemplate: new FormControl(),
        cmbMainHeader: new FormControl(),
        cmbSubHeader: new FormControl(),
        txtAvgTAT: new FormControl()
      });
  }

  ngOnInit(): void {
    $('#btnaddtestdefinition').addClass("is-active");
    this.getAllAPTestDefinitionData();
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

  getAllAPTestDefinitionData(): void {
    this._testDirectoryService.getAllAPTestDefinition().subscribe(res => {
      this.apTestDefinitionAllData = res;
      this.matchedTests$ = this.getFilteredTests('');
      this.getRecord("last", this.apTestDefinitionAllData.length - 1);
      this.activateTestIdField();
      this.bindChildDropdowns();
    },
      (error) => {
        console.error('Error loading user list:', error);
      })
  }

  activateTestIdField() {
    this.isViewMode = true;
  }

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Check if the charCode corresponds to a number (48-57 is the range for digits 0-9)
    if (charCode >= 48 && charCode <= 57) {
      return false; // Prevent the default action (entering the digit)
    }

    return true; // Allow other characters
  }

  // Custom search function
  customSearch(term: string, item: apTestDefinitionModel): boolean {
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
    if (event.tcode && event.full_Name) {
      const selectedTest = this.apTestDefinitionAllData.find(test =>
        test.tcode === event.tcode && test.full_Name === event.full_Name
      );
      if (selectedTest) {
        this.apTestDefinitionData = selectedTest; // Store the selected test details
      } else {
        // Handle case where selectedTest is not found
        console.warn('Selected test not found');
      }
    } else {
      // Handle case where event is undefined or missing necessary properties
      console.warn('Invalid selection event:', event);
      if (this.hit !== 1) {
        this.getRecord("last", this.apTestDefinitionAllData.length - 1);
      }
    }
    select.handleClearClick(); // Clear the selection after processing
    this.hit = 1;
  }

  getFilteredTests(term: string): Observable<any[]> {
    const filteredTests = this.apTestDefinitionAllData.filter(test => this.customSearch(term, test));

    const transformedTests = filteredTests.map(test => ({
      ...test,
      combinedLabel: `${test.tcode} - ${test.full_Name}`
    }));

    return of(transformedTests);
  }

  onChange(event: any) {
    this.objSpecTypes = event;
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

  bindChildDropdowns() {
    this.bindCombos("LAB_SECT", this.apTestDefinitionData.div, this.ArrayLabSection);
    this.bindCombos("LAB_TS", this.apTestDefinitionData.wc, this.ArrayTestSite);
    if (this.apTestDefinitionData.mhn) {
      this.bindCombos("RPT_SHDR", this.apTestDefinitionData.mhn, this.ArraySubHeader);
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

  onAddRecord() {
    this.isViewMode = false;
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
      setTimeout(() => {
        this.el.nativeElement.querySelector('#tcode').focus();
      }, 500);
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
      this.Update(this.apTestDefinitionData);
    }
  }

  Add() {
    if (this.apTestDefinitionData.tcode && this.apTestDefinitionData.div && this.apTestDefinitionData.sect
      && this.apTestDefinitionData.wc && this.apTestDefinitionData.ts
      && this.apTestDefinitionData.mdl && this.apTestDefinitionData.prfx) {
      this._testDirectoryService.insertAPTestDefinition(this.apTestDefinitionData).subscribe(response => {
        if (response.status === 200 || response.status === 204) {
          this.getAllAPTestDefinitionData();
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
    this.isViewMode = true;
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

  Update(apTestDefinitionData: apTestDefinitionModel) {
    if (this.apTestDefinitionData.tcode && this.apTestDefinitionData.div && this.apTestDefinitionData.sect
      && this.apTestDefinitionData.wc && this.apTestDefinitionData.ts
      && this.apTestDefinitionData.mdl && this.apTestDefinitionData.prfx) {
      this._testDirectoryService.updateAPTestDefinition(apTestDefinitionData).subscribe(
        (response) => {
          if (response.status === 200 || response.status === 204) {
            this.getAllAPTestDefinitionData();
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

  onDeleteRecord(_id: number) {
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._testDirectoryService.deleteAPTestDefinition(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.isEditBtnActive = false;
            this.isAddBtnActive = false;
            this.isDeleteBtnActive = false;
            this.isCancelBtnActive = true;
            this.isSaveBtnActive = true;
            this.getAllAPTestDefinitionData();
            Swal.fire({
              text: deleteMessage,
            })
          }
        },
        (error) => {
          console.error('error caught in component')
          const status = error.status;
          if (status === 400) {
            Swal.fire({
              text: deleteErrorMessage,
            });
          }
        });
    }
  }

  onCancelRecord(_id: number) {
    this.isEditing = false;
    this.isEditBtnActive = false;
    if (this.isEdit) {
      this.operation = Operation.cancel;
      this.apTestDefinitionData = this.apTestDefinitionAllData[this.apTestDefinitionAllData.length - 1]
      const index = this.apTestDefinitionAllData.findIndex(x => x.tD_ID === _id);
      if (index !== -1) {
        // Restore the original user data
        this.apTestDefinitionData = this.apTestDefinitionAllData[index]; // Deep copy to prevent mutation
        this.assignTheValueUsingFormControl();
        this.isCancelBtnActive = true;
        this.isSaveBtnActive = true;
        this.isAddBtnActive = false;
        this.isNavigationActive = false;
      }
    }
    else {
      this.getAllAPTestDefinitionData();
      this.isAddBtnActive = false;
      this.isNavigationActive = true;
      this.isEditBtnActive = false;
      this.isDeleteBtnActive = false;
      this.isCancelBtnActive = true;
      this.isSaveBtnActive = true;
      //this.emptyTheForm();
    }
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
      s_TYPE: getValue('cmbSpecimenstypes'),
      prty: getValue('cmbPriority'),
      status: getValue('cmbStatus'),
      ordable: getValue('cmbOrderable'),
      pr: getValue('cmbPrintResult'),
      mdl: getValue('cmblabModule'),
      diVs: "0",
      div: getValue('cmblabDivision'),
      sect: getValue('cmbSection'),
      wc: getValue('cmbWorkCenter'),
      ts: getValue('cmbTestSite'),
      prfx: getValue('cmbAccnPrefix'),
      mhn: getValue('cmbMainHeader'),
      shn: getValue('cmbSubHeader'),
      tat: getValue('txtAvgTAT'),
    };
  }

  emptyTheForm() {
    this.form.reset({
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  calculateCurrentIndex(currentSNO: number): number {
    let currentIndex = this.apTestDefinitionAllData.findIndex(x => x.sno === currentSNO);
    return currentIndex + 1; // Start index is one-based
  }

  getRecord(input: any, SNO: number) {
    let totalNumberOfRec = this.apTestDefinitionAllData.length;
    if (input == 'first') {
      if (SNO === 1) {
        Swal.fire({
          text: "You are already at the first record.",
        })
      } else {
        this.apTestDefinitionData = this.apTestDefinitionAllData[0];
        this.bindChildDropdowns();
      }
    }
    else if (input == 'search') {
      const searchRecord = this.apTestDefinitionAllData.find(x => x.sno == (SNO));
      if (searchRecord) {
        this.apTestDefinitionData = searchRecord;
        this.bindChildDropdowns();
      }
    }
    else if (input == 'prev' && SNO != 1) {
      const prevRecord = this.apTestDefinitionAllData.find(x => x.sno == (SNO - 1));
      if (prevRecord) {
        this.apTestDefinitionData = prevRecord;
        this.bindChildDropdowns();
      }
    }
    else if (input == 'next' && totalNumberOfRec > SNO) {
      const nextRecord = this.apTestDefinitionAllData.find(x => x.sno == (SNO + 1));
      if (nextRecord) {
        this.apTestDefinitionData = nextRecord;
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
        const lastRecord = this.apTestDefinitionAllData.find(x => x.sno == totalNumberOfRec);
        if (lastRecord) {
          this.apTestDefinitionData = lastRecord;
          this.bindChildDropdowns();
        }
      }
    }
  }
}
