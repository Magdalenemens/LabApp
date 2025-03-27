import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { Observable, Subject, debounceTime, flatMap, of } from 'rxjs';
import { ViewChild } from '@angular/core';
import { Editor, NgxEditorService, Toolbar, Validators } from 'ngx-editor';

import { AbstractControl, FormBuilder, FormControl, FormGroup, NgModel } from '@angular/forms';
import { AnatomicpathologyService } from './anatomic-pathology.service';
import { BAD_REQUEST_ERROR_MESSAGE, REPORT_BASEURL, amendMessage, deleteErrorMessage, deleteMessage, errorMessage, releaseMessage, saveMessage, successMessage, updateSuccessMessage, validateMessage, verifyMessage, warningMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

import { DataTableDirective } from 'angular-datatables';
import { Modal } from 'bootstrap';
import { resulttemplateModel } from 'src/app/models/resulttemplateModel';
import { anatomicModel, apRepportModel } from 'src/app/models/anatomicModel';

import { ActivatedRoute, Router } from '@angular/router';
import { clinicalFindingModel } from 'src/app/models/clinicalFindingModel';
import { pathFindingModel } from 'src/app/models/pathFindingModel';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CommonService } from 'src/app/common/commonService';
import { pageTrackRecordModel } from 'src/app/models/pageTrackRecordModel';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { OrderentryService } from 'src/app/modules/orderprocessing/orderentry/add-orderentry/orderentry.service';
import moment from 'moment';
import { PageName } from 'src/app/common/enums';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { OrderentrynewService } from 'src/app/modules/orderprocessing/orderentrynew/add-orderentrynew/orderentrynew.service';
import { rolePermissionModel } from '../../../../models/rolePermissionModel';
import { roleBaseAction } from '../../../../models/roleBaseAction';
import { PermissionService } from '../../../../services/permission.service';
import { Anatomic_Pathology } from '../../../../common/moduleNameConstant';
import { MultiSearchService } from 'src/app/services/multi-search.service';
import { kolkovEditorService } from 'src/app/common/kolkovEditorService';


@Component({
  selector: 'app-add-pathology',
  templateUrl: './add-pathology.component.html',
  styleUrls: ['./add-pathology.component.scss'],
  providers: [DatePipe] // Include DatePipe as a provider
})
export class AddPathologyComponent implements OnInit {
  @ViewChild('reportFrame') reportFrame!: ElementRef;
  name = 'Angular 6';
  htmlContent = '';
  content = 'This is the initial content of the editor.';
  form: FormGroup;
  isLoaded = false;
  data: any;
  btnDisabled: boolean = true;
  public multupleSearchOrdersList: any[] = [];
  public multupleSearchList: any[] = [];
  public OrderDetailsTable = [];
  public ATRTable: any[] = [];
  scmid: string = '';
  otpid: string = '';
  natid: string = '';
  NewPatId = 0;
  editor = new Editor();
  ckEditorData: string = '';

  PAT_ID: any = '';
  ORD_NO: any = '';
  GTNO: any = '';
  REQ_CODE: any = '';

