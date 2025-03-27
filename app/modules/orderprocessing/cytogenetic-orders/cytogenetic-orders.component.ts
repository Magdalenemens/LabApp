import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CytogeneticOrdersService } from './cytogenetic-orders.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { successMessage, cancelRequest, collectedRequest, firstRecord, lastRecord, alertThreeDigits, updateSuccessMessage, warningMessage, invalidDiscountMessage, invalidPrtyMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { Alert, Modal } from 'bootstrap';
import { cleanData } from 'jquery';
import { NgSelectComponent } from '@ng-select/ng-select';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { TDModel } from 'src/app/models/tdmodel';
import * as $ from 'jquery';
import { cgCancelReason, cgClient, cgListMultiInvoicePrintModel, cgListPrintModel, cgPatientID, cgPrintModel, cgSample, cytogeneticOrderATR, cytogeneticOrderModel } from 'src/app/models/cytogenticOrderModel';
import { mbPatientSearchModel } from 'src/app/models/microbiologyModel';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';
import { mnModel } from 'src/app/models/mnModel';
import { MnService } from '../../masters/mn/mn.service';
import { cytogeneticLoginARModel } from 'src/app/models/cytogeneticLoginModel';
import { roleBaseAction } from 'src/app/models/roleBaseAction';
import { rolePermissionModel } from 'src/app/models/rolePermissionModel';
import { PermissionService } from 'src/app/services/permission.service';
import { Cytogenetics_Order } from 'src/app/common/moduleNameConstant';
import { LoaderService } from '../../shared/services/loaderService';
@Component({
  selector: 'app-cytogenetic-orders',
  templateUrl: './cytogenetic-orders.component.html',
  styleUrls: ['./cytogenetic-orders.component.scss']
})
export class CytogeneticOrdersComponent {


  cgLoginAR = [] as cytogeneticLoginARModel[];
  cgLoginSP = [] as cytogeneticLoginARModel[];
  ATRNotes: any;
  selectedSite: string = "";
  selectedrefSite: string = "";
  selectedUserId: string = "";

  @ViewChild('ITable') ITableRef: ElementRef;
  currentDateTime = moment();
  _response: any; _responsePlus: any;
  startTime: string = '';
  discount: number = 0;
  endTime: string = '';
  discountPercentage: number = 0;
  subtotal: number = 0;
  discountedprice: number = 0;
  evOrderData: cytogeneticOrderATR[] = [];
  evCancelReason: cgCancelReason[] = [];
  mnList: mnModel[] = [];
  public specimenstypes: any[] = [];
  public DoctorTableList: any[] = [];
  isLoaded = false;
  public sharedtableNat: any[] = [];
  cytogeneticOrderAllData: cytogeneticOrderModel[] = [];
  cytogeneticOrderData: cytogeneticOrderModel = new cytogeneticOrderModel();
  evform: FormGroup;
  isReadOnly: boolean = false;
  isDisabled = false;
  isFreeze: boolean = false;
  isModify: boolean = false;
  initialValueForm!: FormGroup;
  patientSearch: mbPatientSearchModel[] = [];
  selectedPatient: number;
  order_FDatetime: any;
  evClientDDL: string = '';
  evTdOrg = [] as TDModel[];
  evTd = [] as TDModel[];
  evPrint = [] as cgPrintModel[];
  evClient = [] as cgClient[];
  evSample = [] as cgSample[];
  evPatient = [] as cgPatientID[];
  rolepermissionmodel: rolePermissionModel[] = [];
  rolebaseaction: roleBaseAction = new roleBaseAction();

  //Action Buttons
  isAddReadOnly: boolean = true;
  isSubmitReadOnly: boolean = true;
  isCancelReadOnly: boolean = true;
  isModifyReadOnly: boolean = true;

  constructor(private formBuilder: FormBuilder, private cgOrderService: CytogeneticOrdersService,
    private router: Router, private elRef: ElementRef,
    private _commonService: CommonService, private _mnService: MnService,
    private _permissionService: PermissionService, private _loaderService: LoaderService) {

  }

  ngOnInit(): void {
    this.getAllEnvironmentalOrderPatientSearch();
    this.getClient();
    this.getCGTD('EMPTY');
    this.BindCancelReason();
    this.BindSharedTableNat();
    this.BindSpecimenstypes();
    this.GetmnData();
    this.getCytogeneticsLoginAR();
    this.getRoleBasedPermission();
    this._loaderService.ShowHideLoader(4000);
    // this.cytogeneticOrderData.orD_NO = null;
    // this.cytogeneticOrderData.paT_ID = null;

  }

  ngOnDestroy(): void {

  }


  getAllCytogeneticOrderData() {
    this.cgOrderService.GetAllCytogeneticOrder().subscribe(res => {
      if(res.length > 0){
      this.cytogeneticOrderAllData = res;
      this.getRecord("last", this.cytogeneticOrderAllData.length - 1);
      }
    },
      (error) => {
        console.error('Error loading Site list:', error);
      })
  }

