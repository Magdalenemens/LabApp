import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { successMessage, cannotcancelRequest, cancelRequest, collectedRequest, firstRecord, lastRecord, alertThreeDigits, updateSuccessMessage, warningMessage, invalidDiscountMessage, invalidPrtyMessage, REPORT_BASEURL } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { Alert, Modal } from 'bootstrap';
import { cleanData } from 'jquery';
import { EnvironmentalorderService } from './environmentalorder.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { EVInvoiceQRImageModel, TDModel } from 'src/app/models/tdmodel';
import * as $ from 'jquery';
import { mbPatientSearchModel } from 'src/app/models/microbiologyModel';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';
import { sample } from 'rxjs';
import { PermissionService } from 'src/app/services/permission.service';
import { Environmental_Order } from 'src/app/common/moduleNameConstant';
import { roleBaseAction } from 'src/app/models/roleBaseAction';
import { rolePermissionModel } from 'src/app/models/rolePermissionModel';
import { MultiSearchService } from 'src/app/services/multi-search.service';
import { environmentOrderATR, evCancelReason, environmentalOrderModel, evPrintModel, evClient, evSignUser, evSample, evPatientID, evListPrintModel, evListMultiInvoicePrintModel } from 'src/app/models/environmentalOrderModel';
import { PrintService } from 'src/app/services/print.service.';
import { userflModel } from 'src/app/models/userflModel';
import { UserService } from 'src/app/modules/system/users/users.service';
import { LoaderService } from 'src/app/modules/shared/services/loaderService';
/// <reference path="../../../../../assets/js/jquery-barcode.js" />
@Component({
  selector: 'app-add-orderentry',
  //standalone: true,
  //imports: [],
  templateUrl: './add-environmentalorder.component.html',
  styleUrls: ['./add-environmentalorder.component.scss']
})
export class AddEnvironmentalorderComponent {
  @ViewChild('reportFrame') reportFrame!: ElementRef;
  rolepermissionmodel: rolePermissionModel[] = [];
  rolebaseaction: roleBaseAction = new roleBaseAction();
  imageSource;
  ATRNotes: any;
  selectedSite: string = "";
  selectedrefSite: string = "";
  selectedUserId: string = "";
  sampleId: string = "";
  @ViewChild('ITable') ITableRef: ElementRef;
  currentDateTime = moment();
  _response: any;
  _responsePlus: any;
  startTime: string = '';
  discount: number = 0;
  endTime: string = '';
  discountPercentage: number = 0;
  subtotal: number = 0;
  discountedprice: number = 0; sinceDate: string = '';
  evOrderData: environmentOrderATR[] = [];
  evCancelReason: evCancelReason[] = [];
  submitId: number = 0; cancelReason = '';
  isLoaded = false;
  accnBarcode: string = '';
  accnPatId: string = '';
  environmentOrderAllData: environmentalOrderModel[] = [];
  environmentOrderData: environmentalOrderModel = new environmentalOrderModel();
  evform: FormGroup;
  isReadOnly: boolean = false;
  isDisabled = false;
  isFreeze: boolean = false;
  isModify: boolean = false;
  initialValueForm!: FormGroup;
  patientSearch: mbPatientSearchModel[] = [];
  patientSearchOrg: mbPatientSearchModel[] = [];
  selectedPatient: number;
  toDate: string;
  fromDate: string;
  public multupleSearchOrdersList: any[] = [];
  public multupleSearchList: any[] = [];
  NewPatId = 0;
  order_FDatetime: any;
  evClientDDL: string = '';
  evTdOrg = [] as TDModel[];
  evInvoiceQRImage: EVInvoiceQRImageModel = new EVInvoiceQRImageModel();
  evTd = [] as TDModel[];
  evPrint = [] as evPrintModel[];
  evClient = [] as evClient[];
  evSOTP = [] as evSignUser[];
  evSample = [] as evSample[];
  evPatient = [] as evPatientID[];
  evsignUser = [] as evSignUser[];
  SelectAll: string = 'Select All';
  //Action Buttons
  isAddReadOnly: boolean = true;
  isSubmitReadOnly: boolean = true;
  isCancelReadOnly: boolean = true;
  isModifyReadOnly: boolean = true;
  reportPath_finance = '/Finance'; // Path to the report folder
  reportName = 'EV_Invoice'; // Report name
  multiInvoiceReportName = 'EvMultiInvoice'; // Report name
  defaultValue: number = 60;
  userAllData: userflModel[] = [];
  checkedCount: number = 0;
  tabletotalFormatted: string= '';
  printOptions = {
    // cancelledOrders: false,
    vatInvoice: false,
    // clientNotes: false,
    paymentStatus: true,
    pageHeader: true
    // eSignature: false

  };

  constructor(private formBuilder: FormBuilder, private environmentalorderService: EnvironmentalorderService,
    private _permissionService: PermissionService, private _printService: PrintService,
    private _userService: UserService, private _loaderService: LoaderService, private multiSearchService: MultiSearchService) {

  }

  ngOnInit(): void {
    this.getAllEnvironmentOrderData($("#pSize").val().toString() == '' ? '60' : $("#pSize").val().toString());
    this.getAllEnvironmentalOrderPatientSearch();
    this.getEVClient();
    this.getEVSignUser();
    this.getEVTD('EMPTY');
    this.BindCancelReason();
    this.getRoleBasedPermission();
    this.getEVOTP();
    this.getAllUsersData();
    this._loaderService.ShowHideLoader(4000);

    const today = new Date();
    this.toDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
    // Get the date 2 months ago
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    this.fromDate = twoMonthsAgo.toISOString().split('T')[0];
    this.setDefaultSinceDate();
    //this.fetchLastTwoMonthsInvoiceData(); // Fetch data on page load
  }

  async GetMultipleSearch() {
    this.multupleSearchList = await this.multiSearchService.GetMultipleSearchService('EV');
  }

  async GetMultipleSearchOrders(PAT_ID: any) {
    this.NewPatId = PAT_ID;
    this.multupleSearchOrdersList = [];
    this.multupleSearchOrdersList = await this.multiSearchService.GetMultipleSearchOrders(PAT_ID);
  }

  // Set default SinceDate to 60 days ago
  setDefaultSinceDate() {
    let sinceDate = this.subtract_Days(60);
    let formattedDate = sinceDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    ($("#SinceDate") as any).val(formattedDate);
    this.evMultiInvoice();
  }

