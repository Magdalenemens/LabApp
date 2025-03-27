import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { CommonService } from 'src/app/common/commonService';
import { MnService } from 'src/app/modules/masters/mn/mn.service';
import { EnvironmentalserviceService } from './environmentalservice.service';
import { evResultStatus, environmentalResultARFModel, environmentalResultModel, evPatientSearchModel, evSearchModel, environmentalDetailModel } from 'src/app/models/environemtalResult';
import Swal from 'sweetalert2';

import { NgSelectComponent } from '@ng-select/ng-select';
import { Modal } from 'bootstrap';
import { mnModel } from 'src/app/models/mnModel';
import { OrderentrynewService } from 'src/app/modules/orderprocessing/orderentrynew/add-orderentrynew/orderentrynew.service';
import { MultiSearchService } from 'src/app/services/multi-search.service';
import { Environmental } from 'src/app/common/moduleNameConstant';
import { roleBaseAction } from 'src/app/models/roleBaseAction';
import { rolePermissionModel } from 'src/app/models/rolePermissionModel';
import { PermissionService } from 'src/app/services/permission.service';

import { Editor, NgxEditorService, Toolbar, Validators } from 'ngx-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { REPORT_BASEURL } from 'src/app/common/constant';

import { kolkovEditorService } from 'src/app/common/kolkovEditorService';
import { CytogeneticsService } from '../../cytogenetics/add-cytogenetics/cytogenetics.service';
import { evSignUser } from 'src/app/models/environmentalOrderModel';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';
import { userflModel } from 'src/app/models/userflModel';
import { UserService } from 'src/app/modules/system/users/users.service';
import { arModel } from 'src/app/models/arModel';
import { PrintService } from 'src/app/services/print.service.';
import { LoaderService } from 'src/app/modules/shared/services/loaderService';


@Component({
  selector: 'app-add-clinical-environmental',
  templateUrl: './add-clinical-environmental.component.html',
  styleUrls: ['./add-clinical-environmental.component.scss']
})
export class AddClinicalEnvironmentalComponent {
  @ViewChild('reportFrame') reportFrame!: ElementRef;
  form: FormGroup;
  rolepermissionmodel: rolePermissionModel[] = [];
  rolebaseaction: roleBaseAction = new roleBaseAction();
  scmid: string = '';
  otpid: string = '';
  natid: string = '';
  isLoaded = false;
  btnDisabled: boolean = true;
  NewPatId = 0;
  public multupleSearchOrdersList: any[] = [];
  public multupleSearchList: any[] = [];
  public OrderDetailsTable = [];
  public ATRTable: any[] = [];
  mnList: mnModel[] = [];
  selectedPatient: number;
  toDate: string;
  fromDate: string;
  evInstrument = [] as evSignUser[];
  patientSearch: evPatientSearchModel[] = [];
  patientSearchORG: evPatientSearchModel[] = [];
  evResultAllData: environmentalResultModel[] = [];
  evResultData: environmentalResultModel = new environmentalResultModel();
  evResultArfData: environmentalResultARFModel[] = [];
  evResultInstrument: environmentalResultARFModel[] = [];
  evDetails: environmentalDetailModel = new environmentalDetailModel();
  disableText: boolean = false; arList: arModel[] = [];
  finding: string = '';
  fnlres: string = '';
  @ViewChild('inputFile') inputFile!: ElementRef<HTMLInputElement>;
  @ViewChild('previewImage') previewImage!: ElementRef<HTMLImageElement>;
  @ViewChild('inputFile1') inputFile1!: ElementRef<HTMLInputElement>;
  @ViewChild('previewImage1') previewImage1!: ElementRef<HTMLImageElement>;
  @ViewChild('inputFile2') inputFile2!: ElementRef<HTMLInputElement>;
  @ViewChild('previewImage2') previewImage2!: ElementRef<HTMLImageElement>;
  imageSelected: boolean = false;
  imagesList: any[] = [];
  imageSelected1: boolean = false;
  imageSelected2: boolean = false;
  base64Image = '';
  PAT_ID: any = '';
  ORD_NO: any = '';
  GTNO: any = '';
  REQ_CODE: any = '';
  submitId: number = 0;
  editor = new Editor();
  isCKEditorReadOnly: boolean = true;

  reportPath_Clinical = '/Clinical'; // Path to the report folder
  reportName = 'EV_Results'; // Report name

