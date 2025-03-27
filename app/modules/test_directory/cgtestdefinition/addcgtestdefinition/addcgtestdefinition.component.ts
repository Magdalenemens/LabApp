import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl } from '@angular/forms';
import { fromEvent, Observable, of, Subject, takeUntil } from 'rxjs';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { tdComboModel } from 'src/app/models/tdComboModel';
import { GTModel, TDModel } from 'src/app/models/tdmodel';
import { AddTestDirectoryService } from '../../test-definition/add-test-directory/add-test-directory.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Modal } from 'bootstrap';
import { successMessage, warningMessage, errorMessage, REQUIRED_FIELDS, updateSuccessMessage, deleteMessage, deleteErrorMessage } from 'src/app/common/constant';
import { Operation } from 'src/app/common/enums';
import Swal from 'sweetalert2';
import { cgProfiledModel, cgProfileGTDModel, cgTestDefinitionModel } from 'src/app/models/cgTestDefinitionModel';
import { OrderentryService } from 'src/app/modules/orderprocessing/orderentry/add-orderentry/orderentry.service';

@Component({
  selector: 'app-addcgtestdefinition',
  templateUrl: './addcgtestdefinition.component.html',
  styleUrls: ['./addcgtestdefinition.component.scss']
})
export class AddcgtestdefinitionComponent {
  @ViewChildren('gtdtcode') gtdtcode: QueryList<ElementRef>;
  form: any;
  formGroup: any;
  isEditMode = false;
  tdModelData: any;
  operation = 0; // 0 means show, 1 means add,2 means edit, 3 means delete // make enum for operation

  cgTestDefinitionAllData: cgTestDefinitionModel[] = [];
  cgTestDefinitionData: cgTestDefinitionModel = new cgTestDefinitionModel();
  tdCombos: tdComboModel = new tdComboModel();

  cgTestDefinitionList: cgProfiledModel[] = [];
  cgProfileGTDList: cgProfileGTDModel[] = [];
  cgProfileData: cgProfiledModel = new cgProfiledModel();
  cgProfileSearchList: cgProfileGTDModel[] = [];
  cgGTDData: GTModel[] = [];

  //Search and Pagination
  matchedTests$!: Observable<cgTestDefinitionModel[]>;
  hit: number = 0;
  tdSearchList: cgTestDefinitionModel[] = [];
  filteredList: TDModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;

  isNavigationActive: boolean = false;
  objSpecTypes: string = "";
  tcode: string = "";
  //Action Buttons
  submitted = false;
  public specimenstypes: any[] = [];
  isAddBtnActive: boolean = false;
  isEditBtnActive: boolean = false;
  isDeleteBtnActive: boolean = false;
  isSaveBtnActive: boolean = true;
  isGridEditBtnActive: boolean = false;
  isCancelBtnActive: boolean = true;

  isViewMode: boolean = false;
  IsDisabled = true;
  isEdit = false;
  isDelete = false;
  istCodeReadonly = false;
  sectionId: string = "0";
  divID: string = "0";
  isLoaded = false;
  isAddModal: any;
  maxTestId: number;
  startTime: string = '';
  endTime: string = '';
  isEditing: boolean = false;
  isGridEditing: boolean = false;
  //Dropdowns
  selectedComboValue: string = "";
  selectedLabDivision: string = "";
  selectedSection: string = "";
  selectedWorkCenter: string = "";
  selectedTestSite: string = "";
  selectedAccnPrefix: string = "";
  selectedtestTemp: string = "";
  selectedMainHeader: string = "";
  selectedSubHeader: string = "";
  selectedMethodDetails: string = "";
  objDiv: string = "";
  objSection: string = "";

  objWorkCenter: string = "";
  objTestSite: string = "";
  objAccnPrefix: string = "";
  objTestTemplate: string = "";
  objInstrument: string = "";
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
  public ArrayMethod: any[] = [];
  public ArrayMethodDetails: any[] = [];