  // Utility function to subtract days
  subtract_Days(days: number): Date {
    let date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  ngOnDestroy(): void {
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.defaultValue = parseInt(input.value, 10) || 0;
  }

  ShowMulipleSearch() {
    const modalMulipleSearch = document.getElementById('modalMulipleSearch') as HTMLElement;
    const myModal = new Modal(modalMulipleSearch);
    myModal.show();
  }

  getAllEnvironmentOrderData(pSize: any) {
    this.environmentalorderService.getAllEnvironmentOrder(pSize).subscribe(res => {
      this.environmentOrderAllData = res;
      const s_TYPE = document.getElementById('s_TYPE') as HTMLInputElement;
      const cn = document.getElementById('cn') as HTMLInputElement;
      const expR_DATE = document.getElementById('expR_DATE') as HTMLInputElement;
      const prD_DATE = document.getElementById('prD_DATE') as HTMLInputElement;
      const asT_DATE = document.getElementById('asT_DATE') as HTMLInputElement;
      const rcvD_DATE = document.getElementById('rcvD_DATE') as HTMLInputElement;
      const issU_DATE = document.getElementById('issU_DATE') as HTMLInputElement;
      const tel = document.getElementById('tel') as HTMLInputElement;
      expR_DATE.disabled = true; prD_DATE.disabled = true; asT_DATE.disabled = true; rcvD_DATE.disabled = true; issU_DATE.disabled = true;
      this.getRecord("last", this.environmentOrderAllData.length - 1);
    },
      (error) => {
        console.error('Error loading Site list:', error);
      })
  }

  getRecord(input: any, SNO: number) {
    let totalNumberOfRec = this.environmentOrderAllData.length;
    this.sampleId = localStorage.getItem('sample_ID');
    if (this.sampleId && this.sampleId.trim().length > 0) {
      this.environmentOrderData = this.environmentOrderAllData.filter(c => c.paT_ID == this.sampleId)[0];
      localStorage.removeItem('sample_ID');
    } else {
      if (input == 'first') {
        if (this.environmentOrderData.sno == 1) {
          Swal.fire({
            text: firstRecord,
          });
          return;
        }
        this.environmentOrderData = this.environmentOrderAllData[0];
      } else if (input == 'prev' && SNO != 1) {
        this.environmentOrderData = this.environmentOrderAllData.filter(x => x.sno == (SNO - 1))[0];
      }
      else if (input == 'next' && totalNumberOfRec > SNO) {
        this.environmentOrderData = this.environmentOrderAllData.filter(x => x.sno == (SNO + 1))[0];
      }
      else if (input == 'last') {
        if (this.environmentOrderData != null) {
          if (this.environmentOrderData.sno == totalNumberOfRec) {
            // Swal.fire({
            //   text: lastRecord,
            // });
            this.environmentOrderData = this.environmentOrderAllData.filter(x => x.sno == totalNumberOfRec)[0];
            this.getEnvironmentalOrderATRData(this.environmentOrderData.orD_NO);
            return;
          }
        }

        this.environmentOrderData = this.environmentOrderAllData.filter(x => x.sno == totalNumberOfRec)[0];
        //$("#CN")[0].innerText = this.environmentOrderData.cnclient;
      }
      else if (input == 'new') {
        if (this.environmentOrderData != null) {
          if (this.environmentOrderData.sno == totalNumberOfRec) {
            Swal.fire({
              text: lastRecord,
            });
            return;
          }
        }
        this.environmentOrderData = this.environmentOrderAllData.filter(x => x.sno == totalNumberOfRec)[0];
      }
      if (this.submitId != 0) {
        this.environmentOrderData = this.environmentOrderAllData.filter(x => x.sno == this.submitId)[0];
        this.submitId = 0;
      }
    }
    this.environmentOrderData.rcvD_DATE = this.environmentOrderData.rcvD_DATE;
    this.environmentOrderData.prD_DATE = this.environmentOrderData.prD_DATE;
    this.environmentOrderData.expR_DATE = this.environmentOrderData.expR_DATE;
    this.environmentOrderData.issU_DATE = this.environmentOrderData.issU_DATE;
    this.environmentOrderData.asT_DATE = this.environmentOrderData.asT_DATE;
    this.environmentOrderData.tel = this.environmentOrderData.tel;
    this.environmentOrderData.cn = this.environmentOrderData.cn;
    var LblARTID = document.getElementById("LblARTID") as HTMLInputElement | null;
    LblARTID.value = this.environmentOrderData.atR_ID;
    $("#paytp").val(this.environmentOrderData.paytp);
    this.getEnvironmentalOrderATRData(this.environmentOrderData.orD_NO);
    this.printBar(this.environmentOrderData.paT_ID.toString());
    //this.isReadOnly = true;
    var cash = <HTMLInputElement>document.getElementById("cash");
    cash.value = this.environmentOrderData.cash == true ? "true" : "false";
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  getEnvironmentalOrderATRData(orderNo: string) {

    const evOrderATR = new environmentOrderATR();
    evOrderATR.orD_NO = orderNo;
    this.environmentalorderService.getAllEVOrderATR(evOrderATR).subscribe((data) => {
      if (data) {
        this.evOrderData = data;
        if (this.evOrderData.length == 0)
          this.intialaddRow();
        else {
          this.accnBarcode = this.evOrderData[0].accn.toString();
          this.accnPatId = parseInt(this.environmentOrderData.paT_ID).toString();
        }


        let currentDay: string = (new Date().getDate()).toString();
        let currentMonth: string = (new Date().getMonth() + 1).toString();
        let currentYear: string = (new Date().getFullYear()).toString();

        if (currentMonth.length < 2)
          currentMonth = '0' + currentMonth;
        if (currentDay.length < 2)
          currentDay = '0' + currentDay;

        const sinceDate = currentYear + '-' + currentMonth + '-' + currentDay;
        $("#SinceDate").val(this.getTextBox2MonthOldDate());
        //this.getEVPrint(this.environmentOrderData.orD_NO);     
      } else {
        console.error('Mirco Biology ISol data not found:', data);
      }
      if (this.patientSearch == null)
        this.patientSearch = this.patientSearchOrg;

      this.calculateTotal();
      this.evMultiInvoice();
    })
  }

  evMultiInvoice() {
    let clientNo = this.environmentOrderData.cn
    const evPrint = new evListMultiInvoicePrintModel();
    evPrint.clientNo = clientNo;
    evPrint.Search = "";
    if ($("#SinceDate").val().toString() != '') {
      let sinceDate = new Date($("#SinceDate").val().toString());
      evPrint.SinceDate = (sinceDate.getMonth() + 1).toString() + '/' + sinceDate.getDate().toString() + '/' + sinceDate.getFullYear().toString();
    }
    else
      evPrint.SinceDate = '';

    this.environmentalorderService.GetEVMultipleInvoice(evPrint).subscribe(res => {
      this._responsePlus = res;
      let tabletotal: number = 0;
      for (let i = 0; i < this._responsePlus.length; i++) {
        // tabletotal = tabletotal + parseFloat(this._responsePlus[i].uprice);
        // this.checkedCount = this._responsePlus.filter(res => res.checked).length;
        // Calculate total
        tabletotal = this._responsePlus.reduce((sum, item) => sum + parseFloat(item.uprice), 0);
        tabletotal = parseFloat(tabletotal.toFixed(2)); // Ensure it has 2 decimal places

        // Convert it to a string for proper UI formatting
        this.tabletotalFormatted = tabletotal.toFixed(2);
        this.checkedCount = this._responsePlus.filter(res => res.checked).length;
      }
      //$("#tabletotal").val(tabletotal.toString());
      //this.isDisabled= false;
      // alert('calling abort');

    },
      (error) => {
        console.error('Error loading EV Multiple Invoice :', error);
      })
  }



  getEVClient() {
    this.environmentalorderService.getAllClients().subscribe(res => {
      if (res.length > 0) {
        this.evClient = res;
        this.getEVSamples();
      }
    },
      (error) => {
        console.error('Error loading EV Client:', error);
      })
  }

  getEVSamples() {
    this.environmentalorderService.GetAllEVSample().subscribe(res => {
      if (res.length > 0) {
        this.evSample = res;
        //this.getAllEnvironmentOrderData($("#pSize").val());
      }
    },
      (error) => {
        console.error('Error loading EV Samples:', error);
      })
  }


  getEVTD(TCode: string) {
    this.environmentalorderService.GetAllEVTD(TCode).subscribe(res => {
      if (res.length > 0) {
        this.evTd = res;
        this.evTdOrg = res;
      }
    },
      (error) => {
        console.error('Error loading TD :', error);
      })
  }


  // getEVPrint() {

  //   let OrderNo = this.environmentOrderData.orD_NO
  //   const evPrint = new evListPrintModel();

  //   evPrint.orderNo = OrderNo;
  //   this.environmentalorderService.GetEVPrint(evPrint).subscribe(res => {
  //     this._response = res;
  //     var fileblob = this.b64toBlob(this._response.messages, 'application/pdf');
  //     var url = window.URL.createObjectURL(fileblob);
  //     let anchor = document.createElement("a");
  //     anchor.href = url;
  //     anchor.target = "_blank"
  //     anchor.click();
  //   },
  //     (error) => {
  //       console.error('Error loading EV Print :', error);
  //     })
  // }

  onPrint(): void {
    this._loaderService.show();
    const vcNumber = this.environmentOrderData.vC_NO;
    if (!vcNumber) {
      console.error('Error: vc Number parameter is missing.');
      return;
    }

    // Construct the URL with print parameters
    const baseUrl = REPORT_BASEURL;
    const reportParams = `&Vc_No=${vcNumber}`
      // + `&CancelledOrders=${this.printOptions.cancelledOrders}`
      + `&VatInvoice=${this.printOptions.vatInvoice}`
      // + `&ClientNotes=${this.printOptions.clientNotes}`
      + `&PaymentStatus=${this.printOptions.paymentStatus}`
      + `&DisplayLogo=${this.printOptions.pageHeader}`
    // + `&ESignature=${this.printOptions.eSignature}`;

    const reportUrl = `${baseUrl}${this.reportPath_finance}/${this.reportName}${reportParams}&rs:Command=Render&rs:Format=PDF&rs:Print=True`;

    // Fetch the report as a blob
    this._printService.getSSRSReport(reportUrl).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const iframeSrc = `${url}#toolbar=0&navpanes=0&scrollbar=1`;

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
                a.download = "EV_Invoice_${vcNumber}.pdf"; 
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


  b64toBlob(b64Data: any, contentType: any) {
    contentType = contentType || '';
    let sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }



  BindSearchTDTable() {
    const InpTestCode = document.getElementById("InpTestCode") as HTMLInputElement;
    if (InpTestCode.value != '')
      this.getEVTD(InpTestCode.value);
    else
      this.getEVTD("EMPTY");
  }

  getEVPatientId() {
    this.environmentalorderService.getPatientID().subscribe(res => {
      if (res.length > 0) {
        this.evPatient = res;
        this.getEVSignUser();
      }
    },
      (error) => {
        console.error('Error loading EV Patient Next Id:', error);
      })
  }

  getEVSignUser() {
    this.environmentalorderService.getSignUser().subscribe(res => {
      if (res.length > 0) {
        this.evsignUser = res;
      }
    },
      (error) => {
        console.error('Error loading EV Patient Next Id:', error);
      })
  }


  newEVOrder() {
    this.isReadOnly = false; this.isDisabled = true; this.isFreeze = true;
    const obj = new environmentalOrderModel();
    obj.paT_ID = '';//this.padLeft(this.evPatient[0].paT_ID, "0", 10); 
    obj.paT_NAME = ''; obj.s_TYPE = ''; obj.cn = ''; obj.cash = false; obj.cuS_NAME = '';
    obj.cuS_TP = ''; obj.issU_DATE = ''; obj.reF_NO = ''; obj.voL_WT = ''; obj.voL_WT2 = '';
    obj.batchA_NO = ''; obj.tel = ''; obj.email = ''; obj.cperson = ''; obj.rcvD_DATE = this.getCurrentDateOnly();
    obj.phyS_COND = ''; obj.origin = ''; obj.citY_CNTRY = ''; obj.address = ''; obj.custoM_SR = '';
    obj.prD_DATE = ''; obj.expR_DATE = ''; obj.asT_DATE = this.getCurrentDateOnly(); obj.client = ''; obj.orD_NO = '';
    obj.brand = ''; obj.expirY_PERIOD = '';
    obj.sno = this.environmentOrderAllData.length + 1;

    this.environmentOrderAllData.push(obj);
    this.getRecord("new", this.environmentOrderAllData.length - 1);
    var cash = <HTMLInputElement>document.getElementById("cash");
    const expR_DATE = document.getElementById('expR_DATE') as HTMLInputElement; const prD_DATE = document.getElementById('prD_DATE') as HTMLInputElement; const asT_DATE = document.getElementById('asT_DATE') as HTMLInputElement;
    const rcvD_DATE = document.getElementById('rcvD_DATE') as HTMLInputElement; const issU_DATE = document.getElementById('issU_DATE') as HTMLInputElement; const cuS_NAME = document.getElementById('cuS_NAME') as HTMLInputElement;
    const cuS_TP = document.getElementById('cuS_TP') as HTMLInputElement; const reF_NO = document.getElementById('reF_NO') as HTMLInputElement; const tel = document.getElementById('tel') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement; const cperson = document.getElementById('cperson') as HTMLInputElement; const citY_CNTRY = document.getElementById('citY_CNTRY') as HTMLInputElement;
    const address = document.getElementById('address') as HTMLInputElement;  //s_TYPE.disabled = false;
    expR_DATE.disabled = false; prD_DATE.disabled = false; asT_DATE.disabled = false; rcvD_DATE.disabled = false; issU_DATE.disabled = false;
    cash.value = "false"; cuS_NAME.value = ''; cuS_TP.value = ''; reF_NO.value = ''; tel.value = ''; email.value = ''; cperson.value = ''; citY_CNTRY.value = ''; address.value = '';
    $("#receivedfrom").prop('selectedIndex', 0);
  }


  assignTheData() {
    if (!this.environmentOrderData) {
      console.error('No data available to assign. microbiologyData is undefined.');
      return;
    }
  };


  SaveInitial() {

    for (let i = 0; i < this.evOrderData.length; i++) {
      if (this.evOrderData[i].reQ_CODE == '') {
        this.evOrderData.splice(i, 1);
        i = i - 1;
      }
    }

    const paT_NAME = document.getElementById('paT_NAME') as HTMLInputElement;
    const s_TYPE = document.getElementById('s_TYPE') as HTMLInputElement;
    const cn = document.getElementById('cn') as HTMLInputElement;
    this.environmentOrderData.paT_NAME = paT_NAME.value;
    this.environmentOrderData.s_TYPE = this.environmentOrderData.s_TYPE.split("-", 1).toString();
    this.environmentOrderData.cn = this.environmentOrderData.cn.split("-", 1).toString();

    if (this.environmentOrderData.paT_NAME == null || this.environmentOrderData.paT_NAME == '') {
      Swal.fire({ text: 'Sample Name is required', }); return;
    }
    else if (this.environmentOrderData.s_TYPE == null || this.environmentOrderData.s_TYPE == '') {
      Swal.fire({ text: 'Sample Type is required', }); return;
    }
    else if (this.environmentOrderData.cn == null || this.environmentOrderData.cn == '') {
      Swal.fire({ text: 'Client is required', }); return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you want to Confirm the Submit?',//this.updateMgsAccordingToButton(clickNumber),
      //icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitId = this.environmentOrderData.sno;

        var cash = <HTMLInputElement>document.getElementById("cash");
        const batchA_NO = document.getElementById('batchA_NO') as HTMLInputElement;
        const rcvD_DATE = document.getElementById('rcvD_DATE') as HTMLInputElement;
        const phyS_COND = document.getElementById('phyS_COND') as HTMLInputElement;
        const origin = document.getElementById('origin') as HTMLInputElement;
        const voL_WT = document.getElementById('voL_WT') as HTMLInputElement;
        const voL_WT2 = document.getElementById('voL_WT2') as HTMLInputElement;
        const asT_DATE = document.getElementById('asT_DATE') as HTMLInputElement;
        const custoM_SR = document.getElementById('custoM_SR') as HTMLInputElement;
        const prD_DATE = document.getElementById('prD_DATE') as HTMLInputElement;
        const expR_DATE = document.getElementById('expR_DATE') as HTMLInputElement;

        const cuS_NAME = document.getElementById('cuS_NAME') as HTMLInputElement;
        const cuS_TP = document.getElementById('cuS_TP') as HTMLInputElement;
        const issU_DATE = document.getElementById('issU_DATE') as HTMLInputElement;
        const reF_NO = document.getElementById('reF_NO') as HTMLInputElement;
        const tel = document.getElementById('tel') as HTMLInputElement;
        const email = document.getElementById('email') as HTMLInputElement;
        const cperson = document.getElementById('cperson') as HTMLInputElement;
        const citY_CNTRY = document.getElementById('citY_CNTRY') as HTMLInputElement;
        const address = document.getElementById('address') as HTMLInputElement;
        const paytp = document.getElementById('paytp') as HTMLInputElement;
        const totalpaid = document.getElementById('totalpaid') as HTMLInputElement;
        const remainingbalance = document.getElementById('remainingbalance') as HTMLInputElement;
        const subtotal = document.getElementById('subtotal') as HTMLInputElement;
        const discountPercentage = document.getElementById('discountPercentage') as HTMLInputElement;
        const discount = document.getElementById('discount') as HTMLInputElement;
        const discountedprice = document.getElementById('discountedprice') as HTMLInputElement;
        const vat = document.getElementById('vat') as HTMLInputElement;
        const grandtotal = document.getElementById('grandtotal') as HTMLInputElement;
        const brand = document.getElementById('brand') as HTMLInputElement;
        const expirY_PERIOD = document.getElementById('expirY_PERIOD') as HTMLInputElement;
        const vC_NO = document.getElementById('vC_NO') as HTMLInputElement;
        const inV_DATE = document.getElementById('inV_DATE') as HTMLInputElement;

        this.environmentOrderData.paT_NAME = paT_NAME.value;
        this.environmentOrderData.cn = this.environmentOrderData.cn.split("-", 1).toString();
        this.environmentOrderData.s_TYPE = this.environmentOrderData.s_TYPE.split("-", 1).toString();
        this.environmentOrderData.cash = (cash.value == "true" ? true : false);
        this.environmentOrderData.cuS_NAME = cuS_NAME.value;
        this.environmentOrderData.cuS_TP = cuS_TP.value;
        this.environmentOrderData.issU_DATE = issU_DATE.value;
        this.environmentOrderData.reF_NO = reF_NO.value;
        this.environmentOrderData.voL_WT = voL_WT.value;
        this.environmentOrderData.voL_WT2 = voL_WT2.value;
        this.environmentOrderData.batchA_NO = batchA_NO.value;
        this.environmentOrderData.tel = tel.value;
        this.environmentOrderData.email = email.value;
        this.environmentOrderData.cperson = cperson.value;
        this.environmentOrderData.rcvD_DATE = rcvD_DATE.value;
        this.environmentOrderData.phyS_COND = phyS_COND.value;
        this.environmentOrderData.origin = origin.value;
        this.environmentOrderData.citY_CNTRY = citY_CNTRY.value;
        this.environmentOrderData.address = address.value;
        this.environmentOrderData.custoM_SR = custoM_SR.value;
        this.environmentOrderData.prD_DATE = prD_DATE.value;
        this.environmentOrderData.expR_DATE = expR_DATE.value;
        this.environmentOrderData.asT_DATE = asT_DATE.value;
        this.environmentOrderData.paytp = paytp.value;
        this.environmentOrderData.stypesP_DESCRP = ''
        this.environmentOrderData.paid = totalpaid.value;
        this.environmentOrderData.rmng = remainingbalance.value;
        this.environmentOrderData.toT_VALUE = subtotal.value;
        this.environmentOrderData.totdscnt = discountPercentage.value;
        this.environmentOrderData.dscamnt = discount.value;
        this.environmentOrderData.neT_VALUE = discountedprice.value;
        this.environmentOrderData.vat = vat.value;
        this.environmentOrderData.granD_VAL = grandtotal.value;
        this.environmentOrderData.brand = brand.value;
        this.environmentOrderData.expirY_PERIOD = expirY_PERIOD.value;
        this.environmentOrderData.search = ''; this.environmentOrderData.vC_NO = vC_NO.value;
        this.environmentOrderData.inV_DATE = inV_DATE.value;
        this.environmentOrderData.extradiscount = $("#discountED").val() == "" ? "0" : $("#discountED").val().toString();
        this.environmentOrderData.otp = $("#receivedfrom").val().toString();
        this.environmentalorderService.InsertEVOrder(this.environmentOrderData).subscribe(
          (response) => {
            this.insertATR(response);
          },
          (error) => {
            const status = error.status;
            if (status === 409) {
              Swal.fire({
                text: warningMessage,
              });
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          text: 'Not amended by the User!!!.',
        });
      }
    });
  }



  insertATR(paT_ID: string) {

    const site = EncryptionHelper.decrypt(localStorage.getItem("site"));;
    const userId = EncryptionHelper.decrypt(localStorage.getItem("userId"));
    for (let i = 0; i < this.evOrderData.length; i++) {
      this.evOrderData[i].reQ_DTTM = this.getCurrentDate();
      this.evOrderData[i].drawN_DTTM = this.getCurrentDate();
      this.evOrderData[i].s_TYPE = this.environmentOrderData.s_TYPE;
      this.evOrderData[i].mdl = 'EV';
      this.evOrderData[i].lasT_UPDT = this.getCurrentDate();
      this.evOrderData[i].updT_TIME = new Date().getTime().toString();
      this.evOrderData[i].sitE_NO = site;
      this.evOrderData[i].o_ID = userId;
      this.evOrderData[i].vC_NO = '';
      this.evOrderData[i].inV_DATE = '';
      this.evOrderData[i].uprice = this.evOrderData[i].uprice.toString();
      this.evOrderData[i].paT_ID = this.environmentOrderData.paT_ID == "" ? paT_ID.toString() : this.environmentOrderData.paT_ID;
      this.evOrderData[i].orD_NO = this.environmentOrderData.orD_NO;
      if (this.evOrderData[i].accn == null)
        this.evOrderData[i].accn = '';
    }

    for (let i = 0; i < this.evOrderData.length; i++) {
      if (this.evOrderData[i].reQ_CODE == '') {
        this.evOrderData.splice(i, 1);
      }
    }


    this.environmentalorderService.insertEnvironmentalATR(this.evOrderData).subscribe(
      (response) => {
        // if (response.status === 200 || response.status === 204)        
        {
          // Swal.fire({
          //   text: updateSuccessMessage,
          // })
          this.getEVClient();
          //this.getEVPatientId();
          this.getAllEnvironmentOrderData($("#pSize").val());
          //this.abort();
          //this.getAllEnvironmentOrderData();
        }
      },
      (error) => {
        const status = error.status;
        if (status === 409) {
          Swal.fire({
            text: warningMessage,
          });
        }
      });
  }




  focusTD(rowNum, cellNum) {
    this.ITableRef.nativeElement.tBodies[0].rows[rowNum].cells[cellNum].getElementsByTagName('reqcode' + rowNum)[0].focus()
  }

  deleteRow(evOrder: any) {
    // var delBtn = confirm("Do you want to delete this record?");
    // if (delBtn == true) {
    if (evOrder.r_STS == 'OD') {
      const index = this.evOrderData.indexOf(evOrder, 0);
      const hfIndex = document.getElementById('hfIndex') as HTMLInputElement;
      const InputCode = document.getElementById('InputCode') as HTMLInputElement;
      const InputFullName = document.getElementById('InputFullName') as HTMLInputElement;
      InputCode.value = evOrder.reQ_CODE;
      hfIndex.value = String(index);
      InputFullName.value = evOrder.fulL_NAME;
      this.cancelReason = '';
      $("#cmbCancelReason").val('');
      $("#AreaNOTES").val('');
      const cmbCancelReason = (document.getElementById('cmbCancelReason') as HTMLInputElement);
      cmbCancelReason.value = '';
      const modalCancelReason = document.getElementById('modalCancelReason') as HTMLElement;
      const myModal = new Modal(modalCancelReason);
      myModal.show();
    }
    else {
      Swal.fire({
        text: cannotcancelRequest,
      })
    }
  }



  getCode(event: any, control: string) {
    var el = event.currentTarget;
    while (el && el.nodeName !== "TR") {
      el = el.parentNode;
    }
    let rowIndex = el.rowIndex - 1;
    debugger;
    if ((event.keyCode == 40)) {  // || (event.keyCode == 9)
      if (control == "reqcode" + rowIndex) {
        let _word = event.target.value.trim();
        if (this.evOrderData.filter(x => x.reQ_CODE == _word).length > 1) {
          Swal.fire({ text: 'Code already exists', });
          this.evOrderData.splice(this.evOrderData.length - 1, 1);
          $("#reqcode" + this.evOrderData.length).focus();
          $("#hdFocus").val("1");
          return;
        }
        let arr = [] as any;
        const _codeResponse = this.evTdOrg.filter(x => x.tcode.toUpperCase().includes(_word.toUpperCase()) || x.fulL_NAME.toUpperCase().includes(_word.toUpperCase()));
        if (_codeResponse.length > 1 || _codeResponse.length == 0) {
          const rowTestCode = document.getElementById("rowTestCode") as HTMLInputElement;
          const InpTestCode = document.getElementById("InpTestCode") as HTMLInputElement;
          InpTestCode.value = _word; rowTestCode.value = rowIndex.toString();
          this.evTd = _codeResponse;
          const tcodeModal = document.getElementById('tcodeModal') as HTMLElement;
          const myModal = new Modal(tcodeModal);
          myModal.show();

        }
        else if (_codeResponse.length = 1) {
          this.evOrderData[rowIndex].tesT_ID = _codeResponse[0].tesT_ID;
          this.evOrderData[rowIndex].reQ_CODE = _codeResponse[0].tcode;
          this.evOrderData[rowIndex].drawN_DTTM = this.getCurrentDate();
          this.evOrderData[rowIndex].sts = _codeResponse[0].sts;
          this.evOrderData[rowIndex].uprice = _codeResponse[0].uprice.toString();
          this.evOrderData[rowIndex].fulL_NAME = _codeResponse[0].fulL_NAME;
          this.evOrderData[rowIndex].r_STS = 'OD';//_codeResponse[0].rstp;
          this.evOrderData[rowIndex].dt = (_codeResponse[0].dt == null ? 'P' : (_codeResponse[0].dt == '' ? 'P' : _codeResponse[0].dt));
          this.evOrderData[rowIndex].dscnt = _codeResponse[0].dscnt;
          this.evOrderData[rowIndex].dprice = (_codeResponse[0].dscnt == 0 ? _codeResponse[0].uprice : _codeResponse[0].uprice - (_codeResponse[0].uprice * (_codeResponse[0].dscnt / 100)));
          this.evOrderData[rowIndex].prty = (_codeResponse[0].prty == '' ? 'RT' : _codeResponse[0].prty);
          this.evOrderData[rowIndex].paT_ID = '';//this.evPatient[0].paT_ID;
          this.evOrderData[rowIndex].div = _codeResponse[0].div;
          this.evOrderData[rowIndex].sect = _codeResponse[0].sect;
          this.evOrderData[rowIndex].wc = _codeResponse[0].wc;
          this.evOrderData[rowIndex].ts = _codeResponse[0].ts;
          this.evOrderData[rowIndex].mdl = _codeResponse[0].mdl;
          this.evOrderData[rowIndex].seq = _codeResponse[0].seq;
          this.evOrderData[rowIndex].accn = this.evOrderData[0].accn;
          this.calculateTotal();
          //this.addRow();
          $("#InpTestCode").val('');
        }
        if ((event.keyCode == 40) && (this.evOrderData.length == rowIndex + 1)) {
          this.addRow();
          this.evOrderData[rowIndex].tesT_ID = _codeResponse[0].tesT_ID;
          this.evOrderData[rowIndex].reQ_CODE = _codeResponse[0].tcode;
          this.evOrderData[rowIndex].drawN_DTTM = this.getCurrentDate();
          this.evOrderData[rowIndex].sts = _codeResponse[0].sts;
          this.evOrderData[rowIndex].uprice = _codeResponse[0].uprice.toString();
          this.evOrderData[rowIndex].fulL_NAME = _codeResponse[0].fulL_NAME;
          this.evOrderData[rowIndex].r_STS = 'OD';//_codeResponse[0].rstp;
          this.evOrderData[rowIndex].dt = (_codeResponse[0].dt == null ? 'P' : (_codeResponse[0].dt == '' ? 'P' : _codeResponse[0].dt));
          this.evOrderData[rowIndex].dscnt = _codeResponse[0].dscnt;
          this.evOrderData[rowIndex].dprice = (_codeResponse[0].dscnt == 0 ? _codeResponse[0].uprice : _codeResponse[0].uprice - (_codeResponse[0].uprice * (_codeResponse[0].dscnt / 100)));
          this.evOrderData[rowIndex].prty = (_codeResponse[0].prty == '' ? 'RT' : _codeResponse[0].prty);
          this.evOrderData[rowIndex].paT_ID = '';//this.evPatient[0].paT_ID;
          this.evOrderData[rowIndex].div = _codeResponse[0].div;
          this.evOrderData[rowIndex].sect = _codeResponse[0].sect;
          this.evOrderData[rowIndex].wc = _codeResponse[0].wc;
          this.evOrderData[rowIndex].ts = _codeResponse[0].ts;
          this.evOrderData[rowIndex].mdl = _codeResponse[0].mdl;
          this.evOrderData[rowIndex].seq = _codeResponse[0].seq;
          this.evOrderData[rowIndex].accn = this.evOrderData[0].accn;
          this.calculateTotal();
          //this.addRow();
          $("#InpTestCode").val('');
        }
      }
      else {
        if ((event.keyCode == 40) && (this.evOrderData.length == rowIndex + 1)) {
          let _word = event.target.value.trim();
          if (_word != '') {
            if (this.evOrderData.filter(x => x.reQ_CODE == _word).length > 1) {
              Swal.fire({ text: 'Code already exists', });
              this.evOrderData.splice(this.evOrderData.length - 1, 1);
              $("#reqcode" + this.evOrderData.length).focus();
              $("#hdFocus").val("1");
              return;
            }
            let _codeResponse = this.evTdOrg.filter(x => x.tcode.toUpperCase() == (_word.toUpperCase()) || x.fulL_NAME.toUpperCase() == (_word.toUpperCase()));
            if (_codeResponse.length == 0) {
              _codeResponse = this.evTdOrg.filter(x => x.tcode.toUpperCase().includes(_word.toUpperCase()) || x.fulL_NAME.toUpperCase().includes(_word.toUpperCase()));
              if (_codeResponse.length > 1 || _codeResponse.length == 0) {
                const rowTestCode = document.getElementById("rowTestCode") as HTMLInputElement;
                const InpTestCode = document.getElementById("InpTestCode") as HTMLInputElement;
                InpTestCode.value = _word; rowTestCode.value = rowIndex.toString();
                this.evTd = _codeResponse;
                const tcodeModal = document.getElementById('tcodeModal') as HTMLElement;
                const myModal = new Modal(tcodeModal);
                myModal.show();

              }
              else if (_codeResponse.length = 1) {
                this.evOrderData[rowIndex].tesT_ID = _codeResponse[0].tesT_ID;
                this.evOrderData[rowIndex].reQ_CODE = _codeResponse[0].tcode;
                this.evOrderData[rowIndex].drawN_DTTM = this.getCurrentDate();
                this.evOrderData[rowIndex].sts = _codeResponse[0].sts;
                this.evOrderData[rowIndex].uprice = _codeResponse[0].uprice.toString();
                this.evOrderData[rowIndex].fulL_NAME = _codeResponse[0].fulL_NAME;
                this.evOrderData[rowIndex].r_STS = 'OD';//_codeResponse[0].rstp;
                this.evOrderData[rowIndex].dt = (_codeResponse[0].dt == null ? 'P' : (_codeResponse[0].dt == '' ? 'P' : _codeResponse[0].dt));
                this.evOrderData[rowIndex].dscnt = _codeResponse[0].dscnt;
                this.evOrderData[rowIndex].dprice = (_codeResponse[0].dscnt == 0 ? _codeResponse[0].uprice : _codeResponse[0].uprice - (_codeResponse[0].uprice * (_codeResponse[0].dscnt / 100)));
                this.evOrderData[rowIndex].prty = (_codeResponse[0].prty == '' ? 'RT' : _codeResponse[0].prty);
                this.evOrderData[rowIndex].paT_ID = '';//this.evPatient[0].paT_ID;
                this.evOrderData[rowIndex].div = _codeResponse[0].div;
                this.evOrderData[rowIndex].sect = _codeResponse[0].sect;
                this.evOrderData[rowIndex].wc = _codeResponse[0].wc;
                this.evOrderData[rowIndex].ts = _codeResponse[0].ts;
                this.evOrderData[rowIndex].mdl = _codeResponse[0].mdl;
                this.evOrderData[rowIndex].seq = _codeResponse[0].seq;
                this.evOrderData[rowIndex].accn = this.evOrderData[0].accn;
                this.calculateTotal();
                //this.addRow();
                $("#InpTestCode").val('');
              }

              this.addRow();
            }
            else {
              this.evOrderData[rowIndex].tesT_ID = _codeResponse[0].tesT_ID;
              this.evOrderData[rowIndex].reQ_CODE = _codeResponse[0].tcode;
              this.evOrderData[rowIndex].drawN_DTTM = this.getCurrentDate();
              this.evOrderData[rowIndex].sts = _codeResponse[0].sts;
              this.evOrderData[rowIndex].uprice = _codeResponse[0].uprice.toString();
              this.evOrderData[rowIndex].fulL_NAME = _codeResponse[0].fulL_NAME;
              this.evOrderData[rowIndex].r_STS = 'OD';//_codeResponse[0].rstp;
              this.evOrderData[rowIndex].dt = (_codeResponse[0].dt == null ? 'P' : (_codeResponse[0].dt == '' ? 'P' : _codeResponse[0].dt));
              this.evOrderData[rowIndex].dscnt = _codeResponse[0].dscnt;
              this.evOrderData[rowIndex].dprice = (_codeResponse[0].dscnt == 0 ? _codeResponse[0].uprice : _codeResponse[0].uprice - (_codeResponse[0].uprice * (_codeResponse[0].dscnt / 100)));
              this.evOrderData[rowIndex].prty = (_codeResponse[0].prty == '' ? 'RT' : _codeResponse[0].prty);
              this.evOrderData[rowIndex].paT_ID = '';//this.evPatient[0].paT_ID;
              this.evOrderData[rowIndex].div = _codeResponse[0].div;
              this.evOrderData[rowIndex].sect = _codeResponse[0].sect;
              this.evOrderData[rowIndex].wc = _codeResponse[0].wc;
              this.evOrderData[rowIndex].ts = _codeResponse[0].ts;
              this.evOrderData[rowIndex].mdl = _codeResponse[0].mdl;
              this.evOrderData[rowIndex].seq = _codeResponse[0].seq;
              this.evOrderData[rowIndex].accn = this.evOrderData[0].accn;
              this.calculateTotal();
              this.addRow();
              $("#InpTestCode").val('');
            }
          }
          else {
            this.evOrderData[rowIndex].drawN_DTTM = this.getCurrentDate();
            this.evOrderData[rowIndex].r_STS = 'OD';//_codeResponse[0].rstp;
            this.evOrderData[rowIndex].paT_ID = '';//this.evPatient[0].paT_ID;
            this.evOrderData[rowIndex].accn = this.evOrderData[0].accn;
            this.calculateTotal();
            this.addRow();
            $("#InpTestCode").val('');
          }
        }
      }
    }

  }

  getData(event: any) {
    var el = event.currentTarget;
    while (el && el.nodeName !== "TR") {
      el = el.parentNode;
    }
    debugger;
    $("#InpTestCode").val('');
    let rowIndex = el.rowIndex - 1;
    let _word = event.target.value.trim();
    let arr = [] as any;
    if (this.evTdOrg.length <= 1) {

    }
    if (_word != '') {
      if (this.evOrderData.filter(x => x.reQ_CODE == _word).length > 1) {
        Swal.fire({ text: 'Code already exists', });
        this.evOrderData.splice(this.evOrderData.length - 1, 1);
        $("#reqcode" + this.evOrderData.length).focus();
        $("#hdFocus").val("1");
        return;
      }
      let _codeResponse = this.evTdOrg.filter(x => x.tcode.toUpperCase() == (_word.toUpperCase()) || x.fulL_NAME.toUpperCase() == (_word.toUpperCase()));
      if (_codeResponse.length == 0) {
        _codeResponse = this.evTdOrg.filter(x => x.tcode.toUpperCase().includes(_word.toUpperCase()) || x.fulL_NAME.toUpperCase().includes(_word.toUpperCase()));
        if (_codeResponse.length > 1 || _codeResponse.length == 0) {
          const rowTestCode = document.getElementById("rowTestCode") as HTMLInputElement;
          const InpTestCode = document.getElementById("InpTestCode") as HTMLInputElement;
          InpTestCode.value = _word; rowTestCode.value = rowIndex.toString();
          this.evTd = _codeResponse;
          const tcodeModal = document.getElementById('tcodeModal') as HTMLElement;
          const myModal = new Modal(tcodeModal);
          myModal.show();
        }
        else if (_codeResponse.length = 1) {
          this.evOrderData[rowIndex].tesT_ID = _codeResponse[0].tesT_ID;
          this.evOrderData[rowIndex].reQ_CODE = _codeResponse[0].tcode;
          this.evOrderData[rowIndex].drawN_DTTM = this.getCurrentDate();
          this.evOrderData[rowIndex].sts = _codeResponse[0].sts;
          this.evOrderData[rowIndex].uprice = _codeResponse[0].uprice.toString();
          this.evOrderData[rowIndex].fulL_NAME = _codeResponse[0].fulL_NAME;
          this.evOrderData[rowIndex].r_STS = 'OD';// _codeResponse[0].rstp;
          this.evOrderData[rowIndex].dt = (_codeResponse[0].dt == null ? 'P' : (_codeResponse[0].dt == '' ? 'P' : _codeResponse[0].dt));
          this.evOrderData[rowIndex].dscnt = _codeResponse[0].dscnt;
          this.evOrderData[rowIndex].dprice = (_codeResponse[0].dscnt == 0 ? _codeResponse[0].uprice : _codeResponse[0].uprice - (_codeResponse[0].uprice * (_codeResponse[0].dscnt / 100)));
          this.evOrderData[rowIndex].prty = (_codeResponse[0].prty == '' ? 'RT' : _codeResponse[0].prty);
          this.evOrderData[rowIndex].paT_ID = ''; // this.evPatient[0].paT_ID;
          this.evOrderData[rowIndex].div = _codeResponse[0].div;
          this.evOrderData[rowIndex].sect = _codeResponse[0].sect;
          this.evOrderData[rowIndex].wc = _codeResponse[0].wc;
          this.evOrderData[rowIndex].ts = _codeResponse[0].ts;
          this.evOrderData[rowIndex].mdl = _codeResponse[0].mdl;
          this.evOrderData[rowIndex].seq = _codeResponse[0].seq;
          this.evOrderData[rowIndex].accn = this.evOrderData[0].accn;
          this.calculateTotal();
        }
      }
      else {
        this.evOrderData[rowIndex].tesT_ID = _codeResponse[0].tesT_ID;
        this.evOrderData[rowIndex].reQ_CODE = _codeResponse[0].tcode;
        this.evOrderData[rowIndex].drawN_DTTM = this.getCurrentDate();
        this.evOrderData[rowIndex].sts = _codeResponse[0].sts;
        this.evOrderData[rowIndex].uprice = _codeResponse[0].uprice.toString();
        this.evOrderData[rowIndex].fulL_NAME = _codeResponse[0].fulL_NAME;
        this.evOrderData[rowIndex].r_STS = 'OD';// _codeResponse[0].rstp;
        this.evOrderData[rowIndex].dt = (_codeResponse[0].dt == null ? 'P' : (_codeResponse[0].dt == '' ? 'P' : _codeResponse[0].dt));
        this.evOrderData[rowIndex].dscnt = _codeResponse[0].dscnt;
        this.evOrderData[rowIndex].dprice = (_codeResponse[0].dscnt == 0 ? _codeResponse[0].uprice : _codeResponse[0].uprice - (_codeResponse[0].uprice * (_codeResponse[0].dscnt / 100)));
        this.evOrderData[rowIndex].prty = (_codeResponse[0].prty == '' ? 'RT' : _codeResponse[0].prty);
        this.evOrderData[rowIndex].paT_ID = ''; // this.evPatient[0].paT_ID;
        this.evOrderData[rowIndex].div = _codeResponse[0].div;
        this.evOrderData[rowIndex].sect = _codeResponse[0].sect;
        this.evOrderData[rowIndex].wc = _codeResponse[0].wc;
        this.evOrderData[rowIndex].ts = _codeResponse[0].ts;
        this.evOrderData[rowIndex].mdl = _codeResponse[0].mdl;
        this.evOrderData[rowIndex].seq = _codeResponse[0].seq;
        this.evOrderData[rowIndex].accn = this.evOrderData[0].accn;
        this.calculateTotal();
      }
    }
    else {
      this.evOrderData[rowIndex].drawN_DTTM = this.getCurrentDate();
      this.evOrderData[rowIndex].r_STS = 'OD';//_codeResponse[0].rstp;
      this.evOrderData[rowIndex].paT_ID = '';//this.evPatient[0].paT_ID;
      this.evOrderData[rowIndex].accn = this.evOrderData[0].accn;
      this.calculateTotal();
      this.addRow();
      $("#InpTestCode").val('');
    }
  }

  getDiscount(event: any, dec: number, i: number) {
    if (dec > 0 && i >= 0) {
      if (this.evOrderData[i].dt == 'P') {
        this.evOrderData[i].dprice = parseFloat(this.evOrderData[i].uprice) - ((parseFloat(this.evOrderData[i].uprice) / 100) * (this.evOrderData[i].dscnt));
      }
      else {
        this.evOrderData[i].dprice = parseFloat(this.evOrderData[i].uprice) - (this.evOrderData[i].dscnt);
      }
    }
    this.calculateTotal();
  }

  getUnitPrice(event: any, price: string, i: number) {
    if (parseFloat(price) > 0 && i >= 0) {
      this.evOrderData[i].uprice = price;
      if (this.evOrderData[i].dt == 'P') {
        this.evOrderData[i].dprice = parseFloat(this.evOrderData[i].uprice) - ((parseFloat(this.evOrderData[i].uprice) / 100) * (this.evOrderData[i].dscnt));
      }
      else {
        this.evOrderData[i].dprice = parseFloat(this.evOrderData[i].uprice) - (this.evOrderData[i].dscnt);
      }
    }
    this.calculateTotal();
  }

  getDiscountType(event: any, dt: string, i: number) {
    if (dt.toUpperCase() != "P" && dt.toUpperCase() != "S") {
      Swal.fire({
        text: invalidDiscountMessage,
      })
      this.evOrderData[i].dt = '';
    }
  }

  prtycode(event: any, prty: string, i: number) {
    if (prty.trim() == '') {
      prty = 'RT';
    }

    if (prty.toUpperCase() != "RT" && prty.toUpperCase() != "ST") {
      Swal.fire({
        text: invalidPrtyMessage,
      })
      this.evOrderData[i].prty = '';
    }
  }


  addTD(td: any, event: any) {

    const rowTestCode = document.getElementById("rowTestCode") as HTMLInputElement;
    let rowIndex = parseInt(rowTestCode.value);
    this.evOrderData[rowIndex].tesT_ID = td.tesT_ID;
    this.evOrderData[rowIndex].reQ_CODE = td.tcode;
    this.evOrderData[rowIndex].drawN_DTTM = this.getCurrentDate();
    this.evOrderData[rowIndex].sts = td.sts;
    this.evOrderData[rowIndex].uprice = td.uprice.toString();
    this.evOrderData[rowIndex].fulL_NAME = td.fulL_NAME;
    this.evOrderData[rowIndex].r_STS = 'OD';// td.r_STS;
    this.evOrderData[rowIndex].dt = (td.dt == '' ? 'P' : td.dt);
    this.evOrderData[rowIndex].dscnt = td.dscnt;
    this.evOrderData[rowIndex].dprice = td.dprice;
    this.evOrderData[rowIndex].prty = (td.prty == '' ? 'RT' : td.prty);
    this.evOrderData[rowIndex].paT_ID = '';//this.evPatient[0].paT_ID;
    this.evOrderData[rowIndex].div = td.div;
    this.evOrderData[rowIndex].sect = td.sect;
    this.evOrderData[rowIndex].wc = td.wc;
    this.evOrderData[rowIndex].ts = td.ts;
    this.evOrderData[rowIndex].mdl = td.mdl;
    this.evOrderData[rowIndex].seq = td.seq;

    if (parseFloat(td.uprice) > 0 && rowIndex >= 0) {
      this.evOrderData[rowIndex].uprice = td.uprice;
      if (this.evOrderData[rowIndex].dt == 'P') {
        this.evOrderData[rowIndex].dprice = parseFloat(this.evOrderData[rowIndex].uprice) - ((parseFloat(this.evOrderData[rowIndex].uprice) / 100) * (this.evOrderData[rowIndex].dscnt));
      }
      else {
        this.evOrderData[rowIndex].dprice = parseFloat(this.evOrderData[rowIndex].uprice) - (this.evOrderData[rowIndex].dscnt);
      }
    }

    this.calculateTotal();
    $("#hdFocus").val("1");
    $("#InpTestCode").val('');
    this.getEVTD('EMPTY');
  }

  getCurrentDate() {
    return new Date().getDate().toString() + '/' + (new Date().getMonth() + 1).toString() + '/' + new Date().getFullYear().toString() + ' ' + new Date().getHours().toString() + ':' + new Date().getMinutes().toString() + ':' + new Date().getSeconds().toString();
  }

  getCurrentDateOnly() {
    return (new Date().getMonth() + 1).toString() + '/' + new Date().getDate().toString() + '/' + new Date().getFullYear().toString();
  }

  getTextBoxCurrentDate() {
    return new Date().getFullYear().toString() + '-' + String((new Date().getMonth() + 1).toString()).padStart(2, '0') + '-' + String(new Date().getDate().toString()).padStart(2, '0');
  }

  // getTextBox2MonthOldDate() {
  //   const datePlus = this.subtractDays(60);
  //   return datePlus.getFullYear().toString() + '-' + String((datePlus.getMonth() - 1).toString()).padStart(2, '0') + '-' + String(datePlus.getDate().toString()).padStart(2, '0');
  // }

  getTextBox2MonthOldDate(): string {
    const datePlus = this.subtractDays(60);

    // Ensure month and date are in correct format (MM-DD)
    const month = String(datePlus.getMonth() + 1).padStart(2, '0');  // getMonth() is 0-based, so add 1
    const day = String(datePlus.getDate()).padStart(2, '0');
    const year = datePlus.getFullYear();

    return `${year}-${month}-${day}`; // Returns YYYY-MM-DD format
  }


  subtractDays(days: number): Date {
    let date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  onKeydown(e: any) {
    this.addRow();
  }

  addRow() {
    const envOrder = new environmentOrderATR();
    envOrder.sno = this.evOrderData.length + 1;
    envOrder.dt = 'P'; envOrder.dscnt = 0; envOrder.dprice = 0; envOrder.prty = 'RT';
    if (this.evOrderData.length >= 1)
      envOrder.accn = this.evOrderData[0].accn;
    this.evOrderData.push(envOrder);
    $("#hdFocus").val("1");
    //$("#reqcode" + (envOrder.sno-1)).prop('disabled', false);
    this.calculateTotal();
  }

  intialaddRow() {
    const envOrder = new environmentOrderATR();
    const discountPercentage = document.getElementById('discountPercentage') as HTMLInputElement;
    const rcvD_DATE = document.getElementById('rcvD_DATE') as HTMLInputElement;
    const asT_DATE = document.getElementById('asT_DATE') as HTMLInputElement;
    envOrder.sno = this.evOrderData.length + 1;
    envOrder.uprice = '0'; envOrder.atrid = '0';
    envOrder.dt = 'P'; envOrder.dscnt = 0; envOrder.dprice = 0; envOrder.prty = 'RT'; envOrder.r_STS = 'OD';
    this.evOrderData.push(envOrder);
    discountPercentage.value = "0.00";
    //$("#paT_NAME").val('');
    $("#paT_NAME").focus();
    rcvD_DATE.value = this.getTextBoxCurrentDate();
    asT_DATE.value = this.getTextBoxCurrentDate();
    if ($("#aborthf").val().toString() == '1') {
      //this.environmentOrderAllData.splice(this.environmentOrderAllData.length, 1);
      $("#paT_ID").val('');
      this.environmentOrderAllData = this.removeEmptyElementsInPlace(this.environmentOrderAllData);
      this.getRecord("last", this.environmentOrderAllData.length - 1);
      $("#aborthf").val('0');
    }
    $("#receivedfrom").prop('selectedIndex', 0);
  }

  removeEmptyElementsInPlace(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].cn === undefined || arr[i].cn === null || arr[i].cn === "") {
        arr.splice(i, 1);
      }
    }
    return arr;
  }

