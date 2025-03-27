import { Component, OnInit } from '@angular/core';
import { Observable, Subject, flatMap } from 'rxjs';
import { ViewChild } from '@angular/core';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { anatomicModel, apRepportModel } from 'src/app/models/anatomicModel';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgModel } from '@angular/forms';
import { amendMessage, firstRecord, lastRecord, releaseMessage, saveMessage, updateSuccessMessage, validateMessage, verifyMessage, warningMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { resulttemplateModel } from 'src/app/models/resulttemplateModel';
import { MicroBiologyService } from './micro-biology.service';
import { mbPatientSearchModel, mbReportModel, microbiologyModel } from 'src/app/models/microbiologyModel';
import { mbIsolModel } from 'src/app/models/mbIsolModel';
import { mbSensitivityModel } from 'src/app/models/mbSensitivityModel';
import { Modal } from 'bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { mnModel } from 'src/app/models/mnModel';
import { MnService } from 'src/app/modules/masters/mn/mn.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { OrderentrynewService } from 'src/app/modules/orderprocessing/orderentrynew/add-orderentrynew/orderentrynew.service';
import { PermissionService } from 'src/app/services/permission.service';
import { roleBaseAction } from 'src/app/models/roleBaseAction';
import { rolePermissionModel } from 'src/app/models/rolePermissionModel';
import { Microbiology } from 'src/app/common/moduleNameConstant';
import { MultiSearchService } from 'src/app/services/multi-search.service';

@Component({
  selector: 'app-add-microbiology',
  templateUrl: './add-microbiology.component.html',
  styleUrls: ['./add-microbiology.component.scss']
})
export class AddMicrobiologyComponent {
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';

  PAT_ID: any = '';
  ORD_NO: any = '';
  GTNO: any = '';
  REQ_CODE: any = '';

  data: any;
  editor = new Editor();
  ckEditorData: string = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }]
  ];
  rolepermissionmodel: rolePermissionModel[] = [];
  rolebaseaction: roleBaseAction = new roleBaseAction();
  imageSource;
  _response: any;
  mnList: mnModel[] = [];
  keyword = 'patientname';
  // dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  errorMessage: any;
  resultstemplatesDropDown: any;
  ckEditorId: number = 0;

  microbiologyData: microbiologyModel = new microbiologyModel();
  mbRepportData: mbReportModel = new mbReportModel();
  resultsTemplateData: resulttemplateModel = new resulttemplateModel();
  form: FormGroup;
  isLoaded = false;
  submitted = false;
  IsDisabled = true;
  btnDisabled: boolean = true;
  patientSearch: mbPatientSearchModel[] = [];
  microbiologyAllData: microbiologyModel[] = [];
  resultTemplateAllData: resulttemplateModel[] = [];
  public multupleSearchOrdersList: any[] = [];
  public multupleSearchList: any[] = [];
  isEdit = false;
  isEditorReadOnly: boolean = true;
  isTemplateReadOnly: boolean = true;
  isDelete = false;
  accnControl = new FormControl();
  resultTemplateDropDown: any;
  scmid: string = '';
  otpid: string = '';
  natid: string = '';
  selectedTemplateId: any;

  isEditReadOnly: boolean = false;
  isDeleteReadOnly: boolean = true;
  isCancelReadOnly: boolean = true;

  isSubmitReadOnly: boolean = true;
  isVerifiedReadOnly: boolean = true;
  isValidateReadOnly: boolean = true;
  isReleaseReadOnly: boolean = true;
  isAmendReadOnly: boolean = true;
  NewPatId = 0;
  isddlEnable: boolean = true;
  microBiologyISolData: mbIsolModel[] = [];
  microBiologySensitivityData: mbSensitivityModel[] = [];
  public OrderDetailsTable = [];
  public ATRTable: any[] = [];
  microbiologyIsolDropDown: any;
  microbiologyARSensitivityData: any;
  microbiologyTDSensitivityData: any;
  microbiologyGTDSensitivityData: any;
  toDate: string;
  fromDate: string;

  isolCode: string = "";
  microBiologicData: microbiologyModel = new microbiologyModel();
  mbReportData: mbReportModel = new mbReportModel();
  Addrecord: boolean = false;
  visible: boolean = false;
  isSuppress: boolean = false;
  cities = [
    { id: 1, name: 'MA, Boston' },
    { id: 2, name: 'FL, Miami' },
    { id: 3, name: 'NY, New York', disabled: true },
    { id: 4, name: 'CA, Los Angeles' },
    { id: 5, name: 'TX, Dallas' }
  ];
  selectedPatient: number;
  constructor(private formBuilder: FormBuilder, private _microBiologyService: MicroBiologyService,
    private _mnService: MnService, private _commonService: CommonService,
    public _commonAlertService: CommonAlertService, private orderentryService: OrderentrynewService,
    private _permissionService: PermissionService, private multiSearchService: MultiSearchService) {
    this.form = this.formBuilder.group({
      accn: new FormControl(),
      paT_ID: new FormControl(),
      paT_NAME: new FormControl(),
      sex: new FormControl(),
      age: new FormControl(),
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
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    //this.fillResultsTemplateDropDown();
    this.getAllMicrobiologyData();
    this.isEditorReadOnly = true;
    this.isTemplateReadOnly = true;
    this.isEdit = false;
    this.getAllResultsTemplateData();
    this.formatAccn(this.microbiologyData.accn);
    this.fillMBIsol();
    this.fillMBAllSensitivity();
    this.fillMBAllGTDSensitivity();
    this.filMBSensitivityAR();
    $('#btnaddMicrobiology').addClass("is-active");
    this.GetmnData();
    const today = new Date();
    this.toDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD' format

    // Get the date 2 months ago
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    this.fromDate = twoMonthsAgo.toISOString().split('T')[0];
    this.getRoleBasedPermission();
  }


  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Clinical_MicoBiology, this.startTime, this.endTime);
    this.editor.destroy();
    // this.dtOptions = {
    //   paging: false,
    //   search: false
    // };
    this.dtTrigger.unsubscribe();
  }
  async GetMultipleSearch() {
    this.multupleSearchList = await this.multiSearchService.GetMultipleSearchService('MB');
  }
  async GetMultipleSearchOrders(PAT_ID: any) {
    this.NewPatId = PAT_ID;
    this.multupleSearchOrdersList = [];
    this.multupleSearchOrdersList = await this.multiSearchService.GetMultipleSearchOrders(PAT_ID);
  }
  assignTheData() {
    if (!this.microbiologyData) {
      console.error('No data available to assign. microbiologyData is undefined.');
      return; // Exit if microbiologyData is undefined to prevent runtime errors
    }

    this.form.reset({
      accn: this.microbiologyData.accn,
      paT_ID: this.microbiologyData.paT_ID,
      paT_NAME: this.microbiologyData.paT_NAME,
      sex: this.microbiologyData.sex,
      age: this.microBiologicData.age,
      dob: this.microbiologyData.dob,
      saudi: this.microbiologyData.saudi,
      reQ_CODE: this.microbiologyData.reQ_CODE,
      tcode: this.microbiologyData.tcode,
      loc: this.microbiologyData.loc,
      pr: this.microbiologyData.pr,
      cn: this.microbiologyData.cn,
      client: this.microbiologyData.client,
      drno: this.microbiologyData.drno,
      doctor: this.microbiologyData.doctor,
      sno: this.microbiologyData.sno,
      drawN_DTTM: this.microbiologyData.drawN_DTTM,
      veR_DTTM: this.microbiologyData.veR_DTTM,
      r_STS: this.microbiologyData.r_STS,
      notes: this.microbiologyData.notes,
      orD_NO: this.microbiologyData.orD_NO,
      req_COD: this.microbiologyData.req_COD
    });    // this.isReadOnly = true; 
  };

  emptyTheForm() {
    this.form.reset({
      accn: '',
      paT_ID: '',
      paT_NAME: '',
      sex: '',
      age: '',
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

  onEditRecord() {
    this.isEditorReadOnly = false;
    this.isTemplateReadOnly = false;
    this.isEdit = true;
    this.assignTheData();
    this.isSubmitReadOnly = false;
    if (this.isDeleteReadOnly && this.isCancelReadOnly) {
      this.isDeleteReadOnly = false;
      this.isCancelReadOnly = false;
      this.isAmendReadOnly = true;
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
      const strippedNotes = this.microbiologyData.notes.replace(/<\/?[^>]+(>|$)/g, '');
      if (strippedNotes.trim().length > 0) {
        this.isddlEnable = false;
        Swal.fire({
          text: 'Data already Exist. Please delete and import again.',
          icon: 'warning',
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
    console.log('Selected ID:', templateId);

    if (templateId) {
      console.log('Selected value:', templateId);
      this._microBiologyService.getRTForMicroBiologyById(templateId).subscribe((data) => {
        if (data && data.template) {
          // Assign the template data to ckEditorData
          this.ckEditorData = data.template;
          this.microbiologyData.notes = data.template;
        } else {
          console.error('Template data not found:', data);
        }
      });
    } else {
      this.ckEditorData = '';
    }
  }

  onCancelRecord(arF_ID: number) {
    if (this.isEdit) {
      let index = this.microbiologyAllData.findIndex(x => x.arF_ID == arF_ID);
      this.microbiologyData = this.microbiologyAllData[index]
      this.assignTheData();
      this.IsDisabled = true;
      this.isEdit = false;
    }
    else {
      this.emptyTheForm();
    }
  }

  getAllMicrobiologyData() {
    this._microBiologyService.getAllMicroBiology().subscribe(res => {
      this.microbiologyAllData = res;
      this.getRecord("last", this.microbiologyAllData.length - 1);
      this.formatAccn(this.microbiologyData.accn);
      if (localStorage.getItem('arfid')) {
        let arfid = localStorage.getItem('arfid')?.toString();
        if (arfid) {
          this.microbiologyData = this.microbiologyAllData.filter(x => x.arF_ID == Number(arfid))[0];
          this.getMicroBiologyISol(this.microbiologyData.arF_ID);
          this.assignTheData();
          this.fillMBAllSensitivityData(this.microbiologyData.arF_ID);
          this.formatAccn(this.microbiologyData.accn);
          localStorage.setItem('arfid', '');
        }
      }
      this.getAllMicrobiologyDataSearch();
    },
      (error) => {
        console.error('Error loading Site list:', error);
      })
  }



  getAllMicrobiologyDataSearch() {
    this._microBiologyService.getAllMicroBiologySearch().subscribe(res => {
      this.patientSearch = res;
    },
      (error) => {
        console.error('Error loading Patient Search:', error);
      })
  }



  getAllResultsTemplateData(): void {
    this._microBiologyService.getRTForMicroBiology().subscribe(
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

  @ViewChild('selectedValue') selectedValue!: NgModel; // ViewChild for NgModel
  selectedTemplate: number = 0; // Selected template value from dropdown


  // formatAccn(value: string): void {
  //   if(value != '' && !(value.indexOf('-') > -1)){
  //     let accn = value;
  //     if(this.isContainAplha(accn))
  //       accn = value.substring(0, 2) + '-' + value.substring(2, 4) + '-' + value.substring(3, 6) + '-' + value.substring(8);
  //     else
  //       accn = value.substring(0, 2) + '-' + value.substring(2, 4) + '-' + value.substring(4, 7) + '-' + value.substring(8);        
  //       this.microbiologyData.accn = accn;
  //     }
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

      this.microbiologyData.accn = accn;
    }
  }



  // isContainAlpha(Code: string) {
  //   let isReturn = true;
  //   for (var i = 0; i < Code.length; i++) {
  //     var char1 = Code.charAt(i);
  //     var cc = char1.charCodeAt(0);
  //     if ((cc > 64 && cc < 91)) {
  //       isReturn = true;
  //     } else {
  //       isReturn = false;
  //     }
  //   }
  //   return isReturn;
  // }

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



  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // Handle null and return either a number or null
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


  getRecord(input: any, SNO: number) {

    let totalNumberOfRec = this.microbiologyAllData.length;


    if (input == 'first') {
      if (this.microbiologyData.sno == 1) {
        this._commonAlertService.firstRecord();
        return;
      }
      this.microbiologyData = this.microbiologyAllData[0];
    } else if (input == 'prev' && SNO != 1) {
      this.microbiologyData = this.microbiologyAllData.filter(x => x.sno == (SNO - 1))[0];
    }
    else if (input == 'next' && totalNumberOfRec > SNO) {
      this.microbiologyData = this.microbiologyAllData.filter(x => x.sno == (SNO + 1))[0];
    }
    else if (input == 'last') {
      if (this.microbiologyData != null) {
        if (this.microbiologyData.sno == totalNumberOfRec) {
          this._commonAlertService.lastRecord();
          return;
        }
      }
      this.microbiologyData = this.microbiologyAllData.filter(x => x.sno == totalNumberOfRec)[0];
    }
    this.getMicroBiologyISol(this.microbiologyData.arF_ID);
    this.assignTheData();
    this.fillMBAllSensitivityData(this.microbiologyData.arF_ID);
    this.formatAccn(this.microbiologyData.accn);
    this.printBar(this.microbiologyData.accn);
  }

  updateStatus(clickNumber: number) {
    this.microbiologyData.arF_ID = this.microbiologyData.arF_ID;
    this.microbiologyData.notes = this.microbiologyData.notes;
    this.microbiologyData.r_STS = this.microbiologyData.r_STS;
    if (this.microbiologyData.veR_DTTM != null && this.microbiologyData.reS_DTTM != null ||
      this.microbiologyData.rslD_DTTM != null) {
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
              this.microbiologyData.r_STS = 'RS';
              break;
            case 2:
              this.microbiologyData.r_STS = 'VR';
              break;
            case 3:
              this.microbiologyData.r_STS = 'VD';
              break;
            case 4:
              this.microbiologyData.r_STS = 'RD';
              break;
            case 5:
              this.microbiologyData.r_STS = 'RS';
              break;
            default:
              break;
          }
          this.microbiologyData.arF_ID = this.microbiologyData.arF_ID;

          this._microBiologyService.updateMBReport(this.microbiologyData).subscribe(
            (response) => {
              if (response.status === 200 || response.status === 204) {
                if (this.microbiologyData.r_STS == 'VR') {
                  this.SaveSensitivity();
                }
                this._commonAlertService.updateMessage();
                this.getMicroBiologyISol(this.microbiologyData.arF_ID);
                this.fillMBAllSensitivityData(this.microbiologyData.arF_ID);
              }
            },
            (error) => {
              const status = error.status;
              if (status === 409) {
                this._commonAlertService.updateMessage();
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

  onSubmitStatus(clickNumber: number) {
    this.microbiologyData.arF_ID = this.microbiologyData.arF_ID;
    this.microbiologyData.notes = this.microbiologyData.notes;
    this.microbiologyData.r_STS = this.microbiologyData.r_STS;
    if (this.microbiologyData.veR_DTTM != null && this.microbiologyData.reS_DTTM != null ||
      this.microbiologyData.rslD_DTTM != null) {
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

          this.SaveIsol();
          this.SaveSensitivity();


          switch (clickNumber) {
            case 1:
              this.microbiologyData.r_STS = 'RS';
              break;
            case 2:
              this.microbiologyData.r_STS = 'VR';
              break;
            case 3:
              this.microbiologyData.r_STS = 'VD';
              break;
            case 4:
              this.microbiologyData.r_STS = 'RD';
              break;
            case 4:
              this.microbiologyData.r_STS = 'RS';
              break;
            default:
              break;
          }
          this.microbiologyData.arF_ID = this.microbiologyData.arF_ID;

          this._microBiologyService.updateMBReport(this.microbiologyData).subscribe(
            (response) => {
              if (response.status === 200 || response.status === 204) {
                this._commonAlertService.updateMessage();
                this.isEditorReadOnly = true;
                this.isTemplateReadOnly = true;
                this.isEdit = false;
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
        this.isEditorReadOnly = true;
        this.isTemplateReadOnly = true;
        this.isEdit = false;
      });
    }
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
    // 1 submit,2 verify,3 validate,4 release,5 ament
    switch (clickNumber) {
      case 1:

        this.isVerifiedReadOnly = false;
        this.isAmendReadOnly = false;
        this.isSubmitReadOnly = true;

        break;
      case 2:
        this.isValidateReadOnly = false;
        this.isVerifiedReadOnly = true;
        this.isEditorReadOnly = true;
        this.isSubmitReadOnly = true;
        this.isAmendReadOnly = false;
        this.isDeleteReadOnly = true;
        this.isCancelReadOnly = true;
        break;
      case 3:
        this.isReleaseReadOnly = false;
        this.isValidateReadOnly = true;
        this.isVerifiedReadOnly = true;
        this.isEditorReadOnly = true;
        break;
      case 4:
        this.isAmendReadOnly = false;
        this.isVerifiedReadOnly = true;
        this.isValidateReadOnly = true;
        this.isReleaseReadOnly = true;
        this.isEditorReadOnly = true;
        break;
      case 5:
        this.isAmendReadOnly = true;
        this.isValidateReadOnly = true;
        this.isReleaseReadOnly = true;
        this.isEditorReadOnly = false;
        this.isVerifiedReadOnly = false;
        break;
      default:
        break;
    }
  }

  fillMBIsol() {
    this.microbiologyIsolDropDown = this._microBiologyService.getAllIsol().subscribe(x => {
      this.microbiologyIsolDropDown = x;
    })
  }

  fillMBIsolBySearch(search: any) {
    this.microbiologyIsolDropDown = this._microBiologyService.getSearchIsol(search).subscribe(x => {
      this.microbiologyIsolDropDown = x;
    })
  }

  fillMBAllSensitivity() {
    this.microbiologyTDSensitivityData = this._microBiologyService.getAllSensitivity().subscribe(x => {
      this.microbiologyTDSensitivityData = x;
    })
  }

  fillMBAllSensitivityData(arrId: any) {

    this._microBiologyService.getAllSensitivityData(arrId).subscribe(x => {

      this.microBiologySensitivityData = x;
    })
  }

  fillMBAllGTDSensitivity() {
    this.microbiologyGTDSensitivityData = this._microBiologyService.getAllGTDSensitivity().subscribe(x => {
      this.microbiologyGTDSensitivityData = x;
    })
  }

  fillMBSearchSensitivity(search: any) {
    this.microbiologyTDSensitivityData = this._microBiologyService.getSearchSensitivity(search).subscribe(x => {
      this.microbiologyTDSensitivityData = x;
    })
  }

  filMBSensitivityAR() {
    this.microbiologyARSensitivityData = this._microBiologyService.getMBSensitivityAR().subscribe(x => {
      this.microbiologyARSensitivityData = x;
    })

  }

  BindSearchIsolTable() {
    const searchIsol = document.getElementById("searchIsol") as HTMLInputElement;
    if (searchIsol.value != '')
      this.fillMBIsolBySearch(searchIsol.value);
    else
      this.fillMBIsol();
  }

  BindSearchSensitivityTable() {
    const searchSensitivity = document.getElementById("searchSensitivity") as HTMLInputElement;
    if (searchSensitivity.value != '')
      this.fillMBSearchSensitivity(searchSensitivity.value);
    else
      this.fillMBAllSensitivity();
  }

  getMicroBiologyISol(id: number) {
    this._microBiologyService.getMicroBiologyIsol(id).subscribe((data) => {
      if (data) {

        // Assign the template data to ckEditorData
        this.microBiologyISolData = data;
      } else {
        console.error('Mirco Biology ISol data not found:', data);
      }
    })
  }

  addIsolTable(isol: mbIsolModel) {
    let filteredArray = [];
    try {

      filteredArray = this.microBiologyISolData.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.isoL_CD.trimLeft().trimRight() === isol.isoL_CD.trimLeft().trimRight()
        ))
      );
    }
    catch (e) {
      alert((e as Error).message);
      console.log((e as Error).message);
    }

    if (filteredArray.length == 0) {

      console.log(this.microBiologyISolData.length);
      const obj = new mbIsolModel();
      obj.IsAdd = true;
      this.visible = false;
      obj.rno = this.microBiologyISolData.length + 1;
      obj.isoL_CD = isol.isoL_CD;
      obj.descrip = isol.descrip.trimLeft().trimRight();
      obj.arF_ID = this.microbiologyData.arF_ID;
      obj.reQ_CODE = this.microbiologyData.reQ_CODE.trimLeft().trimRight();
      obj.orD_NO = this.microbiologyData.orD_NO;
      obj.f = '';
      obj.r_STS = 'RS';
      obj.search = '';
      this.microBiologyISolData.push(obj);
      this.Addrecord = true;
      this.fillMBIsol();
    }
    else {
      this._commonAlertService.warningMessage();
      const isolModal = document.getElementById('isolModal') as HTMLElement;
      const myModal = new Modal(isolModal);
      myModal.show();
    }
    //this.SaveIsol();
  }

  addSensitivityTable() {

    const orgCode = document.getElementById("orgCode") as HTMLInputElement;
    for (var i = 0; i < this.microbiologyTDSensitivityData.length; i++) {
      if (this.microbiologyTDSensitivityData[i].ischecked === true) {
        if (this.microbiologyTDSensitivityData[i].type.trim() == "D") {
          const obj = new mbSensitivityModel();
          obj.arF_ID = this.microbiologyData.arF_ID;
          obj.ord_NO = this.microbiologyData.orD_NO;
          obj.rno = this.microBiologySensitivityData.length + 1;
          obj.r_STS = 'RS';
          obj.reQ_CODE = this.microbiologyData.reQ_CODE.trimLeft().trimRight();
          obj.sreQ_CODE = this.microbiologyTDSensitivityData[i].reQ_CODE.trim();
          obj.tcode = this.microbiologyTDSensitivityData[i].reQ_CODE.trim();
          obj.fulL_NAME = this.microbiologyTDSensitivityData[i].fulL_NAME.trim();
          obj.result = this.microbiologyTDSensitivityData[i].result.trim();
          obj.mic = this.microbiologyTDSensitivityData[i].mic.trim();
          obj.isolate = obj.isolate = orgCode.value.trim();
          this.microBiologySensitivityData.push(obj);
        }
        else if (this.microbiologyTDSensitivityData[i].type.trim() == "P") {
          const _tempGTD = this.microbiologyGTDSensitivityData.filter((x: { code: any; }) => x.code.trim() == this.microbiologyTDSensitivityData[i].reQ_CODE.trim());
          for (var j = 0; j < _tempGTD.length; j++) {
            const obj = new mbSensitivityModel();
            obj.arF_ID = this.microbiologyData.arF_ID;
            obj.rno = this.microBiologySensitivityData.length + 1;
            obj.r_STS = 'RS';
            obj.ord_NO = this.microbiologyData.orD_NO;
            obj.tcode = _tempGTD[j].reQ_CODE.trimLeft().trimRight();
            obj.sreQ_CODE = _tempGTD[j].code.trimLeft().trimRight();
            obj.reQ_CODE = this.microbiologyData.reQ_CODE.trimLeft().trimRight();
            obj.fulL_NAME = _tempGTD[j].fulL_NAME.trimLeft().trimRight();
            obj.result = _tempGTD[j].result;
            obj.mic = _tempGTD[j].mic;
            obj.isolate = orgCode.value.trimLeft().trimRight();
            this.microBiologySensitivityData.push(obj);

          }

          console.log(this.microBiologySensitivityData);
        }
      }
    }
    this.fillMBAllSensitivity();
    //this.SaveSensitivity();
  }


  eventCheck(event: any) {

    for (var i = 0; i < this.microbiologyTDSensitivityData.length; i++) {
      if (this.microbiologyTDSensitivityData[i].reQ_CODE.trim() === event.value.trim()) {
        if (event.checked === true)
          this.microbiologyTDSensitivityData[i].ischecked = true;
        else
          this.microbiologyTDSensitivityData[i].ischecked = false;
      }
    }
  }


  findPR(isol: any) {
    const searchValue = document.getElementById("searchIsol") as HTMLInputElement;
    searchValue.value = '';
    const isolModal = document.getElementById('isolModal') as HTMLElement;
    const myModal = new Modal(isolModal);
    myModal.show();
  }


  deleteRow(isol: any) {
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      const index = this.microBiologyISolData.indexOf(isol, 0);
      if (index > -1) {
        this.microBiologyISolData.splice(index, 1);
      }
      for (var i = 0; i < this.microBiologyISolData.length; i++) {  // loop through the object array
        this.microBiologyISolData[i].rno = i + 1;
      }
    }
  }

  findSensitivity(item: mbIsolModel) {
    const searchValue = document.getElementById("searchSensitivity") as HTMLInputElement;
    const orgCode = document.getElementById("orgCode") as HTMLInputElement;
    searchValue.value = ''; orgCode.value = item.isoL_CD;
    console.log(orgCode.value);
    const sensitivityModal = document.getElementById('sensitivityModal') as HTMLElement;
    const myModal = new Modal(sensitivityModal);
    myModal.show();
  }

  SaveIsol() {

    this._microBiologyService.saveMicrobiologyIsol(this.microBiologyISolData).subscribe((data: any) => {
      if (data) {
        // Assign the template data to ckEditorData
        //this.microBiologyISolData = data;
      } else {
        console.error('Mirco Biology ISol data not found:', data);
      }
    })

  }


  SaveSensitivity() {

    this._microBiologyService.saveMicrobiologySensitivity(this.microBiologySensitivityData).subscribe((data: any) => {
      if (data) {
        // Assign the template data to ckEditorData
        //this.microBiologySensitivityData = data;
        this.fillMBAllSensitivityData(this.microbiologyData.arF_ID);
      } else {
        console.error('Mirco Biology Sensitivity data not found:', data);
      }
    })
  }

  getSensitivityResult(event: any) {
    let code = event.target.value.toUpperCase();
    const _tempGTD = this.microbiologyGTDSensitivityData.filter((x: { cd: any; }) => x.cd.trim() == code.trim());
    this.microBiologySensitivityData[event.target.id - 1].result = _tempGTD[0].response;
  }

  getMNIValue(event: any) {
    let code = event.target.value.toUpperCase();
    const _tempGTD = this.microbiologyARSensitivityData.filter((x: { cd: any; }) => x.cd.trimLeft().trimRight() == code);
    this.microBiologySensitivityData[event.target.id - 1].result = _tempGTD[0].response;
  }

  delayBlocking(milliseconds: number): void {
    const timeInitial: Date = new Date();
    let timeNow: Date = new Date();
    for (; timeNow.getTime() - timeInitial.getTime() < milliseconds;) {
      timeNow = new Date();
    }
    console.log('Sleep done!');
  }

  checkAll(event: any) {
    for (var i = 0; i < this.microBiologySensitivityData.length; i++) {
      if (this.isSuppress)
        this.microBiologySensitivityData[i].sprs = true;
      else
        this.microBiologySensitivityData[i].sprs = false;
    }
  }

  changeHeader(isChecked: any) {
    let childCheck: boolean = false;
    if (isChecked) {
      for (var i = 0; i < this.microBiologySensitivityData.length; i++) {
        if (this.microBiologySensitivityData[i].sprs === true)
          childCheck = true;
        else {
          childCheck = false; this.isSuppress = false; return;
        }
      }
      if (childCheck)
        this.isSuppress = true;
    }
    else {
      childCheck = false; this.isSuppress = false; return;
    }
  }

  onFetchAbbrevation(event: any) {
    if (event.keyCode == 27) {
      let _word = event.target.innerText.trim();
      let arr = [] as any;
      arr = _word.split(' ');
      let _tempWord = ''
      if (arr.length > 0) {
        _tempWord = arr[arr.length - 1]
      }
      const _codeResponse = this.mnList.filter(x => x.mncd.trim().toUpperCase() == _tempWord.toUpperCase());
      //alert( _codeResponse[0].mN_DESCRP);
      this.microbiologyData.notes = this.replaceAt(this.microbiologyData.notes, this.microbiologyData.notes.lastIndexOf(_tempWord), _codeResponse[0].mN_DESCRP);
    }
  }

  replaceAt(_string: string, index: number, replacement: string) {
    return _string.substring(0, index) + replacement + _string.substring(index + replacement.length);
  }


  GetmnData(): void {
    this._mnService.getAllmn().subscribe(res => {
      this.mnList = res;
    },
      (error) => {
        console.error('Error loading mn list:', error);
      })
  }


  printBar(accn: string) {
    return this._microBiologyService.getBarcode(accn).subscribe(res => {
      this._response = res;
      this.imageSource = 'data:image/png;base64 ,' + this._response.messages;
    })
  }

  showBarCode() {
    const barCodeModal = document.getElementById('barCodeModal') as HTMLElement;
    const myModal = new Modal(barCodeModal);
    myModal.show();
  }


  onPatientSelection(event: any, select: NgSelectComponent) {
    if (event && event.id !== undefined && event.name !== undefined) {
      const selectedPatient = this.microbiologyAllData.find(mb =>
        mb.arF_ID === event.id
      );
      if (selectedPatient) {
        this.microbiologyData = selectedPatient;
        this.getMicroBiologyISol(selectedPatient.arF_ID);
        this.fillMBAllSensitivityData(selectedPatient.arF_ID);
      } else {
        // Handle case where selectedPatient is not found
      }
    } else {
      // Handle case where event or event.paT_NAME is undefined
    }
    select.handleClearClick();
  }
  SearchOrderTransMultiple(ORD_NO: any) {
    const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
    searchOrder.value = ORD_NO;
    this.SearchOrderTrans();

  }


  BindATRTable(PAT_ID: any, ORD_NO: any) {
    this.ATRTable = [];
    this.orderentryService.GET_ATR(PAT_ID, ORD_NO)
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
    this.orderentryService.GET_p_ORD_DTL_TD_GT(PAT_ID, ORD_NO)
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
      this.microbiologyData.paT_ID = paT_ID
      this.form.value.PAT_ID = paT_ID;
    }
    let index = this.microbiologyAllData.findIndex(x => x.paT_ID == paT_ID);
    this.microbiologyData = this.microbiologyAllData[index]
    this.assignTheData();
    this.getMicroBiologyISol(this.microbiologyData.arF_ID);
    this.fillMBAllSensitivityData(this.microbiologyData.arF_ID);
  }

  getRoleBasedPermission() {
    this.rolebaseaction = this._permissionService.getRoleBaseAccessOnAction(Microbiology);
  }

  // Function to check if a button should be disabled
  
}
