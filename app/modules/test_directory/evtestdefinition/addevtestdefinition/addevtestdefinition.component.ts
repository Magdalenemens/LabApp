import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';
import { successMessage, warningMessage, errorMessage, REQUIRED_FIELDS, updateSuccessMessage, deleteMessage, deleteErrorMessage, BAD_REQUEST_ERROR_MESSAGE } from 'src/app/common/constant';
import { Operation } from 'src/app/common/enums';
import { tdComboModel } from 'src/app/models/tdComboModel';
import { GTModel, TDModel } from 'src/app/models/tdmodel';
import { OrderentryService } from 'src/app/modules/orderprocessing/orderentry/add-orderentry/orderentry.service';
import Swal from 'sweetalert2';
import { AddTestDirectoryService } from '../../test-definition/add-test-directory/add-test-directory.service';
import { evProfiledModel, evProfileGTDModel, evTDReferenceRangeModel, evTestDefinitionModel, anlMethodModel } from 'src/app/models/evTestDefinitionModel ';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { NgSelectComponent } from '@ng-select/ng-select';
import { fromEvent, Observable, of, Subject, takeUntil } from 'rxjs';
import { Alert, Modal } from 'bootstrap';
import { CanComponentDeactivate } from '../../../../models/canComponentDeactivate';
import { DivisionService } from 'src/app/modules/masters/divisions/division.service';
import { SectionService } from 'src/app/modules/masters/sections/section.service';

@Component({
  selector: 'app-addevtestdefinition',
  templateUrl: './addevtestdefinition.component.html',
  styleUrls: ['./addevtestdefinition.component.scss']
})

export class AddevtestdefinitionComponent implements CanComponentDeactivate {
  @ViewChildren('gtdtcode') gtdtcode: QueryList<ElementRef>;
  @ViewChildren('s_TYPE') s_TYPE: QueryList<ElementRef>;

  form: any;
  formGroup: any;
  isEditMode = false;
  tdModelData: any;
  operation = 0; // 0 means show, 1 means add,2 means edit, 3 means delete // make enum for operation

  evTestDefinitionAllData: evTestDefinitionModel[] = [];
  evReferenceRangeList: evTDReferenceRangeModel[] = [];
  evReferenceRangeSearchList: evTDReferenceRangeModel[] = [];
  evReferenceRangeData: evTDReferenceRangeModel = new evTDReferenceRangeModel();
  evTestDefinitionData: evTestDefinitionModel = new evTestDefinitionModel();
  tdCombos: tdComboModel = new tdComboModel();

  anlMethodAllData: anlMethodModel[] = [];
  anlMethodData: anlMethodModel = new anlMethodModel();

  evTestDefinitionProfileAllData: evProfiledModel[] = [];
  evProfileGTDList: evProfileGTDModel[] = [];
  evProfileGTDData: evProfileGTDModel = new evProfileGTDModel();
  evProfileData: evProfiledModel = new evProfiledModel();
  evProfileSearchList: evProfileGTDModel[] = [];
  evGTDData: GTModel[] = [];

  //Search and Pagination
  matchedTests$!: Observable<evTestDefinitionModel[]>;
  hit: number = 0;
  tdSearchList: evTestDefinitionModel[] = [];
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
  isCancelBtnActive: boolean = true;
  sectionDropDown: any;

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


  selectedAccnPrefix: string = "";
  selectedtestTemp: string = "";
  selectedMainHeader: string = "";
  selectedSubHeader: string = "";
  selectedMethod: string = "";
  selectedMethodDetails: string = "";
  selectedUnits: string = "";


  objAccnPrefix: string = "";
  objTestTemplate: string = "";
  objInstrument: string = "";
  objSHN: string = "";
  objMTHD: string = "";
  objLabModule: string = "";
  objResultType: string = "";
  objUnits: string = "";
  prevDivvalue: string = "";

  public ordertype: any[] = [];
  public ArrayLabModule: any[] = [];
  public ArrayResultType: any[] = [];
  public ArrayAccnPrefix: any[] = [];
  public ArrayTestTemplate: any[] = [];
  public ArrayMainHeader: any[] = [];
  public ArraySubHeader: any[] = [];
  public ArrayMethod: any[] = [];
  public ArrayMethodDetails: any[] = [];
  public ArrayUnits: any[] = [];

  currentPage: any;


  //Pagination 
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  divisionList: any[] = [];
  sectionList: any[] = [];

