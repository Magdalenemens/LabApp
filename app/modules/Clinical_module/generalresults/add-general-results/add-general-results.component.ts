import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { BAD_REQUEST_ERROR_MESSAGE, alertThreeDigits, deleteMessage, successMessage, updateSuccessMessage, warningMessage, cancelRequest, collectedRequest, errorMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { GeneralResulService } from './add-general-results.service';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { ready, trim } from 'jquery';
import { Modal } from 'bootstrap';
import { OrderentrynewService } from 'src/app/modules/orderprocessing/orderentrynew/add-orderentrynew/orderentrynew.service';
import { MultiSearchService } from 'src/app/services/multi-search.service';
import { roleBaseAction } from 'src/app/models/roleBaseAction';


@Component({
  selector: 'app-add-general-results',
  templateUrl: './add-general-results.component.html',
  styleUrls: ['./add-general-results.component.scss']
})
export class AddGeneralResultsComponent {
  data: any;
  editor = new Editor();
  editor2 = new Editor();
  ckEditorData: string = '';
  toolbar: Toolbar = [

  ];
  toolbar2: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'], // Basic text formatting
    ['code', 'blockquote'], // Code block and blockquote
    ['ordered_list', 'bullet_list'], // Ordered and unordered lists
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }], // Headings
    ['link', 'image'], // Insert link and image
    ['align_left', 'align_center', 'align_right', 'align_justify'], // Text alignment
  ];
  EntryForm: FormGroup;
  rolebaseaction: roleBaseAction = new roleBaseAction();
  public ARFlist: any[] = [];
  public ARFTablelist: any[] = [];
  public ARFTable: any[] = [];
  public ARFInterp: any[] = [];
  counter: number = 0;
  GenLabARData: any;
  interp: any;
  notes: any;
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';

  selectedSite: string = "";
  selectedrefSite: string = "";
  selectedUserId: string = "";

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

  isRSEnable: boolean = true;
  isVREnable: boolean = true;
  isVDEnable: boolean = true;
  isRDEnable: boolean = true;
  isRSAmendEnable: boolean = true;
  toDate: string;
  fromDate: string;
  PAT_ID: any = '';
  ORD_NO: any = '';
  GTNO: any = '';
  REQ_CODE: any = '';
  constructor(private fb: FormBuilder, private genLabService: GeneralResulService,
    private router: Router, private _commonService: CommonService, private orderentryService: OrderentrynewService, private multiSearchService: MultiSearchService) {

    this.EntryForm = this.fb.group({
      editorInterp: [''],
      OrderNumber: [''],
      AccessionNumber: [''],
      CollectionDate: [''],
      editorNotes: ['']
    })

  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    $('#btnaddresults').addClass("is-active");
    this.BindAccnActiveResultsFile();

    this.selectedSite = localStorage.getItem("selectedSite")
    this.selectedrefSite = localStorage.getItem("refSite")
    this.selectedUserId = localStorage.getItem("userId")
    this.editor = new Editor();
    const today = new Date();
    this.toDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD' format

    // Get the date 2 months ago
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    this.fromDate = twoMonthsAgo.toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Clinical_GeneralLab, this.startTime, this.endTime);
    this.editor.destroy();
  }
  async GetMultipleSearch() {
    this.multupleSearchList = await this.multiSearchService.GetMultipleSearchService('GL');
  }
  async GetMultipleSearchOrders(PAT_ID: any) {
    this.NewPatId = PAT_ID;
    this.multupleSearchOrdersList = [];
    this.multupleSearchOrdersList = await this.multiSearchService.GetMultipleSearchOrders(PAT_ID);
  }
  BindAccnActiveResultsFile() {
    this.genLabService.GetAllAccnActiveResultsFile()
      .subscribe({
        next: (res) => {
          for (var i = 0; i < res.getAllAccnARF.length; i++) {  // loop through the object array
            this.ARFlist.push(res.getAllAccnARF[i]);        // push each element to sys_id
          }
          this.onLast();
        }
      })
  }

  BindActiveResultsFileList(ACCN: any) {
    var searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
    if (ACCN == '')
      ACCN = searchOrder.value;
    this.ARFTablelist = [];
    this.genLabService.GetAccnActiveResultsFileList(ACCN == '' ? 'PAJIRI' : ACCN)
      .subscribe({
        next: (res) => {
          for (var i = 0; i < res.getAccnARFList.length; i++) {  // loop through the object array
            this.ARFTablelist.push(res.getAccnARFList[i]);        // push each element to sys_id
          }
          let temp = res.getAccnARFList[0].drawN_DTTM;
          let date = new Date(temp);
          this.EntryForm.patchValue({ OrderNumber: res.getAccnARFList[0].orD_NO });
          this.EntryForm.patchValue({ AccessionNumber: res.getAccnARFList[0].accn });
          this.EntryForm.patchValue({ CollectionDate: date.toISOString().slice(0, 10) });
          //this.EntryForm.patchValue({ editorInterp: res.getAccnARFList[0].interp });
          const preInterp = document.getElementById("preInterp") as HTMLParagraphElement | null;
          preInterp.innerHTML = res.getAccnARFList[0].interp;

          this.notes = res.getAccnARFList[0].notes;
          //this.SearchOrderTrans(this.ARFTablelist[0].paT_ID, this.ARFTablelist[0].orD_NO);

          const hiddenARF_ID = document.getElementById("hiddenARF_ID") as HTMLInputElement | null;
          hiddenARF_ID.value = res.getAccnARFList[0].arF_ID;


          //this.IsButtonDisabled(res.getAccnARFList[0].r_STS);
          /*
                    if (res.getAccnARFList[0].r_STS == 'RS') {
                      this.isRSEnable = true; this.isVREnable = false;
                      this.isVDEnable = true; this.isRDEnable = true;
                    } else if (res.getAccnARFList[0].r_STS == 'VR') {
                      this.isRSEnable = true; this.isVREnable = true;
                      this.isVDEnable = false; this.isRDEnable = true;
                    } else if (res.getAccnARFList[0].r_STS == 'VD') {
                      this.isRSEnable = true; this.isVREnable = true;
                      this.isVDEnable = true; this.isRDEnable = false;
                    } else if (res.getAccnARFList[0].r_STS == 'RD') {
                      this.isRSEnable = true; this.isVREnable = true;
                      this.isVDEnable = true; this.isRDEnable = true;
                    }else{
                      this.isRSEnable = false; this.isVREnable = true;
                      this.isVDEnable = true; this.isRDEnable = true;
                    }
          */
        }
      })
  }

  // IsButtonDisabled(RSTS) {
  //   if (RSTS == 'RS') {
  //     this.isRSEnable = true; this.isVREnable = false;
  //     this.isVDEnable = true; this.isRDEnable = true;
  //     this.isRSAmendEnable = true;
  //   } else if (RSTS == 'VR') {
  //     this.isRSEnable = true; this.isVREnable = true;
  //     this.isVDEnable = false; this.isRDEnable = true;
  //     this.isRSAmendEnable = false;
  //   } else if (RSTS == 'VD') {
  //     this.isRSEnable = true; this.isVREnable = true;
  //     this.isVDEnable = true; this.isRDEnable = false;
  //     this.isRSAmendEnable = false;
  //   } else if (RSTS == 'RD') {
  //     this.isRSEnable = true; this.isVREnable = true;
  //     this.isVDEnable = true; this.isRDEnable = true;
  //     this.isRSAmendEnable = false;
  //   } else {
  //     this.isRSEnable = false; this.isVREnable = true;
  //     this.isVDEnable = true; this.isRDEnable = true;
  //   }
  // }

  onFocusInterp(event: any) {
    //alert(this.ARFTablelist[event.target.id - 1].tcode);

    //this.EntryForm.patchValue({editorInterp: this.ARFTablelist[event.target.id - 1].interp });
    const preInterp = document.getElementById("preInterp") as HTMLParagraphElement | null;
    preInterp.innerHTML = this.ARFTablelist[event.target.id - 1].interp;


    var ACCN = this.ARFTablelist[0].accn;
    const hiddenARF_ID = document.getElementById("hiddenARF_ID") as HTMLInputElement | null;
    hiddenARF_ID.value = this.ARFTablelist[event.target.id - 1].arF_ID;

    this.notes = this.ARFTablelist[event.target.id - 1].notes;

    // this.IsButtonDisabled(this.ARFTablelist[event.target.id - 1].r_STS);

    //console.log(ACCN + "  " + hiddenARF_ID.value + '  '  + this.notes.replace(/<\/?[^>]+(>|$)/g, ' '));

    /*
        this.genLabService.GetAccnActiveResultsFileInterp(this.ARFTablelist[event.target.id - 1].accn, this.ARFTablelist[event.target.id - 1].tcode)
          .subscribe({
            next: (res) => {
              this.EntryForm.patchValue({ editorInterp: res.getAccnARFList[0].interp });
              const preInterp = document.getElementById("preInterp") as HTMLParagraphElement | null;
              preInterp.innerHTML = res.getAccnARFList[0].interp;
              return;
            },
            error: (err) => {
              console.log('Interp not found')
            }
          })
    
        return;
        */
  }

  // SearchOrderTrans(PAT_ID: any, ORD_NO: any) {

  //   const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;

  //   if (searchOrder.value) {
  //     this.genLabService.GetOrderDetailsByPatIdOrdNo(PAT_ID, ORD_NO)
  //       .subscribe({
  //         next: (res) => {

  //           ////console.log(res);

  //           const PAT_ID = document.getElementById("PAT_ID") as HTMLInputElement | null;
  //           const PAT_NAME = document.getElementById("PAT_NAME") as HTMLInputElement | null;
  //           const CN = document.getElementById("CN") as HTMLInputElement | null;
  //           const client = document.getElementById("client") as HTMLInputElement | null;

  //           const SEX = document.getElementById("SEX") as HTMLInputElement | null;
  //           const DOB = document.getElementById("DOB") as HTMLInputElement | null;
  //           //const SAUDI = document.getElementById("SAUDI") as HTMLInputElement | null;
  //           //const IDNT = document.getElementById("IDNT") as HTMLInputElement | null;
  //           //const LOC = document.getElementById("LOC") as HTMLInputElement | null;
  //           const descrp = document.getElementById("descrp") as HTMLInputElement | null;
  //           const DRNO = document.getElementById("DRNO") as HTMLInputElement | null;
  //           const doctor = document.getElementById("doctor") as HTMLInputElement | null;

  //           const REF_NO = document.getElementById("REF_NO") as HTMLInputElement | null;
  //           //const TEL = document.getElementById("TEL") as HTMLInputElement | null;
  //           //const cmbSalesmen = document.getElementById("cmbSalesmen") as HTMLInputElement | null;
  //           //const EMAIL = document.getElementById("EMAIL") as HTMLInputElement | null;
  //           //const cmbOrdertype = document.getElementById("cmbOrdertype") as HTMLInputElement | null;
  //           //const Req = document.getElementById("Req") as HTMLInputElement | null;


  //           PAT_ID.innerText = res.geT_v_ORD_TRANS.paT_ID;
  //           PAT_NAME.innerText = res.geT_v_ORD_TRANS.paT_NAME;
  //           CN.innerText = res.geT_v_ORD_TRANS.cn;
  //           client.innerText = res.geT_v_ORD_TRANS.client;
  //           SEX.innerText = res.geT_v_ORD_TRANS.sex;
  //           let temp = res.geT_v_ORD_TRANS.dob;
  //           let date = new Date(temp);
  //           DOB.innerText = date.toISOString().slice(0, 10);//res.geT_v_ORD_TRANS.dob.substring(0, 10);

  //           //SAUDI.innerText = res.geT_v_ORD_TRANS.saudi;
  //           //IDNT.value = res.geT_v_ORD_TRANS.idnt;
  //           //LOC.value = res.geT_v_ORD_TRANS.loc;
  //           descrp.innerText = res.geT_v_ORD_TRANS.descrp;
  //           DRNO.innerText = res.geT_v_ORD_TRANS.drno;
  //           doctor.innerText = res.geT_v_ORD_TRANS.doctor;

  //           REF_NO.innerText = res.geT_v_ORD_TRANS.reF_NO;
  //           //TEL.value = res.geT_v_ORD_TRANS.tel;
  //           ////cmbSalesmen.value = res.geT_v_ORD_TRANS.loc;
  //           //EMAIL.value = res.geT_v_ORD_TRANS.email;
  //           ////cmbOrdertype.value = res.geT_v_ORD_TRANS.drno;
  //           ////Req.innerText = res.geT_v_ORD_TRANS.doctor;

  //           /**/

  //           //this.OrderEntryForm.patchValue({ DOB: res.geT_v_ORD_TRANS.dob });
  //           //this.OrderEntryForm.patchValue({ SAUDI: res.geT_v_ORD_TRANS.saudi });
  //           //this.OrderEntryForm.patchValue({ IDNT: res.geT_v_ORD_TRANS.idnt });
  //           //this.OrderEntryForm.patchValue({ DRNO: res.geT_v_ORD_TRANS.drno });
  //           //this.OrderEntryForm.patchValue({ REF_NO: res.geT_v_ORD_TRANS.reF_NO });
  //           //this.OrderEntryForm.patchValue({ TEL: res.geT_v_ORD_TRANS.tel });
  //           //this.OrderEntryForm.patchValue({ EMAIL: res.geT_v_ORD_TRANS.email });
  //           //this.OrderEntryForm.patchValue({ CN: res.geT_v_ORD_TRANS.cn });
  //           //this.OrderEntryForm.patchValue({ LOC: res.geT_v_ORD_TRANS.loc });

  //           //this.OrderEntryForm.patchValue({ ORD_NO: res.geT_v_ORD_TRANS.orD_NO });

  //           //this.OrderEntryForm.patchValue({ CLN_IND: res.geT_v_ORD_TRANS.clN_IND });

  //           //this.OrderEntryForm.patchValue({ SITE_NO: res.geT_v_ORD_TRANS.sitE_NO });
  //           //this.OrderEntryForm.value.ORD_NO = res.geT_v_ORD_TRANS.orD_NO;

  //           //this.PAT_ID = res.geT_v_ORD_TRANS.paT_ID;
  //           //this.ORD_NO = res.geT_v_ORD_TRANS.orD_NO;

  //           //this.btnDisabled = false;

  //           //const BtnPRNew = document.getElementById('BtnPRNew') as HTMLElement | null;
  //           //BtnPRNew?.setAttribute('disabled', '');

  //           const BtnPRSave = document.getElementById('BtnPRSave') as HTMLElement | null;
  //           BtnPRSave?.setAttribute('disabled', '');

  //           const BtnPRNew = document.getElementById('BtnPRNew') as HTMLElement | null;
  //           BtnPRNew?.removeAttribute('disabled');


  //           const BtnAdd = document.getElementById('BtnAdd') as HTMLElement | null;
  //           BtnAdd?.setAttribute('disabled', '');

  //           const BtnCancel = document.getElementById('BtnCancel') as HTMLElement | null;
  //           BtnCancel?.setAttribute('disabled', '');

  //         },
  //         error: (err) => {
  //           alert(err?.error.message);
  //         }
  //       })
  //   }
  // }

  GetARValue(event: any) {
    let code = event.target.value.toUpperCase().trim();

    //console.log(code)
    //this.EntryForm.patchValue({ editorInterp: '' });

    //console.log(this.ARFTablelist[event.target.id - 1].rstp);
    //console.log(parseFloat(code) + '>' + parseFloat(this.ARFTablelist[event.target.id - 1].reF_HIGH));
    //console.log(parseFloat(code) + '<' + parseFloat(this.ARFTablelist[event.target.id - 1].reF_LOW));

    if (this.ARFTablelist[event.target.id - 1].rstp == 'N' && code != '') {
      if (parseFloat(code) > parseFloat(this.ARFTablelist[event.target.id - 1].reF_HIGH)) {
        this.ARFTablelist[event.target.id - 1].lhf = 'H';
      } else if (parseFloat(code) < parseFloat(this.ARFTablelist[event.target.id - 1].reF_LOW)) {
        this.ARFTablelist[event.target.id - 1].lhf = 'L';
      } else {
        this.ARFTablelist[event.target.id - 1].lhf = ' ';
      }
    } else if (this.ARFTablelist[event.target.id - 1].rstp == 'A' && code != '') {

      this.genLabService.GetAlphaResponsesByCD(code)
        .subscribe({
          next: (res) => {
            this.ARFTablelist[event.target.id - 1].result = res.response;
            return;
          },
          error: (err) => {
            console.log('Not found Alpha Response')
          }
        })

    } else if (this.ARFTablelist[event.target.id - 1].rstp == 'I' && code != '') {

      const myArr = [code];
      var regdex = /\D+/g;
      //var regdex=/\d+(?:\.\d*)?/;
      let filtered = myArr[0].replace(regdex, ' ').trim().split(' ').map(e => (e));

      if (filtered.length > 1) {
        code = filtered[0] + '.' + filtered[1];
      } else if (filtered.length = 1) {
        code = filtered[0]
      }
      //console.log(filtered);
      let Acode = code

      let isNum = isNaN(code);
      //console.log(isNum + "  -  " + code);


      if (isNum == true || code == '') {
        return;
      }

      this.genLabService.GetInterpretiveValuesByCode(this.ARFTablelist[event.target.id - 1].tcode, this.ARFTablelist[event.target.id - 1].sex, code)
        .subscribe({
          next: (res) => {
            if (res == null) {
              return;
            }
            //console.log((this.ARFTablelist[event.target.id - 1]).tcode);

            //if ((this.ARFTablelist[event.target.id - 1]).tcode = 'FER') { }


            this.ARFTablelist[event.target.id - 1].result = '( ' + Acode + ' ) ' + res.response;

            if (res.abn == 'Y')
              this.ARFTablelist[event.target.id - 1].lhf = '*';
            else
              this.ARFTablelist[event.target.id - 1].lhf = ' ';


            return;
          },
          error: (err) => {
            console.log('Not found Alpha Response')
          }
        })

    } else if (this.ARFTablelist[event.target.id - 1].rstp == 'R' && code != '') {
      this.genLabService.GetAlphaValuesByCode(this.ARFTablelist[event.target.id - 1].tcode, code)
        .subscribe({
          next: (res) => {
            this.ARFTablelist[event.target.id - 1].result = res.response;
            if (res.abn == 'Y')
              this.ARFTablelist[event.target.id - 1].lhf = '*';
            else
              this.ARFTablelist[event.target.id - 1].lhf = ' ';
            return;
          },
          error: (err) => {
            console.log('Not found Alpha Response')
          }
        })

    }
  }


  onFirst() {
    this.counter = 0;
    //console.log(this.counter + " = " + this.ARFlist[this.counter].accn);
    const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
    searchOrder.value = this.ARFlist[this.counter].accn;
    this.BindActiveResultsFileList(this.ARFlist[this.counter].accn);
    //this.SearchOrderTrans(this.ARFlist[this.counter].paT_ID, this.ARFlist[this.counter].orD_NO);
    const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
    BtnFirst?.setAttribute('disabled', '');
    const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
    BtnPrevious?.setAttribute('disabled', '');
    const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
    BtnNext?.removeAttribute('disabled');
    const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
    BtnLast?.removeAttribute('disabled');
    //this.clearOrderEntryTest();
    //this.diabledOrderPatientInformations();
  }
  onPrevious() {
    if (this.counter > 0) {
      --this.counter;
      //console.log(this.counter + " = " + this.ARFlist[this.counter].accn);
      const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
      searchOrder.value = this.ARFlist[this.counter].accn;
      this.BindActiveResultsFileList(this.ARFlist[this.counter].accn);
      //this.SearchOrderTrans(this.ARFlist[this.counter].paT_ID, this.ARFlist[this.counter].orD_NO);
      const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
      BtnNext?.removeAttribute('disabled');
      const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
      BtnLast?.removeAttribute('disabled');

      const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
      BtnFirst?.removeAttribute('disabled');
      const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
      BtnPrevious?.removeAttribute('disabled');
      //this.clearOrderEntryTest();
      //this.diabledOrderPatientInformations();
    } else {
      const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
      BtnFirst?.setAttribute('disabled', '');
      const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
      BtnPrevious?.setAttribute('disabled', '');
      const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
      BtnNext?.removeAttribute('disabled');
      const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
      BtnLast?.removeAttribute('disabled');
      //this.clearOrderEntryTest();
      //this.diabledOrderPatientInformations();
    }
  }
  onNext() {
    if (this.counter < this.ARFlist.length - 1) {
      ++this.counter;
      //console.log(this.counter + " = " + this.ARFlist[this.counter].accn);
      const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
      searchOrder.value = this.ARFlist[this.counter].accn;
      this.BindActiveResultsFileList(this.ARFlist[this.counter].accn);
      //this.SearchOrderTrans(this.ARFlist[this.counter].paT_ID, this.ARFlist[this.counter].orD_NO);
      const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
      BtnNext?.removeAttribute('disabled');
      const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
      BtnLast?.removeAttribute('disabled');

      const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
      BtnFirst?.removeAttribute('disabled');
      const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
      BtnPrevious?.removeAttribute('disabled');
      //this.clearOrderEntryTest();
      //this.diabledOrderPatientInformations();
    } else {
      const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
      BtnNext?.setAttribute('disabled', '');
      const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
      BtnLast?.setAttribute('disabled', '');

      const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
      BtnFirst?.removeAttribute('disabled');
      const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
      BtnPrevious?.removeAttribute('disabled');
      //this.clearOrderEntryTest();
      //this.diabledOrderPatientInformations();
    }
  }
  onLast() {
    this.counter = this.ARFlist.length - 1;
    //console.log(this.counter + " = " + this.ARFlist[this.counter].accn);
    const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
    searchOrder.value = this.ARFlist[this.counter].accn;
    this.BindActiveResultsFileList(this.ARFlist[this.counter].accn);
    //this.SearchOrderTrans(this.ARFlist[this.counter].paT_ID, this.ARFlist[this.counter].orD_NO);
    const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
    BtnNext?.setAttribute('disabled', '');
    const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
    BtnLast?.setAttribute('disabled', '');

    const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
    BtnFirst?.removeAttribute('disabled');
    const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
    BtnPrevious?.removeAttribute('disabled');
    //this.clearOrderEntryTest();
    //this.diabledOrderPatientInformations();
    //this.selectBoolenValue = true;
  }


  btnSave(r_stat) {

    const inpACCN = document.getElementById("searchOrder") as HTMLInputElement;

    var tbl = document.getElementById("tableARFList") as HTMLTableElement;
    var rCount = tbl.rows.length;
    //console.log(rCount);
    this.ARFTable = [];
    for (var i = 1; i < tbl.rows.length; i++) {

      //console.log(tbl.rows[i].cells[3].getElementsByTagName("input")[0].value);// = tbl.rows[1].cells[3].getElementsByTagName("input")[0].value;

      var ARF_ID = this.ARFTablelist[i - 1].arF_ID;
      var STS = this.ARFTablelist[i - 1].sts;
      var RESULT = tbl.rows[i].cells[3].getElementsByTagName("input")[0].value;
      var ACCN = this.ARFTablelist[i - 1].accn;
      var REQ_CODE = this.ARFTablelist[i - 1].tcode;// this.ARFTablelist[i - 1].reQ_CODE;
      var ORD_NO = this.ARFTablelist[i - 1].orD_NO;
      var LHF = this.ARFTablelist[i - 1].lhf;
      var PAT_ID = this.ARFTablelist[i - 1].paT_ID;
      if (this.ARFTablelist[i - 1].rstp == 'N') {
        if (parseFloat(RESULT) > parseFloat(this.ARFTablelist[i - 1].reF_HIGH)) {
          LHF = 'H';
        } else if (parseFloat(RESULT) < parseFloat(this.ARFTablelist[i - 1].reF_LOW)) {
          LHF = 'L';
        } else {
          LHF = ' ';
        }
      } else {
        LHF = ' ';
      }

      //console.log(r_stat + " - "+ this.ARFTablelist[i - 1].r_STS);

      if (RESULT != '' && r_stat == 'RS'
        && this.ARFTablelist[i - 1].r_STS != 'VR'
        && this.ARFTablelist[i - 1].r_STS != 'VD'
        && this.ARFTablelist[i - 1].r_STS != 'RD') {
        this.ARFTable.push({
          ARF_ID: ARF_ID,
          STS: STS,
          RESULT: RESULT,
          ACCN: ACCN,
          REQ_CODE: REQ_CODE,
          ORD_NO: ORD_NO,
          LHF: LHF,
          R_ID: this.selectedUserId,
          R_STS: r_stat
        })

      } else if (RESULT != '' && r_stat == 'VR'
        && this.ARFTablelist[i - 1].r_STS == 'RS'
        && this.ARFTablelist[i - 1].r_STS != 'VD'
        && this.ARFTablelist[i - 1].r_STS != 'RD') {
        this.ARFTable.push({
          ARF_ID: ARF_ID,
          STS: STS,
          RESULT: RESULT,
          ACCN: ACCN,
          REQ_CODE: REQ_CODE,
          ORD_NO: ORD_NO,
          LHF: LHF,
          R_ID: this.selectedUserId,
          R_STS: r_stat
        })

      } else if (RESULT != '' && r_stat == 'VD'
        && this.ARFTablelist[i - 1].r_STS == 'VR'
        && this.ARFTablelist[i - 1].r_STS != 'RS'
        && this.ARFTablelist[i - 1].r_STS != 'RD'
      ) {
        this.ARFTable.push({
          ARF_ID: ARF_ID,
          STS: STS,
          RESULT: RESULT,
          ACCN: ACCN,
          REQ_CODE: REQ_CODE,
          ORD_NO: ORD_NO,
          LHF: LHF,
          R_ID: this.selectedUserId,
          R_STS: r_stat
        })

      } else if (RESULT != '' && r_stat == 'RD'
        && this.ARFTablelist[i - 1].r_STS != 'VR'
        && this.ARFTablelist[i - 1].r_STS == 'VD'
        && this.ARFTablelist[i - 1].r_STS != 'RS'
      ) {
        this.ARFTable.push({
          ARF_ID: ARF_ID,
          STS: STS,
          RESULT: RESULT,
          ACCN: ACCN,
          REQ_CODE: REQ_CODE,
          ORD_NO: ORD_NO,
          LHF: LHF,
          R_ID: this.selectedUserId,
          R_STS: r_stat
        })

      } else if (RESULT != '' && r_stat == 'RSA'
        && this.ARFTablelist[i - 1].r_STS != 'RS'
        && (this.ARFTablelist[i - 1].r_STS == 'VR'
          || this.ARFTablelist[i - 1].r_STS == 'VD'
          || this.ARFTablelist[i - 1].r_STS == 'RD')) {
        this.ARFTable.push({
          ARF_ID: ARF_ID,
          STS: STS,
          RESULT: RESULT,
          ACCN: ACCN,
          REQ_CODE: REQ_CODE,
          ORD_NO: ORD_NO,
          LHF: LHF,
          R_ID: this.selectedUserId,
          R_STS: r_stat,
          PAT_ID: PAT_ID
        })

      } else if (RESULT != ''
        && this.ARFTablelist[i - 1].r_STS != 'RS'
        && this.ARFTablelist[i - 1].r_STS != 'VR'
        && this.ARFTablelist[i - 1].r_STS != 'VD'
        && this.ARFTablelist[i - 1].r_STS != 'RS') {
        this.ARFTable.push({
          ARF_ID: ARF_ID,
          STS: STS,
          RESULT: RESULT,
          ACCN: ACCN,
          REQ_CODE: REQ_CODE,
          ORD_NO: ORD_NO,
          LHF: LHF,
          R_ID: this.selectedUserId,
          R_STS: r_stat
        })

      }

    }
    //console.log(parseFloat(RESULT) + '>' + parseFloat(this.ARFTablelist[i - 1].reF_HIGH));
    //console.log(parseFloat(RESULT) + '<' + parseFloat(this.ARFTablelist[i - 1].reF_LOW));
    //alert(this.ARFTable.length + "  PAJIRI");
    if (this.ARFTable.length == 0) {
      Swal.fire({
        title: 'Please check the result ore refresh the pages',
        text: 'Please check the result ore refresh the pages',
        icon: 'info'
      })
      return;
    }
    //console.log(this.ARFTable);
    //return;
    this.genLabService.UpdateActiveResultsFileGenLab(this.ARFTable, 'inpACCN.value', 'REQ_CODE', 'LHF', 0, 'ORD_NO', 'RESULT')
      .subscribe({
        next: (res) => {
          if (res == 1) {
            this.UpdateFootNoted();
            Swal.fire({
              title: successMessage,
              text: successMessage,
              icon: 'success',
              showConfirmButton: true,
              customClass: {
                confirmButton: 'btn btn-primary btn-lg mr-2',
                cancelButton: 'btn btn-danger btn-lg',
                loader: 'custom-loader',
              },
              loaderHtml: '<div class="spinner-border text-primary"></div>',
              preConfirm: () => {
                Swal.showLoading()
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(true)
                    this.BindActiveResultsFileList('');
                  }, 1000)
                })
              },
            })
          } else {
            Swal.fire({
              title: errorMessage,
              text: errorMessage,
              icon: 'error'
            })
          }
        },
        error: (err) => {
          Swal.fire({
            title: err.message,
            text: errorMessage,
            icon: 'error'
          })
        }
      })




    //this.BindActiveResultsFileList('');
  }

  btnEdit(event) {
    this.interp = event.interp;
    this.notes = event.notes;
    const hiddenARF_ID = document.getElementById("hiddenARF_ID") as HTMLInputElement | null;
    hiddenARF_ID.value = event.arF_ID;
    // console.log(event.interp);
    // console.log(event.notes);
  }

  UpdateFootNoted() {

    var ACCN = this.ARFTablelist[0].accn;
    const hiddenARF_ID = document.getElementById("hiddenARF_ID") as HTMLInputElement | null;
    const editorNotes = document.getElementById("editorNotes") as HTMLInputElement | null;
    //console.log(ACCN + "  " + hiddenARF_ID.value + '  ' + editorNotes + '  ' + this.notes.replace(/<\/?[^>]+(>|$)/g, ' '));
    if (this.notes?.trim() == '')
      this.notes = '&nbsp;';
    this.genLabService.UpdateNotesActiveResultsFileGenLab(hiddenARF_ID.value, ACCN, this.notes.replace(/<\/?[^>]+(>|$)/g, '&nbsp;'))
      .subscribe({
        next: (res) => {
          if (res == 1) {
            /*
            Swal.fire({
              title: successMessage,
              text: successMessage,
              icon: 'success',
              showConfirmButton: true,
              customClass: {
                confirmButton: 'btn btn-primary btn-lg mr-2',
                cancelButton: 'btn btn-danger btn-lg',
                loader: 'custom-loader',
              },
              loaderHtml: '<div class="spinner-border text-primary"></div>',
              preConfirm: () => {
                Swal.showLoading()
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(true)
                    this.BindActiveResultsFileList('');
                    hiddenARF_ID.value = '';
                  }, 1000)
                })
              },
            })
           */
          } else {
            Swal.fire({
              title: errorMessage,
              text: errorMessage,
              icon: 'error'
            })
          }
        },
        error: (err) => {
          Swal.fire({
            title: err.message,
            text: errorMessage,
            icon: 'error'
          })
        }
      })

  }

  computeAges() {
    ///*Computer for the age*/
    var birthdate = document.getElementById("DOB") as HTMLInputElement;
    var age = document.getElementById("Age") as HTMLInputElement;

    let Totalage1 = this.getAge(birthdate);

    //console.log(Totalage1 + "  " + birthdate.value);

    var difference = new Date(birthdate.value);
    let timeDiff = Math.abs(Date.now() - difference.getTime());
    let Totalage = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);

    if (birthdate.value == '') {
      Totalage1 = '';
    }
    //console.log(Totalage1);
    age.innerText = Totalage1;
    return Totalage1;
  }
  getAge(dateString) {

    var birthdate = document.getElementById("DOB") as HTMLInputElement;

    dateString = birthdate.innerText;

    //console.log(dateString.substr(0, 10));

    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    var yearNow = now.getFullYear();
    var monthNow = now.getMonth();
    var dateNow = now.getDate();

    //1985-09-24
    //console.log(dateString.substr(0, 4) + "/" + dateString.substring(5, 7) + "/" + dateString.substring(8, 10));
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
            this.EntryForm.value.LN = i.toString();
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
    let resultObj: any = await this.multiSearchService.SearchOrderTransService(this.EntryForm, this.BindATRTable);
    this.EntryForm = resultObj.form;
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
      this.EntryForm.value.PAT_ID = paT_ID;
    }
  }
}