  getRecord(input: any, SNO: number) {
    let totalNumberOfRec = this.cytogeneticOrderAllData.length;
    if (input == 'first') {
      if (this.cytogeneticOrderData.sno == 1) {
        Swal.fire({
          text: firstRecord,
        });
        return;
      }
      this.cytogeneticOrderData = this.cytogeneticOrderAllData[0];
    } else if (input == 'prev' && SNO != 1) {
      this.cytogeneticOrderData = this.cytogeneticOrderAllData.filter(x => x.sno == (SNO - 1))[0];
    }
    else if (input == 'next' && totalNumberOfRec > SNO) {
      this.cytogeneticOrderData = this.cytogeneticOrderAllData.filter(x => x.sno == (SNO + 1))[0];
    }
    else if (input == 'last') {
      if (this.cytogeneticOrderData != null) {
        if (this.cytogeneticOrderData.sno == totalNumberOfRec) {
          this.cytogeneticOrderData = this.cytogeneticOrderAllData.filter(x => x.sno == totalNumberOfRec)[0];
          this.getEnvironmentalOrderATRData(this.cytogeneticOrderData.orD_NO);
          return;
        }
      }
      this.cytogeneticOrderData = this.cytogeneticOrderAllData.filter(x => x.sno == totalNumberOfRec)[0];
    }
    else if (input == 'new') {
      if (this.cytogeneticOrderData != null) {
        if (this.cytogeneticOrderData.sno == totalNumberOfRec) {
          Swal.fire({
            text: lastRecord,
          });
          return;
        }
      }
      this.cytogeneticOrderData = this.cytogeneticOrderAllData.filter(x => x.sno == totalNumberOfRec)[0];
    }
    this.cytogeneticOrderData.tel = this.cytogeneticOrderData.tel;
    this.cytogeneticOrderData.cn = this.cytogeneticOrderData.cn;
    this.getEnvironmentalOrderATRData(this.cytogeneticOrderData.orD_NO);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  changestype($event: any) {
    this.cytogeneticOrderData.s_TYPE = $event.$ngOptionLabel;
  }

  changeNationality($event: any) {
    this.cytogeneticOrderData.nationality = $event.$ngOptionLabel;
  }

  change($event: any) {
    debugger;
    if ($event != null && $event.length > 0)
      this.cytogeneticOrderData.cn = $event;
  }

  changeDoctor($event: any) {
    debugger;
    if ($event != null && $event.length > 0)
      this.cytogeneticOrderData.drno = $event;
  }

  getEnvironmentalOrderATRData(orderNo: string) {
    const evOrderATR = new cytogeneticOrderATR();
    evOrderATR.orD_NO = orderNo;
    this.cgOrderService.getAllEVOrderATR(evOrderATR).subscribe((data) => {
      if (data) {
        this.evOrderData = data;
        if (this.evOrderData.length == 0) {
          this.intialaddRow();
        }
        //this.getEVPrint(this.cytogeneticOrderData.orD_NO);     
      } else {
        console.error('Cytogenetic data not found:', data);
      }
      this.calculateTotal();
      //this.evMultiInvoice();
    })
  }



  getClient() {
    this.cgOrderService.getAllClients().subscribe(res => {
      if (res.length > 0) {
        debugger;
        this.evClient = res;
        this.getEVSamples();

      }
    },
      (error) => {
        console.error('Error loading EV Client:', error);
      })
  }

  getEVSamples() {
    this.cgOrderService.GetAllEVSample().subscribe(res => {
      if (res.length > 0) {
        this.evSample = res;
        this.getAllCytogeneticOrderData();
      }
    },
      (error) => {
        console.error('Error loading EV Samples:', error);
      })
  }


  getCGTD(TCode: string) {
    this.cgOrderService.GetAllCGTD(TCode).subscribe(res => {
      if (res.length > 0) {
        this.evTd = res;
        this.evTdOrg = res;
      }
    },
      (error) => {
        console.error('Error loading TD :', error);
      })
  }

  getEVPrint() {

    let OrderNo = this.cytogeneticOrderData.orD_NO
    const evPrint = new cgListPrintModel();

    evPrint.orderNo = OrderNo;
    this.cgOrderService.GetEVPrint(evPrint).subscribe(res => {
      this._response = res;
      var fileblob = this.b64toBlob(this._response.messages, 'application/pdf');
      var url = window.URL.createObjectURL(fileblob);
      let anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank"
      anchor.click();
    },
      (error) => {
        console.error('Error loading EV Print :', error);
      })
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
      this.getCGTD(InpTestCode.value);
    else
      this.getCGTD("EMPTY");
  }


  newCGOrder() {
    this.isReadOnly = false; this.isDisabled = true; this.isFreeze = true;
    const obj = new cytogeneticOrderModel();
    obj.paT_ID = '';
    obj.paT_NAME = ''; obj.s_TYPE = ''; obj.cn = ''; obj.cash = false;
    obj.reF_NO = '';

    obj.tel = ''; obj.email = ''; obj.rcvD_DATE = this.getCurrentDateOnly();
    obj.client = ''; obj.orD_NO = '';
    obj.email = '',
      obj.gender = ''; obj.dob = ''; obj.age = ''; obj.cash = false; obj.nationality = ''; obj.iqama = ''; obj.orD_SEQ = '';
    obj.consent = ''; obj.volume = ''; obj.intgrty = ''; obj.color = ''; obj.pac = ''; obj.cntr = ''; obj.comments = '';
    obj.cnst = ''; obj.clN_IND = ''; obj.drno = ''; obj.doctor = '';
    obj.sno = this.cytogeneticOrderAllData.length + 1;

    this.cytogeneticOrderAllData.push(obj);
    this.getRecord("new", this.cytogeneticOrderAllData.length - 1);
    var cash = <HTMLInputElement>document.getElementById("cash");
    const cuS_TP = document.getElementById('cuS_TP') as HTMLInputElement; const reF_NO = document.getElementById('reF_NO') as HTMLInputElement; const tel = document.getElementById('tel') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    cash.checked = false; cuS_TP.value = ''; reF_NO.value = ''; tel.value = ''; email.value = '';
  }


  assignTheData() {
    if (!this.cytogeneticOrderData) {
      console.error('No data available to assign. microbiologyData is undefined.');
      return;
    }
  };


  SaveInitial() {

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you want to Confirm the Submit?',//this.updateMgsAccordingToButton(clickNumber),
      //icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {

        const PAT_ID = document.getElementById('PAT_ID') as HTMLInputElement;
        const paT_NAME = document.getElementById('PAT_NAME') as HTMLInputElement;
        const DOB = document.getElementById('DOB') as HTMLInputElement;
        const Gender = document.getElementById('Gender') as HTMLInputElement;
        const rcvD_DATE = document.getElementById('rcvD_DATE') as HTMLInputElement;
        const DRNO = document.getElementById('DRNO') as HTMLInputElement;
        //const CN = document.getElementById('CN') as HTMLInputElement;   
        var cash = <HTMLInputElement>document.getElementById("cash");
        const cmbSpecimenstypes = document.getElementById('cmbSpecimenstypes') as HTMLInputElement;
        const Color = document.getElementById('Color') as HTMLInputElement;
        const PAC = document.getElementById('PAC') as HTMLInputElement;
        const Container = document.getElementById('Container') as HTMLInputElement;
        const comments = document.getElementById('comments') as HTMLInputElement;
        const CLN_IND = document.getElementById('CLN_IND') as HTMLInputElement;
        //const NATIONALITY = document.getElementById('NATIONALITY') as HTMLInputElement;   
        const iqama = document.getElementById('iqama') as HTMLInputElement;
        const REF_NO = document.getElementById('REF_NO') as HTMLInputElement;
        const TEL = document.getElementById('TEL') as HTMLInputElement;
        const EMAIL = document.getElementById('EMAIL') as HTMLInputElement;
        const Seq = document.getElementById('Seq') as HTMLInputElement;
        const consent = document.getElementById('consent') as HTMLInputElement;
        const Voulme = document.getElementById('Voulme') as HTMLInputElement;
        const Integrety = document.getElementById('Integrety') as HTMLInputElement;
        const subtotal = document.getElementById('subtotal') as HTMLInputElement;
        const discountPercentage = document.getElementById('discountPercentage') as HTMLInputElement;
        const discount = document.getElementById('discount') as HTMLInputElement;
        const discountedprice = document.getElementById('discountedprice') as HTMLInputElement;
        var chkVAT = <HTMLInputElement>document.getElementById("chkVAT");
        const vat = document.getElementById('vat') as HTMLInputElement;
        const grandtotal = document.getElementById('grandtotal') as HTMLInputElement;
        const totalpaid = document.getElementById('totalpaid') as HTMLInputElement;
        const remainingbalance = document.getElementById('remainingbalance') as HTMLInputElement;
        const paytp = document.getElementById('paytp') as HTMLInputElement;
        const vC_NO = document.getElementById('vC_NO') as HTMLInputElement;
        const inV_DATE = document.getElementById('inV_DATE') as HTMLInputElement;

        this.cytogeneticOrderData.paT_ID = PAT_ID.value;
        this.cytogeneticOrderData.paT_NAME = paT_NAME.value;
        this.cytogeneticOrderData.dob = DOB.value.toString();
        this.cytogeneticOrderData.gender = Gender.value;
        this.cytogeneticOrderData.rcvD_DATE = rcvD_DATE.value;
        this.cytogeneticOrderData.drno = DRNO.value;
        //this.cytogeneticOrderData.cn		=   CN.value;
        this.cytogeneticOrderData.cash = cash.checked;
        //this.cytogeneticOrderData.s_TYPE		=   cmbSpecimenstypes.value;
        this.cytogeneticOrderData.color = Color.value;
        this.cytogeneticOrderData.pac = PAC.value;
        this.cytogeneticOrderData.cntr = Container.value;
        this.cytogeneticOrderData.comments = comments.value;
        this.cytogeneticOrderData.clN_IND = CLN_IND.value;
        //this.cytogeneticOrderData.nationality		=   NATIONALITY.value;
        this.cytogeneticOrderData.iqama = iqama.value;
        this.cytogeneticOrderData.reF_NO = REF_NO.value;
        this.cytogeneticOrderData.tel = TEL.value;
        this.cytogeneticOrderData.email = EMAIL.value;
        this.cytogeneticOrderData.orD_SEQ = Seq.value;
        this.cytogeneticOrderData.cnst = consent.value;
        this.cytogeneticOrderData.volume = Voulme.value;
        this.cytogeneticOrderData.intgrty = Integrety.value;
        this.cytogeneticOrderData.orD_SEQ = Seq.value;
        this.cytogeneticOrderData.cnst = consent.value;
        this.cytogeneticOrderData.paytp = paytp.value;
        this.cytogeneticOrderData.paid = totalpaid.value;
        this.cytogeneticOrderData.rmng = remainingbalance.value;
        this.cytogeneticOrderData.toT_VALUE = subtotal.value;
        this.cytogeneticOrderData.totdscnt = discountPercentage.value;
        this.cytogeneticOrderData.dscamnt = discount.value;
        this.cytogeneticOrderData.neT_VALUE = discountedprice.value;
        this.cytogeneticOrderData.vat = vat.value;
        this.cytogeneticOrderData.granD_VAL = grandtotal.value;
        this.cytogeneticOrderData.search = '';
        this.cytogeneticOrderData.vC_NO = vC_NO.value;
        this.cytogeneticOrderData.inV_DATE = inV_DATE.value;
        console.log(this.cytogeneticOrderData);
        this.cgOrderService.InsertCGOrder(this.cytogeneticOrderData).subscribe(
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

  pad(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


  insertATR(paT_ID: string) {
    debugger;
     paT_ID = this.pad(parseInt(paT_ID),10)
        alert(paT_ID);

    const site = EncryptionHelper.decrypt(localStorage.getItem("site"));;
    const userId = EncryptionHelper.decrypt(localStorage.getItem("userId"));


    for (let i = 0; i < this.evOrderData.length; i++) {
      this.evOrderData[i].reQ_DTTM = this.getCurrentDate();
      this.evOrderData[i].drawN_DTTM = this.getCurrentDate();
      this.evOrderData[i].s_TYPE = this.cytogeneticOrderData.s_TYPE;
      this.evOrderData[i].mdl = 'CG';
      this.evOrderData[i].lasT_UPDT = this.getCurrentDate();
      this.evOrderData[i].updT_TIME = new Date().getTime().toString();
      this.evOrderData[i].sitE_NO = site;
      this.evOrderData[i].o_ID = userId;
      this.evOrderData[i].vC_NO = '';
      this.evOrderData[i].inV_DATE = ''
      this.evOrderData[i].uprice = this.evOrderData[i].uprice.toString();
      this.evOrderData[i].paT_ID =  this.evOrderData[i].paT_ID == '' ? paT_ID.toString() : this.evOrderData[i].paT_ID;
    }

    for (let i = 0; i < this.evOrderData.length; i++) {
      if (this.evOrderData[i].reQ_CODE == '') {
        this.evOrderData.splice(i, 1);
      }
    }


    this.cgOrderService.InsertCGATR(this.evOrderData).subscribe(
      (response) => {
        // if (response.status === 200 || response.status === 204)        
        {
          Swal.fire({
            text: updateSuccessMessage,
          })
          this.getClient();
          this.abort();
          this.getAllCytogeneticOrderData();
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
    const index = this.evOrderData.indexOf(evOrder, 0);
    const hfIndex = document.getElementById('hfIndex') as HTMLInputElement;
    const InputCode = document.getElementById('InputCode') as HTMLInputElement;
    const InputFullName = document.getElementById('InputFullName') as HTMLInputElement;
    InputCode.value = evOrder.reQ_CODE;
    hfIndex.value = String(index);
    InputFullName.value = evOrder.fulL_NAME;
    const modalCancelReason = document.getElementById('modalCancelReason') as HTMLElement;
    const myModal = new Modal(modalCancelReason);
    myModal.show();

  }



  getCode(event: any, control: string) {
    debugger;
    var el = event.currentTarget;
    while (el && el.nodeName !== "TR") {
      el = el.parentNode;
    }
    let rowIndex = el.rowIndex - 1;
    if ((event.keyCode == 40)) {  // || (event.keyCode == 9)
      if (control == "reqcode" + rowIndex) {
        let _word = event.target.value.trim();
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
          if (this.evPatient.length > 0)
            this.evOrderData[rowIndex].paT_ID = this.evPatient[0].paT_ID;
          this.evOrderData[rowIndex].div = _codeResponse[0].div;
          this.evOrderData[rowIndex].sect = _codeResponse[0].sect;
          this.evOrderData[rowIndex].wc = _codeResponse[0].wc;
          this.evOrderData[rowIndex].ts = _codeResponse[0].ts;
          this.evOrderData[rowIndex].mdl = _codeResponse[0].mdl;
          this.evOrderData[rowIndex].seq = _codeResponse[0].seq;
          if (this.evPatient.length > 0)
            this.evOrderData[rowIndex].accn = this.evOrderData[0].accn;
        }
        if ((event.keyCode == 40) && (this.evOrderData.length == rowIndex + 1)) {
          this.addRow();
        }
      }
      else {
        if ((event.keyCode == 40) && (this.evOrderData.length == rowIndex + 1)) {
          this.addRow();
        }
      }
    }

  }

  getData(event: any) {
    var el = event.currentTarget;
    while (el && el.nodeName !== "TR") {
      el = el.parentNode;
    }
    $("#InpTestCode").val('');
    let rowIndex = el.rowIndex - 1;
    let _word = event.target.value.trim();
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
      this.evOrderData[rowIndex].r_STS = 'OD';// _codeResponse[0].rstp;
      this.evOrderData[rowIndex].dt = (_codeResponse[0].dt == null ? 'P' : (_codeResponse[0].dt == '' ? 'P' : _codeResponse[0].dt));
      this.evOrderData[rowIndex].dscnt = _codeResponse[0].dscnt;
      this.evOrderData[rowIndex].dprice = (_codeResponse[0].dscnt == 0 ? _codeResponse[0].uprice : _codeResponse[0].uprice - (_codeResponse[0].uprice * (_codeResponse[0].dscnt / 100)));
      this.evOrderData[rowIndex].prty = (_codeResponse[0].prty == '' ? 'RT' : _codeResponse[0].prty);
      if (this.evPatient.length > 0)
        this.evOrderData[rowIndex].paT_ID = this.evPatient[0].paT_ID;
      this.evOrderData[rowIndex].div = _codeResponse[0].div;
      this.evOrderData[rowIndex].sect = _codeResponse[0].sect;
      this.evOrderData[rowIndex].wc = _codeResponse[0].wc;
      this.evOrderData[rowIndex].ts = _codeResponse[0].ts;
      this.evOrderData[rowIndex].mdl = _codeResponse[0].mdl;
      this.evOrderData[rowIndex].seq = _codeResponse[0].seq;
      if (this.evPatient.length > 0)
        this.evOrderData[rowIndex].accn = this.evOrderData[0].accn;
      this.calculateTotal();
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
    debugger;
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
    if (this.evPatient.length > 0)
      this.evOrderData[rowIndex].paT_ID = this.evPatient[0].paT_ID;
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

  getTextBox2MonthOldDate() {
    return new Date().getFullYear().toString() + '-' + String((new Date().getMonth() - 1).toString()).padStart(2, '0') + '-' + String(new Date().getDate().toString()).padStart(2, '0');
  }


  onKeydown(e: any) {
    this.addRow();
  }

  addRow() {
    const envOrder = new cytogeneticOrderATR();
    envOrder.sno = this.evOrderData.length + 1;
    envOrder.dt = 'P'; envOrder.dscnt = 0; envOrder.dprice = 0; envOrder.prty = 'RT';
    this.evOrderData.push(envOrder);
    $("#hdFocus").val("1");
    this.calculateTotal();
  }

  intialaddRow() {
    const envOrder = new cytogeneticOrderATR();
    const discountPercentage = document.getElementById('discountPercentage') as HTMLInputElement;
    const rcvD_DATE = document.getElementById('rcvD_DATE') as HTMLInputElement;
    envOrder.sno = this.evOrderData.length + 1;
    envOrder.uprice = '0'; envOrder.atrid = '0';
    envOrder.dt = 'P'; envOrder.dscnt = 0; envOrder.dprice = 0; envOrder.prty = 'RT'; envOrder.r_STS = 'OD';
    this.evOrderData.push(envOrder);
    discountPercentage.value = "0.00";

    rcvD_DATE.value = this.getTextBoxCurrentDate();
    if ($("#aborthf").val().toString() == '1') {
      //this.cytogeneticOrderAllData.splice(this.cytogeneticOrderAllData.length, 1);
      $("#PAT_ID").val('');
      this.cytogeneticOrderAllData = this.removeEmptyElementsInPlace(this.cytogeneticOrderAllData);
      this.getRecord("last", this.cytogeneticOrderAllData.length - 1);
      $("#aborthf").val('0');
    }
    $("#PAT_ID").focus();
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
          debugger;
          if ($("#bodyList").find("tr").length == i) {
            $(this).find("#reqcode" + i).focus();
            $("#reqcode" + i).prop('disabled', false);
          }
          i++;

        });
      }, 1000);

    }
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size);
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

  ModifyEVOrder() {
    this.isReadOnly = false; this.isDisabled = true; this.isModify = true;
    //var cash = <HTMLInputElement>document.getElementById("cash");
    const rcvD_DATE = document.getElementById('rcvD_DATE') as HTMLInputElement;
    // const reF_NO = document.getElementById('reF_NO') as HTMLInputElement;const tel = document.getElementById('tel') as HTMLInputElement;    
    // const email = document.getElementById('email') as HTMLInputElement;
    // const cperson = document.getElementById('cperson') as HTMLInputElement;
    // const citY_CNTRY = document.getElementById('citY_CNTRY') as HTMLInputElement;       
    // const address = document.getElementById('address') as HTMLInputElement;
    rcvD_DATE.disabled = false;
    for (let i = 0; i < this.evOrderData.length; i++) {
      $(this).find("#reqcode" + i).prop('disabled', true);
    }
  }

  addTest() {
    const envOrder = new cytogeneticOrderATR();
    envOrder.sno = this.evOrderData.length + 1;
    envOrder.dt = 'P'; envOrder.dscnt = 0; envOrder.dprice = 0; envOrder.prty = 'RT';
    envOrder.accn = this.evOrderData[0].accn;
    this.evOrderData.push(envOrder);
    $("#hdFocus").val("1");

  }

  getAllEnvironmentalOrderPatientSearch() {
    this.cgOrderService.GetAllEVPatientSearch().subscribe(res => {
      this.patientSearch = res;
    },
      (error) => {
        console.error('Error loading Patient Search:', error);
      })
  }



  onPatientSelection(event: any, select: NgSelectComponent) {
    if (event && event.id !== undefined && event.name !== undefined) {
      this.cytogeneticOrderData = this.cytogeneticOrderAllData.filter(x => x.paT_ID == event.id)[0];
      if (this.cytogeneticOrderData) {
        this.cytogeneticOrderData.rcvD_DATE = this.cytogeneticOrderData.rcvD_DATE;
        this.cytogeneticOrderData.tel = this.cytogeneticOrderData.tel;
        // this.cytogeneticOrderData.prD_DATE = this.cytogeneticOrderData .prD_DATE;
        // this.cytogeneticOrderData.expR_DATE = this.cytogeneticOrderData .expR_DATE;
        // this.cytogeneticOrderData.issU_DATE = this.cytogeneticOrderData .issU_DATE;
        // this.cytogeneticOrderData.asT_DATE = this.cytogeneticOrderData .asT_DATE;
        this.cytogeneticOrderData.cn = this.cytogeneticOrderData.cn;
        $("#paytp").val(this.cytogeneticOrderData.paytp);
        this.getEnvironmentalOrderATRData(this.cytogeneticOrderData.orD_NO);
      } else {
        // Handle case where selectedPatient is not found
      }
    } else {
      // Handle case where event or event.paT_NAME is undefined
    }
    select.handleClearClick();
  }



  abort() {
    if (this.cytogeneticOrderData.orD_NO != '') {
      this.getBackAbort();
    }
    else {
      $("#aborthf").val("1");
      this.newCGOrder();
    }
  }

  getBackAbort() {
    let paT_ID = $("#hfpaT_ID").val();
    $("#aborthf").val("1");
    this.cytogeneticOrderData = this.cytogeneticOrderAllData.filter(x => x.paT_ID == paT_ID)[0];
    if (this.cytogeneticOrderData) {
      this.cytogeneticOrderData.rcvD_DATE = this.cytogeneticOrderData.rcvD_DATE;
      this.cytogeneticOrderData.tel = this.cytogeneticOrderData.tel;
      this.cytogeneticOrderData.cn = this.cytogeneticOrderData.cn;
      $("#paytp").val(this.cytogeneticOrderData.paytp);
      this.getEnvironmentalOrderATRData(this.cytogeneticOrderData.orD_NO);

      const paT_NAME = document.getElementById('paT_NAME') as HTMLInputElement;
      const s_TYPE = document.getElementById('s_TYPE') as HTMLInputElement;
      var cash = <HTMLInputElement>document.getElementById("cash");
      const orD_NO = document.getElementById('ord_no') as HTMLInputElement;
      const rcvD_DATE = document.getElementById('rcvD_DATE') as HTMLInputElement;
      const cn = document.getElementById('cn') as HTMLInputElement;
      const reF_NO = document.getElementById('reF_NO') as HTMLInputElement;
      const tel = document.getElementById('tel') as HTMLInputElement;
      const email = document.getElementById('email') as HTMLInputElement;
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


      paT_NAME.value = this.cytogeneticOrderData.paT_NAME;
      s_TYPE.value = this.cytogeneticOrderData.s_TYPE;
      cash.checked = this.cytogeneticOrderData.cash;
      reF_NO.value = this.cytogeneticOrderData.reF_NO;
      tel.value = this.cytogeneticOrderData.tel;
      email.value = this.cytogeneticOrderData.email;
      orD_NO.value = this.cytogeneticOrderData.orD_NO;
      paytp.value = this.cytogeneticOrderData.paytp;
      totalpaid.value = this.cytogeneticOrderData.paid;
      remainingbalance.value = this.cytogeneticOrderData.paid;
      vC_NO.value = this.cytogeneticOrderData.vC_NO;
      inV_DATE.value = this.cytogeneticOrderData.inV_DATE;
      $("#cn")[0].innerText = this.cytogeneticOrderData.client;
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
        let OrderNo = this.cytogeneticOrderData.orD_NO
        const evInvoice = new cgListPrintModel();
        evInvoice.orderNo = OrderNo;
        this.cgOrderService.UpdateInvoice(evInvoice).subscribe(res => {
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

  getEnvironmentalOrderData(orderNo: string) {

    const evOrderATR = new cytogeneticOrderATR();
    evOrderATR.orD_NO = orderNo;
    this.cgOrderService.GetAllCytogeneticOrder().subscribe(res => {
      this.cytogeneticOrderAllData = res;
      this.cytogeneticOrderData = res.filter(x => x.orD_NO == orderNo)[0];
      //this.getEVPrint(this.cytogeneticOrderData.orD_NO);     
      this.getEnvironmentalOrderATRData(this.cytogeneticOrderData.orD_NO);
      this.calculateTotal();
    })
  }



  BindCancelReason() {
    this.cgOrderService.getCancelDescription()
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

    var LblARTID = this.evOrderData[i].atR_ID; //this.cytogeneticOrderData.atR_ID;
    var InputSect = document.getElementById("hfSect") as HTMLInputElement | null;
    var AreaNOTES = document.getElementById("AreaNOTES") as HTMLInputElement | null;

    let PAT_ID = $("#hfpaT_ID").val();
    let ORD_NO = this.cytogeneticOrderData.orD_NO

    this.cgOrderService.Update_ATR((LblARTID), 'X', 'X', AreaNOTES.value, this.selectedSite, this.selectedUserId, ORD_NO, InputSect.value, InputCode.value)
      .subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Cancelled successfully!',
            text: cancelRequest,
            icon: 'success'
          })
          this.SaveInitial();
        },
        error: (err) => {
          //alert(err?.error.message);
        }
      })


  }


  evPrintMultiInvoice() {
    let clientNo = this.cytogeneticOrderData.cn
    const evPrint = new cgListMultiInvoicePrintModel();
    evPrint.clientNo = clientNo;
    evPrint.SinceDate = $("#SinceDate").val().toString();
    let invoiceNo: string = '';
    for (let i = 0; i < this._responsePlus.length; i++) {
      if (this._responsePlus[i].checked == true) {
        invoiceNo = this._responsePlus[i].vC_NO + "," + invoiceNo;
      }
    }
    evPrint.Search = invoiceNo;

    this.cgOrderService.GetEVMultipleInvoicePrint(evPrint).subscribe(res => {
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


  evMultiInvoice() {
    let clientNo = this.cytogeneticOrderData.cn
    const evPrint = new cgListMultiInvoicePrintModel();
    evPrint.clientNo = clientNo;
    evPrint.Search = "";
    if ($("#SinceDate").val().toString() != '') {
      let sinceDate = new Date($("#SinceDate").val().toString());
      evPrint.SinceDate = (sinceDate.getMonth() + 1).toString() + '/' + sinceDate.getDate().toString() + '/' + sinceDate.getFullYear().toString();
    }
    else
      evPrint.SinceDate = '';

    this.cgOrderService.GetEVMultipleInvoice(evPrint).subscribe(res => {
      this._responsePlus = res;
      let tabletotal: number = 0;
      for (let i = 0; i < this._responsePlus.length; i++) {
        tabletotal = tabletotal + parseFloat(this._responsePlus[i].uprice);
      }
      $("#tabletotal").val(tabletotal.toString());
      //this.isDisabled= false;
      // alert('calling abort');

    },
      (error) => {
        console.error('Error loading EV Multiple Invoice :', error);
      })
  }

  selectAll() {
    let tabletotal: number = 0;
    for (let i = 0; i < this._responsePlus.length; i++) {
      this._responsePlus[i].checked = true;
      tabletotal = tabletotal + parseFloat(this._responsePlus[i].uprice);
    }
    $("#tabletotal").val(tabletotal.toString());
  }

  checkChange(event: any) {
    let tabletotal: number = 0;
    for (let i = 0; i < this._responsePlus.length; i++) {
      if (this._responsePlus[i].checked == true) {
        tabletotal = tabletotal + parseFloat(this._responsePlus[i].uprice);
      }
    }
    $("#tabletotal").val(tabletotal.toString());
  }


  BindSharedTableNat() {
    this.cgOrderService.GetSharedTableNat()
      .subscribe({
        next: (res) => {
          for (var i = 0; i < res.getSharedTable.length; i++) {  // loop through the object array
            this.sharedtableNat.push(res.getSharedTable[i]);        // push each element to sys_id
          }
          this.isLoaded = false;
        },
        error: (err) => {
        }
      })
  }


  BindSpecimenstypes() {

    this.cgOrderService.GetSpecimensTypes()
      .subscribe({
        next: (res) => {
          this.isLoaded = true;
          for (var i = 0; i < res.length; i++) {  // loop through the object array
            this.specimenstypes.push(res[i]);        // push each element to sys_id
          }
          this.isLoaded = false;
          this.BindDoctor();
        },
        error: (err) => {
          console.log('error order type')
        }
      })
  }

  BindDoctor() {
    this.DoctorTableList = [];
    this.cgOrderService.GetAllDoctorFile()
      .subscribe({
        next: (res) => {
          for (var i = 0; i < res.allDoctorFile.length; i++) {  // loop through the object array
            this.DoctorTableList.push(res.allDoctorFile[i]);        // push each element to sys_id
          }
        },
        error: (err) => {
        }
      })

  }

  displayInvoice() {
    const tcodeModal = document.getElementById('exampleModalToggle') as HTMLElement;
    const myModal = new Modal(tcodeModal);
    myModal.show();
  }

  onPREnter() {
    debugger;
    this.findPR('');
    const PAT_IDEle = document.getElementById("PAT_ID") as HTMLInputElement;
    PAT_IDEle.blur();
  }


  findPR(pr) {
    const PAT_IDEle = document.getElementById("PAT_ID") as HTMLInputElement;
    if (pr != '') {
      PAT_IDEle.value = pr.paT_ID
    }

    if (PAT_IDEle.value.trim() == "?" || PAT_IDEle.value.trim() == "") {
      const PATModal = document.getElementById('PATModal') as HTMLElement;
      const myModal = new Modal(PATModal);
      myModal.show()
      return;
    }
    const formattedNum = PAT_IDEle.value.toString().padStart(10, "0");
    this.cgOrderService.GetPR(formattedNum)
      .subscribe({
        next: (res) => {
          debugger;
          if (res.getPR.length > 0) {

            this.cytogeneticOrderData.paT_ID = formattedNum;
            this.cytogeneticOrderData.paT_NAME = res.getPR[0].paT_NAME;
            this.cytogeneticOrderData.dob = res.getPR[0].sDOB;
            this.cytogeneticOrderData.age = res.getPR[0].age;
            this.cytogeneticOrderData.nationality = res.getPR[0].nationality;
            this.cytogeneticOrderData.gender = res.getPR[0].gender;
            this.cytogeneticOrderData.iqama = res.getPR[0].idnt;
            this.cytogeneticOrderData.drno = res.getPR[0].drno;
            this.cytogeneticOrderData.reF_NO = res.getPR[0].reF_NO;
            this.cytogeneticOrderData.tel = res.getPR[0].tel;
            this.cytogeneticOrderData.email = res.getPR[0].email;
            this.cytogeneticOrderData.cn = res.getPR[0].cn;

          } else {
            const PRNewModal = document.getElementById('PRNewModal') as HTMLElement;
            const myModal = new Modal(PRNewModal);
            myModal.show();
          }
        },
        error: (err) => {
          const PRNewModal = document.getElementById('PRNewModal') as HTMLElement;
          const myModal = new Modal(PRNewModal);
          myModal.show();
        }
      })
  }


  BtnPRYes() {
    const PAT_NAME = document.getElementById("PAT_NAME") as HTMLElement | null;
    PAT_NAME?.focus();
    const PRNewModal = document.getElementById('PRNewModal') as HTMLElement;
    const myModal = new Modal(PRNewModal);
    myModal.hide();
  }


  BtnPRNo() {
    const searchElement = document.getElementById("PAT_ID") as HTMLElement | null;
    searchElement?.focus();

    const BtnPRSave = document.getElementById('BtnPRSave') as HTMLElement | null;
    BtnPRSave?.setAttribute('disabled', '');

    const BtnPRNew = document.getElementById('BtnPRNew') as HTMLElement | null;
    BtnPRNew?.removeAttribute('disabled');

  }


  computeAges() {
    ///*Computer for the age*/
    var birthdate = document.getElementById("DOB") as HTMLInputElement;

    let Totalage1 = this.getAge(birthdate);

    var difference = new Date(birthdate.value);
    let timeDiff = Math.abs(Date.now() - difference.getTime());
    let Totalage = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);

    if (birthdate.value == '') {
      Totalage1 = '';
    }

    $("#Age").val(Totalage1);
    //return Totalage1;
  }

  getAge(dateString) {
    var birthdate = document.getElementById("DOB") as HTMLInputElement;
    dateString = birthdate.value;
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    var yearNow = now.getFullYear();
    var monthNow = now.getMonth();
    var dateNow = now.getDate();
    var dob = new Date(dateString.substr(0, 4),
      dateString.substring(5, 7) - 1,
      dateString.substring(8, 10)
    );

    var yearDob = dob.getFullYear();
    var monthDob = dob.getMonth();
    var dateDob = dob.getDate();
    var age: any = {};
    var ageString = "";
    var yearString = "";
    var monthString = "";
    var dayString = "";

    let yearAge = yearNow - yearDob;

    if (monthNow >= monthDob)
      var monthAge = monthNow - monthDob;
    else {
      yearAge--;
      var monthAge = 12 + monthNow - monthDob;
    }

    if (dateNow >= dateDob)
      var dateAge = dateNow - dateDob;
    else {
      monthAge--;
      var dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }

    age = {
      years: yearAge,
      months: monthAge,
      days: dateAge
    };

    if (age.years > 1) yearString = "Y";
    else yearString = "Y";
    if (age.months > 1) monthString = "M";
    else monthString = "M";
    if (age.days > 1) dayString = "D";
    else dayString = "D";


    if ((age.years > 0) && (age.months > 0) && (age.days > 0))
      ageString = age.years + yearString + " " + age.months + monthString + " " + age.days + dayString + "";
    else if ((age.years == 0) && (age.months == 0) && (age.days > 0))
      ageString = " " + age.days + dayString + "";
    else if ((age.years > 0) && (age.months == 0) && (age.days == 0))
      ageString = age.years + yearString + " ";
    else if ((age.years > 0) && (age.months > 0) && (age.days == 0))
      ageString = age.years + yearString + " " + age.months + monthString + "";
    else if ((age.years == 0) && (age.months > 0) && (age.days > 0))
      ageString = age.months + monthString + " " + age.days + dayString + "";
    else if ((age.years > 0) && (age.months == 0) && (age.days > 0))
      ageString = age.years + yearString + " " + age.days + dayString + "";
    else if ((age.years == 0) && (age.months > 0) && (age.days == 0))
      ageString = age.months + monthString + "";
    else ageString = "Oops! Could not calculate age!";

    return ageString;
  }

  onFetchAbbrevation(event: any) {
    if (event.keyCode == 27) {
      let _word = event.target.value.trim();
      let arr = [] as any;
      arr = _word.split(' ');
      let _tempWord = ''
      if (arr.length > 0) {
        _tempWord = arr[arr.length - 1]
      }
      const _codeResponse = this.mnList.filter(x => x.mncd.trim().toUpperCase() == _tempWord.toUpperCase());
      this.cytogeneticOrderData.comments = this.replaceAt(this.cytogeneticOrderData.comments, this.cytogeneticOrderData.comments.lastIndexOf(_tempWord), _codeResponse[0].mN_DESCRP);
    }
  }


  onFetchAbbrevationForCIndication(event: any) {
    if (event.keyCode == 27) {
      let _word = event.target.value.trim();
      let arr = [] as any;
      arr = _word.split(' ');
      let _tempWord = ''
      if (arr.length > 0) {
        _tempWord = arr[arr.length - 1]
      }
      const _codeResponse = this.mnList.filter(x => x.mncd.trim().toUpperCase() == _tempWord.toUpperCase());
      //alert( _codeResponse[0].mN_DESCRP);
      this.cytogeneticOrderData.clN_IND = this.replaceAt(this.cytogeneticOrderData.clN_IND, this.cytogeneticOrderData.clN_IND.lastIndexOf(_tempWord), _codeResponse[0].mN_DESCRP);
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

  getCytogeneticsLoginAR() {
    this.cgOrderService.getCytogeneticsLoginAR().subscribe(res => {
      if (res.length > 0) {
        this.cgLoginSP = res.filter(x => x.types == 2);
        this.cgLoginAR = res.filter(x => x.types == 1);
        this.cytogeneticOrderData.s_TYPE = res[0].cd;
      }
    },
      (error) => {
        console.error('Error loading CG Login AR list:', error);
      })
  }

  getCodeResponse(code: any, type: number) {
    code = code.target.value;
    const _codeResponse = this.cgLoginAR.filter(x => x.cd.trim().toUpperCase() == code.toUpperCase());
    if (_codeResponse.length > 0) {
      if (type === 1)
        this.cytogeneticOrderData.consent = _codeResponse[0].response;
      else if (type === 2)
        this.cytogeneticOrderData.color = _codeResponse[0].response;
      else if (type === 3)
        this.cytogeneticOrderData.pac = _codeResponse[0].response;
      else if (type === 4)
        this.cytogeneticOrderData.cntr = _codeResponse[0].response;
      else if (type === 5)
        this.cytogeneticOrderData.intgrty = _codeResponse[0].response;
    }
  }

  getRoleBasedPermission() {
    this.rolebaseaction = this._permissionService.getRoleBaseAccessOnAction(Cytogenetics_Order);
  }
  
}
