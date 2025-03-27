import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { CytogeneticsService } from './cytogenetics.service';
import { cgReportModel, cytogeneticModel, rTestModel, txtNameModel } from 'src/app/models/cytogeneticModel';
import Swal from 'sweetalert2';
import { amendMessage, firstRecord, lastRecord, releaseMessage, REPORT_BASEURL, saveMessage, updateSuccessMessage, validateMessage, verifyMessage, warningMessage } from 'src/app/common/constant';
import { contains } from 'jquery';
import { mnModel } from 'src/app/models/mnModel';
import { MnService } from 'src/app/modules/masters/mn/mn.service';
import { Modal } from 'bootstrap';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { OrderentrynewService } from 'src/app/modules/orderprocessing/orderentrynew/add-orderentrynew/orderentrynew.service';
import { PermissionService } from 'src/app/services/permission.service';
import { Anatomic_Pathology, Cytogenetics } from 'src/app/common/moduleNameConstant';
import { roleBaseAction } from 'src/app/models/roleBaseAction';
import { rolePermissionModel } from 'src/app/models/rolePermissionModel';
import { MultiSearchService } from 'src/app/services/multi-search.service';
import { kolkovEditorService } from 'src/app/common/kolkovEditorService';
import { EnvironmentalserviceService } from '../../clinical-environmental/add-clinical-environmental/environmentalservice.service';
import { LoaderService } from 'src/app/modules/shared/services/loaderService';



@Component({
  selector: 'app-add-cytogenetics',
  templateUrl: './add-cytogenetics.component.html',
  styleUrls: ['./add-cytogenetics.component.scss'],
})
export class AddCytogeneticsComponent {
  @ViewChild('reportFrame') reportFrame!: ElementRef;
  @ViewChild('inputFile1') inputFile1!: ElementRef<HTMLInputElement>;
  @ViewChild('previewImage1') previewImage1!: ElementRef<HTMLImageElement>;
  @ViewChild('inputFile2') inputFile2!: ElementRef<HTMLInputElement>;
  @ViewChild('previewImage2') previewImage2!: ElementRef<HTMLImageElement>;
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';
  mnList: mnModel[] = [];
  data: any;
  editor = new Editor();
  imagesList: any[] = [];
  base64Image = '';
  ckEditorData: string = '';
  public multupleSearchList: any[] = [];
  public multupleSearchCodeList: any[] = [];
  PAT_ID: any = '';
  ORD_NO: any = '';
  GTNO: any = '';
  REQ_CODE: any = '';