  ngAfterContentChecked() {
    if ($("#hdFocus").val() == "1") {
      let i: number = 1;
      setTimeout(() => {
        $('#bodyList').find("tr").each(function () {
          $("#hdFocus").val("0");
          if ($('#bodyList').find("tr").length == i) {
            $(this).find("#reqcode" + i).focus();
            $("#reqcode" + i).prop('disabled', false);
            //$(this).find("#reqcode" + i).attr('disabled', 'disabled');          
          }
          i++;
        });
      }, 1000);

    }
  }


  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size);
  }

  change($event: any) {
    if ($event != null && $event.length > 0) {
      if (!$event.toString().includes('-')) {
        $("#cuS_NAME").val(this.evClient.filter(x => x.cn == $event)[0].client);
        $("#address").val(this.evClient.filter(x => x.cn == $event)[0].clnT_ADDRESS);
      }
    }
    this.environmentOrderData.cn = $event;
  }

  changestype($event: any) {
    this.environmentOrderData.s_TYPE = $event;
  }

  calculateTotal() {
    let totalPrice: number = 0; let totalDiscountedPrice: number = 0; let discountPercentage: number = 0;
    let vat: number = 0; let grandtotal: number = 0;
    for (let i = 0; i < this.evOrderData.length; i++) {
      totalPrice = totalPrice + (this.evOrderData[i].uprice == '' ? 0 : parseFloat(this.evOrderData[i].uprice))
      totalDiscountedPrice = totalDiscountedPrice + parseFloat(this.evOrderData[i].dprice.toString())
    }

    if (totalPrice == 0)
      discountPercentage = 0;
    else if (totalDiscountedPrice == 0)
      discountPercentage = 0;
    else
      discountPercentage = ((totalPrice - totalDiscountedPrice) / (totalPrice)) * 100
    $("#subtotal").val(totalPrice.toFixed(2).toString());
    $("#discountPercentage").val(discountPercentage.toFixed(2).toString());
    $("#discount").val((totalPrice - totalDiscountedPrice).toFixed(2).toString());
    $("#discountedprice").val(totalDiscountedPrice.toFixed(2).toString());

    var chkVAT = <HTMLInputElement>document.getElementById("chkVAT");
    if (chkVAT.checked == true)
      vat = totalDiscountedPrice * 0.15;
    else
      vat = 0;

    $("#vat").val(vat.toFixed(2).toString());
    grandtotal = totalDiscountedPrice + vat;
    $("#grandtotal").val(grandtotal.toFixed(2).toString());
    $("#totalpaid").val(grandtotal.toFixed(2).toString());
    $("#remainingbalance").val(0);
  }

  vatCheck() {
    this.calculateTotal()
  }

  calculateDiscountByPercent() {
    let totalPrice: number = 0;
    let vat: number = 0; let grandtotal: number = 0;
    let subtotal = Number($("#subtotal").val());
    let discountPercentage = Number($("#discountPercentage").val());
    let discount = Number($("#discount").val());
    let discountedprice = Number($("#discountedprice").val());

    for (let i = 0; i < this.evOrderData.length; i++) {
      this.evOrderData[i].dscnt = 0;
      this.evOrderData[i].dprice = Number(this.evOrderData[i].uprice);
    }


    discount = subtotal * (discountPercentage / 100)
    $("#discount").val(discount.toFixed(2).toString());
    discountedprice = subtotal - discount
    $("#discountedprice").val(discountedprice.toFixed(2).toString());
    vat = (discountedprice * 0.15)
    $("#vat").val(vat.toFixed(2).toString());
    grandtotal = discountedprice + vat;
    $("#grandtotal").val(grandtotal.toFixed(2).toString());
    $("#totalpaid").val(grandtotal.toFixed(2).toString());
    $("#remainingbalance").val(0);

    for (let i = 0; i < this.evOrderData.length; i++) {
      this.evOrderData[i].dscnt = parseFloat(discountPercentage.toFixed(2));
      this.evOrderData[i].dprice = parseFloat((parseFloat(this.evOrderData[i].uprice) - ((parseFloat(this.evOrderData[i].uprice) / 100) * (discountPercentage))).toFixed(2));
    }
  }

  calculateDiscountByRiyal() {
    let totalPrice: number = 0;
    let vat: number = 0; let grandtotal: number = 0;
    let subtotal = Number($("#subtotal").val());
    let discount = Number($("#discount").val());
    let discountPercentage = 0;
    let discountedprice = Number($("#discountedprice").val());
    for (let i = 0; i < this.evOrderData.length; i++) {
      this.evOrderData[i].dscnt = 0;
      this.evOrderData[i].dprice = Number(this.evOrderData[i].uprice);
    }
    discountPercentage = (discount / subtotal) * 100
    $("#discountPercentage").val(Number(discountPercentage).toFixed(2))
    discount = subtotal * (discountPercentage / 100)
    $("#discount").val(discount.toFixed(2).toString());
    discountedprice = subtotal - discount
    $("#discountedprice").val(discountedprice.toFixed(2).toString());
    vat = (discountedprice * 0.15)
    $("#vat").val(vat.toFixed(2).toString());
    grandtotal = discountedprice + vat;
    $("#grandtotal").val(grandtotal.toFixed(2).toString());
    $("#totalpaid").val(grandtotal.toFixed(2).toString());
    $("#remainingbalance").val(0);

    for (let i = 0; i < this.evOrderData.length; i++) {
      this.evOrderData[i].dscnt = parseFloat(discountPercentage.toFixed(2));
      this.evOrderData[i].dprice = parseFloat((parseFloat(this.evOrderData[i].uprice) - ((parseFloat(this.evOrderData[i].uprice) / 100) * (discountPercentage))).toFixed(2));
    }
  }

  vatCheckED() {
    this.calculateTotal()
  }

  calculateDiscountByPercentED() {
    let totalPrice: number = 0;
    let vat: number = 0; let grandtotal: number = 0;
    let subtotal = Number($("#subtotalED").val());
    let discountPercentage = Number($("#discountPercentageED").val());
    let discount = Number($("#discountED").val());
    let discountedprice = Number($("#discountedpriceED").val());

    for (let i = 0; i < this.evOrderData.length; i++) {
      this.evOrderData[i].dscnt = 0;
      this.evOrderData[i].dprice = Number(this.evOrderData[i].uprice);
    }


    discount = subtotal * (discountPercentage / 100)
    $("#discountED").val(discount.toFixed(2).toString());
    //$("#discount").val(discount.toFixed(2).toString());
    discountedprice = subtotal - discount
    $("#discountedpriceED").val(discountedprice.toFixed(2).toString());
    //$("#discountedprice").val(discountedprice.toFixed(2).toString());
    vat = (discountedprice * 0.15)
    $("#vatED").val(vat.toFixed(2).toString());
    //$("#vat").val(vat.toFixed(2).toString());
    grandtotal = discountedprice + vat;
    $("#grandtotalED").val(grandtotal.toFixed(2).toString());
    $("#totalpaidED").val(grandtotal.toFixed(2).toString());
    $("#remainingbalanceED").val(0);
    // $("#grandtotal").val(grandtotal.toFixed(2).toString());
    // $("#totalpaid").val(grandtotal.toFixed(2).toString());
    // $("#remainingbalance").val(0);

    for (let i = 0; i < this.evOrderData.length; i++) {
      this.evOrderData[i].dscnt = parseFloat(discountPercentage.toFixed(2));
      this.evOrderData[i].dprice = parseFloat((parseFloat(this.evOrderData[i].uprice) - ((parseFloat(this.evOrderData[i].uprice) / 100) * (discountPercentage))).toFixed(2));
    }
  }

  calculateDiscountByRiyalED() {
    let totalPrice: number = 0;
    let vat: number = 0; let grandtotal: number = 0;
    let subtotal = Number($("#subtotalED").val());
    let discount = Number($("#discountED").val());
    let discountPercentage = 0;
    let discountedprice = Number($("#discountedpriceED").val());
    for (let i = 0; i < this.evOrderData.length; i++) {
      this.evOrderData[i].dscnt = 0;
      this.evOrderData[i].dprice = Number(this.evOrderData[i].uprice);
    }
    discountPercentage = (discount / subtotal) * 100
    $("#discountPercentageED").val(Number(discountPercentage).toFixed(2))
    //$("#discountPercentage").val(Number(discountPercentage).toFixed(2))
    discount = subtotal * (discountPercentage / 100)
    $("#discountED").val(discount.toFixed(2).toString());
    //$("#discount").val(discount.toFixed(2).toString()); 
    discountedprice = subtotal - discount
    $("#discountedpriceED").val(discountedprice.toFixed(2).toString());
    //$("#discountedprice").val(discountedprice.toFixed(2).toString());
    vat = (discountedprice * 0.15)
    $("#vatED").val(vat.toFixed(2).toString());
    //$("#vat").val(vat.toFixed(2).toString());
    grandtotal = discountedprice + vat;
    $("#grandtotalED").val(grandtotal.toFixed(2).toString());
    $("#totalpaidED").val(grandtotal.toFixed(2).toString());
    $("#remainingbalanceED").val(0);
    //$("#grandtotal").val(grandtotal.toFixed(2).toString());
    //$("#totalpaid").val(grandtotal.toFixed(2).toString());
    //$("#remainingbalance").val(0);

    for (let i = 0; i < this.evOrderData.length; i++) {
      this.evOrderData[i].dscnt = parseFloat(discountPercentage.toFixed(2));
      this.evOrderData[i].dprice = parseFloat((parseFloat(this.evOrderData[i].uprice) - ((parseFloat(this.evOrderData[i].uprice) / 100) * (discountPercentage))).toFixed(2));
    }
  }

  ModifyEVOrder() {
    this.isReadOnly = false; this.isDisabled = true; this.isModify = true;
    var cash = <HTMLInputElement>document.getElementById("cash");
    const expR_DATE = document.getElementById('expR_DATE') as HTMLInputElement; const prD_DATE = document.getElementById('prD_DATE') as HTMLInputElement; const asT_DATE = document.getElementById('asT_DATE') as HTMLInputElement;
    const rcvD_DATE = document.getElementById('rcvD_DATE') as HTMLInputElement; const issU_DATE = document.getElementById('issU_DATE') as HTMLInputElement; const cuS_NAME = document.getElementById('cuS_NAME') as HTMLInputElement;
    const cuS_TP = document.getElementById('cuS_TP') as HTMLInputElement; const reF_NO = document.getElementById('reF_NO') as HTMLInputElement; const tel = document.getElementById('tel') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement; const cperson = document.getElementById('cperson') as HTMLInputElement; const citY_CNTRY = document.getElementById('citY_CNTRY') as HTMLInputElement;
    const address = document.getElementById('address') as HTMLInputElement;
    expR_DATE.disabled = false; prD_DATE.disabled = false; asT_DATE.disabled = false; rcvD_DATE.disabled = false; issU_DATE.disabled = false;
    for (let i = 0; i < this.evOrderData.length; i++) {
      $(this).find("#reqcode" + i).prop('disabled', true);
      //$("input").prop('disabled', true);
      // $("input").prop('disabled', false);
    }
  }

  addTest() {
    const envOrder = new environmentOrderATR();
    envOrder.sno = this.evOrderData.length + 1;
    envOrder.dt = 'P'; envOrder.dscnt = 0; envOrder.dprice = 0; envOrder.prty = 'RT';
    envOrder.accn = this.evOrderData[0].accn;
    this.evOrderData.push(envOrder);
    $("#hdFocus").val("1");

  }

  keypress() {
    return false;
  }

  getAllEnvironmentalOrderPatientSearch() {
    this.environmentalorderService.GetAllEVPatientSearch($("#pSize").val().toString() == '' ? '60' : $("#pSize").val().toString()).subscribe(res => {
      this.patientSearch = res;
      this.patientSearchOrg = res;
    },
      (error) => {
        console.error('Error loading Patient Search:', error);
      })
  }



  onPatientSelection(event: any, select: NgSelectComponent) {
    if (event != null) {
      if (event && event !== undefined) {
        this.environmentOrderData = this.environmentOrderAllData.filter(x => x.paT_ID == event)[0];
        if (this.environmentOrderData) {
          this.environmentOrderData.rcvD_DATE = this.environmentOrderData.rcvD_DATE;
          this.environmentOrderData.tel = this.environmentOrderData.tel;
          this.environmentOrderData.prD_DATE = this.environmentOrderData.prD_DATE;
          this.environmentOrderData.expR_DATE = this.environmentOrderData.expR_DATE;
          this.environmentOrderData.issU_DATE = this.environmentOrderData.issU_DATE;
          this.environmentOrderData.asT_DATE = this.environmentOrderData.asT_DATE;
          this.environmentOrderData.cn = this.environmentOrderData.cn;
          $("#paytp").val(this.environmentOrderData.paytp);
          this.getEnvironmentalOrderATRData(this.environmentOrderData.orD_NO);
        } else {
          // Handle case where selectedPatient is not found
        }
      } else {
        // Handle case where event or event.paT_NAME is undefined
      }
      // , select: NgSelectComponent
      select.handleClearClick();
    }
  }



  abort() {
    this.submitId = 0;
    if (this.environmentOrderData.orD_NO != '') {
      this.getBackAbort();
    }
    else {
      $("#aborthf").val("1");
      this.newEVOrder();
    }
  }

  getBackAbort() {
    let paT_ID = $("#hfpaT_ID").val();
    $("#aborthf").val("1");
    this.environmentOrderData = this.environmentOrderAllData.filter(x => x.paT_ID == paT_ID)[0];
    if (this.environmentOrderData) {
      this.environmentOrderData.rcvD_DATE = this.environmentOrderData.rcvD_DATE;
      this.environmentOrderData.tel = this.environmentOrderData.tel;
      this.environmentOrderData.prD_DATE = this.environmentOrderData.prD_DATE;
      this.environmentOrderData.expR_DATE = this.environmentOrderData.expR_DATE;
      this.environmentOrderData.issU_DATE = this.environmentOrderData.issU_DATE;
      this.environmentOrderData.asT_DATE = this.environmentOrderData.asT_DATE;
      this.environmentOrderData.cn = this.environmentOrderData.cn;
      $("#paytp").val(this.environmentOrderData.paytp);
      this.getEnvironmentalOrderATRData(this.environmentOrderData.orD_NO);

      const paT_NAME = document.getElementById('paT_NAME') as HTMLInputElement;
      const s_TYPE = document.getElementById('s_TYPE') as HTMLInputElement;
      var cash = <HTMLInputElement>document.getElementById("cash");
      const orD_NO = document.getElementById('ord_no') as HTMLInputElement;
      const batchA_NO = document.getElementById('batchA_NO') as HTMLInputElement;
      const rcvD_DATE = document.getElementById('rcvD_DATE') as HTMLInputElement;
      const phyS_COND = document.getElementById('phyS_COND') as HTMLInputElement;
      const origin = document.getElementById('origin') as HTMLInputElement;
      const voL_WT = document.getElementById('voL_WT') as HTMLInputElement;
      const voL_WT2 = document.getElementById('voL_WT2') as HTMLInputElement;
      const asT_DATE = document.getElementById('asT_DATE') as HTMLInputElement;
      const custoM_SR = document.getElementById('custoM_SR') as HTMLInputElement;
      const prD_DATE = document.getElementById('prD_DATE') as HTMLInputElement;
      const expR_DATE = document.getElementById('expR_DATE') as HTMLInputElement;
      const cn = document.getElementById('cn') as HTMLInputElement;
      const cuS_NAME = document.getElementById('cuS_NAME') as HTMLInputElement;
      const cuS_TP = document.getElementById('cuS_TP') as HTMLInputElement;
      const issU_DATE = document.getElementById('issU_DATE') as HTMLInputElement;
      const reF_NO = document.getElementById('reF_NO') as HTMLInputElement;
      const tel = document.getElementById('tel') as HTMLInputElement;
      const email = document.getElementById('email') as HTMLInputElement;
      const cperson = document.getElementById('cperson') as HTMLInputElement;
      const citY_CNTRY = document.getElementById('citY_CNTRY') as HTMLInputElement;
      const address = document.getElementById('address') as HTMLInputElement;
      const paytp = document.getElementById('paytp') as HTMLInputElement;
      const totalpaid = document.getElementById('totalpaid') as HTMLInputElement;
      const remainingbalance = document.getElementById('remainingbalance') as HTMLInputElement;
      const subtotal = document.getElementById('subtotal') as HTMLInputElement;
      const discountPercentage = document.getElementById('discountPercentage') as HTMLInputElement;
      const discount = document.getElementById('discount') as HTMLInputElement;
      const discountedprice = document.getElementById('discountedprice') as HTMLInputElement;
      const vat = document.getElementById('vat') as HTMLInputElement;
      const grandtotal = document.getElementById('grandtotal') as HTMLInputElement;
      const inV_DATE = document.getElementById('inV_DATE') as HTMLInputElement;
      const vC_NO = document.getElementById('vC_NO') as HTMLInputElement;
      const brand = document.getElementById('brand') as HTMLInputElement;
      const expirY_PERIOD = document.getElementById('expirY_PERIOD') as HTMLInputElement;


      paT_NAME.value = this.environmentOrderData.paT_NAME;
      s_TYPE.value = this.environmentOrderData.s_TYPE;
      //CN.value= this.environmentOrderData.cn;
      cash.value = (this.environmentOrderData.cash == true ? "true" : "false");
      cuS_NAME.value = this.environmentOrderData.cuS_NAME;
      cuS_TP.value = this.environmentOrderData.cuS_TP;
      issU_DATE.value = this.environmentOrderData.issU_DATE;
      reF_NO.value = this.environmentOrderData.reF_NO;
      voL_WT.value = this.environmentOrderData.voL_WT;
      voL_WT2.value = this.environmentOrderData.voL_WT2;
      batchA_NO.value = this.environmentOrderData.batchA_NO;
      tel.value = this.environmentOrderData.tel;
      email.value = this.environmentOrderData.email;
      cperson.value = this.environmentOrderData.cperson;
      rcvD_DATE.value = this.environmentOrderData.rcvD_DATE;
      phyS_COND.value = this.environmentOrderData.phyS_COND;
      origin.value = this.environmentOrderData.origin;
      citY_CNTRY.value = this.environmentOrderData.citY_CNTRY;
      address.value = this.environmentOrderData.address;
      custoM_SR.value = this.environmentOrderData.custoM_SR;
      prD_DATE.value = this.environmentOrderData.prD_DATE;
      expR_DATE.value = this.environmentOrderData.expR_DATE;
      asT_DATE.value = this.environmentOrderData.asT_DATE;
      orD_NO.value = this.environmentOrderData.orD_NO;
      paytp.value = this.environmentOrderData.paytp;
      totalpaid.value = this.environmentOrderData.paid;
      remainingbalance.value = this.environmentOrderData.paid;
      vC_NO.value = this.environmentOrderData.vC_NO;
      inV_DATE.value = this.environmentOrderData.inV_DATE;
      brand.value = this.environmentOrderData.brand;
      expirY_PERIOD.value = this.environmentOrderData.expirY_PERIOD;
      $("#cn")[0].innerText = this.environmentOrderData.cnclient;
      this.calculateTotal();
      this.isDisabled = false;

    }
  }

  updateInvoice() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you want to Confirm to issue the Invoice?',//this.updateMgsAccordingToButton(clickNumber),
      //icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const tcodeModal = document.getElementById('exampleModalToggle') as HTMLElement;
        const myModal = new Modal(tcodeModal);
        myModal.show();
        let OrderNo = this.environmentOrderData.orD_NO
        const evInvoice = new evListPrintModel();
        evInvoice.orderNo = OrderNo;
        this.environmentalorderService.UpdateInvoice(evInvoice).subscribe(res => {
          this.getEnvironmentalOrderData(OrderNo);
        },
          (error) => {
            console.error('Error uploading EV Invoice :', error);
          })

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          text: 'Not amended by the User!!!.',
        });
      }
    });
  }

  displayInvoice() {
    const tcodeModal = document.getElementById('exampleModalToggle') as HTMLElement;
    const myModal = new Modal(tcodeModal);
    myModal.show();
    let OrderNo = this.environmentOrderData.orD_NO
    const evInvoice = new evListPrintModel();
    evInvoice.orderNo = OrderNo;
    this.environmentalorderService.UpdateInvoice(evInvoice).subscribe(res => {
      this.getEnvironmentalOrderData(OrderNo);
    },
      (error) => {
        console.error('Error uploading EV Invoice :', error);
      })

  }

  getEnvironmentalOrderData(orderNo: string) {

    const evOrderATR = new environmentOrderATR();
    evOrderATR.orD_NO = orderNo;
    this.environmentalorderService.getAllEnvironmentOrder($("#pSize").val()).subscribe(res => {
      this.environmentOrderAllData = res;
      this.environmentOrderData = res.filter(x => x.orD_NO == orderNo)[0];
      //this.getEVPrint(this.environmentOrderData.orD_NO);     
      this.getEnvironmentalOrderATRData(this.environmentOrderData.orD_NO);
      this.calculateTotal();
    })
  }



  BindCancelReason() {
    this.environmentalorderService.getCancelDescription()
      .subscribe({
        next: (res) => {
          this.isLoaded = true;
          for (var i = 0; i < res.length; i++) {
            this.evCancelReason.push(res[i]);
          }
          this.isLoaded = false;
        },
        error: (err) => {
        }
      })
    $("#SinceDate").val(this.getTextBox2MonthOldDate());

  }

  cancelOrder() {
    if (this.cancelReason != '') {

      const hfIndex = document.getElementById('hfIndex') as HTMLInputElement;
      const InputCode = document.getElementById('InputCode') as HTMLInputElement;
      const InputFullName = document.getElementById('InputFullName') as HTMLInputElement;
      let i: number = Number(hfIndex.value);
      this.evOrderData[i].fulL_NAME = 'Cancelled Test';
      this.evOrderData[i].uprice = '0';
      this.evOrderData[i].dprice = 0.00;
      this.evOrderData[i].dscnt = 0.00;
      this.evOrderData[i].r_STS = 'X';
      this.calculateTotal();

      var LblARTID = this.evOrderData[i].atR_ID; //this.environmentOrderData.atR_ID;
      var InputSect = document.getElementById("hfSect") as HTMLInputElement | null;
      var AreaNOTES = document.getElementById("AreaNOTES") as HTMLInputElement | null;

      let PAT_ID = $("#hfpaT_ID").val();
      let ORD_NO = this.environmentOrderData.orD_NO

      const site = EncryptionHelper.decrypt(localStorage.getItem("site"));;
      const userId = EncryptionHelper.decrypt(localStorage.getItem("userId"));
      this.environmentalorderService.Update_ATR((LblARTID), 'X', 'X', AreaNOTES.value.toString() == '' ? 'CANCELLED' : AreaNOTES.value.toString(), site, userId, ORD_NO, InputSect.value, InputCode.value)
        .subscribe({
          next: (res) => {
            this.updateCancel()
            // Swal.fire({
            //   title: 'Cancelled successfully!',
            //   text: cancelRequest,
            //   icon: 'success'
            // })

          },
          error: (err) => {
            //alert(err?.error.message);
          }
        })
    }
    else {
      Swal.fire({ text: 'Cancelled Reason required', });
      $("#cmbCancelReason").focus();
      return;
    }
  }


  evPrintMultiInvoice() {
    let clientNo = this.environmentOrderData.cn
    const evPrint = new evListMultiInvoicePrintModel();
    evPrint.clientNo = clientNo;
    evPrint.SinceDate = $("#SinceDate").val().toString();
    let invoiceNo: string = '';
    for (let i = 0; i < this._responsePlus.length; i++) {
      if (this._responsePlus[i].checked == true) {
        invoiceNo = this._responsePlus[i].vC_NO + "," + invoiceNo;
      }
    }
    evPrint.Search = invoiceNo;

    this.environmentalorderService.GetEVMultipleInvoicePrint(evPrint).subscribe(res => {
      this._response = res;
      var fileblob = this.b64toBlob(this._response.messages, 'application/pdf');
      var url = window.URL.createObjectURL(fileblob);
      let anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank"
      anchor.click();
    },
      (error) => {
        console.error('Error loading EV Multiple Invoice Print :', error);
      })
  }

  onPrintMultiInvoice() {
    this._loaderService.show();
    let invoiceNo: string = '';
    for (let i = 0; i < this._responsePlus.length; i++) {
      if (this._responsePlus[i].checked == true) {
        invoiceNo = this._responsePlus[i].vC_NO + "," + invoiceNo;
      }
    }

    if ((invoiceNo.substr(invoiceNo.length - 1) == ','))
      invoiceNo = invoiceNo.substring(0, invoiceNo.length - 1);

    const clientNo = this.environmentOrderData.cn;
    const vcNumber = invoiceNo;//this.environmentOrderData.vC_NO;

    // Construct the URL with print parameters
    const baseUrl = REPORT_BASEURL;
    // const reportParams = `&cn=${clientNo}&CnMulti_Inv=${vcNumber}&rs:Command=Render&rs:Format=PDF&rs:Print=True`
    const reportParams = `&cn=${clientNo}`
      + `&CnMulti_Inv=${vcNumber}`
      + `&rs:Command=Render`
      + `&rs:Format=PDF`
      + `&rs:Print=True`
      + `&VatInvoice=${this.printOptions.vatInvoice}`
      + `&PaymentStatus=${this.printOptions.paymentStatus}`
      + `&DisplayLogo=${this.printOptions.pageHeader}`;

    const reportUrl = `${baseUrl}${this.reportPath_finance}/${this.multiInvoiceReportName}${reportParams}`;



    // Fetch the report as a blob
    this._printService.getSSRSReport(reportUrl).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const iframeSrc = `${url}#toolbar=0&navpanes=0&scrollbar=1`; // Hide default toolbar

      // Open a new tab
      const newTab = window.open("", "_blank");
      const selectedInvoice = this._responsePlus.find(item => item.checked)?.vC_NO || '';
      const vcNumber = selectedInvoice; // Only the first selected invoice number
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
              a.download = "EvMultiInvoice_${vcNumber}.pdf"; 
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

  // onPrintMultiInvoice(pageSize: number, pageNumber: number) {
  //   this._loaderService.show();
  //   let invoiceNo: string = '';

  //   for (let i = 0; i < this._responsePlus.length; i++) {
  //     if (this._responsePlus[i].checked == true) {
  //       invoiceNo = this._responsePlus[i].vC_NO + "," + invoiceNo;
  //     }
  //   }

  //   if (invoiceNo.endsWith(',')) {
  //     invoiceNo = invoiceNo.slice(0, -1);
  //   }

  //   const clientNo = this.environmentOrderData.cn;

  //   // Construct the URL with pagination parameters
  //   const baseUrl = REPORT_BASEURL;
  //   const reportParams = `&cn=${clientNo}`
  //     + `&CnMulti_Inv=${invoiceNo}`
  //     + `&rs:Command=Render`
  //     + `&rs:Format=PDF`
  //     + `&rs:Print=True`
  //     + `&VatInvoice=${this.printOptions.vatInvoice}`
  //     + `&PaymentStatus=${this.printOptions.paymentStatus}`
  //     + `&DisplayLogo=${this.printOptions.pageHeader}`
  //     + `&PageSize=${pageSize}`      // Pagination: Page Size
  //     + `&PageNumber=${pageNumber}`; // Pagination: Page Number

  //   const reportUrl = `${baseUrl}${this.reportPath_finance}/${this.multiInvoiceReportName}${reportParams}`;

  //   // Fetch the report as a blob
  //   this._printService.getSSRSReport(reportUrl).subscribe(blob => {
  //     const url = window.URL.createObjectURL(blob);
  //     const iframeSrc = `${url}#toolbar=0&navpanes=0&scrollbar=1`;

  //     // Open a new tab
  //     const newTab = window.open("", "_blank");
  //     if (newTab) {
  //       newTab.document.write(`
  //               <html>
  //               <head>
  //                   <title>Report Preview</title>
  //               </head>
  //               <body style="text-align: center; margin: 0; padding: 0;">
  //                   <iframe src="${iframeSrc}" width="100%" height="90%" style="border: none;"></iframe>
  //                   <br/>
  //                   <button onclick="downloadReport()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-top: 10px;">
  //                       Download Report
  //                   </button>
  //                   <script>
  //                       function downloadReport() {
  //                           const a = document.createElement('a');
  //                           a.href = "${url}";
  //                           a.download = "EvMultiInvoice_${invoiceNo.split(',')[0]}.pdf";
  //                           document.body.appendChild(a);
  //                           a.click();
  //                           document.body.removeChild(a);
  //                       }
  //                   </script>
  //               </body>
  //               </html>
  //           `);
  //       this._loaderService.hide();
  //       newTab.document.close();
  //     } else {
  //       this._loaderService.hide();
  //       console.error("Error: Unable to open new tab.");
  //     }
  //   });
  // }


  // selectAll() {
  //   let tabletotal: number = 0;
  //   if (this.SelectAll == 'Select All') {
  //     for (let i = 0; i < this._responsePlus.length; i++) {
  //       this._responsePlus[i].checked = true;
  //       tabletotal = tabletotal + parseFloat(this._responsePlus[i].uprice);
  //       this.checkedCount = this._responsePlus.filter(res => res.checked).length;
  //     }
  //     $("#tabletotal").val(tabletotal.toFixed(2).toString());
  //     this.SelectAll = 'UnSelect All';
  //   }
  //   else {
  //     for (let i = 0; i < this._responsePlus.length; i++) {
  //       this._responsePlus[i].checked = false;
  //     }
  //     $("#tabletotal").val(0.00.toString());
  //     this.SelectAll = 'Select All';
  //   }

  // }

  selectAll() {
    let tableTotal: number = 0;
    if (this.SelectAll === 'Select All') {
      this._responsePlus.forEach(item => {
        item.checked = true;
        tableTotal += parseFloat(item.uprice);
      });
      this.checkedCount = this._responsePlus.length;  // Set count to total checkboxes
      this.SelectAll = 'UnSelect All';
    } else {
      this._responsePlus.forEach(item => {
        item.checked = false;
      });
      this.checkedCount = 0;  // Reset count to 0
      tableTotal = 0;
      this.SelectAll = 'Select All';
    }

    $("#tabletotal").val(tableTotal.toFixed(2).toString());
  }



  checkChange(event: any) {
    let tabletotal: number = 0;
    let flag = false;
    for (let i = 0; i < this._responsePlus.length; i++) {
      if (this._responsePlus[i].checked == true) {
        flag = true;
        tabletotal = tabletotal + parseFloat(this._responsePlus[i].uprice);
        this.checkedCount = this._responsePlus.filter(res => res.checked).length;
      }
    }
    $("#tabletotal").val(tabletotal.toString());
    if (flag)
      this.SelectAll = 'UnSelect All';
    else
      this.SelectAll = 'Select All';
  }


  printBar(accn: string) {
    return this.environmentalorderService.getBarcode(accn).subscribe(res => {
      this._response = res;
      this.imageSource = 'data:image/png;base64 ,' + this._response.messages;
    })
  }

  showBarCode() {
    // const barCodeModal = document.getElementById('barCodeModal') as HTMLElement;
    // const myModal = new Modal(barCodeModal);
    // myModal.show();
    this.printBarCode();
  }

  printBarCode() {
    const printContents = document.getElementById('divBarcode').innerHTML;

    var mywindow = window.open('', 'new div', 'height=400,width=600');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"  media="screen,print" type="text/css" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write(printContents);
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus();

    setTimeout(function () {
      mywindow.print();
      mywindow.close();
    }, 1000)
    return true;
  }

  IssueExtraDiscount() {
    this.isReadOnly = false; this.isDisabled = true; this.isModify = true;
    const ExtraDiscountModal = document.getElementById('ExtraDiscountModal') as HTMLElement;
    const myModal = new Modal(ExtraDiscountModal);
    myModal.show();
  }

  SubmitDiscount() {
    this.submitId = 0;
    let totalPrice: number = 0;
    let vat: number = 0; let grandtotal: number = 0;
    let subtotal = Number($("#subtotalED").val());
    let discount = Number($("#discountED").val());
    let discountPercentage = 0;
    let discountedprice = Number($("#discountedpriceED").val());
    for (let i = 0; i < this.evOrderData.length; i++) {
      this.evOrderData[i].dscnt = 0;
      this.evOrderData[i].dprice = Number(this.evOrderData[i].uprice);
    }
    discountPercentage = (discount / subtotal) * 100
    $("#discountPercentageED").val(Number(discountPercentage).toFixed(2))
    $("#discountPercentage").val(Number(discountPercentage).toFixed(2))
    discount = subtotal * (discountPercentage / 100)
    $("#discountED").val(discount.toFixed(2).toString());
    $("#discount").val(discount.toFixed(2).toString());
    discountedprice = subtotal - discount
    $("#discountedpriceED").val(discountedprice.toFixed(2).toString());
    $("#discountedprice").val(discountedprice.toFixed(2).toString());
    vat = (discountedprice * 0.15)
    $("#vatED").val(vat.toFixed(2).toString());
    $("#vat").val(vat.toFixed(2).toString());
    grandtotal = discountedprice + vat;
    $("#grandtotalED").val(grandtotal.toFixed(2).toString());
    $("#totalpaidED").val(grandtotal.toFixed(2).toString());
    $("#remainingbalanceED").val(0);
    $("#grandtotal").val(grandtotal.toFixed(2).toString());
    $("#totalpaid").val(grandtotal.toFixed(2).toString());
    $("#remainingbalance").val(0);

    for (let i = 0; i < this.evOrderData.length; i++) {
      this.evOrderData[i].dscnt = parseFloat(discountPercentage.toFixed(2));
      this.evOrderData[i].dprice = parseFloat((parseFloat(this.evOrderData[i].uprice) - ((parseFloat(this.evOrderData[i].uprice) / 100) * (discountPercentage))).toFixed(2));
    }
    this.environmentOrderData.extradiscount = $("#discountED").val().toString();
    this.SaveInitial();
  }


  updateCancel() {
    const paT_NAME = document.getElementById('paT_NAME') as HTMLInputElement;
    const s_TYPE = document.getElementById('s_TYPE') as HTMLInputElement;
    const cn = document.getElementById('cn') as HTMLInputElement;
    this.environmentOrderData.paT_NAME = paT_NAME.value;
    this.environmentOrderData.s_TYPE = this.environmentOrderData.s_TYPE.split("-", 1).toString();
    this.environmentOrderData.cn = this.environmentOrderData.cn.split("-", 1).toString();

    if (this.environmentOrderData.paT_NAME == null || this.environmentOrderData.paT_NAME == '') {
      Swal.fire({ text: 'Sample Name is required', }); return;
    }
    else if (this.environmentOrderData.s_TYPE == null || this.environmentOrderData.s_TYPE == '') {
      Swal.fire({ text: 'Sample Type is required', }); return;
    }
    else if (this.environmentOrderData.cn == null || this.environmentOrderData.cn == '') {
      Swal.fire({ text: 'Client is required', }); return;
    }

    this.submitId = this.environmentOrderData.sno;
    var cash = <HTMLInputElement>document.getElementById("cash");
    const batchA_NO = document.getElementById('batchA_NO') as HTMLInputElement;
    const rcvD_DATE = document.getElementById('rcvD_DATE') as HTMLInputElement;
    const phyS_COND = document.getElementById('phyS_COND') as HTMLInputElement;
    const origin = document.getElementById('origin') as HTMLInputElement;
    const voL_WT = document.getElementById('voL_WT') as HTMLInputElement;
    const voL_WT2 = document.getElementById('voL_WT2') as HTMLInputElement;
    const asT_DATE = document.getElementById('asT_DATE') as HTMLInputElement;
    const custoM_SR = document.getElementById('custoM_SR') as HTMLInputElement;
    const prD_DATE = document.getElementById('prD_DATE') as HTMLInputElement;
    const expR_DATE = document.getElementById('expR_DATE') as HTMLInputElement;

    const cuS_NAME = document.getElementById('cuS_NAME') as HTMLInputElement;
    const cuS_TP = document.getElementById('cuS_TP') as HTMLInputElement;
    const issU_DATE = document.getElementById('issU_DATE') as HTMLInputElement;
    const reF_NO = document.getElementById('reF_NO') as HTMLInputElement;
    const tel = document.getElementById('tel') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    const cperson = document.getElementById('cperson') as HTMLInputElement;
    const citY_CNTRY = document.getElementById('citY_CNTRY') as HTMLInputElement;
    const address = document.getElementById('address') as HTMLInputElement;
    const paytp = document.getElementById('paytp') as HTMLInputElement;
    const totalpaid = document.getElementById('totalpaid') as HTMLInputElement;
    const remainingbalance = document.getElementById('remainingbalance') as HTMLInputElement;
    const subtotal = document.getElementById('subtotal') as HTMLInputElement;
    const discountPercentage = document.getElementById('discountPercentage') as HTMLInputElement;
    const discount = document.getElementById('discount') as HTMLInputElement;
    const discountedprice = document.getElementById('discountedprice') as HTMLInputElement;
    const vat = document.getElementById('vat') as HTMLInputElement;
    const grandtotal = document.getElementById('grandtotal') as HTMLInputElement;
    const brand = document.getElementById('brand') as HTMLInputElement;
    const expirY_PERIOD = document.getElementById('expirY_PERIOD') as HTMLInputElement;
    const vC_NO = document.getElementById('vC_NO') as HTMLInputElement;
    const inV_DATE = document.getElementById('inV_DATE') as HTMLInputElement;

    this.environmentOrderData.paT_NAME = paT_NAME.value;
    this.environmentOrderData.cn = this.environmentOrderData.cn.split("-", 1).toString();
    this.environmentOrderData.s_TYPE = this.environmentOrderData.s_TYPE.split("-", 1).toString();
    this.environmentOrderData.cash = (cash.value == "true" ? true : false);
    this.environmentOrderData.cuS_NAME = cuS_NAME.value;
    this.environmentOrderData.cuS_TP = cuS_TP.value;
    this.environmentOrderData.issU_DATE = issU_DATE.value;
    this.environmentOrderData.reF_NO = reF_NO.value;
    this.environmentOrderData.voL_WT = voL_WT.value;
    this.environmentOrderData.voL_WT2 = voL_WT2.value;
    this.environmentOrderData.batchA_NO = batchA_NO.value;
    this.environmentOrderData.tel = tel.value;
    this.environmentOrderData.email = email.value;
    this.environmentOrderData.cperson = cperson.value;
    this.environmentOrderData.rcvD_DATE = rcvD_DATE.value;
    this.environmentOrderData.phyS_COND = phyS_COND.value;
    this.environmentOrderData.origin = origin.value;
    this.environmentOrderData.citY_CNTRY = citY_CNTRY.value;
    this.environmentOrderData.address = address.value;
    this.environmentOrderData.custoM_SR = custoM_SR.value;
    this.environmentOrderData.prD_DATE = prD_DATE.value;
    this.environmentOrderData.expR_DATE = expR_DATE.value;
    this.environmentOrderData.asT_DATE = asT_DATE.value;
    this.environmentOrderData.paytp = paytp.value;
    this.environmentOrderData.stypesP_DESCRP = ''
    this.environmentOrderData.paid = totalpaid.value;
    this.environmentOrderData.rmng = remainingbalance.value;
    this.environmentOrderData.toT_VALUE = subtotal.value;
    this.environmentOrderData.totdscnt = discountPercentage.value;
    this.environmentOrderData.dscamnt = discount.value;
    this.environmentOrderData.neT_VALUE = discountedprice.value;
    this.environmentOrderData.vat = vat.value;
    this.environmentOrderData.granD_VAL = grandtotal.value;
    this.environmentOrderData.brand = brand.value;
    this.environmentOrderData.expirY_PERIOD = expirY_PERIOD.value;
    this.environmentOrderData.search = ''; this.environmentOrderData.vC_NO = vC_NO.value;
    this.environmentOrderData.inV_DATE = inV_DATE.value;
    this.environmentOrderData.extradiscount = $("#discountED").val() == "" ? "0" : $("#discountED").val().toString();
    this.environmentOrderData.otp = $("#receivedfrom").val().toString();
    this.environmentalorderService.InsertEVOrder(this.environmentOrderData).subscribe(
      (response) => {
        this.insertATR(response);
      },
      (error) => {
        const status = error.status;
        if (status === 409) {
          Swal.fire({
            text: warningMessage,
          });
        }
      });
  }

  getRoleBasedPermission() {
    this.rolebaseaction = this._permissionService.getRoleBaseAccessOnAction(Environmental_Order);
  }

  // Function to check if a button should be disabled
  // isButtonDisabled(action: string): boolean {
  //   switch (action) {
  //     case 'add':
  //       return !this.rolebaseaction.IsAddAccess || !this.isAddReadOnly;
  //     case 'save':
  //       return !this.rolebaseaction.IsSaveAccess || !this.isSubmitReadOnly;
  //     case 'cancel':
  //       return !this.rolebaseaction.IsCancelAccess || !this.isCancelReadOnly;
  //     case 'modify':
  //       return !this.rolebaseaction.isModifyAccess || !this.isModifyReadOnly;
  //     default:
  //       return true;
  //   }
  // }

  sizeChange(event: any) {
    this.getAllEnvironmentOrderData($("#pSize").val());
    this.getAllEnvironmentalOrderPatientSearch();
  }

  getEVOTP() {
    this.environmentalorderService.getEVOrderOTP().subscribe(result => {
      this.evSOTP = result;
    },
      (error) => {
        console.error('Error loading EV OTP:', error);
      })
  }

  getAllUsersData(): void {
    this._userService.getAllUser().subscribe((res: any[]) => {
      // Filter out users where sigN_LINE1 is null or empty/whitespace only.
      this.userAllData = res.filter(user =>
        user.sigN_LINE1 && user.sigN_LINE1.trim().length > 0
      );
    });
  }


}