  toolbar: Array<any> = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image']
  ];

  rolepermissionmodel: rolePermissionModel[] = [];
  rolebaseaction: roleBaseAction = new roleBaseAction();

  keyword = 'patientname';
  selectedTemplate: number = 0; // Selected template value from dropdown
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  errorMessage: any;
  resultstemplatesDropDown: any;
  ckEditorId: number = 0;

  anatomicData: anatomicModel = new anatomicModel();
  anatomicAllData: anatomicModel[] = [];
  apRepportData: apRepportModel = new apRepportModel();

  resultsTemplateData: resulttemplateModel = new resulttemplateModel();
  resultTemplateAllData: resulttemplateModel[] = [];

  clinicalData: clinicalFindingModel = new clinicalFindingModel();
  clinicalAllData: clinicalFindingModel[] = [];
  filteredRecord: clinicalFindingModel;

  pathData: pathFindingModel = new pathFindingModel();
  pathAllData: pathFindingModel[] = [];
  filteredData: any[] = []; // Filtered data set

  submitted = false;
  IsDisabled = true;

  isEdit = false;
  isCKEditorReadOnly: boolean = true;
  isTemplateReadOnly: boolean = true;
  isDelete = false;
  accnControl = new FormControl();
  resultTemplateDropDown: any;

  selectedTemplateId: any;

  isEditReadOnly: boolean = true;
  isDeleteReadOnly: boolean = true;
  isCancelReadOnly: boolean = true;

  isSubmitReadOnly: boolean = true;
  isVerifiedReadOnly: boolean = true;
  isValidateReadOnly: boolean = true;
  isReleaseReadOnly: boolean = true;
  isAmendReadOnly: boolean = true;

  isddlEnable: boolean = true;

  isNavigationActive: boolean = false;
  isAddTAxisReadOnly: boolean = true;
  isAddMAxisReadOnly: boolean = true;

  matchedPatients$!: Observable<anatomicModel[]>;
  selectedPatient: anatomicModel | undefined; // Property to hold the selected site

  editRowId: any;
  editData_: any;
  currentIndex: number = 0; // To keep track of the current index
  tAxisFilteredData: clinicalFindingModel[];

  filteredList: pathFindingModel[] = [];
  searchTerm: string = '';
  searchPatient: string = '';
  currentPage: any;
  reportStatus: string;

  totalItems: number;
  pageChange: any;
  //Pagination 
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options
  private calculateIndexSubject: Subject<number> = new Subject();
  hit: number = 0;

  currentFilter: string = '';
  clncfndG_ID_MAxis: number = 0;
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';
  url = '';
  toDate: string;
  fromDate: string;
  reportPath_clinical = '/Clinical'; // Path to the report folder
  reportName = 'Histopathology/'; // Report name 


  public codeTrackingList: any[] = [];

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  constructor(private formBuilder: FormBuilder, private router: Router,
    public _commonAlertService: CommonAlertService, private _anatomicpathologyService: AnatomicpathologyService,
    private OrderentrynewService: OrderentrynewService, private route: ActivatedRoute,
    private _commonService: CommonService, private _authService: AuthService,
    private _permissionService: PermissionService
    , private multiSearchService: MultiSearchService,
    public editorService: kolkovEditorService) {
    // this.route.queryParams.subscribe(params => {
    //   this.anatomicData.arF_ID = params['arfid'];
    // });
    
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.createForm();
    this.getAllanatomicData();
    this.isCKEditorReadOnly = true;
    this.isTemplateReadOnly = true;
    this.isEdit = false;
    this.getAllResultsTemplateData();
    this.formatAccn(this.anatomicData.accn);
    $('#btnaddpathology').addClass("is-active");
    this.getAllPathFinding('T');
    const today = new Date();
    this.toDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD' format

    // Get the date 2 months ago
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    this.fromDate = twoMonthsAgo.toISOString().split('T')[0];
    this.getRoleBasedPermission();
  }

  onLineSpacingChange(event: Event) {
    const spacing = (event.target as HTMLSelectElement).value;
    if (spacing) {
      this.editorService.setLineSpacing(spacing);
    }
  }

  async GetMultipleSearch() {
    this.multupleSearchList = await this.multiSearchService.GetMultipleSearchService('AP');
  }

  async GetMultipleSearchOrders(PAT_ID: any) {
    this.NewPatId = PAT_ID;
    this.multupleSearchOrdersList = [];
    this.multupleSearchOrdersList = await this.multiSearchService.GetMultipleSearchOrders(PAT_ID);
  }
  ngondestroyngOnDestroy() {
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      accn: new FormControl(),
      paT_ID: new FormControl(),
      paT_NAME: new FormControl(),
      sex: new FormControl(),
      dob: new FormControl(),
      saudi: new FormControl(),
      reQ_CODE: new FormControl(),
      tcode: new FormControl(),
      loc: new FormControl(),
      pr: new FormControl(),
      cn: new FormControl(),
      client: new FormControl(),
      drno: new FormControl(),
      doctor: new FormControl(),
      sno: new FormControl(),
      drawN_DTTM: new FormControl(),
      veR_DTTM: new FormControl(),
      r_STS: new FormControl(),
      notes: new FormControl(),
    });
    // Debounce the calculate index calls
    this.calculateIndexSubject.pipe(
      debounceTime(300)  // Adjust the debounce time as needed
    ).subscribe(sno => {
      this.currentIndex = this.calculateCurrentIndex(sno);
    });
  }

  view(id: any) {
    localStorage.setItem('orD_NO', id);
    this.url = '../clinical-module/Anatomic/list';
    this.router.navigate([this.url]);
  }

  getAllanatomicData() {
    // Retrieve orD_NO from local storage
    const ordTransId = localStorage.getItem('orD_NO')?.toString();
    this._anatomicpathologyService.getAllAnatomicPathology().subscribe(res => {
      this.anatomicAllData = res;
      this.isEditReadOnly = false;
      this.currentIndex = this.calculateCurrentIndex(this.anatomicAllData.length);
      this.matchedPatients$ = this.getFilteredPatientName('');


      // If we have orD_NO data and a valid orD_NO from local storage
      if (this.anatomicAllData.length > 0 && ordTransId && ordTransId > "0") {
        this.anatomicData = this.anatomicAllData.find(x => x.orD_NO == Number(ordTransId));
        this.formatAccn(this.anatomicData.accn);
        // Clear siteId from local storage after it's used
        localStorage.removeItem('orD_NO');

        if (!this.anatomicData) {
          this.getRecord("last", this.anatomicAllData.length - 1);
          this.formatAccn(this.anatomicData.accn);
          if (this.anatomicAllData && this.anatomicAllData.length > 0) {
            const accnNumber = this.anatomicAllData[this.anatomicAllData.length - 1].accn;
            this.filterRecordByAccnNo(accnNumber); // Pass the accn number to filter method       
          }
        }
      }
      else {
        // If no valid siteId, fallback to the last site
        this.getRecord("last", this.anatomicAllData.length - 1);
        this.formatAccn(this.anatomicData.accn);

        // Clear the siteId from local storage just in case
        localStorage.removeItem('orD_NO');
      }
    },
      (error) => {
        console.error('Error loadinng anatomic list:', error);
      });
  }

  getAllResultsTemplateData(): void {
    this._anatomicpathologyService.getRTForAnatomyPathology().subscribe(
      (data: any[]) => {
        // Assign fetched data to resultTemplateAllData
        this.resultTemplateAllData = data;

        // Extract tname for dropdown and assign to resultTemplateDropDown
        this.resultTemplateDropDown = data.map(item => item.tname);
      },
      (error) => {
        console.error('Error loading result templates:', error);
      }
    );
  }

  // formatAccn(value: string): void {
  //   if (value && value.length === 9) {
  //     const formattedValue = value.substring(0, 2) + '-' + value.substring(2, 4) + '-' + value.substring(4);
  //     this.anatomicData.accn = formattedValue;
  //   } else {
  //     this.anatomicData.accn = value;
  //   }
  // }

  formatAccn(value: string): void {
    if (value !== '' && !value.includes('-')) {
      let accn = value;

      if (this.isContainAlpha(accn)) {
        // Format for text in the string: 04-MB-24-00002
        accn = `${value.substring(0, 2)}-${value.substring(2, 4)}-${value.substring(4, 6)}-${value.substring(6)}`;
      } else {
        // Format for all numbers: 06-24-191-0016
        accn = `${value.substring(0, 2)}-${value.substring(2, 4)}-${value.substring(4, 7)}-${value.substring(7)}`;
      }

      this.anatomicData.accn = accn;
    }
  }

  isContainAlpha(code: string): boolean {
    for (let i = 0; i < code.length; i++) {
      const char1 = code.charAt(i);
      const cc = char1.charCodeAt(0);
      if (cc >= 65 && cc <= 90) { // Check if character is between 'A' and 'Z'
        return true;
      }
    }
    return false;
  }

  ngAfterViewInit(): void {
    let hidearrow = document.getElementsByClassName('ng-arrow-wrapper')[0] as HTMLElement;
    hidearrow?.style.setProperty('Display', 'none')
  }

  // Custom search function
  customSearch(term: string, item: anatomicModel): boolean {
    if (typeof term !== 'string') {
      // Handle non-string term, such as when event is passed as term
      return false;
    }
    term = term.toLowerCase();
    return item.paT_ID.toLowerCase().includes(term) || item.accn.toLowerCase().includes(term);

  }

  onSearch(event: any) {

    const filteredPatients = this.anatomicAllData.filter(site =>
      this.customSearch(event, site)
    );
    this.selectedPatient = null;
    return new Observable(observer => {
      observer.next(filteredPatients);
      observer.complete();
    });
  }

  onPatientSelection(event: any, select: NgSelectComponent) {
    if (event.paT_ID !== undefined && event.accn !== undefined) {
      const selectedPatient = this.anatomicAllData.find(anatomic =>
        anatomic.paT_ID === event.paT_ID && anatomic.accn === event.accn
      );
      if (selectedPatient) {
        this.anatomicData = selectedPatient;
        this.filterRecordByAccnNo(selectedPatient.accn);
      } else {
        // Handle case where selectedPatient is not found
      }
    } else {
      // Handle case where event or event.paT_NAME is undefined
      if (this.hit != 1) {
        this.getRecord("last", this.anatomicAllData.length - 1);
      }
    }
    select.handleClearClick();
    this.hit = 1;
  }

  getFilteredPatientName(term: string): Observable<any[]> {
    const filteredSites = this.anatomicAllData.filter(anatomic =>
      this.customSearch(term, anatomic)
    );
    const transformedSites = filteredSites.map(anatomic => ({
      ...anatomic,
      combinedLabel: `${anatomic.paT_ID} - ${anatomic.accn}`
    }));
    return of(transformedSites);
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Clinical_AnatomicPathology, this.startTime, this.endTime);
    this.editor.destroy();
    this.dtTrigger.unsubscribe();
  }

  assignTheData() {
    if (!this.anatomicData) {
      console.error('No data available to assign. anatomicData is undefined.');
      return; // Exit if anatomicData is undefined to prevent runtime errors
    }

    this.form.reset({
      orD_NO: this.anatomicData.accn,
      accn: this.anatomicData.accn,
      paT_ID: this.anatomicData.paT_ID,
      paT_NAME: this.anatomicData.paT_NAME,
      sex: this.anatomicData.sex,
      dob: this.anatomicData.dob,
      saudi: this.anatomicData.saudi,
      reQ_CODE: this.anatomicData.reQ_CODE,
      tcode: this.anatomicData.tcode,
      loc: this.anatomicData.loc,
      pr: this.anatomicData.pr,
      cn: this.anatomicData.cn,
      client: this.anatomicData.client,
      drno: this.anatomicData.drno,
      doctor: this.anatomicData.doctor,
      sno: this.anatomicData.sno,
      drawN_DTTM: this.anatomicData.drawN_DTTM,
      veR_DTTM: this.anatomicData.veR_DTTM,
      r_STS: this.anatomicData.r_STS,
      notes: this.anatomicData.notes,
    });    // this.isReadOnly = true; 
  };

  emptyTheForm() {
    this.form.reset({
      orD_NO: '',
      accn: '',
      paT_ID: '',
      paT_NAME: '',
      sex: '',
      dob: '',
      saudi: '',
      reQ_CODE: '',
      tcode: '',
      loc: '',
      pr: '',
      cn: '',
      client: '',
      drno: '',
      doctor: '',
      sno: '',
      drawN_DTTM: '',
      veR_DTTM: '',
      r_STS: '',
      notes: ''
    });
  }

  onEditRecord(_id: any) {
    this.assignTheData();
    this.editRowId = _id;
    this.editData_ = JSON.parse(JSON.stringify(this.anatomicAllData.find((u) => u.orD_NO == _id)));
    if (this.isEditReadOnly = true) {
      this.isCKEditorReadOnly = false;
      this.isTemplateReadOnly = false;
      this.isEdit = true;
      this.isSubmitReadOnly = false;
      this.isCancelReadOnly = false;
      this.isNavigationActive = true;
    }
    if (this.isCKEditorReadOnly = false) {
      this.isNavigationActive = true;
    }
  }

  onValidateEditorData(content: string) {
    this.isddlEnable = true;
    const strippedContent = content.replace(/<\/?[^>]+(>|$)/g, '');
    if (this.isTemplateReadOnly) {
      if (content.trim() === '' || strippedContent.trim() === '') {
        this.disableDropdown();
      }
    } else {
      const strippedNotes = this.anatomicData.notes.replace(/<\/?[^>]+(>|$)/g, '');
      if (strippedNotes.trim().length > 0) {
        this.isddlEnable = false;
        Swal.fire({
          title: 'Warning!',
          text: 'Data already Exist. Please delete and import again.',

        });

      } else {
        this.enableDropdown(); // Enable the dropdown
      }
    }
  }

  disableDropdown() {
    this.isTemplateReadOnly = true;
  }

  enableDropdown() {
    this.isTemplateReadOnly = false;
    if (!this.isTemplateReadOnly) {
      this.onTemplateChange(this.resultsTemplateData.rS_TMPLT_ID);
    }
  }

  onTemplateChange(selectedValueId: number): void {
    const templateId = selectedValueId;

    if (templateId) {
      this._anatomicpathologyService.getRTForAnatomyPathologyById(templateId).subscribe((data) => {
        if (data && data.template) {
          // Assign the template data to ckEditorData
          this.ckEditorData = data.template;
          this.anatomicData.notes = data.template;
        } else {
          console.error('Template data not found:', data);
        }
      });
    } else {
      this.ckEditorData = '';
    }
  }

  onCancelRecord(orD_NO: number) {
    if (this.isEdit) {
      let index = this.anatomicAllData.findIndex(x => x.orD_NO == orD_NO);
      this.anatomicData = this.anatomicAllData[index];
      this.anatomicAllData[index].notes = this.editData_.notes;
      this.assignTheData();
      this.isCKEditorReadOnly = true;
      this.isTemplateReadOnly = true;
      this.isNavigationActive = false;
      this.isEditReadOnly = false;
      this.isCancelReadOnly = true;
      this.isSubmitReadOnly = true;
    }
    else {
      this.emptyTheForm();
    }
  }



  findTAxis() {
    // const searchValue = document.getElementById("searchIsol") as HTMLInputElement;
    // searchValue.value= '';
    const isolModal = document.getElementById('taxismodel') as HTMLElement;
    const myModal = new Modal(isolModal);
    myModal.show();
    this.currentFilter = 'T';
    this.getAllPathFinding('T');
    // Optionally, hide the modal after some time (if needed)
    setTimeout(() => {
      // myModal.hide(); // Hide the first modal after 3 seconds (if necessary)
    }, 5000); // Adjust the time as needed (3000 ms = 3 seconds)
  }

  findMAxis(item: any) {
    this.clncfndG_ID_MAxis = item.clncfndG_ID;
    const axisModal = document.getElementById('taxismodel') as HTMLElement;
    const myModal = new Modal(axisModal);
    myModal.show();
    this.currentFilter = 'M';
    this.getAllPathFinding('M');
    // Optionally, hide the modal after some time (if needed)
    setTimeout(() => {
      // myModal.hide(); // Hide the first modal after 3 seconds (if necessary)
    }, 5000); // Adjust the time as needed (3000 ms = 3 seconds)
  }

  applyFilter() {
    if (this.currentFilter === 'M-Axis') {
      this.filteredList = this.pathAllData.filter(item => item.ax === 'M-Axis');
    } else {
      this.filteredList = this.pathAllData;
    }
  }

  filterRecordByAccnNo(accnNo: string): void {
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

  displayRecord(): void {
    this.getRecord('last', this.anatomicAllData.length - 1);
    this.formatAccn(this.clinicalData.accn);
  }

  calculateCurrentIndex(sno: number): number {
    let currentIndex = this.anatomicAllData.findIndex(x => x.sno === sno);
    return currentIndex + 1; // Start index is one-based
  }
  onElementClick() {
    this.calculateIndexSubject.next(this.anatomicData.sno);
  }

  // Method to handle button click 
  onButtonClick(buttonId: string, sno: number) {
    this.getRecord(buttonId, sno);
    this.onElementClick();
  }

  getAllPathFinding(axisType: string) {
    // this.clinicalAllData[0].type = this.pathAllData[0].ax;
    this._anatomicpathologyService.getAllPathFindingsByAxisType(axisType).subscribe(res => {
      this.pathAllData = res;
      this.filteredList = [...this.pathAllData];
      this.updatePagination();
      this.applyFilter();
      // Initialize filteredData with all datathis.filteredList = [...this.divisionList];
    },
      (error) => {
        console.error('Error loading Site list:', error);
      })
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
    } else if (this.pathAllData[0].ax.toUpperCase() === 'M') {
      this.pathAllData = this.pathAllData.filter(item =>
        item.aX_NMBR.toLowerCase().includes(searchText) ||
        item.m_Description.toLowerCase().includes(searchText)
      );
    } else {
      this.pathAllData = this.pathAllData.filter(item =>
        item.aX_NMBR.toLowerCase().includes(searchText) ||
        item.m_Description.toLowerCase().includes(searchText) ||
        item.t_Description.toLowerCase().includes(searchText)
      );
    }
  }

  resetSearch() {
    this.searchTerm = '';
    this.pathAllData = [...this.filteredList];
    setTimeout(() => {
    }, 100); // 1000 milliseconds = 1 second (adjust as needed)
  }


  viewOrderTrackingDetails() {
    const ViewCodeTrackingModal = document.getElementById('ViewCodeTrackingModal') as HTMLElement;
    const myModal = new Modal(ViewCodeTrackingModal);
    myModal.show();
    this.OrderentrynewService.GetOrderTrackingByOrdNo(this.anatomicData.orD_NO, this.anatomicData.reQ_CODE)
      .subscribe({
        next: (res) => {
          for (var i = 0; i < res.geT_OrdTrc.length; i++) {
            this.codeTrackingList.push(res.geT_OrdTrc[i]);
          }
        },
        error: (err) => {
          alert(err?.error.message);
        }
      })
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(event: any): void {
    this.itemsPerPage = event;
    this.currentPage = 1; // Reset to first page when page size changes
    this.updatePagination();
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.pathAllData.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, totalPages) || 1;
  }


  inserclinicalData(item: pathFindingModel, axisType: string) {

    const accnNo = this.anatomicData.accn.replace(/-/g, "");


    if (accnNo !== '' && axisType === 'T') {
      // Handle TAxis data insertion      

      item.accn = accnNo;
      item.ax = '';
      item.clncfndG_ID = 0;
      item.sno = 0;
      item.descrip = '';
      item.t_Description = '';
      item.m_Description = '';

      this._anatomicpathologyService.addPathFinding(item).subscribe({
        next: (res) => {
          if (res.status === 200) {
            this._commonAlertService.successMessage();
            this.filterRecordByAccnNo(accnNo);
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
    } else if (axisType === 'M') {
      // Handle MAxis data update
      item.orD_NO = 0;
      item.pathnmcR_ID = 0;
      item.accn = '';
      item.ax = '';
      item.descrip = '';
      item.t_Description = '';
      item.m_Description = '';
      item.clncfndG_ID = this.clncfndG_ID_MAxis;

      this._anatomicpathologyService.updatePathFinding(item).subscribe(
        (response) => {
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            this.filterRecordByAccnNo(accnNo);
          } else {
            this._commonAlertService.errorMessage();
            console.error('Unexpected response status:', response.status);
          }
        },
        (error) => {
          const status = error.status;
          if (status === 409) {
            Swal.fire({
              text: 'Conflict error while updating MAxis data',
            });
          } else {
            this._commonAlertService.errorMessage();
            console.error('Error updating data:', error);
          }
        }
      );
    } else {
      Swal.fire({
        text: 'Invalid data or operation',
      });
      console.error('Invalid data or operation');
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
            this._commonAlertService.deleteMessage();
            this.callGetAnatomicDatByIdAfterInterval(this.anatomicData.orD_NO); // Refresh the data after an interval 
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

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  calculateAge(dob: string | null): string | null {
    if (!dob) {
      return null;
    }

    const birthDate = this.parseDate(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} years`;
    //return `${years} years, ${months} months, and ${days} days old`;
  }

  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  onPrint(): void {

    let orD_NO = this.anatomicData.orD_NO;
    // Check if orD_NO is available
    if (!orD_NO) {

      console.error('Error: orD_NO parameter is missing.');
      return;
    }

    // Construct the URL with print parameters
    const baseUrl = REPORT_BASEURL;

    const reportParams = `?orD_NO=${orD_NO}&QueryType=5&rs:Command=Render&rs:Format=PDF`;

    const reportUrl = `${baseUrl}${this.reportPath_clinical}/${this.reportName}${reportParams}`;

    // Load the report in an iframe
    const iframe: HTMLIFrameElement = this.reportFrame.nativeElement;
    iframe.src = reportUrl;

    // Trigger print when iframe loads     
    window.open(iframe.src, '_blank');
  }


  onSubmitStatus(clickNumber: number) {

    this.apRepportData.arF_ID = this.anatomicData.arF_ID;
    this.apRepportData.r_STS = this.anatomicData.r_STS;
    const strippedContent = this.anatomicData.notes.replace(/<\/?[^>]+(>|$)/g, '');
    this.apRepportData.notes = strippedContent;
    // Handled Null Values in the Result Template
    if (this.apRepportData.notes && this.apRepportData.notes.trim() !== '') {
      Swal.fire({
        title: 'Confirmation',
        text: this.updateMgsAccordingToButton(clickNumber),
        //icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.setbuttonActiveInactive(clickNumber);
          switch (clickNumber) {
            case 1:
              this.apRepportData.r_STS = 'RS';
              break;
            case 2:
              this.apRepportData.r_STS = 'VR';
              break;
            case 3:
              this.apRepportData.r_STS = 'VD';
              break;
            case 4:
              this.apRepportData.r_STS = 'RD';
              break;
            case 5:
              this.apRepportData.r_STS = 'RS';
              break;
            default:
              break;
          }
          this.reportStatus = this.getReportStatusDescription(this.apRepportData.r_STS);
          let notes = this.anatomicData.notes;
          this.editor.setContent(this.anatomicData.notes); // This line might be incorrect based on the API you're using
          this.apRepportData.notes = notes;
          this._anatomicpathologyService.updateAPReport(this.apRepportData).subscribe(
            (response) => {
              if (response.status === 200 || response.status === 204) {
                this.callGetAnatomicDatByIdAfterInterval(this.anatomicData.orD_NO); // Refresh the data after an interval              
              }
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
    } else {
      Swal.fire({
        text: 'Please add a report and submit again!.',
      });
      this.setbuttonActiveInactive(6);

    }
  }

  // Define a function to call getAnatomicDatById() after a time interval
  callGetAnatomicDatByIdAfterInterval(id: number) {
    setTimeout(() => {
      this.getAnatomicDatById(id);
    }, 100); // 1000 milliseconds = 1 second (adjust as needed)
  }

  // Fetch data by ID
  getAnatomicDatById(id: number) {
    this._anatomicpathologyService.getAnatomicPathologyById(id).subscribe(
      res => {
        this.anatomicData = res;
        this.formatAccn(this.anatomicData.accn);
      },
      error => {
        console.error('Error loading anatomic data by ID:', error);
      }
    );
  }

  updateMgsAccordingToButton(clickNumber: number) {
    switch (clickNumber) {
      case 1:
        return saveMessage;
      case 2:
        return verifyMessage;
      case 3:
        return validateMessage;
      case 4:
        return releaseMessage;
      case 5:
        return amendMessage;
      default:
        return '';
    }
  }

  setbuttonActiveInactive(clickNumber: number) {
    // 1 submit,2 verify,3 validate,4 release,5 amend.
    switch (clickNumber) {
      case 0:
        this.isEditReadOnly = false;
        this.isVerifiedReadOnly = true;
        this.isValidateReadOnly = true;
        this.isReleaseReadOnly = true;
        this.isAmendReadOnly = true;
        break;
      case 1:
        this.isEditReadOnly = true;
        this.isSubmitReadOnly = true;
        this.isCancelReadOnly = true;
        this.isCKEditorReadOnly = true;
        this.isVerifiedReadOnly = false;
        this.isAmendReadOnly = false;
        this.isNavigationActive = false;

        break;
      case 2:
        this.isValidateReadOnly = false;
        this.isAmendReadOnly = false;
        this.isVerifiedReadOnly = true;
        this.isCKEditorReadOnly = true;
        this.isNavigationActive = false;
        this.isEditReadOnly = true;
        this.isSubmitReadOnly = true;
        this.isCancelReadOnly = true;
        break;
      case 3:
        this.isReleaseReadOnly = false;
        this.isAmendReadOnly = false;
        this.isVerifiedReadOnly = true;
        this.isValidateReadOnly = true;
        this.isCKEditorReadOnly = true;
        this.isNavigationActive = false;
        break;
      case 4:
        this.isAmendReadOnly = false;
        this.isCKEditorReadOnly = true;
        this.isVerifiedReadOnly = true;
        this.isValidateReadOnly = true;
        this.isReleaseReadOnly = true;
        this.isNavigationActive = false;
        break;
      case 5:
        this.isAmendReadOnly = false;
        this.isVerifiedReadOnly = false;
        this.isValidateReadOnly = true;
        this.isReleaseReadOnly = true;
        this.isEditReadOnly = false;
        break;
      case 6:
        this.isEditReadOnly = false;
        this.isSubmitReadOnly = true;
        this.isCancelReadOnly = true;
        this.isCKEditorReadOnly = true;
        this.isNavigationActive = false;
        this.isVerifiedReadOnly = true;
        this.isValidateReadOnly = true;
        this.isReleaseReadOnly = true;
        this.isAmendReadOnly = true;
        break;
      default:
        break;
    }
  }

  getReportStatusDescription(statusCode: string): string {
    switch (statusCode) {
      case 'V':
        this.setbuttonActiveInactive(0);
        this.isAddTAxisReadOnly = false;
        this.isAddMAxisReadOnly = false;

        return 'Pending';
      case 'O':
        this.setbuttonActiveInactive(0);
        this.isAddTAxisReadOnly = false;
        this.isAddMAxisReadOnly = false;

        return 'Pending';
      case 'VR':
        this.setbuttonActiveInactive(2);
        this.isAddTAxisReadOnly = true;
        this.isAddMAxisReadOnly = true;

        return 'Verified';
      case 'VD':
        this.setbuttonActiveInactive(3);
        this.isAddTAxisReadOnly = true;
        this.isAddMAxisReadOnly = true;

        return 'Validated';
      case 'RD':
        this.setbuttonActiveInactive(4);
        this.isAddTAxisReadOnly = true;
        this.isAddMAxisReadOnly = true;

        return 'Released';
      case 'RS':
        this.setbuttonActiveInactive(5);
        this.isAddTAxisReadOnly = false;
        this.isAddMAxisReadOnly = false;
        return 'Resulted';
      // Add other cases as needed
      default:
        return 'Unknown';
    }
  }


  getRecord(input: any, SNO: number) {
    let totalNumberOfRec = this.anatomicAllData.length;
    if (input == 'first') {
      if (SNO === 1) {
        Swal.fire({
          text: "You are already at the first record.",
        })
      } else {
        this.anatomicData = this.anatomicAllData[0];
        const accnNumber = this.anatomicAllData[this.anatomicAllData.length - 1].accn;
        this.filterRecordByAccnNo(accnNumber);
        this.formatAccn(this.anatomicData.accn);
      }
    }
    else if (input == 'prev' && SNO != 1) {
      const prevRecord = this.anatomicAllData.find(x => x.sno == (SNO - 1));
      if (prevRecord) {
        this.anatomicData = prevRecord;
        const accnNumber = this.anatomicData.accn;
        this.filterRecordByAccnNo(accnNumber);
        this.formatAccn(this.anatomicData.accn);
      }
    }
    else if (input == 'next' && totalNumberOfRec > SNO) {
      const nextRecord = this.anatomicAllData.find(x => x.sno == (SNO + 1));
      if (nextRecord) {
        this.anatomicData = nextRecord;
        const accnNumber = this.anatomicData.accn;
        this.filterRecordByAccnNo(accnNumber);
        this.formatAccn(this.anatomicData.accn);
      }
    }
    else if (input == 'last') {
      if (SNO === totalNumberOfRec) {
        Swal.fire({
          text: "You are already at the last record.",
        })
      } else {
        const lastRecord = this.anatomicAllData.find(x => x.sno == totalNumberOfRec);
        if (lastRecord) {
          this.anatomicData = lastRecord;
          const accnNumber = this.anatomicData.accn;
          this.filterRecordByAccnNo(accnNumber);
          this.formatAccn(this.anatomicData.accn);
        }
      }
      if (this.anatomicData) {
        this.assignTheData();
        this.filterRecordByAccnNo(this.anatomicData.accn);
        this.formatAccn(this.anatomicData.accn);
      }
    }
    this.reportStatus = this.getReportStatusDescription(this.anatomicData.r_STS);
  }

  SearchOrderTransMultiple(ORD_NO: any) {
    const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
    searchOrder.value = ORD_NO;
    this.SearchOrderTrans();

  }

  BindATRTable(PAT_ID: any, ORD_NO: any) {
    this.ATRTable = [];
    this.OrderentrynewService.GET_ATR(PAT_ID, ORD_NO)
      .subscribe({
        next: (res) => {
          this.isLoaded = true;
          for (var i = 0; i < res.geT_ATR.length; i++) {  // loop through the object array
            this.ATRTable.push(res.geT_ATR[i]);        // push each element to sys_id
            this.form.value.LN = i.toString();
          }
          this.BindOrderDetails(PAT_ID, ORD_NO);
          this.isLoaded = false;

        }/*,
        error: (err) => {
        }*/
      })
  }

  BindOrderDetails(PAT_ID: any, ORD_NO: any) {
    this.OrderDetailsTable = [];
    this.OrderentrynewService.GET_p_ORD_DTL_TD_GT(PAT_ID, ORD_NO)
      .subscribe({
        next: (res) => {
          for (var i = 0; i < res.ord_Dtl.length; i++) {  // loop through the object array
            this.OrderDetailsTable.push(res.ord_Dtl[i]);        // push each element to sys_id
          }

        }/*,
        error: (err) => {
        }*/
      })
  }

  async SearchOrderTrans() {
    let resultObj: any = await this.multiSearchService.SearchOrderTransService(this.form, this.BindATRTable);
    this.form = resultObj.form;
    this.natid = resultObj.natid;
    this.scmid = resultObj.scmid;
    this.otpid = resultObj.otpid;
    this.PAT_ID = resultObj.PAT_ID;
    this.ORD_NO = resultObj.ORD_NO;
    this.btnDisabled = resultObj.btnDisabled;
  }

  ShowMulipleSearch() {
    const modalMulipleSearch = document.getElementById('modalMulipleSearch') as HTMLElement;
    const myModal = new Modal(modalMulipleSearch);
    myModal.show();
  }
  
  LoadPatient(paT_ID) {
    const PAT_IDEle = document.getElementById("PAT_ID") as HTMLInputElement;
    if (paT_ID) {
      this.anatomicData.paT_ID = paT_ID
      this.form.value.PAT_ID = paT_ID;
    }
    let index = this.anatomicAllData.findIndex(x => x.paT_ID == paT_ID);
    this.anatomicData = this.anatomicAllData[index]
    this.assignTheData();
  }

  getRoleBasedPermission() {
    this.rolebaseaction = this._permissionService.getRoleBaseAccessOnAction(Anatomic_Pathology);
  }
 
 

}