  public codeTrackingList: any[] = [];
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],

  ];

  rolepermissionmodel: rolePermissionModel[] = [];
  rolebaseaction: roleBaseAction = new roleBaseAction();

  form: FormGroup;

  isEditReadOnly: boolean = false;
  isDeleteReadOnly: boolean = true;
  isCancelReadOnly: boolean = true;

  isSubmitReadOnly: boolean = true;
  isVerifiedReadOnly: boolean = true;
  isValidateReadOnly: boolean = true;
  isReleaseReadOnly: boolean = true;
  isAmendReadOnly: boolean = true;
  isEditorReadOnly: boolean = true;
  isEdit = false; istestReadOnly = false;
  isTemplateReadOnly: boolean = true;
  imageSelected1: boolean = false;
  imageSelected2: boolean = false;
  cytogeneticAllData: cytogeneticModel[] = [];
  cytogeneticData: cytogeneticModel = new cytogeneticModel();
  arfid: number = 0; testCode: string = '';
  iscn: string = ''; figline1: string = '';
  figline2: string = '';
  results: string = '';
  notes: string = '';
  cgReportData: cgReportModel = new cgReportModel();
  rTest = [] as rTestModel[];
  txtName = [] as txtNameModel[];
  scmid: string = '';
  otpid: string = '';
  natid: string = '';
  isLoaded = false;
  btnDisabled: boolean = true;
  NewPatId = 0;
  toDate: string;
  fromDate: string;
  public multupleSearchOrdersList: any[] = [];
  //public multupleSearchList: any[] = [];
  public OrderDetailsTable = [];
  public ATRTable: any[] = [];
  reportPath_clinical = '/Clinical'; // Path to the report folder
  reportName = 'CG_KaryoType/'; // Report name

  constructor(private formBuilder: FormBuilder, private _cytogenticService: CytogeneticsService,
    private _mnService: MnService, public _commonAlertService: CommonAlertService,
    private _commonService: CommonService, private orderentryService: OrderentrynewService,
    private _permissionService: PermissionService, private multiSearchService: MultiSearchService,
    private _environmentalService: EnvironmentalserviceService, public editorService: kolkovEditorService,
    private _loaderService: LoaderService) {
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
    $('#btnaddcytogenetics').addClass("is-active");
    this.getAllCytogenitcsData();
    this.GetmnData();
    const today = new Date();
    this.toDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
    // Get the date 2 months ago
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    this.fromDate = twoMonthsAgo.toISOString().split('T')[0];
    this.getRoleBasedPermission();
    this._loaderService.ShowHideLoader(3000);

  }

  onLineSpacingChange(event: Event) {
    const spacing = (event.target as HTMLSelectElement).value;
    if (spacing) {
      this.editorService.setLineSpacing(spacing);
    }
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Clinical_Cytogenetics, this.startTime, this.endTime);

  }
  async GetMultipleSearch() {
    this.multupleSearchList = await this.multiSearchService.GetMultipleSearchService('CG');
  }
  async GetMultipleSearchOrders(PAT_ID: any) {
    this.NewPatId = PAT_ID;
    this.multupleSearchOrdersList = [];
    this.multupleSearchOrdersList = await this.multiSearchService.GetMultipleSearchOrders(PAT_ID);
  }

  getAllCytogenitcsData() {
    this._cytogenticService.getAllCytogenetics().subscribe(res => {
      this.cytogeneticAllData = res;
      this.getRecord("last", this.cytogeneticAllData.length - 1);
      this.formatAccn(this.cytogeneticData.accn);
      this.loadImages();
      if (localStorage.getItem('arfid')) {
        let arfid = localStorage.getItem('arfid')?.toString();
        if (arfid) {
          this.cytogeneticData = this.cytogeneticAllData.filter(x => x.arF_ID == Number(arfid))[0];
          this.assignTheData();
          this.formatAccn(this.cytogeneticData.accn);
          localStorage.setItem('arfid', '');

        }
      }
    },
      (error) => {
        console.error('Error loading Site list:', error);
      })
  }

  getRecord(input: any, SNO: number) {
    let totalNumberOfRec = this.cytogeneticAllData.length;
    if (input == 'first') {
      if (this.cytogeneticData.sno == 1) {
        this._commonAlertService.firstRecord();
        return;
      }
      this.cytogeneticData = this.cytogeneticAllData[0];
    } else if (input == 'prev' && SNO != 1) {
      this.cytogeneticData = this.cytogeneticAllData.filter(x => x.sno == (SNO - 1))[0];
    }
    else if (input == 'next' && totalNumberOfRec > SNO) {
      this.cytogeneticData = this.cytogeneticAllData.filter(x => x.sno == (SNO + 1))[0];
    }
    else if (input == 'last') {
      if (this.cytogeneticData != null) {
        if (this.cytogeneticData.sno == totalNumberOfRec) {
          this._commonAlertService.lastRecord();
          return;
        }
      }
      this.cytogeneticData = this.cytogeneticAllData.filter(x => x.sno == totalNumberOfRec)[0];

    }
    this.assignTheData();
    this.formatAccn(this.cytogeneticData.accn);

    this.arfid = this.cytogeneticData.arF_ID;
    this.iscn = this.cytogeneticData.iscn;
    this.figline1 = this.cytogeneticData.figLine1;
    this.figline2 = this.cytogeneticData.figLine2;
    this.results = this.cytogeneticData.results;
    this.notes = this.cytogeneticData.notes;
    this.getAllRTest();
    this.loadImages();
  }

  formatAccn(value: string): void {
    if (value && value.length === 9) {
      const formattedValue = value.substring(0, 2) + '-' + value.substring(2, 4) + '-' + value.substring(4);
      this.cytogeneticData.accn = formattedValue;
    } else {
      this.cytogeneticData.accn = value;
    }
  }


  assignTheData() {
    if (!this.cytogeneticData) {
      console.error('No data available to assign. cytogeneticData is undefined.');
      return; // Exit if cytogeneticData is undefined to prevent runtime errors
    }

    this.form.reset({
      accn: this.cytogeneticData.accn,
      paT_ID: this.cytogeneticData.paT_ID,
      paT_NAME: this.cytogeneticData.paT_NAME,
      sex: this.cytogeneticData.sex,
      age: this.cytogeneticData.age,
      dob: this.cytogeneticData.dob,
      saudi: this.cytogeneticData.saudi,
      reQ_CODE: this.cytogeneticData.reQ_CODE,
      tcode: this.cytogeneticData.tcode,
      loc: this.cytogeneticData.loc,
      pr: this.cytogeneticData.pr,
      cn: this.cytogeneticData.cn,
      client: this.cytogeneticData.client,
      drno: this.cytogeneticData.drno,
      doctor: this.cytogeneticData.doctor,
      sno: this.cytogeneticData.sno,
      drawN_DTTM: this.cytogeneticData.drawN_DTTM,
      veR_DTTM: this.cytogeneticData.veR_DTTM,
      r_STS: this.cytogeneticData.r_STS,
      notes: this.cytogeneticData.notes,
      orD_NO: this.cytogeneticData.orD_NO,
      req_COD: this.cytogeneticData.req_COD
    });    // this.isReadOnly = true; 
  };

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

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onSubmitStatus(clickNumber: number) { }

  updateCGReport(clickNumber: number) {
    this.cgReportData.arF_ID = this.arfid;
    this.cgReportData.notes = this.notes;
    this.cgReportData.iscn = this.iscn;
    this.cgReportData.figline1 = this.figline1;
    this.cgReportData.figline2 = this.figline2;
    this.cgReportData.results = this.results;
    if (this.cgReportData.arF_ID != null) {
      Swal.fire({
        title: 'Confirmation',
        text: 'Confirm',//this.updateMgsAccordingToButton(clickNumber),
        //icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.setbuttonActiveInactive(clickNumber);

          switch (clickNumber) {
            case 1:
              this.cgReportData.r_STS = 'RS';
              break;
            case 2:
              this.cgReportData.r_STS = 'VR';
              break;
            case 3:
              this.cgReportData.r_STS = 'VD';
              break;
            case 4:
              this.cgReportData.r_STS = 'RD';
              break;
            case 5:
              this.cgReportData.r_STS = 'RS';
              break;
            default:
              break;
          }

          this._cytogenticService.updateCGReport(this.cgReportData).subscribe(
            (response) => {
              if (response.status === 200 || response.status === 204) {
                this.saveTestResult();
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

  getAllRTest() {
    this._cytogenticService.getAllRTest().subscribe(res => {
      this.rTest = res;
      if (this.rTest.length > 0)
        this.testCode = this.rTest[0].rTest;
      this.getTestName(this.testCode);
    },
      (error) => {
        console.error('Error loading rTest list:', error);
      })
  }

  tNameChange(event: any) {
    if (event && event.target.value !== undefined) {
      this.getTestName(event.target.value);
    }
  }

  getTestName(tCode: any) {
    const tName = new txtNameModel();
    tName.r_STS = tCode; tName.r_SEQ = ''; tName.r_NAME = ''; tName.r_Result = ''; tName.r_ArfId = (this.cytogeneticData.arF_ID).toString();
    this._cytogenticService.getAlltxtName(tName).subscribe(x => {
      x.forEach(x => {
        x.r_ArfId = (this.cytogeneticData.arF_ID).toString();
      })
      if (x.length > 0) {
        if (x[0].r_Result === '')
          this.istestReadOnly = false;
        else {
          //this.testCode = this.rTest.filter(x=>x.rTest.toString().startsWith(this.cytogeneticData.accn.toString().slice(0, 2)))[0].rTest.toString();
          this.istestReadOnly = true;
        }
      }
      this.txtName = x;
    });
  }

  saveTestResult() {
    this.txtName.forEach(x => {
      x.r_STS = (this.testCode).toString();
    })
    this._cytogenticService.saveTestResult(this.txtName).subscribe((data: any) => {
      if (data) {
        this.getAllCytogenitcsData();
      } else {
        console.error('Test Result data not found:', data);
      }
    })
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
      this.notes = this.replaceAt(this.notes, this.notes.lastIndexOf(_tempWord), _codeResponse[0].mN_DESCRP);
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

  ViewOrderTrackingDetails() {
    this.codeTrackingList = [];
    const ViewCodeTrackingModal = document.getElementById('ViewCodeTrackingModal') as HTMLElement;
    const myModal = new Modal(ViewCodeTrackingModal);
    myModal.show();
    this.multupleSearchCodeList = [];
    this._cytogenticService.GetOrderTrackingByOrdNo(this.cytogeneticData.orD_NO, this.cytogeneticData.reQ_CODE)
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

  onPrint(): void {
    let accession = this.cytogeneticData.accn.replace(/-/g, '');;
    // Check if accession is available
    if (!accession) {
      console.error('Error: accession parameter is missing.');
      return;
    }
    // Construct the URL with print parameters
    const baseUrl = REPORT_BASEURL;
    const reportParams = `?ACCN=${accession}&rs:Command=Render&rs:Format=PDF`;
    const reportUrl = `${baseUrl}${this.reportPath_clinical}/${this.reportName}${reportParams}`;


    // Fetch the report as a blob
    this._environmentalService.getSSRSReport(reportUrl).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const iframeSrc = `${url}#toolbar=0&navpanes=0&scrollbar=1`; // Hide default toolbar

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
              a.download = "EV_Result_${accession}.pdf"; 
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          </script>
        </body>
        </html>
      `);
        newTab.document.close();
      } else {
        console.error("Error: Unable to open new tab.");
      }
    });
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
      ACCN: this.cytogeneticData.accn,
      TCODE: this.cytogeneticData.reQ_CODE,
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
      ACCN: this.cytogeneticData.accn
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
    this.assignTheData();
    // this.getMicroBiologyISol(this.microbiologyData.arF_ID);
    // this.fillMBAllSensitivityData(this.microbiologyData.arF_ID);
  }

  getRoleBasedPermission() {
    this.rolebaseaction = this._permissionService.getRoleBaseAccessOnAction(Cytogenetics);
  }

}