  toolbar: Array<any> = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image']
  ];

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: '',
    translate: 'no',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'verdana', name: 'Verdana' },
      { class: 'georgia', name: 'Georgia' },
      { class: 'courier-new', name: 'Courier New' },
      { class: 'tahoma', name: 'Tahoma' },
      { class: 'impact', name: 'Impact' },
      { class: 'sans-serif', name: 'Sans-Serif' },
      { class: 'roboto', name: 'Roboto' },
      { class: 'segoe-ui', name: 'Segoe UI' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      [
        'bold', // Bold button
        'italic', // Italic button
        'underline', // Underline button
        'strikeThrough', // Strike-through button
        'subscript', // Subscript button
        'superscript', // Superscript button
        'justifyLeft', // Justify left button
        'justifyCenter', // Justify center button
        'justifyRight', // Justify right button
        'justifyFull', // Justify full button
        'indent', // Indent button
        'outdent', // Outdent button
        'insertUnorderedList', // Unordered List button
        'insertOrderedList', // Ordered List button
        'heading', // Headings dropdown
        'fontName', // Font Name dropdown
        'backgroundColor', // Background color picker
        'customClasses', // Custom classes dropdown
        'insertImage', // Insert Image button
        'insertVideo', // Insert Video button
        'horizontalLine', // Horizontal Line button
        'removeFormat', // Remove formatting button
        'link', // Insert Link button
        'unlink', // Remove Link button
        'undo', // Undo button
        'redo', // Redo button
        'toggleEditorMode',
        'insertHorizontalRule',
      ],
    ],
  };
  userId: string;
  userAllData: userflModel[] = [];
  selectedUserId: string = ''; // Or null  // This will hold the user id selected in the dropdown
  downloadUrl: string;
  downloadFilename: string;

  constructor(private formBuilder: FormBuilder, private _environmentalService: EnvironmentalserviceService,
    private _mnService: MnService, private _commonService: CommonService,
    public _commonAlertService: CommonAlertService, private orderentryService: OrderentrynewService,
    private _permissionService: PermissionService, private multiSearchService: MultiSearchService,
    private _cytogenticService: CytogeneticsService, public editorService: kolkovEditorService,
    private _authService: AuthService, public _userService: UserService,
    private _printService: PrintService, private _loaderService: LoaderService) {

  }

  ngOnInit(): void {
    this.userId = EncryptionHelper.decrypt(this._authService.getuserId());
    this.GetmnData();
    this.getAllEnvironmentalResultData($("#pSize").val() == '' ? 60 : $("#pSize").val());
    const today = new Date();
    this.toDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
    // Get the date 2 months ago
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    this.fromDate = twoMonthsAgo.toISOString().split('T')[0];
    this.getAlllInstruments();
    this.getRoleBasedPermission();
    this.getAllUsersData();
    this.GetARData();
    this._loaderService.ShowHideLoader(4000);
  }

  async GetMultipleSearch() {
    this.multupleSearchList = await this.multiSearchService.GetMultipleSearchService('EV');
  }

  async GetMultipleSearchOrders(PAT_ID: any) {
    this.NewPatId = PAT_ID;
    this.multupleSearchOrdersList = [];
    this.multupleSearchOrdersList = await this.multiSearchService.GetMultipleSearchOrders(PAT_ID);
  }

  getAllEnvironmentalResultData(pSize: any) {
    this._environmentalService.getAllEnvironmentalResult(pSize).subscribe(res => {
      this.evResultAllData = res;
      if (localStorage.getItem('sample_ID')) {
        let sample_ID = localStorage.getItem('sample_ID')?.toString();
        this.evResultData = this.evResultAllData.filter(x => x.paT_ID == sample_ID)[0];
        this.formatAccn(this.evResultData.accn);
        this.getEVArfResult(this.evResultData.accn);
        this.loadImages();
        localStorage.setItem('sample_ID', '');
      }
      else {
        this.getRecord("last", this.evResultAllData.length - 1);
        this.formatAccn(this.evResultData.accn);
        this.getAllEnvironmentalDataSearch();
      }

    },
      (error) => {
        console.error('Error loading EV Result list:', error);
      })
  }

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

      this.evResultData.accn = accn;
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

  getAllUsersData(): void {
    this._userService.getAllUser().subscribe((res: any[]) => {
      // Filter out users where sigN_LINE1 is null or empty/whitespace only.
      this.userAllData = res.filter(user =>
        user.sigN_LINE1 && user.sigN_LINE1.trim().length > 0
      );
    });
  }



  getRecord(input: any, SNO: number) {
    let totalNumberOfRec = this.evResultAllData.length;
    if (input == 'first') {
      if (this.evResultData.sno == 1) {
        this._commonAlertService.firstRecord();
        return;
      }
      this.evResultData = this.evResultAllData[0];
    } else if (input == 'prev' && SNO != 1) {
      this.evResultData = this.evResultAllData.filter(x => x.sno == (SNO - 1))[0];
    }
    else if (input == 'next' && totalNumberOfRec > SNO) {
      this.evResultData = this.evResultAllData.filter(x => x.sno == (SNO + 1))[0];
    }
    else if (input == 'last') {
      if (this.evResultData != null) {
        if (this.evResultData.sno == totalNumberOfRec) {
          //this._commonAlertService.lastRecord();
          return;
        }
      }
      this.evResultData = this.evResultAllData.filter(x => x.sno == totalNumberOfRec)[0];
    }

    if (this.submitId != 0) {
      this.evResultData = this.evResultAllData.filter(x => x.sno == this.submitId)[0];
      this.submitId = 0;
    }

    this.formatAccn(this.evResultData.accn);
    this.getEVArfResult(this.evResultData.accn);
    this.loadImages();
  }

  getEVArfResult(accn: string) {
    this._environmentalService.getEVArf(accn).subscribe((data) => {

      if (data) {


        this.evResultArfData = data;
        if (this.evResultArfData.length > 0) {
          this.finding = this.evResultArfData[0].finding;
          this.fnlres = this.evResultArfData[0].fnlres;
        }
        if (this.evResultArfData[0].r_STS == 'OD' || this.evResultArfData[0].r_STS == 'RS') {
          this.disableText = false;
        }
        else {
          this.disableText = true;
        }

        if (this.patientSearch == null)
          this.patientSearch = this.patientSearchORG;

      } else {
        console.error('Environmental result data not found:', data);
      }
    })
  }

  onFetchAbbrevationResult(event: any, evResultArfData: any, allevResultArfData: any) {
    const index = this.evResultArfData.indexOf(evResultArfData, 0);
    $("#rowIndex").val(index.toString());
    if (event.keyCode == 27) {
      let _word = event.target.value.trim();
      let arr = [] as any;
      arr = _word.split(' ');
      let _tempWord = ''
      if (arr.length > 0) {
        _tempWord = arr[arr.length - 1]
      }
      const _codeResponse = this.arList.filter(x => x.cd.trim().toUpperCase() == _tempWord.toUpperCase());
      this.evResultArfData[index].result = this.replaceAtResult(this.evResultArfData[index].result, this.evResultArfData[index].result.lastIndexOf(_tempWord), _codeResponse[0].response);

    }
    else if (event.keyCode == 40) {
      if (index + 1 <= allevResultArfData.length)
        $("#inputResult" + (index + 1)).focus();
    }
  }

  replaceAtResult(_string: string, index: number, replacement: string) {
    return _string.substring(0, index) + replacement + _string.substring(index + replacement.length);
  }


  getCommentIndex(evResultArfData: any) {
    $("#notes").val(evResultArfData.notes);
    const index = this.evResultArfData.indexOf(evResultArfData, 0);
    $("#rowIndex").val(index.toString());
  }

  getInstrumentIndex(evResultArfData: any) {
    $("#instrumenttype").val(evResultArfData.shn);
    const index = this.evResultArfData.indexOf(evResultArfData, 0);
    $("#rowIndex").val(index.toString());
    this.showInstruments(evResultArfData.reQ_CODE, evResultArfData.fulL_NAMEPLUS, evResultArfData.shn);
  }


  updateComments() {
    this.evResultArfData[parseInt($("#rowIndex").val().toString())].notes = $("#notes").val().toString();
    this.SaveResultInComments();
  }

  updateInstruments() {
    this.evResultArfData[parseInt($("#rowIndex").val().toString())].shn = $("#instrumenttype").val().toString();
    this.SaveResultInstrument(parseInt($("#rowIndex").val().toString()));
  }

  SaveResult() {

    for (let i = 0; i < this.evResultArfData.length; i++) {
      this.evResultArfData[i].accn = this.evResultData.accn;
      this.evResultArfData[i].updatetype = 'SAVE';
      this.evResultArfData[i].rsid = '';
      this.evResultArfData[i].vldt = '';
      this.evResultArfData[i].finding = this.finding;
      this.evResultArfData[i].notes = (this.evResultArfData[i].notes == null || this.evResultArfData[i].notes == undefined ? '' : this.evResultArfData[i].notes);
      this.evResultArfData[i].fnlres = $("#fnlres").val() == null ? $("#fnlres").prop('selectedIndex', 0).val().toString() : $("#fnlres").val().toString();
      this.evResultArfData[i].f = (this.evResultArfData[i].f == null || this.evResultArfData[i].f == undefined ? '' : this.evResultArfData[i].f);
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you want to Confirm the Save?',
      //icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitId = this.evResultData.sno;
        this._environmentalService.saveEVResult(this.evResultArfData).subscribe((data: any) => {
          if (data) {
            this.getEVArfResult(this.evResultData.accn);
            // Swal.fire({
            //   text: 'Result updated successfully!!!.',
            // });

          } else {
            console.error('Environemtal Result data not found:', data);
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          text: 'Not amended by the User!!!.',
        });
      }
    });
  }

  SaveResultInComments() {
    for (let i = 0; i < this.evResultArfData.length; i++) {
      this.evResultArfData[i].accn = this.evResultData.accn;
      this.evResultArfData[i].updatetype = 'SAVE';
      this.evResultArfData[i].rsid = '';
      this.evResultArfData[i].vldt = '';
      this.evResultArfData[i].finding = this.finding;
      this.evResultArfData[i].notes = (this.evResultArfData[i].notes == null || this.evResultArfData[i].notes == undefined ? '' : this.evResultArfData[i].notes);
      this.evResultArfData[i].fnlres = $("#fnlres").val() == null || $("#fnlres").val() == undefined ? '' : $("#fnlres").val().toString();
      this.evResultArfData[i].f = (this.evResultArfData[i].f == null || this.evResultArfData[i].f == undefined ? '' : this.evResultArfData[i].f);
      this.evResultArfData[i].shn = (this.evResultArfData[i].shn == null || this.evResultArfData[i].shn == undefined ? '' : this.evResultArfData[i].shn);
    }

    this.submitId = this.evResultData.sno;
    this._environmentalService.saveEVResult(this.evResultArfData).subscribe((data: any) => {
      if (data) {
        this.getAllEnvironmentalResultData($("#pSize").val());
        // Swal.fire({
        //   text: 'Result updated successfully!!!.',
        // });
      } else {
        console.error('Environemtal Result data not found:', data);
      }
    });
  }


  SaveResultInstrument(index: number) {
    this.evResultInstrument = [];
    const enInstrument = new environmentalResultARFModel();
    enInstrument.accn = this.evResultArfData[index].accn;
    enInstrument.updatetype = 'SAVE';
    enInstrument.rsid = '';
    enInstrument.vldt = '';
    enInstrument.tcode = this.evResultArfData[index].tcode.toString();
    enInstrument.reQ_CODE = $("#instrumentCode").val().toString();
    enInstrument.finding = this.finding;
    enInstrument.notes = (this.evResultArfData[index].notes == null || this.evResultArfData[index].notes == undefined ? '' : this.evResultArfData[index].notes);
    enInstrument.fnlres = $("#fnlres").val() == null || $("#fnlres").val() == undefined ? '' : $("#fnlres").val().toString();
    enInstrument.f = (this.evResultArfData[index].f == null || this.evResultArfData[index].f == undefined ? '' : this.evResultArfData[index].f);
    enInstrument.shn = (this.evResultArfData[index].shn == null || this.evResultArfData[index].shn == undefined ? '' : this.evResultArfData[index].shn);
    this.evResultInstrument.push(enInstrument);
    this.submitId = this.evResultData.sno;
    this._environmentalService.UpdateEVResultInstrument(this.evResultInstrument).subscribe((data: any) => {
      if (data) {
        // this.getAllEnvironmentalResultData($("#pSize").val());
        this.getEVArfResult(this.evResultData.accn);
        // Swal.fire({
        //   text: 'Result updated successfully!!!.',
        // });
      } else {
        console.error('Environemtal Result data not found:', data);
      }
    });
  }


  change(event: any) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you want to update the empty cells?',
      //icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        let option = event.$ngOptionLabel;
        for (let i = 0; i < this.evResultArfData.length; i++) {
          if (this.evResultArfData[i].result == '')
            this.evResultArfData[i].result = option;
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  statusUpdate(status: string) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you want to update the result status?',
      //icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const obj = new evResultStatus();
        obj.accn = this.evResultData.accn;
        obj.r_STS = status;
        obj.querytype = 2;
        this._environmentalService.updateEVResultStatus(obj).subscribe((data: any) => {
          if (data) {
            this.getEVArfResult(this.evResultData.accn);
            // Swal.fire({
            //   text: 'Result updated successfully!!!.',
            // });
          } else {
            console.error('Environemtal Result data not found:', data);
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          text: 'Not amended by the User!!!.',
        });
      }
    });
  }

  resetRefRange(status: string) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you want to update the reset the reference range?',
      //icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const obj = new evResultStatus();
        obj.accn = this.evResultData.accn;
        obj.r_STS = status;
        obj.querytype = 3;
        this._environmentalService.resetEVReferenceRange(obj).subscribe((data: any) => {
          if (data) {
            this.getEVArfResult(this.evResultData.accn);
            // Swal.fire({
            //   text: 'Reference range reset successfully!!!.',
            // });
          } else {
            console.error('Environemtal Result data not found:', data);
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          text: 'Not amended by the User!!!.',
        });
      }
    });
  }

  getAllEnvironmentalDataSearch() {
    this._environmentalService.getAllEnvironmentalSearch($("#pSize").val().toString() == '' ? '60' : $("#pSize").val().toString()).subscribe(res => {
      this.patientSearch = res;
      this.patientSearchORG = res;
    },
      (error) => {
        console.error('Error loading Sample Search:', error);
      })
  }

  pad(num: any, size: number) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
  }

  // onPatientSelection(event: any, select: NgSelectComponent) {
  //   if (event && event.id !== undefined && event.name !== undefined) {
  //     const selectedPatient = this.evResultAllData.find(ev =>
  //       ev.paT_ID === event.id.toString().padStart(10, '0')
  //     );
  //     if (selectedPatient) {
  //       this.evResultData = selectedPatient;
  //       this.formatAccn(this.evResultData.accn);
  //       this.getEVArfResult(this.evResultData.accn);
  //     } else {
  //       // Handle case where selectedPatient is not found
  //     }
  //   } else {
  //     // Handle case where event or event.paT_NAME is undefined
  //   }
  //   select.handleClearClick();
  // }


  onPatientSelection(event: any, select: NgSelectComponent) {

    if (event && event !== undefined) {
      const patId = this.pad(event, 10);
      const selectedPatient = this.evResultAllData.filter(x => x.paT_ID == patId)[0];
      if (selectedPatient) {
        this.evResultData = selectedPatient;
        this.formatAccn(this.evResultData.accn);
        this.getEVArfResult(this.evResultData.accn);

        //this.patientSelect = '';

      } else {
        // Handle case where selectedPatient is not found
      }
    } else {
      // Handle case where event or event.paT_NAME is undefined
    }
    // , select: NgSelectComponent
    select.handleClearClick();
  }




  loadTCodeDetails(tcode: string) {
    const obj = new evSearchModel();
    obj.accn = this.evResultData.accn;
    obj.orD_NO = this.evResultData.orD_NO;
    obj.tcode = tcode;
    this._environmentalService.getAllEnvironmentalDetails(obj).subscribe(res => {
      this.evDetails = res;
    },
      (error) => {
        console.error('Error loading TCode Details:', error);
      })
  }

  showPatient(Id: any) {
    const sampleModal = document.getElementById('sampleModal') as HTMLElement;
    this.loadTCodeDetails(Id);
    const myModal = new Modal(sampleModal);
    myModal.show();
  }

  showInstruments(Id: any, Fullname: any, shn: any) {
    //  const instrument = document.getElementById('instrument') as HTMLElement;
    $("#instrumentCode").val(Id);
    $("#instrumentfullName").val(Fullname);
    $("#instrumenttype").val(shn);
    // const myModal = new Modal(instrument);
    // myModal.show();
  }

  onFetchAbbrevation(event: any) {

    if (event.keyCode == 27) {
      let _word = event.target.value.toString().trim();
      let arr = [] as any;
      arr = _word.split(' ');
      let _tempWord = ''
      if (arr.length > 0) {
        _tempWord = arr[arr.length - 1]
      }
      const _codeResponse = this.mnList.filter(x => x.mncd.trim().toUpperCase() == _tempWord.toUpperCase());
      //alert( _codeResponse[0].mN_DESCRP);
      this.finding = this.replaceAt(this.finding, this.finding.lastIndexOf(_tempWord), _codeResponse[0].mN_DESCRP);
    }
  }

  replaceAt(_string: string, index: number, replacement: string) {
    return _string.substring(0, index) + replacement + _string.substring(index + replacement.length);
  }

  GetmnData(): void {
    this._environmentalService.getAllmn().subscribe(res => {

      this.mnList = res;
    },
      (error) => {
        console.error('Error loading mn list:', error);
      })
  }

  getAlllInstruments() {
    this._environmentalService.getAlllInstruments().subscribe(res => {
      this.evInstrument = res;
    },
      (error) => {
        console.error('Error loading mn list:', error);
      })
  }

  GetARData(): void {
    this._environmentalService.getAllAR().subscribe(res => {
      this.arList = res;
    },
      (error) => {
        console.error('Error loading ar list:', error);
      })
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
      //  this.microbiologyData.paT_ID = paT_ID
      this.form.value.PAT_ID = paT_ID;
    }
    // let index = this.microbiologyAllData.findIndex(x => x.paT_ID == paT_ID);
    // this.microbiologyData = this.microbiologyAllData[index]
    //this.assignTheData();
    // this.getMicroBiologyISol(this.microbiologyData.arF_ID);
    // this.fillMBAllSensitivityData(this.microbiologyData.arF_ID);
  }
  onSelectImage(imageNumber: number) {
    if (imageNumber === 1) {
      this.inputFile1.nativeElement.click();
    } else {
      this.inputFile2.nativeElement.click();
    }
  }

  onRemoveImage(imageNumber: number) {
    if (imageNumber === 1) {
      this.previewImage1.nativeElement.src = '';
      this.inputFile1.nativeElement.value = '';
      this.imageSelected1 = false;
    } else {
      this.previewImage2.nativeElement.src = '';
      this.inputFile2.nativeElement.value = '';
      this.imageSelected2 = false;
    }
  }

  onFileChange(event: Event, imageNumber: number) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64Image = reader.result as string;
        this.onUpload();
      };
      reader.readAsDataURL(file);
    }
  }
  // This function is triggered when the user clicks "Upload"
  onUpload(): void {
    // Prepare the data to be sent in the API call
    const payload = {
      IMAGE_ID: this.evResultData.paT_ID,
      ACCN: this.evResultData.accn,
      //TCODE: this.evResultData.reQ_CODE,
      IMAGE: this.base64Image.split(',')[1]
    };

    // Call the API to upload the Base64 file data
    this._cytogenticService.insertClinicalImage(payload).subscribe(
      (response) => {
        this.loadImages();
        alert('File uploaded successfully!');
      },
      (error) => {
        console.error(error);
      }
    );
  }

  loadImages() {
    // Prepare the data to be sent in the API call
    const payload = {
      ACCN: this.evResultData.accn
    };

    // Call the API to upload the Base64 file data
    this._cytogenticService.getClinicalImage(payload).subscribe(
      (response) => {
        this.imagesList = response.body;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  deleteImages(id: number) {
    this._cytogenticService.deleteCytogeneticById(id).subscribe(
      (response) => {
        this.loadImages();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getRoleBasedPermission() {
    this.rolebaseaction = this._permissionService.getRoleBaseAccessOnAction(Environmental);
  }

  //old
  // onPrint(): void {
  //   // Get the selected user id from the dropdown
  //   const selectedUserId = this.selectedUserId;
  //   if (!selectedUserId) {
  //     console.error("Error: No user selected");
  //     return;
  //   }

  //   const patientId = this.evResultData?.paT_ID;
  //   const accn = this.evResultData?.accn?.replace(/-/g, ""); // Remove dashes from accn if present

  //   // Validate the required parameters
  //   if (!patientId || !accn) {
  //     console.error('Error: Missing required parameters (Patient ID or Accn).');
  //     return;
  //   }

  //   // Construct the SSRS report URL with the necessary parameters, including the selected user id.
  //   const baseUrl = REPORT_BASEURL; // Ensure this constant is defined/imported
  //   const reportParams = `&SampleId=${patientId}&Accn=${accn}&UserId=${selectedUserId}&rs:Command=Render&rs:Format=PDF`;
  //   const reportUrl = `${baseUrl}${this.reportPath_Clinical}/${this.reportName}${reportParams}`;
  //   // "http://deltacarevm.centralus.cloudapp.azure.com/ReportServer?/DeltaCare.Reports/Clinical/EV_Results&SampleId=0000014473&Accn=01EV25000964&UserId=10001&rs:Command=Render&rs:Format=PDF"
  //   this._environmentalService.getSSRSReport(reportUrl).subscribe(blob => {
  //     // const url = window.URL.createObjectURL(blob);
  //     // window.open(url, '_blank'); // Opens in a new tab
  //     const url = window.URL.createObjectURL(blob);
  //     window.open(url, '_blank'); // Opens in a new tab
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'ev_result.pdf'; // Set the desired file name
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  //     // Open the SSRS report in a new tab
  //     // const printWindow = window.open(reportUrl, '_blank');

  //     // // Automatically open the print dialog once the new window loads.
  //     // if (printWindow) {
  //     //   printWindow.onload = () => {
  //     //     printWindow.print();
  //     //   };
  //     // } else {
  //     //   console.error('Error: Unable to open the print window.');
  //     // }
  //   })
  //   // Open the SSRS report in a new tab
  //   // const printWindow = window.open(reportUrl, '_blank');

  //   // // Automatically open the print dialog once the new window loads.
  //   // if (printWindow) {
  //   //   printWindow.onload = () => {
  //   //     printWindow.print();
  //   //   };
  //   // } else {
  //   //   console.error('Error: Unable to open the print window.');
  //   // }
  // }



  // Ish
  onPrint(): void {
    this._loaderService.show();
    const selectedUserId = this.selectedUserId;
    if (!selectedUserId) {
      console.error("Error: No user selected");
      return;
    }

    /// EV_Result_1234_custom_Sr
    const patientId = this.evResultData?.paT_ID;
    const updatedPatientId = patientId.replace(/^0{5}/, ''); // Removes only the first 5 leading zeros
    console.log(updatedPatientId); // Output: "012673"

    const accn = this.evResultData?.accn?.replace(/-/g, ""); // Remove dashes from accn
    const cust_SR = this.evResultData?.custoM_SR; // Custom SR value

    if (!patientId || !accn) {
      console.error("Error: Missing required parameters (Patient ID or Accn).");
      return;
    }

    // Construct SSRS report URL
    const baseUrl = REPORT_BASEURL;
    const reportParams = `&SampleId=${patientId}&Accn=${accn}&UserId=${selectedUserId}&rs:Command=Render&rs:Format=PDF`;
    const reportUrl = `${baseUrl}${this.reportPath_Clinical}/${this.reportName}${reportParams}`;

    // Fetch the report as a blob
    this._printService.getSSRSReport(reportUrl).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const iframeSrc = `${url}#toolbar=0&navpanes=0&scrollbar=1`; // Hide default toolbar

      // Determine filename logic
      let filename = `EV_Result_${updatedPatientId}`;
      if (cust_SR) {
        filename += `_${cust_SR}`; // Append cust_SR if available
      }
      filename += `.pdf`;
    
      // Open a new tab
      const newTab = window.open("", "_blank");

      if (newTab) {
        newTab.document.write(`
          <html>
          <head>
            <title>Report Preview</title>
          </head>
          <body style="text-align: center; margin: 0; padding: 0;">
            <iframe src="${iframeSrc}" width="100%" height="90%" style="border: none;"></iframe>
            <br/>
            <button onclick="downloadReport()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-top: 10px;">
              Download Report
            </button>
            <script>
              function downloadReport() {
                const a = document.createElement('a');
                a.href = "${url}";
                a.download = "${filename}"; 
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
            </script>
          </body>
          </html>
        `);
        this._loaderService.hide();
        newTab.document.close();
      } else {
        this._loaderService.hide();
        console.error("Error: Unable to open new tab.");
      }
    });
  }





  sizeChange(event: any) {
    this.getAllEnvironmentalResultData($("#pSize").val());
  }

  keypress() {
    return false;
  }


}