  selectedDivision: any;
  selectedSection: any;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder, private el: ElementRef,
    private _testDirectoryService: AddTestDirectoryService, private cdr: ChangeDetectorRef,
    private _commonAlertService: CommonAlertService, private _divisionService: DivisionService,
    private _sectionService: SectionService) {
    this.initializeForm();
    this.stopSiteReload();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      txtCode: new FormControl({ value: '', disabled: true }, Validators.required),
      txtdtNumber: new FormControl({ value: '', disabled: true }),
      txtFullName: new FormControl({ value: '', disabled: true }),
      txtSynm: new FormControl({ value: '', disabled: true }),
      cmblabModule: new FormControl({ value: this.tdCombos[0], disabled: true }),
      cmbResultType: new FormControl({ value: this.tdCombos[0], disabled: true }),
      cmbPriority: new FormControl({ value: '', disabled: true }),
      cmbStatus: new FormControl({ value: '', disabled: true }),
      cmbunits: new FormControl({ value: '', disabled: true }),
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
      txtnoofDecimals: new FormControl({ value: '', disabled: true }),
      cmbCTType: new FormControl({ value: '', disabled: true }),
      cmbMethod: new FormControl({ value: '', disabled: true }),
      cmbMethodDetails: new FormControl({ value: '', disabled: true }),
      tatunits: new FormControl({ value: '', disabled: true }),
      txtMin: new FormControl({ value: '', disabled: true }),
      txtTatc: new FormControl({ value: '', disabled: true }),
      txtuPrice: new FormControl({ value: '', disabled: true })

    });
  }

  ngOnInit(): void {
    // this will stop the back button
    this.stopBackButton();
    $('#btnaddtestdefinition').addClass("is-active");
    this.evReferenceRangeSearchList = [];
    this.evProfileSearchList = [];
    this.evProfileGTDList = [];
    this.getAllEVTestDefinitionData();
    this.bindCombos("SYS_MDL", "1", this.ArrayLabModule);
    this.bindCombos("RESTYPE", "1", this.ArrayResultType);
    this.bindCombos("ACCNPRFX", "1", this.ArrayAccnPrefix);
    this.bindCombos("RS_TMPLT", "1", this.ArrayTestTemplate);
    this.bindCombos("EV_SUBHDR", "1", this.ArrayMainHeader);
    this.bindCombos("ANL_MTHD", "1", this.ArrayMethod);
    this.bindCombos("SHRD_TBL", "1", this.ArrayUnits);
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
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


  // Get All TD data fro Left Hand Side Form
  getAllEVTestDefinitionData(): void {
    this._testDirectoryService.getAllEVTestDefinition().subscribe(res => {
      this.evTestDefinitionAllData = res;
      //Navigation
      const lastRecordId = this.evTestDefinitionAllData.length - 1;
      this.getRecord("last", lastRecordId);
      //Fetch Reference Range Data Basd on Tcode 
      this.getReferenceRangeTCodeDataFromTD(this.evTestDefinitionData.tcode);
      this.getEVProfieDataFromGTD(this.evTestDefinitionData.tcode);
      this.activateTestIdField();
      this.matchedTests$ = this.getFilteredTests('');
      this.GetDivisionData();
      this.GetSectionData();
    },
      (error) => {
        console.error('Error loading list:', error);
      })
  }

  activateTestIdField() {
    this.isViewMode = true;
  }

  // Get All Reference Range Data base on Tcode for right
  getReferenceRangeTCodeDataFromTD(tCode: string) {
    this._testDirectoryService.getReferenceRangeTCodeFromTD(tCode).subscribe((data) => {
      if (data) {
        this.evReferenceRangeList = data;
      } else {
        console.error('Data not found:', data);
      }
    })
  }

  getEVProfieDataFromGTD(tCode: string) {
    this._testDirectoryService.getEVProfileFromGTD(tCode).subscribe((data) => {
      if (data) {
        this.evProfileGTDList = data;
      } else {
        console.error('GTD data not found:', data);
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

  refLowAndHighnumberOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    // Allow numbers (0-9), decimal point (.), and control characters (like backspace)
    if (
      charCode > 31 && // Allow control characters
      (charCode < 48 || charCode > 57) && // Not a number
      charCode !== 46 // Not a decimal point
    ) {
      return false; // Block the input
    }

    // Get the input element and its current value
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    // Prevent multiple decimal points
    if (charCode === 46 && inputValue.includes('.')) {
      return false; // Block additional decimal points
    }

    return true; // Allow the input
  }

  // Custom search function
  customSearch(term: string, item: evTestDefinitionModel): boolean {
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

  //Search
  onTestSelection(event: any, select: NgSelectComponent): void {
    //console.log('Selection Event:', event); // Debugging log

    // Ensure event exists and has valid properties
    if (!event || typeof event !== 'object') {
      console.warn('Invalid selection event:', event);
      return;
    }

    // Check if the selected event has expected properties
    if (!event.tcode || !event.fulL_NAME) {
      console.warn('Incomplete selection event:', event);
      return;
    }

    // Find the selected test
    const selectedTest = this.evTestDefinitionAllData.find(test =>
      test.tcode === event.tcode && test.fulL_NAME === event.fulL_NAME
    );

    if (selectedTest) {
      this.evTestDefinitionData = selectedTest; // Store selected test details

      if (selectedTest.ct !== 'G') {
        this.getReferenceRangeTCodeDataFromTD(selectedTest.tcode); // Update grid data
      } else {
        this.getEVProfieDataFromGTD(selectedTest.tcode); // Update grid data
      }
    } else {
      console.warn('Test not found for selection:', event);
    }

    select.clearModel(); // Clear selection in the dropdown
    this.hit = 1; // Set hit flag to indicate a selection has been made
  }


  //Search
  getFilteredTests(term: string): Observable<any[]> {
    const filteredTests = this.evTestDefinitionAllData.filter(test => this.customSearch(term, test));

    const transformedTests = filteredTests.map(test => ({
      ...test,
      combinedLabel: `${test.tcode} - ${test.fulL_NAME}`
    }));

    return of(transformedTests);
  }

  // To get the maxtestid for insert
  testCodeChange() {
    if (!this.isEdit) {
      const param1 = "TD";
      const param2 = "TEST_ID";
      this.getMaxTestIDFromTD(param1, param2);
      // Assign the previously calculated maxTestId to the test ID field
      const txtName = document.getElementById('txtFullName') as HTMLElement;
      if (txtName) {
        txtName.focus(); // Set focus on the input element
      }

      setTimeout(() => {
        this.el.nativeElement.querySelector('#txtFullName').focus();
      }, 500);
    }
  }

  getMaxTestIDFromTD(param: string, param1: string): void {
    this._testDirectoryService.getMaxValueFromTestID(param, param1).subscribe({
      next: (res) => {
        // Assuming res is an object, extract the relevant value
        if (res) {
          this.evTestDefinitionData.tesT_ID = res.maxValue + 1; // Assuming the response has a 'value' property
        }
        // Set focus on the input element
        this.setFocusToFullNameInput();
      },
      error: (err) => {
        console.error('Error fetching max value:', err);
        Swal.fire({
          text: 'An error occurred while fetching the maximum value.',
          icon: 'error',
        });
      }
    });
  }

  private setFocusToFullNameInput(): void {
    const txtName = document.getElementById('txtFullName') as HTMLElement;
    if (txtName) {
      txtName.focus();
    } else {
      setTimeout(() => {
        const inputElement = this.el.nativeElement.querySelector('#txtFullName');
        if (inputElement) {
          inputElement.focus();
        }
      }, 500);
    }
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
    if (comboname === 'Method') {
      const methodId = Number(event.split('-')[0]?.trim());
      this.evTestDefinitionData.anL_MTHD_ID = methodId;
    } else {
      switch (comboname) {
        case 'Instrument':
          this.objInstrument = event;
          break;
        case 'LabModule':
          this.objLabModule = event;
          break;
        case 'ResultType':
          this.objResultType = event;
          break;
        case 'Method':
          this.objMTHD = event;
          break;
        case 'ShrdTbl':
          this.objMTHD = event;
          break;
      }
    }
  }

  bindChildDropdowns() {
    if (this.evTestDefinitionData.mhn) {
      this.bindCombos("ANL_MTHD", this.evTestDefinitionData.mhn, this.ArrayMethodDetails);
    }
  }

  onAddRecord() {
    this.isViewMode = false;
    this.isEditMode = true;
    this.form.reset(); // Clear form values for a new record
    this.form.enable(); // Enable all form controls for adding a new record
    this.evReferenceRangeList = [];
    this.submitted = true;
    this.emptyTheForm();
    this.buttonActionStatus();
    this.operation = Operation.add;
    // Reset the dropdown value to empty
    this.evTestDefinitionData.ct = '';  // Or use null if preferred        
    setTimeout(() => {
      this.el.nativeElement.querySelector('#txtCode').focus();
    }, 500);
    setTimeout(() => {
      this.evTestDefinitionData.prty = 'RT';
      this.evTestDefinitionData.status = 'A';
      this.evTestDefinitionData.ordable = 'Y';
      this.evTestDefinitionData.pr = 'Y';
      this.evTestDefinitionData.ct = 'D';
      this.evTestDefinitionData.prfx = 'EV';
      this.evTestDefinitionData.mdl = 'EV';
      this.evTestDefinitionData.rstp = 'E';
      this.evTestDefinitionData.div = '09';
      this.evTestDefinitionData.sect = '900';
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

  calculateTATMin(item: evTestDefinitionModel): void {
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


  // Fetch only the division where div == '09'
  GetDivisionData(): void {
    this._divisionService.getAllDivision().subscribe(
      (res) => {
        this.divisionList = res.filter(x => x.div === this.evTestDefinitionData.div);
        this.selectedDivision = this.divisionList.length ? this.divisionList[0] : null;
      },
      (error) => console.error("Error loading division data:", error)
    );
  }

  // Fetch only the section where sect == '900'
  GetSectionData(): void {
    this._sectionService.getAllSection().subscribe(
      (res) => {
        const divNumber = this.evTestDefinitionData.div.split(' - ')[0]; // Extract only the number
        this.sectionList = res.filter(x => x.sect === this.evTestDefinitionData.sect && x.div.split(' - ')[0] === divNumber);
        this.selectedSection = this.sectionList.length ? this.sectionList[0] : null;
      },
      (error) => console.error("Error loading section data:", error)
    );
  }

  // onSubmit() {
  //   this.isEditMode = false;
  //   this.form.disable(); // Disable all form controls after saving
  //   this.isEditing = false;
  //   this.operation = Operation.submit;
  //   if (!this.isEdit) {
  //     this.isSaveBtnActive = true;
  //     this.isCancelBtnActive = true;
  //     this.isEditBtnActive = false;
  //     this.isDeleteBtnActive = false;
  //     this.isNavigationActive = false;
  //     this.isAddBtnActive = false;
  //     this.Add();
  //     this.IsDisabled = true;
  //     this.assignTheValueUsingFormControl();
  //   }
  //   else {  //Edit 
  //     this.Update(this.evTestDefinitionData);
  //   }
  // }

  onSubmit() {
    const { tcode, mdl, prfx } = this.evTestDefinitionData;

    // Check if all required fields are filled
    if (!(tcode && mdl && prfx)) {
      this.isSaveBtnActive = false; // Disable the submit button

      Swal.fire({
        text: REQUIRED_FIELDS,       
        allowOutsideClick: false
      }).then(() => {
        // Focus on 'txtCode' after the alert is closed
        setTimeout(() => this.el.nativeElement.querySelector('#txtCode')?.focus(), 0);
      });

      return;
    }

    // Enable submit button when all fields are filled
    this.isSaveBtnActive = true;

    // Proceed with submission logic
    this.isEditMode = false;
    this.form.disable();
    this.isEditing = false;
    this.operation = Operation.submit;

    if (!this.isEdit) {
      this.isCancelBtnActive = true;
      this.isEditBtnActive = false;
      this.isDeleteBtnActive = false;
      this.isNavigationActive = false;
      this.isAddBtnActive = false;
      this.IsDisabled = true;

      this.Add();
      this.assignTheValueUsingFormControl();
    } else {
      this.Update(this.evTestDefinitionData);
    }
  }

  Add() {
    if (this.evTestDefinitionData.tcode && this.evTestDefinitionData.mdl && this.evTestDefinitionData.prfx) {
      if (!this.evTestDefinitionData.ct) {
        this.evTestDefinitionData.ct = 'D';
      }
      this._testDirectoryService.insertEVTestDefinition(this.evTestDefinitionData).subscribe(response => {
        if (response.status === 200 || response.status === 204) {
          // this.getAllEVTestDefinitionData(1, 100);// standard 1,10 todo
          this.getAllEVTestDefinitionData();// standard 1,10 todo
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

  Update(evTestDefinitionData: evTestDefinitionModel) {
    if (this.evTestDefinitionData.tcode && this.evTestDefinitionData.mdl && this.evTestDefinitionData.prfx)
      this._testDirectoryService.updateEVTestDefinition(evTestDefinitionData).subscribe(
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
      this._testDirectoryService.deleteEVTestDefinition(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.isEditBtnActive = false;
            this.isAddBtnActive = false;
            this.isDeleteBtnActive = false;
            this.isCancelBtnActive = true;
            this.isSaveBtnActive = true;
            this.getAllEVTestDefinitionData();
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
              text: BAD_REQUEST_ERROR_MESSAGE,
            });
          }
        });
    }
  }

  onDeleteRecord(_id: number, index: number) {
    const delBtn = confirm(
      _id === 0 ? "Do you want to cancel this test?" : "Do you want to delete this record?"
    );

    if (delBtn) {
      // Soft delete case: for unsaved items (non-DB entries) with _id = 0
      if (_id === 0) {
        const index = this.evReferenceRangeList.findIndex((item) => item.sno === 0);
        if (index > -1) {
          this.evReferenceRangeList.splice(index, 1); // Remove the item from the list
        }
        else {
          const index = this.evProfileGTDList.findIndex((item) => item.sno === 0);
          if (index > -1) {
            this.evProfileGTDList.splice(index, 1); // Remove the item from the list
          }
        }
      } else {
        if (this.evTestDefinitionData.ct !== 'G') {
          this.evReferenceRangeList.splice(index, 1); // Remove the item from the list
          this.deleteReferenceRangeItem(_id);
        }
        else {
          this.evProfileGTDList.splice(index, 1); // Remove the item from the list
          this.deleteProfileItem(_id);
        }
        // API delete case: for saved records
      }
    }
  }

  deleteReferenceRangeItem(_id: number) {
    this._testDirectoryService.deleteEVReferenceRange(_id).subscribe(
      (response: any) => {
        if (response.status === 200 || response.status === 204) {
          this.isEditBtnActive = false;
          this.isAddBtnActive = false;
          this.isDeleteBtnActive = false;
          this.isCancelBtnActive = true;
          this.isSaveBtnActive = true;
          // Swal.fire({
          //   text: deleteMessage,
          // });
          // Refresh data upon successful deletion
          // this.getAllEVTestDefinitionData();
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

  deleteProfileItem(_id: number) {
    this._testDirectoryService.deleteEVProfile(_id).subscribe(
      (response: any) => {
        if (response.status === 200 || response.status === 204) {
          this.isEditBtnActive = false;
          this.isAddBtnActive = false;
          this.isDeleteBtnActive = false;
          this.isCancelBtnActive = true;
          this.isSaveBtnActive = true;
          // Swal.fire({
          //   text: deleteMessage,
          // });
          // Refresh data upon successful deletion
          // this.getAllEVTestDefinitionData();
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
    this.isEditMode = false;
    this.form.disable();
    this.isEditing = false;
    this.isEditBtnActive = false;
    if (this.isEdit) {
      this.operation = Operation.cancel;
      this.evTestDefinitionData = this.evTestDefinitionAllData[this.evTestDefinitionAllData.length - 1]
      const index = this.evTestDefinitionAllData.findIndex(x => x.tD_ID === _id);
      if (index !== -1) {
        // Restore the original user data
        this.evTestDefinitionData = this.evTestDefinitionAllData[index]; // Deep copy to prevent mutation
        this.assignTheValueUsingFormControl();
        this.isCancelBtnActive = true;
        this.isSaveBtnActive = true;
        this.isAddBtnActive = false;
        this.isNavigationActive = false;
      }
    }
    else {
      const maxId = Math.max(...this.evTestDefinitionAllData.map(item => item.tD_ID));
      const previousRecordId = maxId - 1;

      // Find the record with `tD_ID` equal to `previousRecordId`
      const previousRecord = this.evTestDefinitionAllData.find(item => item.tD_ID === previousRecordId);

      if (previousRecord) {
        // Set `evTestDefinitionData` to the found previous record
        this.evTestDefinitionData = { ...previousRecord }; // Deep copy to avoid mutation
        this.assignTheValueUsingFormControl();
      }
      // Retrieve the last record in the data array     
      this.isAddBtnActive = false;
      this.isNavigationActive = false;
      this.isEditBtnActive = false;
      this.isDeleteBtnActive = false;
      this.isCancelBtnActive = true;
      this.isSaveBtnActive = true;
      this.getAllEVTestDefinitionData();
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
      fulL_NAME: getValue('txtFullName'),
      s_TYPE: getValue('cmbSpecimenstypes'),
      prty: getValue('cmbPriority'),
      status: getValue('cmbStatus'),
      ordable: getValue('cmbunits'),
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
      dec: getValue('txtnoofDecimals'),
      ct: getValue('cmbCTType'),
      mthd: getValue('cmbMethod'),
      mthddetails: getValue('cmbMethodDetails'),
      tatu: getValue('tatunits'),
      taT_MIN: getValue('txtMin'),
      tatc: getValue('txtTatc'),
      uprice: getValue('txtuPrice')
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
    let currentIndex = this.evTestDefinitionAllData.findIndex(x => x.sno === currentSNO);
    return currentIndex + 1; // Start index is one-based
  }
  displayTable: boolean = true; // Initialize to show the table by default

  // Dropdown to choose the CT Type
  selectDisplayType(event: any): void {
    const selectedValue = event.target.value; // New value selected from the dropdown
    const id = this.evTestDefinitionData.tD_ID; // Identifier for fetching the current `ctype`

    // Call the API to get the current CType value
    if (this.isEdit) {
      this._testDirectoryService.getEVTestDefinitionById(id).subscribe({
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
            // Rule 1: Profile ('G') cannot be changed to Single ('D')
            case currentCType === 'G' && selectedValue === 'D':
              Swal.fire({
                text: "You cannot change a Profile to Single.",
                icon: "warning",
              });

              // Revert the dropdown UI to reflect the original value 
              this.evTestDefinitionData.ct = currentCType; // Identifier for fetching the current `ctype`

              return;

            // Rule 2: Single ('D') is being changed to Profile ('G')
            case selectedValue === 'G':
              Swal.fire({
                text: "If you change from Single to Profile, you cannot revert back to Single.",
                icon: "info",
                confirmButtonText: "Proceed",
                showCancelButton: true,
                cancelButtonText: "Cancel",
              }).then((result) => {
                if (result.isConfirmed) {
                  // If confirmed, allow the change
                  this.evTestDefinitionData.ct = selectedValue;
                  //console.log('CType updated successfully to:', this.evTestDefinitionData.ct);
                } else {
                  // If cancelled, revert the change
                  this.getEVProfieDataFromGTD(this.evTestDefinitionData.tcode);
                  this.evTestDefinitionData.ct = currentCType;
                  setTimeout(() => {
                    this.evTestDefinitionData.ct = currentCType; // Reset dropdown to the original value
                  }, 0);
                }
              });
              return;

            // Rule 3: Once Profile ('G') has been set, do not allow reverting back to Single ('D')
            case selectedValue === 'D' && this.evTestDefinitionData.ct === 'D':
              Swal.fire({
                text: "Once changed to Panel, it cannot be reverted to Single.",
                icon: "warning",
              });
              this.evTestDefinitionData.ct = 'G';
              // Revert the dropdown UI to reflect the original value
              setTimeout(() => {
                this.evTestDefinitionData.ct === 'G' // Reset dropdown to the original value
              }, 0);
              return;

            // Default: If no rules violated, update CType
            default:
              // Update CType when change is valid
              this.evTestDefinitionData.ct = selectedValue;
              // console.log('CType updated successfully to:', this.evTestDefinitionData.ct);
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
            event.target.value = this.evTestDefinitionData.ct;
          }, 0);
        },
      });
    }
  }

  // Right Hand SIde Data 

  addEmptyRow() {
    const envOrder = new evTDReferenceRangeModel();
    envOrder.tcode = '';
    envOrder.tesT_ID = 0;
    envOrder.s_TYPE = '';
    envOrder.sP_DESCRP = '';
    envOrder.lhf = '';
    envOrder.reF_LOW = '';
    envOrder.reF_HIGH = '';
    this.evReferenceRangeList.push(envOrder);
    this.evReferenceRangeList.forEach(item => item.isEditing = true);
    setTimeout(() => {
      const inputsArray = this.s_TYPE.toArray();
      if (inputsArray.length) {
        inputsArray[inputsArray.length - 1].nativeElement.focus();
      }
    }, 100);
  }


  addEmptyRowForProfile() {
    const envOrder = new evProfileGTDModel();
    envOrder.gtD_ID = 0;
    envOrder.tcode = '';
    envOrder.tcode = '';
    envOrder.reQ_CODE = '';
    envOrder.gtdtcode = '';
    envOrder.profilE_FULLNAME = '';
    this.evProfileGTDList.push(envOrder);
    this.evProfileGTDList.forEach(item => item.isEditing = true);
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
      if (index === this.evReferenceRangeList.length - 1 && this.evTestDefinitionData.ct !== 'G') {
        this.addEmptyRow();
        this.evReferenceRangeList.forEach(item => item.isEditing = true);
      }
      else {
        if (index === this.evProfileGTDList.length - 1) {
          this.addEmptyRowForProfile();
          this.evProfileGTDList.forEach(item => item.isEditing = true);
        }
      }
    }
  }

  // Helper function to check for duplicates
  private isDuplicate(value: string, index: number): boolean {
    return this.evReferenceRangeList.some((item, i) =>
      item.s_TYPE === value && i !== index // Exclude the current item being edited
    );
  }

  // Helper function to check for duplicates
  private isProfileDuplicate(value: string, index: number): boolean {
    return this.evProfileGTDList.some((item, i) =>
      item.gtdtcode === value && i !== index // Exclude the current item being edited
    );
  }

  // Method called on blur to initiate the API call and update the specific row
  onSourceCodeChange(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    // Show modal if sType is empty
    if (!value) {
      const ctType = this.evTestDefinitionData.ct;
      switch (ctType) {
        case 'D':
          // Fetch all available tests for recovery         
          this.getAllReferenceRangeDataByType("EMPTY");
          this.displayFirstPage();
          break;
        case 'G':
          // Fetch all available tests for recovery         
          this.getAllProfilesDataByGTDTCode("EMPTY");
          this.displayFirstPage();
          break;
        default:
          console.warn('Invalid input type:', ctType);
          return;
      }
      this.showModal('tcodeModal');

      return;
    }

    // Check if the entered value matches the parent panel's tcode
    if (value === this.evTestDefinitionData.tcode) {
      Swal.fire({
        text: "Parent Panel cannot be added into the child.",
        icon: "warning",
      });
      //value = ''; // Clear the value
      target.value = ''; // Update the input field to reflect the cleared value
      this.evProfileGTDList[index].gtdtcode = ''; // Clear the value in the data model
      return; // Exit the method
    }

    // Check for duplicates in the reference range list
    if (this.isDuplicate(value, index)) {
      Swal.fire({
        text: "Test already exists in the list.",
        icon: "warning"
      });
      return; // Exit the method if a duplicate is found
    }

    if (this.isProfileDuplicate(value, index)) {
      Swal.fire({
        text: "Test already exists in the list.",
        icon: "warning"
      });
      return; // Exit the method if a duplicate is found
    }

    // Determine the appropriate API call based on 'ct' and subscribe to fetch data
    const fetchDataObservable = this.evTestDefinitionData.ct !== 'G'
      ? this.getReferenceRangeDataByType(value)
      : this.geProfileByDataByGTDTCode(value);

    fetchDataObservable.subscribe({
      next: (data) => {
        this.handleDataFetch(data, index);
        // Bind the data to the appropriate list based on the 'ct' value
        if (this.evTestDefinitionData.ct !== 'G') {
          // this.evReferenceRangeList = data;
          this.evReferenceRangeList[index].tcode = this.evTestDefinitionData.tcode;
          this.evReferenceRangeList[index].tesT_ID = this.evTestDefinitionData.tesT_ID;
          this.evReferenceRangeList[index].sP_DESCRP = data.sP_DESCRP;
        } else {
          //
          this.evProfileGTDList[index].profilE_FULLNAME = data.profilE_FULLNAME;
          this.evProfileGTDList[index].tcode = this.evTestDefinitionData.tcode;
          this.evProfileGTDList[index].reQ_CODE = this.evTestDefinitionData.tcode;
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
        let ctType = this.evTestDefinitionData.ct;
        switch (ctType) {
          case 'D':
            this.evReferenceRangeList.splice(index, 1);
            // Fetch all available tests for recovery
            this.getAllReferenceRangeDataByType("EMPTY");
            break;
          case 'G':
            // Clear invalid entry
            this.evProfileGTDList.splice(index, 1);
            // Fetch all available tests for recovery
            this.getAllProfilesDataByGTDTCode("EMPTY");
            break;
          default:
            console.warn('Invalid input type:', ctType);
            return;
        }

        // Clear invalid entry

      },
    });
  }


  // Method to call the API and update the source name for the specific item
  getReferenceRangeDataByType(SType: string) {
    return this._testDirectoryService.getEVTDferenceRangeByType(SType);
  }

  // Method to call the API and update the source name for the specific item
  geProfileByDataByGTDTCode(profileTCode: string) {
    return this._testDirectoryService.getEVProfileFromGTDByTCode(profileTCode);
  }

  onBlurRefLow(index: number): void {
    // Round off the value and assign back to reF_HIGH
    this.evReferenceRangeList[index].reF_LOW = this.roundToTwoDecimals(this.evReferenceRangeList[index].reF_LOW).toString();
  }

  // Handle rounding on blur for reF_HIGH
  onBlurRefHigh(index: number): void {
    // Round off the value and assign back to reF_HIGH
    this.evReferenceRangeList[index].reF_HIGH = this.roundToTwoDecimals(this.evReferenceRangeList[index].reF_HIGH).toString();
  }


  // Method to round values to 2 decimal places safely
  roundToTwoDecimals(value: string): string {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00'; // Default to '0.00' if the input is not a valid number
    return num.toFixed(2); // Round to two decimal places and return as string
  }

  round_ToTwoDecimals(value: string): string {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00'; // Default to '0.00' if the input is not a valid number
    return num.toFixed(2); // Round to two decimal places and return as string
  }

  // Handle the data fetching response
  private handleDataFetch(data: any, index: number): void {
    if (data && data.sP_DESCRP) {
      const tCode = this.evTestDefinitionData.tcode;
      const testId = this.evTestDefinitionData.tesT_ID;
      // Update the specific item in the list based on index
      this.evReferenceRangeList[index] = {
        ...this.evReferenceRangeList[index],
        sP_DESCRP: data.sP_DESCRP,
        tcode: tCode,
        tesT_ID: testId,
      };
    } else {
      console.error('Data not found for SType:', data.s_TYPE);
    }
  }

  // Show modal function to encapsulate modal display logic
  private showModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    const myModal = new Modal(modalElement);
    myModal.show();
  }



  insertReferenceRangeList() {
    if (this.evReferenceRangeList && this.evReferenceRangeList.length) {
      // Call the service to insert data since the table is empty   
      this.evReferenceRangeList.forEach((item) => {
        const matchingItem = this.evTestDefinitionAllData.find(data => data.tcode === item.tcode); // Use a unique identifier here
        if (matchingItem) {
          item.dec = matchingItem.dec;
        }
      });
      this._testDirectoryService.insertReferenceRange(this.evReferenceRangeList).subscribe(
        response => {
          if (response.status === 200 || response.status === 204) {
            //this.getAllEVTestDefinitionData(); // Refresh data if the call was successful
            this.evReferenceRangeList = response.body; // Update list with new IDs
            Swal.fire({
              text: "Data successfully submitted.",
            });
          }
          this.IsDisabled = false;
          this.evReferenceRangeList.forEach(item => item.isEditing = false);
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

  updateReferenceRangeList() {
    if (this.evReferenceRangeList && this.evReferenceRangeList.length) {
      // Call the service to update data since the table has values     
      this._testDirectoryService.updateReferenceRange(this.evReferenceRangeList).subscribe(
        response => {
          if (response.status === 200 || response.status === 204) {
            //this.getAllEVTestDefinitionData(); // Refresh data if the call was successful
            this.evReferenceRangeList = response.body; // Update list with new IDs
            Swal.fire({
              text: "Data successfully updated.",
            });
          }
          this.IsDisabled = false;
          this.evReferenceRangeList.forEach(item => item.isEditing = false);
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

  insertProfileList() {
    if (this.evProfileGTDList && this.evProfileGTDList.length) {
      // Call the service to insert data since the table is empty    
      this._testDirectoryService.insertProfile(this.evProfileGTDList).subscribe(
        response => {
          if (response.status === 200 || response.status === 204) {
            this.evProfileGTDList = response.body; // Update list with new IDs
            //this.getAllEVTestDefinitionData(); // Refresh data if the call was successful
            Swal.fire({
              text: "Data successfully submitted.",
            });
          }
          this.IsDisabled = false;
          this.evProfileGTDList.forEach(item => item.isEditing = false);
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
    if (this.evProfileGTDList && this.evProfileGTDList.length) {
      // Call the service to update data since the table has values     
      this._testDirectoryService.updateProfile(this.evProfileGTDList).subscribe(
        response => {
          if (response.status === 200 || response.status === 204) {
            //this.getAllEVTestDefinitionData(); // Refresh data if the call was successful
            this.evProfileGTDList = response.body; // Update list with new IDs
            Swal.fire({
              text: "Data successfully updated.",
            });
          }
          this.IsDisabled = false;
          this.evProfileGTDList.forEach(item => item.isEditing = false);
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

  onSubmitList(): void {
    const isReferenceRange = this.evTestDefinitionData.ct !== 'G';

    if (isReferenceRange) {
      // Check if all items have eV_REFRNG_ID as 0 or undefined
      const hasExistingRecords = this.evReferenceRangeList?.some(item => item.eV_REFRNG_ID > 0);

      if (hasExistingRecords) {
        this.updateReferenceRangeList();
      } else {
        this.insertReferenceRangeList();
      }
    } else {
      // Check if all items have gtD_ID as 0 or undefined
      const hasExistingRecords = this.evProfileGTDList?.some(item => item.gtD_ID > 0);

      if (hasExistingRecords) {
        this.updateProfileList();
      } else {
        this.insertProfileList();
      }
    }
  }




  bindReferenceRangeGrid(): void {
    const shouldEdit = this.evTestDefinitionData.ct !== 'G';

    if (this.evTestDefinitionAllData.length > 0 && shouldEdit) {
      // Add an empty row only if `evReferenceRangeList` is initially empty
      if (this.evReferenceRangeList.length === 0) {
        this.addEmptyRow();
      }
      this.evReferenceRangeList.forEach(item => item.isEditing = true);
    } else if (shouldEdit) {
      this.evReferenceRangeList.forEach(item => item.isEditing = false);
    }
  }

  bindProfileGrid(): void {
    if (this.evProfileGTDList.length === 0) {
      this.addEmptyRowForProfile();
    }
    // Set all items to editing mode if there are items in `evProfileGTDList`
    const shouldEdit = this.evProfileGTDList.length > 0;
    this.evProfileGTDList.forEach(item => item.isEditing = shouldEdit);
  }
  isSubmitBtnActive: boolean = true;
  // Function to handle Edit/Save button click
  toggleEditTests() {
    this.isGridEditing = !this.isGridEditing;
    this.isSubmitBtnActive = false;
    if (this.isGridEditing) {
      // Start editing: add an empty row and set the focus on the new row.
      // Reference Range Grid Section
      if (this.evTestDefinitionData.ct !== 'G') {
        this.bindReferenceRangeGrid();
      } else {
        // Profile Grid Section
        this.bindProfileGrid();
      }
    } else {
      // Cancel editing: clear any newly added row.
      this.cancelEdit();
    }
  }

  cancelEdit() {
    if (this.evTestDefinitionData.ct === 'D' || this.evTestDefinitionData.ct === 'S') {
      // console.log(this.evTestDefinitionData.ct);
      this.isSubmitBtnActive = true;
      // Remove the last empty row if one was added during editing

      // Remove the last empty row if one was added during editing
      if (this.evReferenceRangeList.length > 0 && this.isReferenceRangeRowEmpty(this.evReferenceRangeList[this.evReferenceRangeList.length - 1])) {
        this.evReferenceRangeList.pop();
      }
      // Reset editing mode for all items
      // this.getCGTestDefinitionDataByUserId(this.cgTestDefinitionData.tD_ID);
      this.evReferenceRangeList.forEach(item => item.isEditing = false);
    }
    else {
      //console.log(this.evTestDefinitionData.ct);
      this.isSubmitBtnActive = true;
      if (this.evProfileGTDList.length > 0 && this.isRowEmpty(this.evProfileGTDList[this.evProfileGTDList.length - 1])) {
        this.evProfileGTDList.pop();
      }
      // Reset editing mode for all items
      // this.getCGTestDefinitionDataByUserId(this.cgTestDefinitionData.tD_ID);
      this.evProfileGTDList.forEach(item => item.isEditing = false);

    }
  }

  isRowEmpty(row: evProfileGTDModel): boolean {
    return !row.gtdtcode && !row.profilE_FULLNAME && !row.pndg;
  }

  isReferenceRangeRowEmpty(row: evTDReferenceRangeModel): boolean {
    return !row.s_TYPE && !row.sP_DESCRP && !row.lhf && !row.reF_LOW && !row.reF_HIGH;
  }

  // Get All Reference Range Data base on Tcode for right
  getAllReferenceRangeDataByType(sType: string) {
    this._testDirectoryService.getAllEVReferenceRangeByType(sType).subscribe((data) => {
      if (data) {
        this.evReferenceRangeSearchList = data;
      } else {
        console.error('Data not found:', data);
      }
    })
  }

  getAllProfilesDataByGTDTCode(search: string) {
    this._testDirectoryService.getAllEVProfiles(search).subscribe((data) => {
      if (data) {
        this.evProfileSearchList = data;
      } else {
        console.error('Data not found:', data);
      }
    })
  }

  onSearchReferenceRanges() {
    const InpTestCode = document.getElementById("InpTestCode") as HTMLInputElement;
    if (InpTestCode.value != '')
      setTimeout(() => {
        this.getAllReferenceRangeDataByType(InpTestCode.value);
        this.displayFirstPage();
      }, 2000); // Adjust the time as needed (3000 ms = 3 seconds);
    else
      setTimeout(() => {
        this.getAllReferenceRangeDataByType("EMPTY");
        this.displayFirstPage();
      }, 2000); // Adjust the time as needed (3000 ms = 3 seconds);
  }

  onSearchProfile() {
    const InpTestCode = document.getElementById("InpTestCode") as HTMLInputElement;
    if (InpTestCode.value != '')
      setTimeout(() => {
        this.getAllProfilesDataByGTDTCode(InpTestCode.value);
        this.displayFirstPage();
      }, 2000); // Adjust the time as needed (3000 ms = 3 seconds);
    else
      setTimeout(() => {
        this.getAllProfilesDataByGTDTCode("EMPTY");
        this.displayFirstPage();
      }, 2000); // Adjust the time as needed (3000 ms = 3 seconds);
  }

  // Function to add a selected record from the search results to the second table 
  addTD(item: any): void {
    // Remove any existing empty rows from evReferenceRangeList
    if (this.evTestDefinitionData.ct !== 'G') {
      this.evReferenceRangeList = this.evReferenceRangeList.filter(row =>
        row.s_TYPE && row.sP_DESCRP && row.lhf !== undefined && row.reF_LOW !== undefined && row.reF_HIGH !== undefined
      );

      // Prevent duplicates before adding
      const exists = this.evReferenceRangeList.some((existingItem) => existingItem.s_TYPE === item.s_TYPE);
      if (exists) {
        Swal.fire({
          text: "Record already exists in the list.",
          icon: "warning"
        });
        return;
      }

      // Add selected item to the evReferenceRangeList in editing mode
      this.evReferenceRangeList.push({
        ...item,
        tcode: this.evTestDefinitionData.tcode,
        tesT_ID: this.evTestDefinitionData.tesT_ID,
        isEditing: true  // Ensure new row is added in editable mode
      });
    } else {
      this.evProfileGTDList = this.evProfileGTDList.filter(row =>
        row.gtdtcode && row.profilE_FULLNAME && row.pndg !== undefined
      );

      // Prevent duplicates before adding
      const exists = this.evProfileGTDList.some((existingItem) => existingItem.gtdtcode === item.gtdtcode);
      if (exists) {
        Swal.fire({
          text: "Record already exists in the list.",
          icon: "warning"
        });
        return;
      }

      // Add selected item to the evReferenceRangeList in editing mode
      this.evProfileGTDList.push({
        ...item,
        tcode: this.evTestDefinitionData.tcode,
        reQ_CODE: this.evTestDefinitionData.tcode,
        isEditing: true  // Ensure new row is added in editable mode
      });

    }
  }


  // Function to disable editing once changes are finalized
  finalizeRowEdit(index: number): void {
    if (this.evReferenceRangeList[index]) {
      this.evReferenceRangeList[index].isEditing = false;
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
    const totalPages = Math.ceil(this.evReferenceRangeSearchList.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, totalPages) || 1;
  }

  // Method to display the first 10 records after search data populates
  displayFirstPage(): void {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.updatePagination();
  }

  getRecord(input: string, SNO: number) {
    const totalRecords = this.evTestDefinitionAllData.length;
    if (totalRecords === 0) {
      console.warn('No records available.');
      return;
    }

    const primaryTCode = this.evTestDefinitionAllData[0]?.tcode;
    if (this.evProfileGTDList[0]) {
      this.evProfileGTDList[0].tcode = primaryTCode;
      this.evProfileGTDList[0].reQ_CODE = primaryTCode;
    }

    // Select record based on input type
    switch (input) {
      case 'first':
        if (this.evTestDefinitionData?.sno === 1) {
          this._commonAlertService.firstRecord();
          return;
        }
        this.evTestDefinitionData = this.evTestDefinitionAllData[0];
        break;

      case 'prev':
        if (SNO > 1) {
          this.evTestDefinitionData = this.evTestDefinitionAllData.find(record => record.sno === SNO - 1) || null;
        }
        break;

      case 'next':
        if (SNO < totalRecords) {
          this.evTestDefinitionData = this.evTestDefinitionAllData.find(record => record.sno === SNO + 1) || null;
        }
        break;

      case 'last':
        if (this.evTestDefinitionData?.sno === totalRecords) {
          this._commonAlertService.lastRecord();
          return;
        }
        this.evTestDefinitionData = this.evTestDefinitionAllData[totalRecords - 1];
        this.evTestDefinitionData.mthd = this.evTestDefinitionData.mthd;
        break;

      default:
        console.warn('Invalid input type:', input);
        return;
    }
    // Execute method based on the `ct` property if valid data is found
    if (this.evTestDefinitionData) {
      const ct = this.evTestDefinitionData.ct;
      const tCode = this.evTestDefinitionData.tcode;
      ct === 'G' ? this.getEVProfieDataFromGTD(tCode) : this.getReferenceRangeTCodeDataFromTD(tCode);
    } else {
      console.warn('No record found for the specified SNO:', SNO);
    }
  }
}