  currentPage: any;
  hasData: boolean = false; // Flag to track if data is available
  isSubmitBtnActive: boolean = true;
  //Pagination 
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder, private el: ElementRef,
    private _testDirectoryService: AddTestDirectoryService, private cdr: ChangeDetectorRef,
    private _commonAlertService: CommonAlertService, private auth: OrderentryService) {
    this.initializeForm();
    this.stopSiteReload();
  }
  initializeForm() {
    this.form = this.formBuilder.group({
      txtCode: new FormControl({ value: '', disabled: true }),
      txtdtNumber: new FormControl({ value: '', disabled: true }),
      txtFullName: new FormControl({ value: '', disabled: true }),
      txtSynm: new FormControl({ value: '', disabled: true }),
      cmbSpecimenstypes: new FormControl({ value: '', disabled: true }),
      cmblabModule: new FormControl({ value: this.tdCombos[0], disabled: true }),
      cmbResultType: new FormControl({ value: this.tdCombos[0], disabled: true }),
      cmbPriority: new FormControl({ value: '', disabled: true }),
      cmbStatus: new FormControl({ value: '', disabled: true }),
      cmbOrderable: new FormControl({ value: '', disabled: true }),
      cmbPrintResult: new FormControl({ value: '', disabled: true }),
      cmblabDivision: new FormControl({ value: '', disabled: true }),
      cmbSection: new FormControl({ value: '', disabled: true }),
      cmbWorkCenter: new FormControl({ value: '', disabled: true }),
      cmbTestSite: new FormControl({ value: '', disabled: true }),
      cmbAccnPrefix: new FormControl({ value: '', disabled: true }),
      cmbTestTemplate: new FormControl({ value: '', disabled: true }),
      cmbMainHeader: new FormControl({ value: '', disabled: true }),
      cmbSubHeader: new FormControl({ value: '', disabled: true }),
      txtAvgTAT: new FormControl({ value: '', disabled: true }),
      cmbCTType: new FormControl({ value: '', disabled: true }),
      tatunits: new FormControl({ value: '', disabled: true }),
      txtMin: new FormControl({ value: '', disabled: true }),
      txtTatc: new FormControl({ value: '', disabled: true })

    });
  }

  ngOnInit(): void {
    // this will stop the back button
    $('#btnaddtestdefinition').addClass("is-active");
    this.cgProfileSearchList = [];
    this.cgProfileGTDList = [];
    this.stopBackButton();
    this.getAllCGTestDefinitionData();
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

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  stopBackButton() {
    history.pushState(null, '');
    fromEvent(window, 'popstate').pipe(
      takeUntil(this.unsubscriber)
    ).subscribe((_) => {
      if (this.isEditing || this.isAddBtnActive === true) {
        history.pushState(null, '');
        Swal.fire("Please complete all fields or cancel to exit.")
      }
    });
  }

  stopSiteReload() {
    window.onbeforeunload = (event) => {
      if (this.isEditing || this.isAddBtnActive === true) {
        event.preventDefault();
        event.returnValue = ''; // Standard practice to show a confirmation dialog
      }
    };
  }

  canDeactivate(): boolean {
    if (this.isEditing || this.isAddBtnActive === true) {
      // Show a warning message or dialog if user tries to navigate away    
      return confirm('Data is not saved. Are you sure you want to leave?');
    }
    $('#btnaddtestdefinition').addClass("is-active");
    return true; // Allow navigation if data is saved
  }

  // Get All TD data fro Left Hand Side Form
  getAllCGTestDefinitionData(): void {
    this._testDirectoryService.getAllCGTestDefinition().subscribe(res => {
      this.cgTestDefinitionAllData = res;
      //Navigation
      const lastRecordId = this.cgTestDefinitionAllData.length - 1;
      this.getRecord("last", lastRecordId);
      //Fetch profile Data Basd on Tcode       
      this.getCGProfieDataFromGTD(this.cgTestDefinitionData.tcode);
      this.activateTestIdField();
      this.matchedTests$ = this.getFilteredTests('');
    },
      (error) => {
        console.error('Error loading list:', error);
      })
  }

  activateTestIdField() {
    this.isViewMode = true;
  }

  getCGProfieDataFromGTD(tCode: string) {
    this._testDirectoryService.getCGProfileFromGTD(tCode).subscribe((data) => {
      if (data) {
        this.cgProfileGTDList = data;
      } else {
        console.error('GTD data not found:', data);
      }
    })
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
          // console.log('error order type')
        }
      })
  }

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Custom search function
  customSearch(term: string, item: cgTestDefinitionModel): boolean {
    if (typeof term !== 'string') {
      // Handle non-string term, such as when event is passed as term
      return false;
    }
    term = term.toLowerCase();
    return item.tcode.toLowerCase().includes(term) || item.tcode.toLocaleLowerCase().includes(term) || item.tcode.toUpperCase().includes(term)
      || item.fulL_NAME.toLocaleLowerCase().includes(term) || item.fulL_NAME.toUpperCase().includes(term) || item.fulL_NAME.toLowerCase().includes(term);
  }

  onTestSearch(event: any): void {
    this.matchedTests$ = this.getFilteredTests(event.term); // Update the matchedTests$ observable with filtered results
  }

  onChange(event: any) {
    this.objSpecTypes = event;
  }

  //Search
  onTestSelection(event: any, select: NgSelectComponent): void {
    if (event.tcode && event.fulL_NAME) {
      const selectedTest = this.cgTestDefinitionAllData.find(test =>
        test.tcode === event.tcode && test.fulL_NAME === event.fulL_NAME
      );
      if (selectedTest) {
        this.cgTestDefinitionData = selectedTest; // Store the selected test details      
      } else {
        console.warn('Selected test not found');
      }
    } else {
      console.warn('Invalid selection event:', event);
      if (this.hit !== 1) {
        // Default to the last record if no valid selection is made
        this.getRecord("last", this.cgTestDefinitionAllData.length);
      }
    }
    select.clearModel(); // Clear selection in the dropdown
    this.hit = 1; // Set hit flag to indicate a selection has been made
  }

  //Search
  getFilteredTests(term: string): Observable<any[]> {
    const filteredTests = this.cgTestDefinitionAllData.filter(test => this.customSearch(term, test));

    const transformedTests = filteredTests.map(test => ({
      ...test,
      combinedLabel: `${test.tcode} - ${test.fulL_NAME}`
    }));

    return of(transformedTests);
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
        // console.log('error order type')
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
    this.bindCombos("LAB_SECT", this.cgTestDefinitionData.div, this.ArrayLabSection);
    this.bindCombos("LAB_TS", this.cgTestDefinitionData.wc, this.ArrayTestSite);
    if (this.cgTestDefinitionData.mhn) {
      this.bindCombos("RPT_SHDR", this.cgTestDefinitionData.mhn, this.ArraySubHeader);
    }
  }

  onAddRecord() {
    this.isViewMode = false;
    this.isEditMode = true;
    this.form.reset(); // Clear form values for a new record
    this.form.enable(); // Enable all form controls for adding a new record    
    this.submitted = true;
    this.emptyTheForm();
    this.buttonActionStatus();
    this.operation = Operation.add;
    // Reset the dropdown value to empty
    this.cgTestDefinitionData.ct = '';  // Or use null if preferred        
    setTimeout(() => {
      this.el.nativeElement.querySelector('#txtCode').focus();
    }, 500);
    setTimeout(() => {
      this.cgTestDefinitionData.prty = 'RT';
      this.cgTestDefinitionData.status = 'A';
      this.cgTestDefinitionData.ordable = 'Y';
      this.cgTestDefinitionData.pr = 'Y';
    });
    this.stopBackButton();
  }

  buttonActionStatus() {
    this.isAddBtnActive = true;
    this.isSaveBtnActive = false;
    this.istCodeReadonly = false;
    this.isCancelBtnActive = false;
    this.isEditBtnActive = true;
    this.isDeleteBtnActive = true;
    this.isNavigationActive = true;
  }

  calculateTATMin(item: cgTestDefinitionModel): void {
    switch (item.tatu.toLowerCase()) {
      case 'minutes':
      case 'm':
        item.taT_MIN = item.tat;
        break;
      case 'hours':
      case 'h':
        item.taT_MIN = item.tat * 60;
        break;
      case 'days':
      case 'd':
        item.taT_MIN = item.tat * 1440;
        break;
      default:
        item.taT_MIN = 0;  // Set to 0 for unrecognized units       
    }
  }

  onSubmit() {
    this.isEditMode = false;
    this.form.disable(); // Disable all form controls after saving
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
    }
    else {  //Edit 
      this.Update(this.cgTestDefinitionData);
    }
  }

  Add() {
    // Ensure tesT_ID is a string

    if (this.cgTestDefinitionData.tcode && this.cgTestDefinitionData.div && this.cgTestDefinitionData.sect
      && this.cgTestDefinitionData.wc && this.cgTestDefinitionData.ts
      && this.cgTestDefinitionData.mdl && this.cgTestDefinitionData.prfx) {
      if (!this.cgTestDefinitionData.ct) {
        this.cgTestDefinitionData.ct = 'D';
      }
      this._testDirectoryService.insertCGTestDefinition(this.cgTestDefinitionData).subscribe(response => {
        if (response.status === 200 || response.status === 204) {
          // this.getAllEVTestDefinitionData(1, 100);// standard 1,10 todo
          this.getAllCGTestDefinitionData();// standard 1,10 todo
          Swal.fire({
            text: successMessage,
          })
        }
        this.IsDisabled = false;
      },
        error => {
          this.IsDisabled = false;
          const status = error.status;
          if (status === 409) {
            Swal.fire({
              text: warningMessage,
            });
          } else {
            Swal.fire({
              text: errorMessage,
            });
          }
        }
      );
    } else {
      Swal.fire({
        text: REQUIRED_FIELDS,
      });
      this.IsDisabled = false;
      this.isSaveBtnActive = false;
      this.isAddBtnActive = false;
    }
  }

  onEditRecord() {
    this.isGridEditBtnActive = true;
    this.isViewMode = false;
    this.isEditMode = true;
    this.form.enable(); // Enable all form controls for editing
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

  Update(cgTestDefinitionData: cgTestDefinitionModel) {
    // Ensure tesT_ID is a string


    if (this.cgTestDefinitionData.tcode && this.cgTestDefinitionData.div && this.cgTestDefinitionData.sect
      && this.cgTestDefinitionData.wc && this.cgTestDefinitionData.ts
      && this.cgTestDefinitionData.mdl && this.cgTestDefinitionData.prfx)
      this._testDirectoryService.updateCGTestDefinition(cgTestDefinitionData).subscribe(
        (response) => {
          if (response.status === 200 || response.status === 204) {
            Swal.fire({
              text: updateSuccessMessage,
            }).then(() => {
              this.isSaveBtnActive = true;
              this.isEditBtnActive = false;
              this.isCancelBtnActive = true;
              this.isAddBtnActive = false;
            });
          }
        },
        (error) => {
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          }
        }
      );
    this.isNavigationActive = false;
    this.isAddBtnActive = false;
  }

  onDelete(_id: number) {
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._testDirectoryService.deleteCGTestDefinition(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.isEditBtnActive = false;
            this.isAddBtnActive = false;
            this.isDeleteBtnActive = false;
            this.isCancelBtnActive = true;
            this.isSaveBtnActive = true;
            this.getAllCGTestDefinitionData();
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

  onDeleteRecord(_id: number): void {
    const confirmationMessage = _id === 0
      ? "Do you want to cancel this test?"
      : "Do you want to delete this record?";

    const delBtn = confirm(confirmationMessage);

    if (!delBtn) {
      return; // Exit if the user cancels the action
    }

    if (_id === 0) {
      // Handle soft delete for unsaved items (_id = 0)
      const index = this.cgProfileGTDList.findIndex((item) => item.sno === 0);
      if (index > -1) {
        this.cgProfileGTDList.splice(index, 1); // Remove the item
        // const _id = this.cgTestDefinitionData.tesT_ID;
        // this._testDirectoryService.getCGTestDefinitionById(_id);
      } else {
        console.warn("Item with sno = 0 not found in the list.");
      }
    } else {
      // Handle delete for saved records (_id > 0)
      if (_id !== 0) {
        this.deleteProfileItem(_id);
      } else {
        console.warn("Record not deleted. Unsupported condition for _id:", _id);
      }
    }
  }


  deleteProfileItem(_id: number) {
    this._testDirectoryService.deleteCGProfile(_id).subscribe(
      (response: any) => {
        if (response.status === 200 || response.status === 204) {
          this.isEditBtnActive = false;
          this.isAddBtnActive = false;
          this.isDeleteBtnActive = false;
          this.isCancelBtnActive = true;
          this.isSaveBtnActive = true;
          Swal.fire({
            text: deleteMessage,
          });
          // Refresh data upon successful deletion
          this.getCGProfieDataFromGTD(this.cgTestDefinitionData.tcode);
        }
      },
      (error) => {
        console.error("Error caught in component:", error);
        if (error.status === 400) {
          Swal.fire({
            text: deleteErrorMessage,
          });
        }
      }
    );
  }


  onCancelRecord(_id: number) {
    // Disable all form controls to make them read-only  
    this.isGridEditBtnActive = false;
    this.isEditMode = false;
    this.form.disable();
    this.isEditing = false;
    this.isEditBtnActive = false;
    if (this.isEdit) {
      this.operation = Operation.cancel;
      this.cgTestDefinitionData = this.cgTestDefinitionAllData[this.cgTestDefinitionAllData.length - 1]
      const index = this.cgTestDefinitionAllData.findIndex(x => x.tD_ID === _id);
      if (index !== -1) {
        // Restore the original user data
        this.cgTestDefinitionData = this.cgTestDefinitionAllData[index]; // Deep copy to prevent mutation
        this.assignTheValueUsingFormControl();
        this.isCancelBtnActive = true;
        this.isSaveBtnActive = true;
        this.isAddBtnActive = false;
        this.isNavigationActive = false;
      }
    }
    else {
      const maxId = Math.max(...this.cgTestDefinitionAllData.map(item => item.tD_ID));
      const previousRecordId = maxId - 1;

      // Find the record with `tesT_ID` equal to `previousRecordId`
      const previousRecord = this.cgTestDefinitionAllData.find(item => item.tD_ID === previousRecordId);

      if (previousRecord) {
        // Set `evTestDefinitionData` to the found previous record
        this.cgTestDefinitionData = { ...previousRecord }; // Deep copy to avoid mutation
        this.assignTheValueUsingFormControl();
      }
      // Retrieve the last record in the data array     
      this.isAddBtnActive = false;
      this.isNavigationActive = false;
      this.isEditBtnActive = false;
      this.isDeleteBtnActive = false;
      this.isCancelBtnActive = true;
      this.isSaveBtnActive = true;
      this.getAllCGTestDefinitionData();
      //this.emptyTheForm();
    }
  }

  assignTheValueUsingFormControl() {
    const getValue = (controlName: string, defaultValue: string = "0") =>
      this.form.get(controlName)?.value ?? defaultValue;
    this.tdModelData = {
      sno: 0,
      tcode: getValue('txtCode'),
      tesT_ID: getValue('txtdtNumber'),
      fulL_NAME: getValue('txtFullName'),
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
      ct: getValue('cmbCTType'),
      tatu: getValue('tatunits'),
      taT_MIN: getValue('txtMin'),
      tatc: getValue('txtTatc'),
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
    let currentIndex = this.cgTestDefinitionAllData.findIndex(x => x.sno === currentSNO);
    return currentIndex + 1; // Start index is one-based
  }
  displayTable: boolean = true; // Initialize to show the table by default

  // Dropdown to choose the CT Type
  selectDisplayType(event: any): void {
    const selectedValue = event.target.value; // New value selected from the dropdown
    const id = this.cgTestDefinitionData.tD_ID; // Identifier for fetching the current `ctype`

    if (this.isEdit) {
      // Call the API to get the current CType value
      this._testDirectoryService.getCGTestDefinitionById(id).subscribe({
        next: (response: any) => {
          const currentCType = response?.ct; // Extract only the `ct` value

          if (!currentCType) {
            console.error('CT value is missing in the response.');
            Swal.fire({
              text: "Failed to validate CType. Missing data from server.",
              icon: "error",
            });
            return;
          }

          // console.log('Current CType:', currentCType);
          // console.log('Selected CType:', selectedValue);

          // Validate the change based on original CType
          switch (true) {
            // Rule 1: Panel ('G') cannot be changed to Single ('D')
            case currentCType === 'G' && selectedValue === 'D':
              Swal.fire({
                text: "You cannot change a Panel to Single.",
                icon: "warning",
              });

              // Revert the dropdown UI to reflect the original value 
              this.cgTestDefinitionData.ct = currentCType; // Identifier for fetching the current `ctype`

              return;

            // Rule 2: Single ('D') is being changed to Panel ('G')
            case selectedValue === 'G':
              Swal.fire({
                text: "If you change from Single to Panel, you cannot revert back to Single.",
                icon: "info",
                confirmButtonText: "Proceed",
                showCancelButton: true,
                cancelButtonText: "Cancel",
              }).then((result) => {
                if (result.isConfirmed) {
                  // If confirmed, allow the change
                  this.cgTestDefinitionData.ct = selectedValue;
                  // console.log('CType updated successfully to:', this.cgTestDefinitionData.ct);
                } else {
                  // If cancelled, revert the change                 
                  this.getCGProfieDataFromGTD(this.cgTestDefinitionData.tcode);
                  this.cgTestDefinitionData.ct = currentCType;

                  setTimeout(() => {
                    this.cgTestDefinitionData.ct = currentCType; // Reset dropdown to the original value

                  }, 0);
                }
              });
              return;

            // Rule 3: Once Profile ('G') has been set, do not allow reverting back to Single ('D')
            case selectedValue === 'D' && this.cgTestDefinitionData.ct === 'D':
              Swal.fire({
                text: "Once changed to Profile, it cannot be reverted to Single.",
                icon: "warning",
              });
              this.cgTestDefinitionData.ct = 'G';
              // Revert the dropdown UI to reflect the original value
              setTimeout(() => {
                this.cgTestDefinitionData.ct === 'G' // Reset dropdown to the original value
              }, 0);
              return;

            // Default: If no rules violated, update CType
            default:
              // Update CType when change is valid
              this.cgTestDefinitionData.ct = selectedValue;
              // console.log('CType updated successfully to:', this.cgTestDefinitionData.ct);
              break;
          }
        },

        error: (err) => {
          console.error('Error fetching current CType:', err);

          // Show an error message to the user
          Swal.fire({
            text: "Failed to validate CType. Please try again later.",
            icon: "error",
          });

          // Revert the dropdown UI to the original value
          setTimeout(() => {
            event.target.value = this.cgTestDefinitionData.ct;
          }, 0);
        },
      });
    }
  }



  // Right Hand SIde Data 
  addEmptyRowForProfile() {
    const cgOrder = new cgProfileGTDModel();
    cgOrder.gtD_ID = 0;
    cgOrder.tcode = '';
    cgOrder.tcode = '';
    cgOrder.reQ_CODE = '';
    cgOrder.gtdtcode = '';
    cgOrder.profilE_FULLNAME = '';
    this.cgProfileGTDList.push(cgOrder);
    this.cgProfileGTDList.forEach(item => item.isEditing = true);
    setTimeout(() => {
      const inputsArray = this.gtdtcode.toArray();
      if (inputsArray.length) {
        inputsArray[inputsArray.length - 1].nativeElement.focus();
      }
    }, 100);
  }

  // Function to handle keydown event (for handling down arrow key)
  onKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowDown') {
      // If the down arrow is pressed on the last row, add a new row
      if (this.cgTestDefinitionData.ct === 'G') {
        if (index === this.cgProfileGTDList.length - 1) {
          this.addEmptyRowForProfile();
          this.cgProfileGTDList.forEach(item => item.isEditing = true);
        }
      }
    }
  }

  // Helper function to check for duplicates
  private isProfileDuplicate(value: string, index: number): boolean {
    return this.cgProfileGTDList.some((item, i) =>
      item.gtdtcode === value && i !== index // Exclude the current item being edited
    );
  }

  // Method called on blur to initiate the API call and update the specific row
  onSourceCodeChange(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim(); // Trim whitespace for clean input

    if (!value) {
      this.showModal("tcodeModal"); // Display the modal
      this.displayFirstPage();
    }

    // Check if the entered value matches the parent panel's tcode
    if (value === this.cgTestDefinitionData.tcode) {
      Swal.fire({
        text: "Parent Panel cannot be added into the child.",
        icon: "warning",
      });
      //value = ''; // Clear the value
      target.value = ''; // Update the input field to reflect the cleared value
      this.cgProfileGTDList[index].gtdtcode = ''; // Clear the value in the data model
      return; // Exit the method
    }

    // Check for duplicates in the list
    if (this.isProfileDuplicate(value, index)) {
      Swal.fire({
        text: "Test already exists in the list.",
        icon: "warning",
      });
      return; // Exit if a duplicate is found
    }

    // Proceed with the API call if the value is valid
    if (value !== '') {
      const fetchDataObservable = this.getCGProfileByDataByGTDTCode(value);

      if (!fetchDataObservable) {
        Swal.fire({
          title: "No Tests Matched",
          text: "No tests matched your search criteria. Would you like to view all available tests?",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            this.cgTestDefinitionAllData = []; // Clear the list if no matches
            this.showModal("tcodeModal"); // Display the modal
            this.findAllCGTestsData("EMPTY"); // Fetch all available tests
          }
        });
        return;
      }

      // Subscribe to the API response
      fetchDataObservable.subscribe({
        next: (data) => {
          if (data && data.profilE_FULLNAME && data.tcode) {
            // Update the corresponding list item
            const profile = this.cgProfileGTDList[index];
            if (profile) {
              profile.gtno = data.gtD_ID;
              profile.gtno = this.cgTestDefinitionData.tesT_ID;
              profile.tcode = data.tcode;
              profile.reQ_CODE = this.cgTestDefinitionData.tcode;
              profile.dtno = data.tesT_ID;
              profile.profilE_FULLNAME = data.profilE_FULLNAME;
              profile.pndg = data.pndg;
            }
          } else {
            // If data is incomplete, display a warning
            Swal.fire({
              text: "No valid data found for the entered test code.",
              icon: "info",
            });
            this.showModal("tcodeModal");

          }
        },
        error: (err) => {
          if (err.status === 404)
            this.showModal('tcodeModal'); // Show modal in case of an error
          // Safely update the input field value if needed
          const inputElement = document.getElementById("InpTestCode") as HTMLInputElement;
          if (inputElement) {
            inputElement.value = value?.trim() || ""; // Avoid direct assignment, use safe checks         
          }

          // Clear invalid entry
          this.cgProfileGTDList.splice(index, 1);

          // Fetch all available tests for recovery
          this.findAllCGTestsData("EMPTY");
        },
      });
    }
    this.findAllCGTestsData("EMPTY");
  }

  onModalClose(): void {
    // Reset any relevant variables or states
    // Clear the search result or perform cleanup
    if (this.cgProfileSearchList?.length === 0 || this.cgProfileSearchList?.length > 0) {
      this.cgProfileSearchList = []; // Ensure no residual data
      this.cgProfileGTDList = [];
      this.getCGProfieDataFromGTD(this.cgTestDefinitionData.tcode);
      // console.log('Modal closed, cleaned up state.');
    }
  }

  // Method to call the API and update the source name for the specific item
  getCGProfileByDataByGTDTCode(profileTCode: string) {
    return this._testDirectoryService.getCGProfileFromGTDByTCode(profileTCode);
  }

  findAllCGTestsData(search: string) {
    this._testDirectoryService.getAllCGProfiles(search).subscribe((data) => {
      if (data) {
        this.cgProfileSearchList = data;
        this.hasData = this.cgProfileSearchList.length > 0;
      } else {
        Swal.fire({
          text: "No tests matched your search criteria.",
          icon: "info"
        });

      }
    })
  }


  // Show modal function to encapsulate modal display logic
  private showModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    const myModal = new Modal(modalElement);
    myModal.show();
  }

  insertProfileList() {
    if (this.cgProfileGTDList && this.cgProfileGTDList.length) {
      // Call the service to insert data since the table is empty    
      this._testDirectoryService.insertCGProfile(this.cgProfileGTDList).subscribe(
        response => {
          if (response.status === 200 || response.status === 204) {
            //this.getAllEVTestDefinitionData(); // Refresh data if the call was successful
            Swal.fire({
              text: "Data successfully submitted.",
            });
          }
          this.IsDisabled = false;
          this.cgProfileGTDList.forEach(item => item.isEditing = false);
          this.isGridEditing = false;
          this.isSubmitBtnActive = true;
        },
        error => {
          this.IsDisabled = false;
          const status = error.status;
          if (status === 409) {
            Swal.fire({
              text: "Data conflict. Entry already exists.",
            });
          } else {
            Swal.fire({
              text: "An error occurred while submitting data.",
            });
          }
        }
      );
    }
  }

  updateProfileList() {
    if (this.cgProfileGTDList && this.cgProfileGTDList.length) {
      // Call the service to update data since the table has values     
      this._testDirectoryService.updateCGProfile(this.cgProfileGTDList).subscribe(
        response => {
          if (response.status === 200 || response.status === 204) {
            //this.getAllEVTestDefinitionData(); // Refresh data if the call was successful
            Swal.fire({
              text: "Data successfully updated.",
            });
          }
          this.IsDisabled = false;
          this.cgProfileGTDList.forEach(item => item.isEditing = false);
          this.isGridEditing = false;
          this.isSubmitBtnActive = true;

        },
        error => {
          this.IsDisabled = false;
          const status = error.status;
          if (status === 409) {
            Swal.fire({
              text: "Data conflict. Entry already exists.",
            });
          } else {
            Swal.fire({
              text: "An error occurred while updating data.",
            });
          }
        }
      );
    }
  }

  onSubmitList() {
    if (this.cgProfileGTDList.length > 1) {
      this.updateProfileList();
    } else {
      this.insertProfileList();
    }
  }

  bindProfileGrid(): void {
    if (this.cgProfileGTDList.length === 0) {
      this.addEmptyRowForProfile();
    }
    // Set all items to editing mode if there are items in `evProfileGTDList`
    const shouldEdit = this.cgProfileGTDList.length > 0;
    this.cgProfileGTDList.forEach(item => item.isEditing = shouldEdit);
  }

  // Function to handle Edit/Save button click
  toggleEditTests() {
    this.isGridEditing = !this.isGridEditing;
    this.isSubmitBtnActive = false;
    if (this.isGridEditing) {
      // Start editing: add an empty row and set the focus on the new row.
      this.isNavigationActive = true;
      this.bindProfileGrid();
    } else {
      // Cancel editing: clear any newly added row.
      this.cancelEdit();
      this.isNavigationActive = false;
    }
  }

  cancelEdit() {
    this.isSubmitBtnActive = true;
    // Remove the last empty row if one was added during editing
    if (this.cgProfileGTDList.length > 0 && this.isRowEmpty(this.cgProfileGTDList[this.cgProfileGTDList.length - 1])) {
      this.cgProfileGTDList.pop();
    }
    // Reset editing mode for all items
    // this.getCGTestDefinitionDataByUserId(this.cgTestDefinitionData.tesT_ID);
    this.cgProfileGTDList.forEach(item => item.isEditing = false);
    this.getCGProfieDataFromGTD(this.cgTestDefinitionData.tcode);
  }

  isRowEmpty(row: cgProfileGTDModel): boolean {
    return !row.gtdtcode && !row.profilE_FULLNAME && !row.pndg;
  }

  getCGTestDefinitionDataByUserId(id: number) {
    this._testDirectoryService.getCGTestDefinitionById(id).subscribe((data) => {
      if (data) {
        this.cgTestDefinitionAllData = data;
      } else {
        this._commonAlertService.notFoundMessage();
      }
    })
  }

  getAllCGProfilesDataByGTDTCode(search: string) {
    this._testDirectoryService.getAllCGProfiles(search).subscribe((data) => {
      if (data) {
        this.cgProfileSearchList = data;
      } else {
        console.error('Data not found:', data);
      }
    })
  }

  onSearchProfile() {
    const InpTestCode = document.getElementById("InpTestCode") as HTMLInputElement;
    if (InpTestCode.value != '')
      setTimeout(() => {
        this.findAllCGTestsData(InpTestCode.value);
        this.displayFirstPage();
      }, 2000); // Adjust the time as needed (3000 ms = 3 seconds);
    else
      setTimeout(() => {
        this.findAllCGTestsData("EMPTY");
        this.displayFirstPage();
      }, 2000); // Adjust the time as needed (3000 ms = 3 seconds);
  }

  // Function to add a selected record from the search results to the second table 
  addTD(item: any): void {
    // Remove any existing empty rows from evReferenceRangeList
    if (item.gtdtcode === this.cgTestDefinitionData.tcode) {
      Swal.fire({
        text: "Parent Panel cannot be added into the child.",
        icon: "warning",
      });
      item.value = ''; // Clear the input field value
      return; // Exit the method
    }
    if (this.cgTestDefinitionData.ct === 'G') {
      this.cgProfileGTDList = this.cgProfileGTDList.filter(row =>
        row.gtdtcode && row.profilE_FULLNAME && row.pndg !== undefined
      );

      // Prevent duplicates before adding
      const exists = this.cgProfileGTDList.some((existingItem) => existingItem.gtdtcode === item.gtdtcode);
      if (exists) {
        Swal.fire({
          text: "Record already exists in the list.",
          icon: "warning"
        });
        return;
      }

      // Add selected item to the evReferenceRangeList in editing mode
      this.cgProfileGTDList.push({
        ...item,
        tcode: this.cgTestDefinitionData.tcode,
        reQ_CODE: this.cgTestDefinitionData.tcode,
        isEditing: true  // Ensure new row is added in editable mode
      });

    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  onPageSizeChange(event: any): void {
    this.itemsPerPage = event;
    this.currentPage = 1; // Reset to first page when page size changes
    this.updatePagination();
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.cgProfileSearchList.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, totalPages) || 1;
  }

  // Method to display the first 10 records after search data populates
  displayFirstPage(): void {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.updatePagination();
  }

  getRecord(input: string, SNO: number) {
    const totalRecords = this.cgTestDefinitionAllData.length;
    if (totalRecords === 0) {
      console.warn('No records available.');
      return;
    }

    const primaryTCode = this.cgTestDefinitionAllData[0]?.tcode;
    if (this.cgProfileGTDList[0]) {
      this.cgProfileGTDList[0].tcode = primaryTCode;
      this.cgProfileGTDList[0].reQ_CODE = primaryTCode;
    }

    // Select record based on input type
    switch (input) {
      case 'first':
        if (this.cgTestDefinitionData?.sno === 1) {
          this._commonAlertService.firstRecord();
          return;
        }
        this.cgTestDefinitionData = this.cgTestDefinitionAllData[0];
        break;

      case 'prev':
        if (SNO > 1) {
          this.cgTestDefinitionData = this.cgTestDefinitionAllData.find(record => record.sno === SNO - 1) || null;
        }
        break;

      case 'next':
        if (SNO < totalRecords) {
          this.cgTestDefinitionData = this.cgTestDefinitionAllData.find(record => record.sno === SNO + 1) || null;
        }
        break;

      case 'last':
        if (this.cgTestDefinitionData?.sno === totalRecords) {
          this._commonAlertService.lastRecord();
          return;
        }
        this.cgTestDefinitionData = this.cgTestDefinitionAllData[totalRecords - 1];
        break;

      default:
        console.warn('Invalid input type:', input);
        return;
    }

    // Execute method based on the `ct` property if valid data is found
    if (this.cgTestDefinitionData) {
      const ct = this.cgTestDefinitionData.ct;
      if (ct === 'G' && this.cgTestDefinitionData.tcode)
        this.getCGProfieDataFromGTD(this.cgTestDefinitionData.tcode);
    } else {
      console.warn('No record found for the specified SNO:', SNO);
    }
  }
}


