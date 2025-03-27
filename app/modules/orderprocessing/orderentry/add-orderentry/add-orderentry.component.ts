/// <reference path="../../../../../assets/js/jquery-barcode.js" />
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { successMessage, cancelRequest, collectedRequest, errorMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { mbListQRModel } from 'src/app/models/microbiologyListModel';
import { Modal } from 'bootstrap';
import { cleanData, error } from 'jquery';
import { OrderentryService } from './orderentry.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { retryWhen } from 'rxjs';

@Component({
  selector: 'app-add-orderentry',
  //standalone: true,
  //imports: [],
  templateUrl: './add-orderentry.component.html',
  styleUrls: ['./add-orderentry.component.scss']
})
export class AddOrderentryComponent implements OnInit {
  public PRTable: any[] = [];
  public barcode: any[] = [];
  public td_gt: any[] = [];
  public salesmen: any[] = [];
  public cancelreason: any[] = [];
  public specimenstypes: any[] = [];
  public OrderDetailsTable = [];
  public ord_dtl_list = [];
  public ordertype: any[] = [];
  public ATRTable: any[] = [];
  public orderTransactionlist: any[] = [];
  public sitedetailslist: any[] = [];
  public collectionOrderlist: any[] = [];

  public ClientTableList: any[] = [];
  public LocationTableList: any[] = [];
  public DoctorTableList: any[] = [];

  public multupleSearchList: any[] = [];
  public multupleSearchOrdersList: any[] = [];

  public orderTrackingList: any[] = [];
  public sharedtableNat: any[] = [];


  OrderEntryForm!: FormGroup;
  isvalidated: boolean = false;
  wasvalidated: string = "";
  currentFormControlName: string = "";
  initialValueForm!: FormGroup;
  isLoaded = false;

  selectBoolenValue: boolean = true;

  counter: number = 0;
  rows = [1];
  btnDisabled: boolean = true;

  ATRNotes: any;
  selectedSite: string = "";
  selectedrefSite: string = "";
  selectedUserId: string = "";
  currentdatetime: any = new Date().toISOString().slice(0, 16);

  @ViewChild(NgSelectComponent) NgSelectComponent: NgSelectComponent;
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';
  imageSource;
  resbarcode: any;
  resQRCode: any;
  ListQRModel: mbListQRModel;
  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50];
  //Search
  filteredList: any[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;
  scmid: string = '';
  otpid: string = '';
  natid: string = '';
  constructor(private fb: FormBuilder, private orderentryService: OrderentryService,
    private router: Router, private elRef: ElementRef,
    private _commonService: CommonService) {
    this.OrderEntryForm = this.fb.group({
      PAT_ID: [''],
      PAT_NAME: [''],
      SEX: [''],//new FormControl({ value: '', disabled: true }),
      DOB: [Date],
      Age: [Number],
      //DOB: [{ value: moment(this.today).valueOf() }, [Validators.required]],
      //DOB: [this.today.toISOString(), [Validators.required]],
      SAUDI: [''],
      IDNT: [''],
      DRNO: [''],
      //doctor: '',
      REF_NO: [''],
      TEL: [''],
      EMAIL: [''],
      CN: [''],
      client: '',
      LOC: [''],
      //descrp: '',
      cmbSalesmen: new FormControl(this.salesmen[0]),
      cmbOrdertype: new FormControl(this.ordertype[0]),
      cmbCancelReason: new FormControl(this.cancelreason[0]),
      UPRICE: [0.0],
      TCODE: '',
      REQ_CODE: '',
      PRFX: '',
      TD_ID: [0],
      GT_ID: [0],
      //FULL_NAME:''
      //Ord_Trns-----------
      ORD_NO: '',
      SITE_NO: '',
      SPECIMEN: '',
      cmbSpecimenstypes: '',// new FormControl(this.specimenstypes[0]),
      COL_DATE_TIME: [Date],
      STS: '',
      DT: '',
      DSCNT: [0.0],
      DPRICE: [0.0],
      FULL_NAME: '',
      ACCN: '',
      ST: '',
      //ORD_TRNS_ID: '',
      REQ_DTTM: new Date(),
      DRAWN_DTTM: new Date(),
      LAST_UPDT: new Date(),
      TRNS_DTTM: new Date(),
      RCVD_DTTM: new Date(),
      VER_DTTM: new Date(),
      CASH: '',
      TOTDSCNT: [0.0],
      TOT_VALUE: [0.0],
      DSCAMNT: [0.0],
      NET_VALUE: [0.0],
      PAID: [0.0],
      RMNG: [0.0],
      VAT: [0.0],
      GRAND_VAL: [0.0],
      EXTRDSCT: [0.0],

      //ATR-------------------------------
      //ATR_ID:''
      LN: '',
      GTNO: '',
      TEST_ID: '',
      DTNO: '',
      CT: '',
      B_NO: '',
      //S_TYPE: '',
      //SP_SITE: '',
      //NO_SLD: '',
      //PRTY: '',
      //RS: '',
      // O_ID: '',
      RUN_NO: '',
      //CNLD: '',
      SF: '',
      LF: Boolean,
      RN: '',
      //RPT_NO: '',
      //NOTES: '',
      DSCNTG: '',
      BPRICE: [0.0],
      KP: '',
      MDF: '',

      //ORDER DETAILS--------------------
      //ORD_DTL_ID: '',
      ORD_CODE: '',
      O_ID: '',
      TRNS_ID: '',
      RCVD_ID: '',
      PRCVD_DTTM: [],
      PRCVD_ID: '',
      RSLD: '',
      VLDT: '',
      PRTY: '',
      STSDSP: '',
      R_STS: '',
      MDL: '',
      DIV: '',
      SECT: '',
      WC: '',
      TS: '',
      X_ID: '',
      CNLD: '',
      ATRID: [0],
      //ARF-------------------------
      //ARF_ID: '',
      SREQ_CODE: '',
      S_TYPE: '',
      SP_SITE: '',
      PTN: '',
      RESULT: '',
      ORG_RES: '',
      UNITS: '',
      F: '',
      LRESULT: '',
      LREQ_DATE: [],
      PNDG: '',
      TAT: [0.0],
      RSTP: '',
      RES_DTTM: [],
      RSLD_DTTM: [],
      TST_ID: '',
      SEQ: '',
      RPT_NO: '',
      DEC: [],
      REF_LOW: [],
      REF_HIGH: [],
      CRTCL_LOW: [],
      CRTCL_HIGH: [],
      LHF: '',
      AF: '',
      REF_RANGE: '',
      REF_LC: '',
      REF_HC: '',
      TNO: '',
      MHN: '',
      SHN: '',
      NO_SLD: [0.0],
      R_ID: '',
      V_ID: '',
      RSLD_ID: '',
      VLDT_ID: '',
      BILL: '',
      NOTES: '',
      NOTESB: '',
      INTERP: '',
      FN: '',
      S: '',
      ARFID: [0],
      PRID: [0],
      VER: '',
      P: '',
      CNT: [0],
      PF: '',
      PR: '',
      WS: '',
      UPDT_TIME: [0],
      AreaNOTES: '',
      CLN_IND: '',
      RNO: '',

      //Order Transacstions

      COMMENTS: '',
      INS_NO: '',
      OTP: '',
      PAYTP: '',
      PHID: '',
      PT: '',
      REQ_NO: '',
      SMC: '',
      VC_NO: '',
      FAXNO: '',
      ADDRESS: '',
      MOBILE: '',
      searchOrder: '',
      RSVRD_DTTM: new Date(),
      NATIONALITY: ''
    })

    this.initialValueForm = this.OrderEntryForm.value;

    this.btnDisabled = true;

    this.selectBoolenValue = true;
  }


  ngOnInit(): void {

    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.BindSalesmen();
    this.BindOrdertype();
    this.BindSpecimenstypes();
    this.BindOrderTransactions();
    this.BindSharedTableNat();
    //var values = JSON.parse(localStorage.getItem("store_owner_ad_contacts"));

    this.diabledOrderPatientInformations();

    this.selectedSite = localStorage.getItem("selectedSite")
    this.selectedrefSite = localStorage.getItem("refSite")
    this.selectedUserId = localStorage.getItem("userId")
    //const searchElement = document.getElementById("PAT_ID");

    this.BindSiteDetatils();
    /*
        setTimeout(() => {
    
          //this.onFirst();
          this.onLast();
        }, 4000);
    */
    $('#btnaddorder').addClass("is-active");

  }


  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.OderProcessing_OrderEntry, this.startTime, this.endTime);
  }


  inputValidated() {
    const searchElement = document.getElementById("PAT_ID");
    searchElement?.focus();
    this.OrderEntryForm.value.PAT_ID == '' ? this.wasvalidated = "was-validated" : this.wasvalidated = "";
    this.OrderEntryForm.value.PAT_NAME == '' ? this.wasvalidated = "was-validated" : this.wasvalidated = "";


  }

  BindSalesmen() {
    this.orderentryService.GetSalesmen()
      .subscribe({
        next: (res) => {
          //this.BindDatatables(res);
          this.isLoaded = true;
          for (var i = 0; i < res.length; i++) {  // loop through the object array
            this.salesmen.push(res[i]);        // push each element to sys_id
          }
          this.isLoaded = false;
        },
        error: (err) => {
        }
      })
  }
  BindSharedTableNat() {
    this.orderentryService.GetSharedTableNat()
      .subscribe({
        next: (res) => {
          //this.BindDatatables(res);
          this.isLoaded = true;
          for (var i = 0; i < res.getSharedTable.length; i++) {  // loop through the object array
            this.sharedtableNat.push(res.getSharedTable[i]);        // push each element to sys_id
          }
          this.isLoaded = false;
        },
        error: (err) => {
        }
      })
  }

  salesmenselected: any = this.salesmen;
  consoleLog(salesmenselected) {
    console.log(salesmenselected.smc);
    this.scmid = salesmenselected.smc;
  }

  BindOrdertype() {
    this.orderentryService.GetOrderType()
      .subscribe({
        next: (res) => {
          this.isLoaded = true;
          for (var i = 0; i < res.geT_Ord_TP.length; i++) {  // loop through the object array
            this.ordertype.push(res.geT_Ord_TP[i]);        // push each element to sys_id
          }
          this.isLoaded = false;
        },
        error: (err) => {
          console.log('error order type')
        }
      })
  }
  BindOrderTransactions() {
    this.orderentryService.GET_ALL_ORD_TRANS()
      .subscribe({
        next: (res) => {
          this.isLoaded = true;
          for (var i = 0; i < res.geT_ORD_TRNS.length; i++) {  // loop through the object array
            this.orderTransactionlist.push(res.geT_ORD_TRNS[i]);        // push each element to sys_id
          }
          this.isLoaded = false;
          this.onLast();
        },
        error: (err) => {
          console.log('error order type')
        }
      })
  }

  BindSpecimenstypes() {

    this.orderentryService.GetSpecimensTypes()
      .subscribe({
        next: (res) => {
          this.isLoaded = true;
          for (var i = 0; i < res.length; i++) {  // loop through the object array
            this.specimenstypes.push(res[i]);        // push each element to sys_id
          }
          this.isLoaded = false;
        },
        error: (err) => {
          console.log('error order type')
        }
      })
  }
  ordertypeselected: any = this.ordertype;
  ordertyoeconsoleLog(ordertypeselected) {
    console.log(ordertypeselected.otp);
    this.otpid = ordertypeselected.otp;
  }

  SharedTableNatSel: any = this.sharedtableNat;
  sharedTableNatconsoleLog(SharedTableNatSel) {
    console.log(SharedTableNatSel.nationality);
    //this.OrderEntryForm.value.NATIONALITY = SharedTableNatSel.nationality;
    this.natid = SharedTableNatSel.nationality;
  }

  BindPRTable() {
    const InpPAT = document.getElementById("InpPAT") as HTMLInputElement;

    if (InpPAT.value.length < 2) {

      Swal.fire({
        title: 'Please enter at least two character!',
        text: 'Please enter patient id.',
        icon: 'info'
      }).then(() => {
        Swal.close();
        InpPAT.focus();
        return;
      })
      InpPAT.focus();
      return;
    }

    this.PRTable = [];
    this.orderentryService.GetPRSearch(InpPAT.value.trim())
      .subscribe({
        next: (res) => {

          for (var i = 0; i < res.getPR.length; i++) {  // loop through the object array
            this.PRTable.push(res.getPR[i]);        // push each element to sys_id
          }

        },
        error: (err) => {

        }
      })
  }

  onPREnter() {
    this.findPR('');
    const PAT_IDEle = document.getElementById("PAT_ID") as HTMLInputElement;
    PAT_IDEle.blur();
  }


  findPR(pr) {


    const PAT_IDEle = document.getElementById("PAT_ID") as HTMLInputElement;

    if (pr != '') {
      PAT_IDEle.value = pr.paT_ID
      this.OrderEntryForm.value.PAT_ID = pr.paT_ID;
    }

    if (PAT_IDEle.value.trim() == "?" || PAT_IDEle.value.trim() == "") {
      const PATModal = document.getElementById('PATModal') as HTMLElement;
      const myModal = new Modal(PATModal);
      myModal.show()
      return;
    }
    const formattedNum = PAT_IDEle.value.toString().padStart(10, "0"); // "05"
    this.OrderEntryForm.patchValue({ PAT_ID: formattedNum });
    this.OrderEntryForm.value.PAT_ID = PAT_IDEle.value;

    if (this.OrderEntryForm.valid) {
      this.orderentryService.GetPR(this.OrderEntryForm.value.PAT_ID)
        .subscribe({
          next: (res) => {
            if (res.getPR.length > 0) {
              let temp = res.getPR[0].dob;
              let date = new Date(temp);
              this.OrderEntryForm.get('PAT_NAME')?.clearValidators();
              this.OrderEntryForm.patchValue({ PAT_NAME: res.getPR[0].paT_NAME });
              this.OrderEntryForm.patchValue({ SEX: res.getPR[0].sex });
              this.OrderEntryForm.patchValue({ DOB: date.toISOString().slice(0, 10) });
              this.OrderEntryForm.patchValue({ SAUDI: res.getPR[0].saudi });
              this.OrderEntryForm.patchValue({ NATIONALITY: res.getPR[0].nationality });
              this.natid=res.getPR[0].nationality ;
              this.OrderEntryForm.patchValue({ IDNT: res.getPR[0].idnt });
              this.OrderEntryForm.patchValue({ DRNO: res.getPR[0].drno });
              this.OrderEntryForm.patchValue({ REF_NO: res.getPR[0].reF_NO });
              this.OrderEntryForm.patchValue({ TEL: res.getPR[0].tel });
              this.OrderEntryForm.patchValue({ EMAIL: res.getPR[0].email });
              this.OrderEntryForm.patchValue({ CN: res.getPR[0].cn });
              this.OrderEntryForm.patchValue({ LOC: res.getPR[0].loc });
              this.OrderEntryForm.patchValue({ PAT_ID: res.getPR[0].paT_ID });

              this.GET_CLNT_FL('');
              this.GetDOC_FL('');
              this.GetLOCATION('');

              const BtnPRSave = document.getElementById('BtnPRSave') as HTMLElement | null;
              BtnPRSave?.removeAttribute('disabled');

              const BtnAdd = document.getElementById('BtnAdd') as HTMLElement | null;
              BtnAdd?.removeAttribute('disabled');

              const BtnCancel = document.getElementById('BtnCancel') as HTMLElement | null;
              BtnCancel?.removeAttribute('disabled');

              const TCODEEle = document.getElementById('TCODE') as HTMLInputElement | null;
              TCODEEle.focus();


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

    return Totalage1;
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

  computeDPrice() {
    var inpUPRICE = document.getElementById("UPRICE") as HTMLInputElement;
    var inpDSCNT = document.getElementById("DSCNT") as HTMLInputElement;
    var inpDPRICE = document.getElementById("DPRICE") as HTMLInputElement;
    var DpriceCompute = parseFloat(inpUPRICE.value) - (parseFloat(inpUPRICE.value) * (parseFloat(inpDSCNT.value) / 100));
    inpDPRICE.value = DpriceCompute.toString();
    return DpriceCompute;
  }

  GET_CLNT_FL(cn) {
    const CNElement = document.getElementById("CN") as HTMLInputElement;
    const PAT_ID = document.getElementById("PAT_ID") as HTMLInputElement;
    if (this.OrderEntryForm.value.CN == "" || this.OrderEntryForm.value.CN == null || CNElement.value == '' || CNElement.value == null) {
      //CNElement.focus();
      PAT_ID.focus();
      //return;
    }
    if (this.OrderEntryForm.value.PAT_ID == '') {
      Swal.fire({
        title: 'Please search Patient information!',
        text: 'Please search it again.',
        icon: 'info'
      }).then(() => {
        Swal.close();
        PAT_ID.focus();
      })
      return;
    }

    if (cn == 'Y') {
      this.ClientTableList = [];
      this.orderentryService.GetAllClients()
        .subscribe({
          next: (res) => {
            for (var i = 0; i < res.length; i++) {  // loop through the object array
              this.ClientTableList.push(res[i]);        // push each element to sys_id
            }
          },
          error: (err) => {
          }
        })
      const modalClient = document.getElementById('modalClient') as HTMLElement;
      const myModal = new Modal(modalClient);
      myModal.show();
    }

    if (this.OrderEntryForm.value.CN != '') {
      this.orderentryService.GetCLNT_FL(this.OrderEntryForm.value.CN)
        .subscribe({
          next: (res) => {
            if (res.geT_CLNT_FL != null) {
              this.OrderEntryForm.patchValue({ client: res.geT_CLNT_FL.client });
              document.getElementById("client").innerHTML = res.geT_CLNT_FL.client;
            } else {
              /*const modalClient = document.getElementById('modalClient') as HTMLElement;
              const myModal = new Modal(modalClient);
              myModal.show();
              this.orderentryService.GetAllClients()
                .subscribe({
                  next: (res) => {
                    for (var i = 0; i < res.length; i++) {  // loop through the object array
                      this.ClientTableList.push(res[i]);        // push each element to sys_id
                    }
                  },
                  error: (err) => {
                  }
                })
                  */
            }
          },
          error: (err) => {
            document.getElementById("client").innerHTML = "";
            Swal.fire({
              title: err?.error.message,
              text: 'Please search it again.',
              icon: 'error'
            }).then(() => {
              Swal.close();
              document.getElementById("client").autofocus;
            })
          }
        })
    }
  }
  SelectClientInfo(clinicid: any) {
    this.OrderEntryForm.patchValue({ CN: clinicid.cn });
    this.OrderEntryForm.patchValue({ client: clinicid.client });
    document.getElementById("client").innerHTML = clinicid.client;
  }

  GetDOC_FL(doc) {
    const DRNOElement = document.getElementById("DRNO") as HTMLInputElement;
    const PAT_ID = document.getElementById("PAT_ID") as HTMLInputElement;
    if (this.OrderEntryForm.value.DRNO == "" || this.OrderEntryForm.value.DRNO == null || DRNOElement.value == '' || DRNOElement.value == null) {
      //DRNOElement.focus();
      PAT_ID.focus();
      //return;
    }

    if (this.OrderEntryForm.value.PAT_ID == '') {
      Swal.fire({
        title: 'Please search Patient information!',
        text: 'Please search it again.',
        icon: 'info'
      }).then(() => {
        Swal.close();
        PAT_ID.focus();
      })
      return;
    }
    if (doc == 'Y') {
      this.DoctorTableList = [];
      this.orderentryService.GetAllDoctorFile()
        .subscribe({
          next: (res) => {
            for (var i = 0; i < res.allDoctorFile.length; i++) {  // loop through the object array
              this.DoctorTableList.push(res.allDoctorFile[i]);        // push each element to sys_id
            }
          },
          error: (err) => {
          }
        })
      const modalDoctor = document.getElementById('modalDoctor') as HTMLElement;
      const myModal = new Modal(modalDoctor);
      myModal.show();
    }

    if (this.OrderEntryForm.value.DRNO != '') {
      this.orderentryService.GetDOC_FL(this.OrderEntryForm.value.DRNO)
        .subscribe({
          next: (res) => {
            if (res.getDoctorFileByDrNo != null) {
              this.OrderEntryForm.patchValue({ doctor: res.getDoctorFileByDrNo.doctor });
              document.getElementById("doctor").innerHTML = res.getDoctorFileByDrNo.doctor;
            } else {
              /*const modalDoctor = document.getElementById('modalDoctor') as HTMLElement;
              const myModal = new Modal(modalDoctor);
              myModal.show();
              this.orderentryService.GetAllDoctorFile()
                .subscribe({
                  next: (res) => {
                    for (var i = 0; i < res.allDoctorFile.length; i++) {  // loop through the object array
                      this.DoctorTableList.push(res.allDoctorFile[i]);        // push each element to sys_id
                    }
                  },
                  error: (err) => {
                  }
                })
                  */
            }
          },
          error: (err) => {
            document.getElementById("doctor").innerHTML = "";
            //console.log('ERROR');
            Swal.fire({
              title: 'Doctor file information not found!',
              text: 'Please search it again.',
              icon: 'error'
            }).then(() => {
              Swal.close();
              document.getElementById("doctor").autofocus;
            })


          }
        })
    }
  }
  SelectDoctorInfo(doctor: any) {
    this.OrderEntryForm.patchValue({ DRNO: doctor.drno });
    this.OrderEntryForm.patchValue({ doctor: doctor.doctor });
    document.getElementById("doctor").innerHTML = doctor.doctor;
  }

  GetLOCATION(loc) {
    const LOCElement = document.getElementById("LOC") as HTMLInputElement;
    const PAT_ID = document.getElementById("PAT_ID") as HTMLInputElement;
    if (this.OrderEntryForm.value.LOC == "" || this.OrderEntryForm.value.LOC == null || LOCElement.value == '' || LOCElement.value == null) {
      //LOCElement.focus();
      PAT_ID.focus();
      //return;
    }
    if (this.OrderEntryForm.value.PAT_ID == '') {
      Swal.fire({
        title: 'Please search Patient information!',
        text: 'Please search it again.',
        icon: 'info'
      }).then(() => {
        Swal.close();
        PAT_ID.focus();
      })
      return;
    }

    if (loc == 'Y') {
      this.LocationTableList = [];
      this.orderentryService.GetAllLocationsFile()
        .subscribe({
          next: (res) => {
            for (var i = 0; i < res.getAllLocationsFile.length; i++) {  // loop through the object array
              this.LocationTableList.push(res.getAllLocationsFile[i]);        // push each element to sys_id
            }
          },
          error: (err) => {
          }
        })
      const modalClinic = document.getElementById('modalClinic') as HTMLElement;
      const myModal = new Modal(modalClinic);
      myModal.show();
    }

    if (this.OrderEntryForm.value.LOC != '') {
      this.orderentryService.GetLOCATION(this.OrderEntryForm.value.LOC)
        .subscribe({
          next: (res) => {
            if (res.getLocationsFileByLoc != null) {
              this.OrderEntryForm.patchValue({ descrp: res.getLocationsFileByLoc.descrp });
              document.getElementById("descrp").innerHTML = res.getLocationsFileByLoc.descrp;

            } else {
              /* const modalClinic = document.getElementById('modalClinic') as HTMLElement;
              const myModal = new Modal(modalClinic);
              myModal.show();
             this.orderentryService.GetAllLocationsFile()
                .subscribe({
                  next: (res) => {
                    for (var i = 0; i < res.getAllLocationsFile.length; i++) {  // loop through the object array
                      this.LocationTableList.push(res.getAllLocationsFile[i]);        // push each element to sys_id
                    }
                  },
                  error: (err) => {
                  }
                })
                  */

            }
          },
          error: (err) => {
            document.getElementById("descrp").innerHTML = "";
            Swal.fire({
              title: 'Location not found!',
              text: 'Please search it again.',
              icon: 'error'
            }).then(() => {
              Swal.close();
              document.getElementById("descrp").autofocus;
            })
          }
        })
    }
  }
  SelectClinicInfo(location: any) {
    this.OrderEntryForm.patchValue({ LOC: location.loc });
    this.OrderEntryForm.patchValue({ descrp: location.descrp });
    document.getElementById("descrp").innerHTML = location.descrp;
  }

  BtnPRNew() {


    document.getElementById("client").innerHTML = "";
    document.getElementById("descrp").innerHTML = "";
    document.getElementById("doctor").innerHTML = "";

    const PAT_IDElement = document.getElementById("PAT_ID") as HTMLInputElement | null;
    const PAT_NAMEElement = document.getElementById("PAT_NAME") as HTMLElement | null;



    if (this.OrderEntryForm.value.PAT_ID == '')
      PAT_IDElement?.focus();
    else
      PAT_NAMEElement?.focus();


    const BtnPRNew = document.getElementById('BtnPRNew') as HTMLElement | null;
    BtnPRNew?.setAttribute('disabled', '');

    const BtnPRSave = document.getElementById('BtnPRSave') as HTMLElement | null;
    BtnPRSave?.removeAttribute('disabled');

    const BtnAdd = document.getElementById('BtnAdd') as HTMLElement | null;
    BtnAdd?.removeAttribute('disabled');

    const BtnCancel = document.getElementById('BtnCancel') as HTMLElement | null;
    BtnCancel?.removeAttribute('disabled');


    //--------------------------------------------
    this.btnDisabled = true;
    this.OrderEntryForm.reset(this.initialValueForm);
    document.getElementById("client").innerHTML = "";
    document.getElementById("descrp").innerHTML = "";
    document.getElementById("doctor").innerHTML = "";
    document.getElementById("FULL_NAME").innerHTML = "";
    document.getElementById("DT").innerHTML = "";
    document.getElementById("STS").innerHTML = "";
    const searchElement = document.getElementById("PAT_ID") as HTMLElement | null;
    searchElement?.focus();
    this.ATRTable = [];
    //----------------------------
    const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
    BtnFirst?.setAttribute('disabled', '');
    const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
    BtnPrevious?.setAttribute('disabled', '');
    const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
    BtnNext?.setAttribute('disabled', '');
    const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
    BtnLast?.setAttribute('disabled', '');
    this.enableOrderPatientInformations();
    const RSVRD_DTTM = document.getElementById('RSVRD_DTTM') as HTMLInputElement | null;
    RSVRD_DTTM.value = this.currentdatetime;

    if (PAT_IDElement.value == '')
      PAT_IDElement?.focus();

    //Make Order Default to 01 - Normal
    this.OrderEntryForm.patchValue({ OTP: "01 Normal" });
    this.otpid = '01';

  }

  BtnPRYes() {
    const PAT_NAME = document.getElementById("PAT_NAME") as HTMLElement | null;
    PAT_NAME?.focus();
  }
  BtnPRNo() {
    this.OrderEntryForm.reset(this.initialValueForm);
    const searchElement = document.getElementById("PAT_ID") as HTMLElement | null;
    searchElement?.focus();

    const BtnPRSave = document.getElementById('BtnPRSave') as HTMLElement | null;
    BtnPRSave?.setAttribute('disabled', '');

    const BtnPRNew = document.getElementById('BtnPRNew') as HTMLElement | null;
    BtnPRNew?.removeAttribute('disabled');

  }

  BtnPRSave() {

    this.OrderEntryForm.controls['SEX'].enable();
    this.OrderEntryForm.controls['OTP'].enable();
    this.OrderEntryForm.controls['SMC'].enable();
    this.OrderEntryForm.controls['SAUDI'].enable();
    this.OrderEntryForm.controls['NATIONALITY'].enable();
    //const BtnPRSave = document.getElementById('BtnPRSave') as HTMLElement | null;
    //BtnPRSave?.setAttribute('disabled', '');

    //const BtnPRNew = document.getElementById('BtnPRNew') as HTMLElement | null;
    //BtnPRNew?.removeAttribute('disabled');
    //console.log(this.OrderEntryForm.value);
    //return;
    this.onRegister();
    this.clearOrderEntryTest();
    /* this.ATRTable = [];*/
    /*this.OrderEntryForm.controls['SEX'].disable();
    this.OrderEntryForm.controls['OTP'].disable();
    this.OrderEntryForm.controls['SMC'].disable();
    this.OrderEntryForm.controls['SAUDI'].disable();
    */
  }

  BtnRevert() {

    var checkAutoSpecemenLogin = <HTMLInputElement>document.getElementById("checkAutoSpecemenLogin");

    const TCODE = document.getElementById("TCODE") as HTMLInputElement;
    const DSCNT = document.getElementById("DSCNT") as HTMLInputElement;
    const DPRICE = document.getElementById("DPRICE") as HTMLInputElement;
    const UPRICE = document.getElementById("UPRICE") as HTMLInputElement;
    const COL_DATE_TIME = document.getElementById("COL_DATE_TIME") as HTMLInputElement;
    const cmbSpecimenstypes = document.getElementById("cmbSpecimenstypes") as HTMLInputElement;
    TCODE.value = '';
    DSCNT.value = '';
    DPRICE.value = '';
    UPRICE.value = '';
    COL_DATE_TIME.value = '';
    cmbSpecimenstypes.value = '';

    if (this.ATRTable.length > 0) {
      Swal.fire({
        title: 'Are you sure you want to cancel the active transaction?',
        text: "Please confirm!",
        showDenyButton: true,
        confirmButtonText: 'Yes',
        icon: 'question'
      }).then((result) => {
        if (result.isConfirmed) {

          Swal.fire({
            title: 'Cancelled successfully!',
            text: 'Order form has been successfully cleared.',
            icon: 'success'
          }).then(() => {
            const searchElement = document.getElementById("PAT_ID") as HTMLElement | null;
            searchElement?.focus();
            //this.onLast(); //Added on Sept. 7,2024
            this.SearchOrderTrans();
            this.diabledOrderPatientInformations();
            Swal.close();
            return;
          })
          //this.OrderEntryForm.reset(this.initialValueForm);
          document.getElementById("client").innerHTML = "";
          document.getElementById("descrp").innerHTML = "";
          document.getElementById("doctor").innerHTML = "";
          document.getElementById("FULL_NAME").innerHTML = "";
          document.getElementById("DT").innerHTML = "";
          document.getElementById("STS").innerHTML = "";

          const BtnPRSave = document.getElementById('BtnPRSave') as HTMLElement | null;
          BtnPRSave?.setAttribute('disabled', '');

          const BtnPRNew = document.getElementById('BtnPRNew') as HTMLElement | null;
          BtnPRNew?.removeAttribute('disabled');

          const BtnAdd = document.getElementById('BtnAdd') as HTMLElement | null;
          BtnAdd?.setAttribute('disabled', '');

          const BtnCancel = document.getElementById('BtnCancel') as HTMLElement | null;
          BtnCancel?.setAttribute('disabled', '');

          const searchElement = document.getElementById("PAT_ID") as HTMLElement | null;
          searchElement?.focus();
          this.ATRTable = [];

          checkAutoSpecemenLogin.checked = false;
          this.btnDisabled = true;
          Swal.close();
          return;
        } else if (result.isDenied) {
          Swal.fire("No!", "The Test order is not cleared. Please continue.", 'info')
          const TCODEElement = document.getElementById("TCODE") as HTMLElement | null;
          TCODEElement?.focus();
          Swal.close();
          return;
        }
      })
    } else {
      this.btnDisabled = true;
      this.OrderEntryForm.reset(this.initialValueForm);

      document.getElementById("client").innerHTML = "";
      document.getElementById("descrp").innerHTML = "";
      document.getElementById("doctor").innerHTML = "";

      document.getElementById("FULL_NAME").innerHTML = "";
      document.getElementById("DT").innerHTML = "";
      document.getElementById("STS").innerHTML = "";




      const BtnPRSave = document.getElementById('BtnPRSave') as HTMLElement | null;
      BtnPRSave?.setAttribute('disabled', '');

      const BtnPRNew = document.getElementById('BtnPRNew') as HTMLElement | null;
      BtnPRNew?.removeAttribute('disabled');


      const BtnAdd = document.getElementById('BtnAdd') as HTMLElement | null;
      BtnAdd?.setAttribute('disabled', '');

      const BtnCancel = document.getElementById('BtnCancel') as HTMLElement | null;
      BtnCancel?.setAttribute('disabled', '');

      checkAutoSpecemenLogin.checked = false;


      const searchElement = document.getElementById("PAT_ID") as HTMLElement | null;
      searchElement?.focus();
      this.ATRTable = [];
      this.onLast(); //Added on Sept. 7,2024
      //this. SearchOrderTrans();
    }

    const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
    BtnFirst?.removeAttribute('disabled');
    const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
    BtnPrevious?.removeAttribute('disabled');
    const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
    BtnNext?.removeAttribute('disabled');
    const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
    BtnLast?.removeAttribute('disabled');



  }

  onRegister() {

    if (!this.OrderEntryForm.value.PAT_ID) {

      var PAT_IDEle = document.getElementById("PAT_ID") as HTMLInputElement | null;

      Swal.fire({
        title: 'Required patient information!',
        text: 'Please enter patient id.',
        icon: 'info'
      }).then(() => {
        Swal.close();
        PAT_IDEle.focus();

        return;
      })

      this.BtnPRNew();
      return;
    }
    if (this.ATRTable.length <= 0) {
      var TCODE = document.getElementById("TCODE") as HTMLInputElement | null;
      var REQ_CODE = document.getElementById("REQ_CODE") as HTMLInputElement | null;

      Swal.fire({
        title: 'Required order test entry!',
        text: 'Please enter Order Test.',
        icon: 'info'
      }).then(() => {
        Swal.close();
        if (TCODE) { TCODE.focus(); }
        if (REQ_CODE) { REQ_CODE.focus(); };
        return;
      })

      if (TCODE) { TCODE.focus(); }
      if (REQ_CODE) { REQ_CODE.focus(); };
      return;
    }

    if (this.OrderEntryForm.value.SEX == '' || this.OrderEntryForm.value.SEX == null) {
      Swal.fire({
        title: "Required Gender.",
        text: "Please select Sex from the dropdownlist",
        icon: 'error'
      })
      return;
    }

    if (this.OrderEntryForm.valid) {
      //console.log(this.OrderEntryForm.value);
      //return;
      this.OrderEntryForm.value.NATIONALITY = (this.natid == "" || this.natid == undefined || this.natid == null) ? '' : this.natid;
      this.orderentryService.PutPR(this.OrderEntryForm.value)
        .subscribe({
          next: (res) => {

            this.onOrderFinal(this.ATRTable[0].reQ_CODE,
              this.ATRTable[0].dprice,
              this.ATRTable[0].drawN_DTTM,
              this.ATRTable[0].dscnt,
              this.ATRTable[0].dt,
              this.ATRTable[0].fulL_NAME,
              this.ATRTable[0].ln,
              this.ATRTable[0].r_STS,
              this.ATRTable[0].s_TYPE,//sPECIMEN,
              this.ATRTable[0].sts,
              this.ATRTable[0].uprice)
          },
          error: (err) => {
            alert(err?.error.message);
          }
        })
    }
  }

  BindTDGTTable() {
    const InpTestCode = document.getElementById("InpTestCode") as HTMLInputElement;
    if (InpTestCode.value.length < 2) {
      Swal.fire({
        title: 'Please enter at least two character!',
        text: 'Please enter Test Code or Description.',
        icon: 'info'
      }).then(function (result) {
        if (result.isDismissed) {
          Swal.close();

          InpTestCode.focus();
          return;
        }
      })
      InpTestCode.focus();
      return;
    }
    this.td_gt = [];
    this.orderentryService.GET_p_TD_GT(InpTestCode.value.trim())
      .subscribe({
        next: (res) => {
          for (var i = 0; i < res.tD_GT.length; i++) {  // loop through the object array
            this.td_gt.push(res.tD_GT[i]);        // push each element to sys_id
          }
        },
        error: (err) => {
        }
      })
  }

  onLostFucosTCode() {
    var FULL_NAMEEle = document.getElementById("FULL_NAME") as HTMLInputElement;
    if (FULL_NAMEEle.innerText == '') {
      this.LostFucosTCode('');
    } else {
      this.onAddOrder();
    }
  }

  LostFucosTCode(sTCode) {
    const TCODEElement = document.getElementById("TCODE") as HTMLInputElement;
    const InpTestCode = document.getElementById('InpTestCode') as HTMLInputElement;
    const TCODEModal = document.getElementById('TCODEModal') as HTMLElement;
    if (sTCode != '') {
      TCODEElement.value = sTCode.tcode
    }
    if (TCODEElement.value.trim() == "?" || TCODEElement.value.trim() == "") {
      const myModal = new Modal(TCODEModal);
      myModal.show();
      return;
    }
    var UPRICEEle = document.getElementById("UPRICE") as HTMLInputElement;
    var DPRICEEle = document.getElementById("DPRICE") as HTMLInputElement;
    var FULL_NAMEEle = document.getElementById("FULL_NAME") as HTMLInputElement;
    var DSCNTEle = document.getElementById("DSCNT") as HTMLInputElement;
    var DTEle = document.getElementById("DT") as HTMLInputElement;
    var STSEle = document.getElementById("STS") as HTMLInputElement;
    var SPTypeEle = document.getElementById("cmbSpecimenstypes") as HTMLInputElement;
    UPRICEEle.value = '';
    FULL_NAMEEle.value = '';
    this.orderentryService.GetTD(TCODEElement.value)
      .subscribe({
        next: (res) => {
          if (res.geT_TD != null) {
            if (res.geT_TD.status == "I") {
              document.getElementById("LblMessageOrderEntry").innerHTML = "This Is an Inactive Test, Can Not Be Requested!"; return;
            }
            if (res.geT_TD.ordable == "N") {
              document.getElementById("LblMessageOrderEntry").innerHTML = "This Is a Non-Orderable Test, Can Not Be Ordered!"; return;
            }

            const ACCN = document.getElementById("ACCN") as HTMLInputElement | null;
            if (ACCN.value == '') {
              STSEle.innerHTML = res.geT_TD.sts;
              this.OrderEntryForm.value.STS = res.geT_TD.sts;
            }
            UPRICEEle.value = res.geT_TD.uprice;
            DPRICEEle.value = res.geT_TD.uprice;
            FULL_NAMEEle.innerHTML = res.geT_TD.fulL_NAME;
            DSCNTEle.value = res.geT_TD.dscnt;
            DTEle.innerHTML = res.geT_TD.dt;

            SPTypeEle.value = res.geT_TD.s_TYPE;

            this.OrderEntryForm.patchValue({ cmbSpecimenstypes: res.geT_TD.s_TYPE });
            this.OrderEntryForm.value.REQ_CODE = res.geT_TD.tcode;
            this.OrderEntryForm.value.CT = res.geT_TD.ct;//'D';
            this.OrderEntryForm.value.TD_ID = res.geT_TD.tD_ID;
            this.OrderEntryForm.value.DTNO = res.geT_TD.tesT_ID.toString();
            this.OrderEntryForm.value.TCODE = res.geT_TD.tcode;
            this.OrderEntryForm.value.BCODE = res.geT_TD.bcode;
            this.OrderEntryForm.value.HSTNO = res.geT_TD.hstno;
            this.OrderEntryForm.value.PTN = res.geT_TD.ptn;
            this.OrderEntryForm.value.HOSTCODE = res.geT_TD.hostcode;
            this.OrderEntryForm.value.IFLG = res.geT_TD.iflg;
            this.OrderEntryForm.value.B_NO = res.geT_TD.b_NO;
            this.OrderEntryForm.value.SYNM = res.geT_TD.synm;
            this.OrderEntryForm.value.MTHD = res.geT_TD.mthd;
            this.OrderEntryForm.value.STATUS = res.geT_TD.status;
            this.OrderEntryForm.value.ORDABLE = res.geT_TD.ordable;
            this.OrderEntryForm.value.FULL_NAME = res.geT_TD.fulL_NAME;
            this.OrderEntryForm.value.AFULL_NAME = res.geT_TD.afulL_NAME;
            this.OrderEntryForm.value.UNITS = res.geT_TD.units;
            this.OrderEntryForm.value.DEC = res.geT_TD.dec;
            this.OrderEntryForm.value.CNVTFCTR = res.geT_TD.cnvtfctr;
            this.OrderEntryForm.value.CNVTCODE = res.geT_TD.cnvtcode;
            this.OrderEntryForm.value.UC = res.geT_TD.uc;
            this.OrderEntryForm.value.CNVUNITS = res.geT_TD.cnvunits;
            this.OrderEntryForm.value.CNVTDEC = res.geT_TD.cnvtdec;
            this.OrderEntryForm.value.AC = res.geT_TD.ac;
            this.OrderEntryForm.value.MDL = res.geT_TD.mdl;
            this.OrderEntryForm.value.RSTP = res.geT_TD.rstp;
            this.OrderEntryForm.value.SEQ = res.geT_TD.seq;
            this.OrderEntryForm.value.S_TYPE = res.geT_TD.s_TYPE;
            this.OrderEntryForm.value.SR = res.geT_TD.sr;
            this.OrderEntryForm.value.SC = res.geT_TD.sc;
            this.OrderEntryForm.value.RES_CODE = res.geT_TD.reS_CODE;
            this.OrderEntryForm.value.RESULT = res.geT_TD.result;
            this.OrderEntryForm.value.DELTATP = res.geT_TD.deltatp;
            this.OrderEntryForm.value.DAYSVAL = res.geT_TD.daysval;
            this.OrderEntryForm.value.DELTAVAL = res.geT_TD.deltaval;
            this.OrderEntryForm.value.DIV = res.geT_TD.div;
            this.OrderEntryForm.value.SECT = res.geT_TD.sect;
            this.OrderEntryForm.value.WC = res.geT_TD.wc;
            this.OrderEntryForm.value.TS = res.geT_TD.ts;
            this.OrderEntryForm.value.PRFX = res.geT_TD.prfx;
            //this.OrderEntryForm.patchValue({ PRFX: res.geT_TD.prfx });
            //this.OrderEntryForm.value.STS = res.geT_TD.sts;
            this.OrderEntryForm.value.PRTY = res.geT_TD.prty;
            this.OrderEntryForm.value.RR = res.geT_TD.rr;
            this.OrderEntryForm.value.AR = res.geT_TD.ar;
            this.OrderEntryForm.value.MHN = res.geT_TD.mhn;
            this.OrderEntryForm.value.SHN = res.geT_TD.shn;
            this.OrderEntryForm.value.TAT = res.geT_TD.tat;
            this.OrderEntryForm.value.CHAT = res.geT_TD.ctat;
            this.OrderEntryForm.value.BILL_NAME = res.geT_TD.bilL_NAME;
            this.OrderEntryForm.value.BILL = res.geT_TD.bill;
            this.OrderEntryForm.value.DSCNTG = res.geT_TD.dscntg;
            this.OrderEntryForm.value.DT = res.geT_TD.dt;
            this.OrderEntryForm.value.DSCNT = res.geT_TD.dscnt;
            this.OrderEntryForm.value.UPRICE = res.geT_TD.uprice;
            this.OrderEntryForm.value.DPRICE = res.geT_TD.uprice;
            this.OrderEntryForm.value.S = res.geT_TD.s;
            this.OrderEntryForm.value.BILL_GRP = res.bilL_GRP;
            this.OrderEntryForm.value.STK_CODE = res.geT_TD.stK_CODE;
            this.OrderEntryForm.value.TNO = res.geT_TD.tno;
            this.OrderEntryForm.value.RES_TMPLT = res.geT_TD.reS_TMPLT;
            this.OrderEntryForm.value.MNOTES = res.geT_TD.mnotes;
            this.OrderEntryForm.value.FNOTES = res.geT_TD.fnotes;
            this.OrderEntryForm.value.MINTERP = res.geT_TD.minterp;
            this.OrderEntryForm.value.FINTERP = res.geT_TD.finterp;
            this.OrderEntryForm.value.UPDT = res.geT_TD.updt;
            this.OrderEntryForm.value.COL_CNDN = res.geT_TD.coL_CNDN;
            this.OrderEntryForm.value.TEST_INF = res.geT_TD.tesT_INF;
            this.OrderEntryForm.value.VLM_MTRL = res.geT_TD.vlM_MTRL;
            this.OrderEntryForm.value.NRML_RNG = res.geT_TD.nrmL_RNG;
            this.OrderEntryForm.value.METHOD = res.geT_TD.method;
            this.OrderEntryForm.value.LBL_CMNT = res.geT_TD.lbL_CMNT;
            this.OrderEntryForm.value.B_NO1 = res.geT_TD.b_NO1;
            this.OrderEntryForm.value.GTDYN = res.geT_TD.gtdyn;
            this.OrderEntryForm.value.S_RPT = res.geT_TD.s_RPT;
            this.OrderEntryForm.value.PR = res.geT_TD.pr;
            this.OrderEntryForm.value.TOPIC_ID = res.geT_TD.topiC_ID;
            this.OrderEntryForm.value.TEST_ID = res.geT_TD.tesT_ID;
            this.OrderEntryForm.value.CT = res.geT_TD.ct;
            if (this.OrderEntryForm.value.SEX == 'M')
              this.OrderEntryForm.value.INTERP = res.geT_TD.minterp;
            else
              this.OrderEntryForm.value.INTERP = res.geT_TD.finterp;
            // console.log(this.OrderEntryForm.value) ;
            document.getElementById("LblMessageOrderEntry").innerHTML = "Test code found.";


          } else if (res.geT_TD == null) {
            this.currentFormControlName = 'REQ_CODE';
            this.OrderEntryForm.value.REQ_CODE = this.OrderEntryForm.value.TCODE;
            //Get the GT Information if TD is not available
            this.orderentryService.GetGT(TCODEElement.value)
              .subscribe({
                next: (res) => {
                  if (res.geT_GT.status == "I") {
                    document.getElementById("LblMessageOrderEntry").innerHTML = "This Is an Inactive Test, Can Not Be Requested!"; return;
                  }
                  UPRICEEle.value = res.geT_GT.uprice;
                  DPRICEEle.value = res.geT_GT.uprice;
                  FULL_NAMEEle.innerHTML = res.geT_GT.bilL_NAME;
                  DSCNTEle.value = res.geT_GT.dscnt;
                  DTEle.innerHTML = res.geT_GT.dt;
                  STSEle.innerHTML = res.geT_GT.sts;
                  // SPTypeEle.value = res.geT_GT.s_TYPE
                  this.OrderEntryForm.value.FULL_NAME = res.geT_GT.bilL_NAME;
                  this.OrderEntryForm.value.CT = res.geT_GT.gp;
                  this.OrderEntryForm.value.GT_ID = res.geT_GT.gT_ID;
                  this.OrderEntryForm.value.GTNO = res.geT_GT.gtno;
                  this.OrderEntryForm.value.GRP_NO = res.geT_GT.grP_NO;
                  this.OrderEntryForm.value.B_NO = res.geT_GT.b_NO;
                  this.OrderEntryForm.value.REQ_CODE = res.geT_GT.reQ_CODE;
                  this.OrderEntryForm.value.GRP_NAME = res.geT_GT.grP_NAME;
                  this.OrderEntryForm.value.AGRP_NAME = res.geT_GT.agrP_NAME;
                  this.OrderEntryForm.value.SYNM = res.geT_GT.synm;
                  this.OrderEntryForm.value.MTHD = res.geT_GT.mthd;
                  this.OrderEntryForm.value.STATUS = res.geT_GT.status;
                  this.OrderEntryForm.value.DIV = res.geT_GT.div;
                  this.OrderEntryForm.value.SECT = res.geT_GT.sect;
                  this.OrderEntryForm.value.TS = res.geT_GT.ts;
                  this.OrderEntryForm.value.PRFX = res.geT_GT.prfx;
                  //this.OrderEntryForm.patchValue({ PRFX: res.geT_GT.prfx });
                  this.OrderEntryForm.value.MDL = res.geT_GT.mdl;
                  this.OrderEntryForm.value.STS = res.geT_GT.sts;
                  this.OrderEntryForm.value.PRTY = res.geT_GT.prty;
                  this.OrderEntryForm.value.RPT = res.geT_GT.rpt;
                  this.OrderEntryForm.value.SUBHDR = res.geT_GT.subhdr;
                  this.OrderEntryForm.value.RPT_NO = res.geT_GT.rpT_NO;
                  this.OrderEntryForm.value.SRRR = res.geT_GT.srrr;
                  this.OrderEntryForm.value.S = res.geT_GT.s;
                  this.OrderEntryForm.value.GP = res.geT_GT.gp;
                  this.OrderEntryForm.value.TAT = res.geT_GT.tat;
                  this.OrderEntryForm.value.BILL_NAME = res.geT_GT.bilL_NAME;
                  this.OrderEntryForm.value.BILL = res.geT_GT.bill;
                  this.OrderEntryForm.value.DSCNTG = res.geT_GT.dscntg;
                  this.OrderEntryForm.value.DT = res.geT_GT.dt;
                  this.OrderEntryForm.value.DSCNT = res.geT_GT.dscnt;
                  this.OrderEntryForm.value.UPRICE = res.geT_GT.uprice;
                  this.OrderEntryForm.value.DPRICE = res.geT_GT.uprice;
                  this.OrderEntryForm.value.STK_CODE = res.geT_GT.stK_CODE;
                  this.OrderEntryForm.value.UPDT = res.geT_GT.updt
                  this.OrderEntryForm.value.DWL = res.geT_GT.dwl
                  this.OrderEntryForm.value.COL_CNDN = res.geT_GT.coL_CNDN
                  this.OrderEntryForm.value.TEST_ID = res.geT_TD.tesT_ID;
                  document.getElementById("LblMessageOrderEntry").innerHTML = "Test code found.";
                  return;
                }
                /*,
                error: (err) => {
                  document.getElementById("LblMessageOrderEntry").innerHTML = "Invalid Test Code, Please Try Again!"; return;
                }
                  */
              })

            document.getElementById("LblMessageOrderEntry").innerHTML = "Invalid Test Code, Please Try Again!";
            InpTestCode.value = TCODEElement.value;
            const myModal = new Modal(TCODEModal);
            myModal.show();
            this.BindTDGTTable();
            return;
          }
        }
        /*,
        error: (err) => {
          //console.log(this.OrderEntryForm.value);
        }*/
      })


  }



  PAT_ID: any = '';
  ORD_NO: any = '';
  GTNO: any = '';
  REQ_CODE: any = '';

  BindATRTable(PAT_ID: any, ORD_NO: any) {
    this.ATRTable = [];
    this.orderentryService.GET_ATR(PAT_ID, ORD_NO)
      .subscribe({
        next: (res) => {
          this.isLoaded = true;
          for (var i = 0; i < res.geT_ATR.length; i++) {  // loop through the object array
            this.ATRTable.push(res.geT_ATR[i]);        // push each element to sys_id
            this.OrderEntryForm.value.LN = i.toString();
          }
          this.BindOrderDetails(PAT_ID, ORD_NO);
          this.isLoaded = false;

        }/*,
        error: (err) => {
        }*/
      })
  }

  showOrderEntryForm() {
    console.log(this.OrderEntryForm.value);
    console.log(this.OrderEntryForm);
  }

  //data: any[] = [] //don't forget initialize!

  onAddOrder() {

    var SITE_NO = document.getElementById("SITE_NO") as HTMLInputElement;
    var SPECIMEN = document.getElementById("cmbSpecimenstypes") as HTMLInputElement; // document.getElementById("SPECIMEN") as HTMLInputElement;
    var COL_DATE_TIME = document.getElementById("COL_DATE_TIME") as HTMLInputElement;
    var STS = document.getElementById("STS") as HTMLInputElement;
    var DT = document.getElementById("DT") as HTMLInputElement;
    var UPRICE = document.getElementById("UPRICE") as HTMLInputElement;
    var DSCNT = document.getElementById("DSCNT") as HTMLInputElement;
    var DPRICE = document.getElementById("DPRICE") as HTMLInputElement;
    var FULL_NAME = document.getElementById("FULL_NAME") as HTMLInputElement;
    var ACCN = document.getElementById("ACCN") as HTMLInputElement;
    var ST = document.getElementById("ST") as HTMLInputElement;
    var TCODE = document.getElementById("TCODE") as HTMLInputElement;
    var REQ_CODE = document.getElementById("REQ_CODE") as HTMLInputElement;
    var inpDPRICE = document.getElementById("DPRICE") as HTMLInputElement;
    var inpCLN_IND = document.getElementById("CLN_IND") as HTMLInputElement;

    if (FULL_NAME.innerText == '') {

      Swal.fire({
        title: 'Required Order test entry!',
        text: 'Please enter order test.',
        icon: 'info'
      }).then(() => {
        TCODE.focus();
      })


      return;
    }

    var table: HTMLTableElement = <HTMLTableElement>document.getElementById("tableTestOrder");
    var totalRowCount = table.rows.length; // 5
    totalRowCount <= 9 ? '0' + totalRowCount.toString() : totalRowCount.toString();

    this.ATRTable.push({
      ln: totalRowCount.toString(),
      reQ_CODE: TCODE.value,
      sPECIMEN: (SPECIMEN.value == '' || SPECIMEN.value == null) ? '' : SPECIMEN.value,
      s_TYPE: (SPECIMEN.value == '' || SPECIMEN.value == null) ? '' : SPECIMEN.value,
      drawN_DTTM: COL_DATE_TIME.value,
      sts: STS.innerText,
      dt: DT.innerText,
      uprice: UPRICE.value,
      dscnt: DSCNT.value,
      dprice: DPRICE.value,
      fulL_NAME: FULL_NAME.innerText,
      r_STS: ACCN.value == '' ? 'O' : ST.value,
      paT_ID: this.OrderEntryForm.value.PAT_ID,
      orD_NO: this.OrderEntryForm.value.ORD_NO,
      gtno: this.OrderEntryForm.value.GTNO,
      tesT_ID: this.OrderEntryForm.value.TEST_ID,
      sitE_NO: this.selectedSite,// this.OrderEntryForm.value.SITE_NO,
      o_ID: this.selectedUserId,// this.OrderEntryForm.value.O_ID
      sect: this.OrderEntryForm.value.SECT,
      ct: this.OrderEntryForm.value.CT,
      accn: ACCN.value
    })

    SITE_NO.value = '';
    SPECIMEN.value = '';

    //COL_DATE_TIME.value = '';
    STS.innerText = '';
    DT.innerText = '';
    UPRICE.value = '';
    DSCNT.value = '';
    DPRICE.value = '';
    FULL_NAME.innerText = '';
    ACCN.value = '';
    ST.value = '';
    TCODE.value = '';
    REQ_CODE.value = '';
    inpDPRICE.value = '';

    // this.NgSelectComponent.clearModel();


  }
  onRemoveOrder(row) {
    alert('');
    this.rows.splice(row, 1);
  }

  onCheckAutoSpecemenLogin() {
    var element = <HTMLInputElement>document.getElementById("checkAutoSpecemenLogin");
    var COL_DATE_TIME = document.getElementById("COL_DATE_TIME") as HTMLInputElement;

    var isChecked = element.checked;
    const completeDate = new Date();

    if (isChecked == true) {
      COL_DATE_TIME.value = completeDate.toISOString().substring(0, 16);
    } else {
      COL_DATE_TIME.value = '';
    }

  }

  //onOrderFinal( reQ_CODE, dprice, drawN_DTTM, dscnt, dt, fulL_NAME, ln, r_STS, sPECIMEN, sts, uprice) {
  onOrderFinal(reQ_CODE, dprice, drawN_DTTM, dscnt, dt, fulL_NAME, ln, r_STS, sPECIMEN, sts, uprice) {
    /* onAddOrder() {*/

    var inpCLN_IND = document.getElementById("CLN_IND") as HTMLInputElement | null;
    var searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
    var RSVRD_DTTM = document.getElementById("RSVRD_DTTM") as HTMLInputElement | null;


    if (fulL_NAME == '') {
      alert('Required Order test entry!');
      return;
    }

    if (this.OrderEntryForm.value.SEX == '' || this.OrderEntryForm.value.SEX == null) {
      Swal.fire({
        title: "Required Gender.",
        text: "Please select Sex from the dropdownlist",
        icon: 'error'
      })
      return;
    }

    if (this.OrderEntryForm.value.DOB == '' || this.OrderEntryForm.value.DOB == null) {
      Swal.fire({
        title: "Required Date of Birth.",
        text: "Please select Date of Birth from the calendar",
        icon: 'error'
      })
      return;
    }
    if (this.OrderEntryForm.value.CN == '' || this.OrderEntryForm.value.CN == null) {
      Swal.fire({
        title: "Required Client.",
        text: "Please enter Client ID or Search!",
        icon: 'error'
      })
      return;
    }
    if (this.OrderEntryForm.value.LOC == '' || this.OrderEntryForm.value.LOC == null) {
      Swal.fire({
        title: "Required Clinic.",
        text: "Please enter Clinic ID or Search!",
        icon: 'error'
      })
      return;
    }
    if (this.OrderEntryForm.value.DRNO == '' || this.OrderEntryForm.value.DRNO == null) {
      Swal.fire({
        title: "Required Doctor.",
        text: "Please enter Doctor ID or Search!",
        icon: 'error'
      })
      return;
    }

    this.OrderEntryForm.value.CLN_IND = (inpCLN_IND.value == '' || inpCLN_IND.value == null) ? 'X' : inpCLN_IND.value;

    this.OrderEntryForm.value.UPRICE = uprice;// dprice.value;
    this.OrderEntryForm.value.DPRICE = dprice;// inpDPRICE.value;
    this.OrderEntryForm.value.DSCNT = dscnt;//DSCNT.value;

    this.OrderEntryForm.value.REQ_CODE = reQ_CODE;//TCODE.value;
    this.OrderEntryForm.value.TCODE = reQ_CODE;// TCODE.value;

    this.OrderEntryForm.value.FULL_NAME = fulL_NAME;//FULL_NAME.innerText;
    this.OrderEntryForm.value.DT = dt;// DT.innerText;
    this.OrderEntryForm.value.STS = r_STS;//STS.innerText;
    this.OrderEntryForm.value.SITE_NO = "";//SITE_NO.value;
    this.OrderEntryForm.value.CLN_IND = (inpCLN_IND.value == '' || inpCLN_IND.value == null) ? 'X' : inpCLN_IND.value;

    this.OrderEntryForm.value.CASH = this.OrderEntryForm.value.CASH == true ? "Y" : "N";
    this.OrderEntryForm.value.COMMENTS = "";
    this.OrderEntryForm.value.INS_NO = "";
    //this.OrderEntryForm.value.OTP = "";
    this.OrderEntryForm.value.PAYTP = "";
    this.OrderEntryForm.value.PHID = "";
    this.OrderEntryForm.value.PT = "";
    this.OrderEntryForm.value.REQ_NO = "";
    //this.OrderEntryForm.value.SMC = "";
    this.OrderEntryForm.value.VC_NO = "";
    this.OrderEntryForm.value.RNO = "";
    this.OrderEntryForm.value.NOTES = "";
    this.OrderEntryForm.value.S_TYPE = (sPECIMEN == "" || sPECIMEN == null) ? '' : sPECIMEN;
    this.OrderEntryForm.value.SITE_NO = this.selectedSite;
    this.OrderEntryForm.value.SMC = (this.scmid == "" || this.scmid == undefined || this.scmid == null) ? '' : this.scmid;
    this.OrderEntryForm.value.OTP = (this.otpid == "" || this.otpid == undefined || this.otpid == null) ? '' : this.otpid;
    this.OrderEntryForm.value.NATIONALITY = (this.natid == "" || this.natid == undefined || this.natid == null) ? '' : this.natid;
    this.OrderEntryForm.value.PRFX = "YM";
    //console.log(this.OrderEntryForm.value);
    //return;
    this.orderentryService.GET_NEW_ORD_NO()
      .subscribe({
        next: (res) => {

          if (!this.OrderEntryForm.value.ORD_NO) {

            this.OrderEntryForm.value.ORD_NO = res.geT_ORD_TRNS.orD_NO.toString();
            this.OrderEntryForm.value.LN = '01';
            searchOrder.value = (searchOrder.value == '' || searchOrder.value == null) ? res.geT_ORD_TRNS.orD_NO.toString() : searchOrder.value;
            this.OrderEntryForm.value.RSVRD_DTTM = RSVRD_DTTM.value;
            this.orderentryService.ADD_ORD_TRNS(this.OrderEntryForm.value)
              .subscribe({
                next: (res) => {
                  this.orderTransactionlist.push({
                    orD_NO: this.OrderEntryForm.value.ORD_NO,
                    paT_ID: this.OrderEntryForm.value.PAT_ID
                  })

                  this.OrderEntryForm.value.STS = "OD";
                  this.OrderEntryForm.value.R_STS = "O";
                  this.orderentryService.ADD_ATR(this.ATRTable,//this.OrderEntryForm.value,//
                    this.OrderEntryForm.value.SEX,
                    this.OrderEntryForm.value.CN,
                    this.OrderEntryForm.value.DOB,
                    this.OrderEntryForm.value.DRNO,
                    this.OrderEntryForm.value.LOC,
                    this.OrderEntryForm.value.PRFX,
                    this.OrderEntryForm.value.CLN_IND,
                    this.OrderEntryForm.value.ORD_NO)
                    .subscribe({
                      next: (res) => {
                        this.OrderEntryForm.value.ATRID = res.atR_ID;
                        this.PAT_ID = this.OrderEntryForm.value.PAT_ID;
                        this.ORD_NO = this.OrderEntryForm.value.ORD_NO;

                        this.ATRTable = [];
                        Swal.fire({
                          title: successMessage,
                          text: successMessage,
                          icon: 'success'
                        })
                        //this.BtnRevert();

                        const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
                        BtnFirst?.removeAttribute('disabled');
                        const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
                        BtnPrevious?.removeAttribute('disabled');
                        const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
                        BtnNext?.removeAttribute('disabled');
                        const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
                        BtnLast?.removeAttribute('disabled');
                        const BtnCollect = document.getElementById('BtnCollect') as HTMLElement | null;
                        BtnCollect?.removeAttribute('disabled');
                        //Get the last inserted record
                        this.SearchOrderTrans();
                        this.diabledOrderPatientInformations();
                      },
                      error: (err) => {
                        //alert(" Create New ATR Error");
                        this.OrderEntryForm.patchValue({ ORD_NO: "" });
                        Swal.fire({
                          title: "Error in adding Active Tests Request!",
                          text: errorMessage,
                          icon: 'error'
                        })
                      }
                    })

                },
                error: (err) => {
                  //alert(" Create New ORD TRANS Error");
                  this.OrderEntryForm.patchValue({ ORD_NO: "" });
                  Swal.fire({
                    title: "Error in generating Order Number!",
                    text: errorMessage,
                    icon: 'error'
                  })
                }
              })
          } else {
            //this.OrderEntryForm.patchValue(this.OrderEntryForm.value);
            const PAT_NAME = document.getElementById("PAT_NAME") as HTMLInputElement | null;
            if (PAT_NAME.disabled == false) {
              this.orderentryService.UpdateOrdersTransactionsDetails(this.OrderEntryForm.value)
                .subscribe({
                  next: (res) => {
                    if (res) {
                      Swal.fire({
                        title: "Order Transaction successfully updated",
                        text: "Order Transaction successfully updated",
                        icon: 'success'
                      })
                      //Get the last inserted record
                      this.SearchOrderTrans();
                      //this.BtnRevert();
                      const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
                      BtnFirst?.removeAttribute('disabled');
                      const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
                      BtnPrevious?.removeAttribute('disabled');
                      const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
                      BtnNext?.removeAttribute('disabled');
                      const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
                      BtnLast?.removeAttribute('disabled');
                      const BtnCollect = document.getElementById('BtnCollect') as HTMLElement | null;
                      BtnCollect?.removeAttribute('disabled');
                      this.diabledOrderPatientInformations();
                    } else {
                      Swal.fire({
                        title: "Error in updating Order trasanction!",
                        text: errorMessage,
                        icon: 'error'
                      })
                    }
                  },
                  error: (err) => {
                    //alert(" Add New ATR Error");
                    Swal.fire({
                      title: "Error in adding Active Tests Request!",
                      text: errorMessage,
                      icon: 'error'
                    })
                  }
                })
              return;
            }
            this.OrderEntryForm.value.ORD_NO = (searchOrder.value == '' || searchOrder.value == null) ? res.geT_ORD_TRNS.orD_NO.toString() : searchOrder.value;//res.geT_ORD_TRNS.orD_NO.toString();
            searchOrder.value = (searchOrder.value == '' || searchOrder.value == null) ? res.geT_ORD_TRNS.orD_NO.toString() : searchOrder.value;
            this.OrderEntryForm.value.LN = "0" + (this.ATRTable.length + 1).toString();
            this.OrderEntryForm.value.STS = "OD";
            this.OrderEntryForm.value.R_STS = "O";
            this.orderentryService.ADD_ATR(this.ATRTable, //this.OrderEntryForm.value,//
              this.OrderEntryForm.value.SEX,
              this.OrderEntryForm.value.CN,
              this.OrderEntryForm.value.DOB,
              this.OrderEntryForm.value.DRNO,
              this.OrderEntryForm.value.LOC,
              this.OrderEntryForm.value.PRFX,
              this.OrderEntryForm.value.CLN_IND,
              this.OrderEntryForm.value.ORD_NO)
              .subscribe({
                next: (res) => {
                  this.OrderEntryForm.value.ATRID = res.atR_ID;
                  this.PAT_ID = this.OrderEntryForm.value.PAT_ID;
                  this.ORD_NO = this.OrderEntryForm.value.ORD_NO;

                  this.ATRTable = [];
                  Swal.fire({
                    title: successMessage,
                    text: successMessage,
                    icon: 'success'
                  })
                  //Get the last inserted record
                  this.SearchOrderTrans();
                  //this.BtnRevert();
                  const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
                  BtnFirst?.removeAttribute('disabled');
                  const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
                  BtnPrevious?.removeAttribute('disabled');
                  const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
                  BtnNext?.removeAttribute('disabled');
                  const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
                  BtnLast?.removeAttribute('disabled');
                  const BtnCollect = document.getElementById('BtnCollect') as HTMLElement | null;
                  BtnCollect?.removeAttribute('disabled');
                  this.diabledOrderPatientInformations();
                },
                error: (err) => {
                  //alert(" Add New ATR Error");
                  Swal.fire({
                    title: "Error in adding Active Tests Request!",
                    text: errorMessage,
                    icon: 'error'
                  })
                }
              })

          }

        },
        error: (err) => {
          //alert("Get New ORDER Number Error.");
          Swal.fire({
            title: "Error in generating Order Number!",
            text: errorMessage,
            icon: 'error'
          })
        }
      })
  }

  BindCancelReason() {
    this.orderentryService.GET_CNLCD()
      .subscribe({
        next: (res) => {

          //this.BindDatatables(res);

          this.isLoaded = true;
          for (var i = 0; i < res.length; i++) {  // loop through the object array
            this.cancelreason.push(res[i]);        // push each element to sys_id
          }
          this.isLoaded = false;

        },
        error: (err) => {
        }
      })
  }

  cancelreasonselected: any = this.cancelreason[0];
  cancelreasonseLog(cancelreasonselected) {
    var AreaNOTES = document.getElementById("AreaNOTES") as HTMLInputElement | null;
    AreaNOTES.value = cancelreasonselected.descrip;
    this.OrderEntryForm.patchValue({ AreaNOTES: cancelreasonselected.descrip });
  }


  showModalCancelReason(ATRID) {
    //alert(ATRID.atR_ID);

    if (ATRID.atR_ID == undefined) {
      //alert(ATRID.ln);

      const ATRTable1 = this.ATRTable;

      Swal.fire({
        title: 'Are you sure you want to remove the test order?',
        text: "Remove Order test",
        showDenyButton: true,
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.ATRTable.splice(ATRID, 1);
          Swal.fire({
            title: 'Remove successfully!',
            text: 'Candidates are successfully shortlisted!',
            icon: 'success'
          })
        } else if (result.isDenied) {
          Swal.fire("Cancelled", "The Test order is not remove.", 'info')
          return;
        }
      })

      return
    }

    this.BindCancelReason();

    var LblARTID = document.getElementById("LblARTID") as HTMLInputElement | null;
    LblARTID.innerText = ATRID.atR_ID;

    var InputCode = document.getElementById("InputCode") as HTMLInputElement | null;
    InputCode.value = ATRID.reQ_CODE;

    var InputFullName = document.getElementById("InputFullName") as HTMLInputElement | null;
    InputFullName.value = ATRID.fulL_NAME;

    var InputSect = document.getElementById("InputSect") as HTMLInputElement | null;
    InputSect.value = ATRID.sect;

    const modalCancelReason = document.getElementById('modalCancelReason') as HTMLElement;
    const myModal = new Modal(modalCancelReason);
    myModal.show();
  }

  showModalAddNotes(ATRID) {
    //alert(ATRID.atR_ID);
    if (ATRID.atR_ID == undefined) {
      Swal.fire({
        title: 'Information!',
        text: "It will only add notes if the orders is processed."
      })
      return;
    }
    /*this.BindCancelReason();*/
    var LblARTID = document.getElementById("LblARTID_Notes") as HTMLInputElement | null;
    LblARTID.innerText = ATRID.atR_ID;

    var InputCode = document.getElementById("InputCode") as HTMLInputElement | null;
    InputCode.value = ATRID.reQ_CODE;

    var InputFullName = document.getElementById("InputFullName") as HTMLInputElement | null;
    InputFullName.value = ATRID.fulL_NAME;

    this.ATRNotes = ATRID.notes;

    const modalAddNotes = document.getElementById('modalAddNotes') as HTMLElement;
    const myModal = new Modal(modalAddNotes);
    myModal.show();
  }

  cancelOrder() {
    var LblARTID = document.getElementById("LblARTID") as HTMLInputElement | null;
    var InputCode = document.getElementById("InputCode") as HTMLInputElement | null;
    var InputSect = document.getElementById("InputSect") as HTMLInputElement | null;
    var AreaNOTES = document.getElementById("AreaNOTES") as HTMLInputElement | null;

    this.PAT_ID = this.OrderEntryForm.value.PAT_ID;
    this.ORD_NO = this.OrderEntryForm.value.ORD_NO;

    this.orderentryService.Update_ATR(parseInt(LblARTID.innerText), 'X', 'X', AreaNOTES.value, this.selectedSite, this.selectedUserId, this.ORD_NO, InputSect.value, InputCode.value)
      .subscribe({
        next: (res) => {

          this.BindATRTable(this.PAT_ID, this.ORD_NO);

          Swal.fire({
            title: 'Cancelled successfully!',
            text: cancelRequest,
            icon: 'success'
          })

        },
        error: (err) => {
          alert(err?.error.message);
        }
      })
    //this.ATRTable = [];
    //this.BindATRTable();
  }


  /***************Serach Order***********/
  SearchOrderTrans() {

    const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;

    if (searchOrder.value) {
      this.orderentryService.GET_v_ORD_TRANS(' ', searchOrder.value)
        .subscribe({
          next: (res) => {

            const PAT_ID = document.getElementById("PAT_ID") as HTMLInputElement | null;
            const PAT_NAME = document.getElementById("PAT_NAME") as HTMLInputElement | null;
            const CN = document.getElementById("CN") as HTMLInputElement | null;
            const client = document.getElementById("client") as HTMLInputElement | null;

            const SEX = document.getElementById("SEX") as HTMLInputElement | null;
            const DOB = document.getElementById("DOB") as HTMLInputElement | null;
            const SAUDI = document.getElementById("SAUDI") as HTMLInputElement | null;
            const NATIONALITY = document.getElementById("NATIONALITY") as HTMLInputElement | null;
            const IDNT = document.getElementById("IDNT") as HTMLInputElement | null;
            const LOC = document.getElementById("LOC") as HTMLInputElement | null;
            const descrp = document.getElementById("descrp") as HTMLInputElement | null;
            const DRNO = document.getElementById("DRNO") as HTMLInputElement | null;
            const doctor = document.getElementById("doctor") as HTMLInputElement | null;

            const REF_NO = document.getElementById("REF_NO") as HTMLInputElement | null;
            const TEL = document.getElementById("TEL") as HTMLInputElement | null;
            const cmbSalesmen = document.getElementById("cmbSalesmen") as HTMLInputElement | null;
            const EMAIL = document.getElementById("EMAIL") as HTMLInputElement | null;
            const cmbOrdertype = document.getElementById("cmbOrdertype") as HTMLInputElement | null;
            const Req = document.getElementById("Req") as HTMLInputElement | null;
            const RSVRD_DTTM = document.getElementById("RSVRD_DTTM") as HTMLInputElement | null;

            PAT_ID.value = res.geT_v_ORD_TRANS.paT_ID;
            PAT_NAME.value = res.geT_v_ORD_TRANS.paT_NAME;
            CN.value = res.geT_v_ORD_TRANS.cn;
            client.innerText = res.geT_v_ORD_TRANS.client;
            SEX.value = res.geT_v_ORD_TRANS.sex;
            let temp = res.geT_v_ORD_TRANS.dob;
            let date = new Date(temp);
            DOB.value = date.toISOString().slice(0, 10);
            SAUDI.value = res.geT_v_ORD_TRANS.saudi;
            NATIONALITY.value = res.geT_v_ORD_TRANS.nationality;
            IDNT.value = res.geT_v_ORD_TRANS.idnt;
            LOC.value = res.geT_v_ORD_TRANS.loc;
            descrp.innerText = res.geT_v_ORD_TRANS.descrp;
            DRNO.value = res.geT_v_ORD_TRANS.drno;
            doctor.innerText = res.geT_v_ORD_TRANS.doctor;

            REF_NO.value = res.geT_v_ORD_TRANS.reF_NO;
            TEL.value = res.geT_v_ORD_TRANS.tel;
            cmbSalesmen.value = res.geT_v_ORD_TRANS.smc;
            EMAIL.value = res.geT_v_ORD_TRANS.email;
            cmbOrdertype.value = res.geT_v_ORD_TRANS.otp;
            //Req.innerText = res.geT_v_ORD_TRANS.doctor;
            RSVRD_DTTM.value = res.geT_v_ORD_TRANS.rsvrD_DTTM;

            this.OrderEntryForm.patchValue({ PAT_ID: res.geT_v_ORD_TRANS.paT_ID });
            this.OrderEntryForm.patchValue({ PAT_NAME: res.geT_v_ORD_TRANS.paT_NAME });
            this.OrderEntryForm.patchValue({ SEX: res.geT_v_ORD_TRANS.sex });

            this.OrderEntryForm.patchValue({ DOB: DOB.value });//res.geT_v_ORD_TRANS.dob });

            this.OrderEntryForm.patchValue({ SAUDI: res.geT_v_ORD_TRANS.saudi });
            this.OrderEntryForm.patchValue({ NATIONALITY: res.geT_v_ORD_TRANS.nationality });
            this.natid = res.geT_v_ORD_TRANS.nationality;
            this.OrderEntryForm.patchValue({ IDNT: res.geT_v_ORD_TRANS.idnt });
            this.OrderEntryForm.patchValue({ DRNO: res.geT_v_ORD_TRANS.drno });
            this.OrderEntryForm.patchValue({ REF_NO: res.geT_v_ORD_TRANS.reF_NO });
            this.OrderEntryForm.patchValue({ TEL: res.geT_v_ORD_TRANS.tel });

            this.OrderEntryForm.patchValue({ SMC: res.geT_v_ORD_TRANS.scM_DESC });
            this.scmid = res.geT_v_ORD_TRANS.smc;
            this.OrderEntryForm.patchValue({ OTP: res.geT_v_ORD_TRANS.otp + " " + res.geT_v_ORD_TRANS.otP_DESC });
            this.otpid = res.geT_v_ORD_TRANS.otp;
            this.OrderEntryForm.patchValue({ EMAIL: res.geT_v_ORD_TRANS.email });
            this.OrderEntryForm.patchValue({ CN: res.geT_v_ORD_TRANS.cn });
            this.OrderEntryForm.patchValue({ LOC: res.geT_v_ORD_TRANS.loc });

            this.OrderEntryForm.patchValue({ ORD_NO: res.geT_v_ORD_TRANS.orD_NO });

            this.OrderEntryForm.patchValue({ CLN_IND: res.geT_v_ORD_TRANS.clN_IND });

            this.OrderEntryForm.patchValue({ SITE_NO: res.geT_v_ORD_TRANS.sitE_NO });
            this.OrderEntryForm.value.ORD_NO = res.geT_v_ORD_TRANS.orD_NO;

            this.PAT_ID = res.geT_v_ORD_TRANS.paT_ID;
            this.ORD_NO = res.geT_v_ORD_TRANS.orD_NO;

            //Issuing Invoice Only
            this.OrderEntryForm.patchValue({ CASH: res.geT_v_ORD_TRANS.cash == 'N' ? false : true });
            this.OrderEntryForm.patchValue({ TOTDSCNT: res.geT_v_ORD_TRANS.totdscnt });
            this.OrderEntryForm.patchValue({ TOT_VALUE: res.geT_v_ORD_TRANS.toT_VALUE });
            this.OrderEntryForm.patchValue({ DSCAMNT: res.geT_v_ORD_TRANS.dscamnt });
            this.OrderEntryForm.patchValue({ NET_VALUE: res.geT_v_ORD_TRANS.neT_VALUE });
            this.OrderEntryForm.patchValue({ PAID: res.geT_v_ORD_TRANS.paid });

            this.OrderEntryForm.patchValue({ RMNG: res.geT_v_ORD_TRANS.granD_VAL - res.geT_v_ORD_TRANS.paid }); //res.geT_v_ORD_TRANS.rmng });

            this.OrderEntryForm.patchValue({ VAT: res.geT_v_ORD_TRANS.vat });
            this.OrderEntryForm.patchValue({ GRAND_VAL: res.geT_v_ORD_TRANS.granD_VAL });
            this.OrderEntryForm.patchValue({ EXTRDSCT: res.geT_v_ORD_TRANS.extrdsct });
            this.OrderEntryForm.patchValue({ PAYTP: res.geT_v_ORD_TRANS.paytp });
            this.OrderEntryForm.patchValue({ VC_NO: res.geT_v_ORD_TRANS.vC_NO });

            this.BindATRTable(this.PAT_ID, this.ORD_NO);

            //this.BindOrderDetails(this.PAT_ID, this.ORD_NO);

            this.btnDisabled = false;

            //const BtnPRNew = document.getElementById('BtnPRNew') as HTMLElement | null;
            //BtnPRNew?.setAttribute('disabled', '');

            const BtnPRSave = document.getElementById('BtnPRSave') as HTMLElement | null;
            BtnPRSave?.setAttribute('disabled', '');

            const BtnPRNew = document.getElementById('BtnPRNew') as HTMLElement | null;
            BtnPRNew?.removeAttribute('disabled');


            const BtnAdd = document.getElementById('BtnAdd') as HTMLElement | null;
            BtnAdd?.setAttribute('disabled', '');

            const BtnCancel = document.getElementById('BtnCancel') as HTMLElement | null;
            BtnCancel?.setAttribute('disabled', '');

          },
          error: (err) => {
            alert(err?.error.message);
          }
        })
    }
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

  ngAfterViewInitCollections() {
    //alert();
    var sitE_NO = '';
    var tbl = document.getElementById("TableOrderCollection") as HTMLTableElement | null;
    for (var i = 1; i < tbl.rows.length; i++) {
      sitE_NO = ((this.OrderDetailsTable[i - 1].sitE_NO == '' || this.OrderDetailsTable[i - 1].sitE_NO == null) ? null : this.OrderDetailsTable[i - 1].sitE_NO);

      if (sitE_NO == '' || sitE_NO == null || sitE_NO == 'null') {

        tbl.rows[i].cells[4].getElementsByTagName("select")[0].value = this.selectedSite;
        //tbl.rows[i].cells[4].getElementsByTagName("select")[0].onchange;
      }
      else {
        tbl.rows[i].cells[4].getElementsByTagName("select")[0].value = this.OrderDetailsTable[i - 1].sitE_NO;
        //tbl.rows[i].cells[4].getElementsByTagName("select")[0].onchange;
      }

      this.PrintBarcodeCollection(this.OrderDetailsTable[i - 1].accn);

    }
  }

  BindSiteDetatils() {
    this.sitedetailslist = [];
    this.orderentryService.GetAllSiteDetails()
      .subscribe({
        next: (res) => {

          for (var i = 0; i < res.length; i++) {  // loop through the object array
            this.sitedetailslist.push(res[i]);        // push each element to sys_id

          }


        },
        error: (err) => {
        }

      })
  }

  CollectTest() {

    this.PAT_ID = this.OrderEntryForm.value.PAT_ID;
    this.ORD_NO = this.OrderEntryForm.value.ORD_NO;
    //this.BindOrderDetails(this.PAT_ID, this.ORD_NO);
    if (this.OrderDetailsTable.length >= 0) {
      setTimeout(() => {
        this.ngAfterViewInitCollections();
      }, 1000);
    }

    const exampleModalToggle = document.getElementById('exampleModalToggle') as HTMLElement;
    const myModal = new Modal(exampleModalToggle);
    myModal.show();


  }


  SubmitCollected() {

    var tbl = document.getElementById("TableOrderCollection") as HTMLTableElement;
    var rCount = tbl.rows.length;
    var ATR_ID = '';
    var STS = '';
    var DRAWN_DTTM = '';
    var ACCN = '';
    var REQ_CODE = '';
    var ORD_NO = '';
    var SECT = '';
    var MDL = '';
    var SITE_NO = '';
    var REF_SITE = '';
    var DOB = '';
    var SEX = '';
    this.collectionOrderlist = [];

    this.OrderEntryForm.controls['SEX'].enable();
    this.OrderEntryForm.controls['OTP'].enable();
    this.OrderEntryForm.controls['SMC'].enable();
    this.OrderEntryForm.controls['SAUDI'].enable();
    this.OrderEntryForm.controls['NATIONALITY'].enable();
    for (var i = 1; i < tbl.rows.length; i++) {

      let date = new Date(tbl.rows[i].cells[5].getElementsByTagName("input")[0].value);

      ATR_ID = this.OrderDetailsTable[i - 1].atrid;
      STS = 'CO';//this.OrderDetailsTable[i - 1].sts;
      DRAWN_DTTM = tbl.rows[i].cells[5].getElementsByTagName("input")[0].value;
      ACCN = (this.OrderDetailsTable[i - 1].accn == '' ? null : this.OrderDetailsTable[i - 1].accn);
      REQ_CODE = this.OrderDetailsTable[i - 1].reQ_CODE;
      ORD_NO = this.OrderDetailsTable[i - 1].orD_NO;
      SECT = this.OrderDetailsTable[i - 1].sect;
      MDL = this.OrderDetailsTable[i - 1].mdl;
      SITE_NO = tbl.rows[i].cells[4].getElementsByTagName("select")[0].value;
      DOB = this.OrderEntryForm.value.DOB;
      SEX = this.OrderEntryForm.value.SEX;
      REF_SITE = tbl.rows[i].cells[4].getElementsByTagName("select")[0].value;

      this.collectionOrderlist.push({
        ATR_ID: ATR_ID,
        STS: STS,
        DRAWN_DTTM: DRAWN_DTTM,
        ACCN: ACCN,
        REQ_CODE: REQ_CODE,
        ORD_NO: ORD_NO,
        SECT: SECT,
        REF_SITE: REF_SITE,// SITE_NO.substring(1,4)
        SITE_NO: SITE_NO,
        U_ID: this.selectedUserId,
        MDL: MDL,
        DOB: DOB,
        SEX: SEX
      })

    }
    //console.log(this.collectionOrderlist);
    //return;

    this.orderentryService.Collected_ATR(this.collectionOrderlist, ATR_ID, 'CO', DRAWN_DTTM, 'ACCN', REQ_CODE, ORD_NO, SECT, SITE_NO.substring(1, 4))
      .subscribe({
        next: (res) => {

          Swal.fire({
            title: 'Collected successfully!',
            text: collectedRequest,
            icon: 'success'
          })
          this.BindATRTable(this.PAT_ID, this.ORD_NO);
          //this.BindOrderDetails(this.PAT_ID, this.ORD_NO);
          if (this.OrderDetailsTable.length >= 0) {
            setTimeout(() => {
              this.ngAfterViewInitCollections();
              this.OrderEntryForm.controls['SEX'].disable();
              this.OrderEntryForm.controls['OTP'].disable();
              this.OrderEntryForm.controls['SMC'].disable();
              this.OrderEntryForm.controls['SAUDI'].disable();
              this.OrderEntryForm.controls['NATIONALITY'].disable();
            }, 1500);
          }
        },
        error: (err) => {
          alert(err?.error.message);
        }
      })

    //this.BindATRTable(this.PAT_ID, this.ORD_NO);

    //Swal.fire({
    //  text: collectedRequest,
    //})



    //const exampleModalToggle2 = document.getElementById('exampleModalToggle2') as HTMLElement;
    //const myModal = new Modal(exampleModalToggle2);
    //myModal.show();
  }

  ApplyCollection() {

    var tbl = document.getElementById("TableOrderCollection") as HTMLTableElement;
    var rCount = tbl.rows.length;
    for (var i = 1; i < tbl.rows.length; i++) {
      tbl.rows[i].cells[5].getElementsByTagName("input")[0].value = tbl.rows[1].cells[5].getElementsByTagName("input")[0].value;
    }

  }

  showBarCode() {
    if (this.OrderDetailsTable[0].accn == '') {
      Swal.fire({
        title: 'Accesion Number is empty!',
        text: "cannot generate barcode",
        icon: 'info'
      })
      return;
    }

    this.BindBarcode();
    /*
    const BarcodeModal = document.getElementById('BarcodeModal') as HTMLElement;
    const myModal = new Modal(BarcodeModal);
    myModal.show();
    */
    //const barCodeModal = document.getElementById('barCodeModal') as HTMLElement;
    //const myModal = new Modal(barCodeModal);
    //myModal.show();

  }


  BindBarcode() {
    this.barcode = [];
    this.orderentryService.GET_BARCODE(this.ORD_NO)
      .subscribe({
        next: (res) => {

          for (var i = 0; i < res.geT_BARCODE.length; i++) {  // loop through the object array
            this.barcode.push(res.geT_BARCODE[i]);        // push each element to sys_id
            this.PrintBarcodeCollection(res.geT_BARCODE[i].accn);
            //console.log(res.geT_BARCODE[i].accn);
          }
        },
        error: (err) => {
        }
      })

    const BarcodeModal = document.getElementById('BarcodeModal') as HTMLElement;
    const myModal = new Modal(BarcodeModal);
    myModal.show();
  }

  CheckBarcode() {
    var tbl = document.getElementById("TableBarcode") as HTMLTableElement;
    var rCount = tbl.rows.length;
    for (var i = 1; i < tbl.rows.length; i++) {
      tbl.rows[i].cells[3].getElementsByTagName("input")[0].checked = true;
    }
  }
  PrintBarcodeCollection(accn: any) {
    if (accn == '') {
      return '';
    }
    return this.orderentryService.getBarcode(accn).subscribe(res => {
      this.resbarcode = res;
      this.imageSource = 'data:image/png;base64 ,' + this.resbarcode.messages;
      //this.imageSource = 'data:image/png;base64 ,' +  res[0].message;//this.barcode[0];
    })
  }


  showQRCode(mbQRSearch: any) {
    this.orderentryService.getQRcode(mbQRSearch).subscribe(x => {
      this.resQRCode = x;
      this.imageSource = 'data:image/png;base64 ,' + this.resQRCode.messages;
    })
  }

  PrintBarcode(barcode: any) {

    console.log(this.barcode);

    var tbl = document.getElementById("TableBarcode") as HTMLTableElement;
    //var bcTarget = document.getElementById("bcTarget") as HTMLElement;// HTMLDivElement;
    var BarCodeDate = document.getElementById("BarCodeDate") as HTMLInputElement;
    var BarCodeAccn = document.getElementById("BarCodeAccn") as HTMLInputElement;
    var BarPAT_ID = document.getElementById("BarPAT_ID") as HTMLInputElement;
    var BarSex = document.getElementById("BarSex") as HTMLInputElement;
    var BarPAT_NAME = document.getElementById("BarPAT_NAME") as HTMLInputElement;
    var BarAge = document.getElementById("BarAge") as HTMLInputElement;

    // 1. Select the div element using the id property
    const divBarcode = document.getElementById("divBarcode");
    divBarcode.innerHTML = '';
    var rCount = tbl.rows.length;

    const mbQRSearch = new mbListQRModel();
    mbQRSearch.accn = '';
    for (var i = 1; i < tbl.rows.length; i++) {

      if (tbl.rows[i].cells[3].getElementsByTagName("input")[0].checked == true) {

        //BarPAT_ID.innerHTML = parseInt( this.barcode[i - 1].paT_ID).toString();
        //BarSex.innerHTML = this.barcode[i - 1].sex;
        //BarPAT_NAME.innerHTML = this.barcode[i - 1].paT_NAME;

        var ACCN = this.barcode[i - 1].accn;
        //BarCodeAccn.innerHTML = ACCN;


        const today = new Date();
        const yyyy = today.getFullYear();
        var mm = today.getMonth() + 1; // Months start at 0!
        var dd = today.getDate();
        var hh = today.getHours();
        var mi = today.getMinutes();
        const formattedToday = (dd < 10 ? '0' + dd : dd) + '/' + (mm < 10 ? '0' + mm : mm) + '/' + yyyy + ' ' + (hh < 10 ? '0' + hh : hh) + ':' + (mi < 10 ? '0' + mi : mi);
        //BarCodeDate.innerHTML = formattedToday;

        //Age

        var birthdate = document.getElementById("DOB") as HTMLInputElement;
        var difference = new Date(birthdate.value);
        let timeDiff = Math.abs(Date.now() - difference.getTime());
        let Totalage = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        //BarAge.innerHTML = Totalage.toString()+ ' Y';

        //$("#bcTarget").barcode(ACCN, "code128");



        //////////////////////////////////////////////////////////////////////////////////////////
        // 1. Select the div element using the id property
        const divBarcode = document.getElementById("divBarcode");
        divBarcode.setAttribute("style", 'visibility: hidden;')


        // 2. Create a new <p></p> element programmatically
        const div1 = document.createElement("pre");
        div1.setAttribute("style", 'display: flex;flex-direction: row; margin-bottom: 0px;border: 0px; padding-left: 10px;')

        const div2 = document.createElement("div");
        const LblBarPAT_ID = document.createElement("label");
        LblBarPAT_ID.setAttribute("style", 'font-size:11px; font-weight:bold; margin-bottom: 0px;')


        const div3 = document.createElement("pre");
        div3.setAttribute("style", 'display: flex;flex-direction: row; margin-bottom: 0px; border: 0px;')
        const div4 = document.createElement("div");
        const LblBarSex = document.createElement("label");
        LblBarSex.setAttribute("style", 'font-size:11px; font-weight:bold')

        const div5 = document.createElement("pre");
        div5.setAttribute("style", 'display: flex;flex-direction: row; margin-bottom: 0px; padding-left: 10px; border: 0px; padding-left: 10px;')
        const div6 = document.createElement("div");
        const LblBarAge = document.createElement("label");
        LblBarAge.setAttribute("style", 'font-size:11px; font-weight:bold')

        const div7 = document.createElement("pre");
        div7.setAttribute("style", 'display: flex;flex-direction: row; margin-bottom: 0px; margin-left: 0px;border: 0px; padding-left: 0px;')
        const div8 = document.createElement("div");
        const LblBarPAT_NAME = document.createElement("label");
        LblBarPAT_NAME.setAttribute("style", 'font-size:11px; font-weight:bold; margin-bottom: 0px;')

        const div10 = document.createElement("div");
        const div11 = document.createElement("div");
        const div12 = document.createElement("div");
        this.orderentryService.getBarcode(ACCN).subscribe(res => {

          var bcodeTarget = document.createElement("img");
          bcodeTarget.setAttribute("id", "barcodeTarget" + i);
          bcodeTarget.setAttribute("style", "height: 30px; width: 19%");

          this.resbarcode = res;
          this.imageSource = 'data:image/png;base64 ,' + this.resbarcode.messages;
          bcodeTarget.src = 'data:image/png;base64 ,' + this.resbarcode.messages;


          var QRCodeTarget = document.createElement("img");
          QRCodeTarget.setAttribute("id", "QRCodeTarget" + i);
          QRCodeTarget.setAttribute("style", "width: 50px");


          mbQRSearch.accn = ACCN;
          this.orderentryService.getQRcode(mbQRSearch).subscribe(x => {
            this.resQRCode = x;
            console.log(x);
            this.imageSource = 'data:image/png;base64 ,' + this.resQRCode.messages;
            QRCodeTarget.src = 'data:image/png;base64 ,' + this.resQRCode.messages;
          })


          //this.resQRCode = res;
          //this.imageSource = 'data:image/png;base64 ,' + this.resQRCode.messages;
          //QRCodeTarget.src = 'data:image/png;base64 ,' + this.resQRCode.messages;

          const br1 = document.createElement("br");
          const div9 = document.createElement("div");
          const LblBarACCN = document.createElement("label");
          LblBarACCN.setAttribute("style", 'font-size:11px; font-weight:bold; margin-bottom: 0;top: 4px; position: absolute;')

          const LblBarDateTime = document.createElement("label");
          LblBarDateTime.setAttribute("style", 'font-size:11px; font-weight:normal;')

          const barC = document.createElement("div");
          // 3. Add the text content
          LblBarPAT_ID.innerHTML = parseInt(this.barcode[0].paT_ID).toString() + "        " + this.barcode[0].sex + "        " + Totalage.toString() + ' Y';;;
          //LblBarSex.innerHTML = this.barcode[0].sex;
          //LblBarAge.innerHTML = Totalage.toString() + ' Y';

          LblBarPAT_NAME.innerHTML = this.barcode[0].paT_NAME;

          LblBarACCN.innerHTML = ACCN;
          LblBarDateTime.innerHTML = formattedToday;

          // 4. Append the p element to the div element
          divBarcode?.appendChild(div1);
          div1.className = 'row';

          div1?.appendChild(div2);
          div2.className = 'col-lg-2';
          div2?.appendChild(LblBarPAT_ID);

          /*
                    div1?.appendChild(div4);
                    div4.className = 'col-lg-1';
                    div4?.appendChild(LblBarSex);
          
                    div1?.appendChild(div6);
                    div6.className = 'col-lg-1';
                    div6?.appendChild(LblBarAge);
          
          */
          divBarcode?.appendChild(div5);
          div5.className = 'row';
          div5?.appendChild(LblBarPAT_NAME);

          divBarcode?.appendChild(div3);
          div3.className = 'row';
          div3?.appendChild(bcodeTarget);


          divBarcode?.appendChild(div7);
          div7.className = 'row';

          div7?.appendChild(div10);
          div10.className = 'col-lg-5';
          div10?.appendChild(QRCodeTarget);
          div10?.appendChild(LblBarACCN);
          div10?.appendChild(LblBarDateTime);
          /*
                    div7?.appendChild(div8);
                    div8.className = 'col-lg-4';
          
                    div8?.appendChild(div11);
                    //div11.className = 'row';
                    div11?.appendChild(div12);
                    div12.className = 'col-lg-6';
                    div10?.appendChild(LblBarACCN );
                    //div11?.appendChild(br1);
                    div11?.appendChild(div9);
                    div9.className = 'col-lg-6';
                    div10?.appendChild(LblBarDateTime);
          */
        })

      }
    }

    setTimeout(() => {
      this.printTestBarcode();
      divBarcode.setAttribute("style", 'visibility: hidden;')
    }, 2000);



  }

  printTestBarcode() {

    const printContents = document.getElementById('divBarcode').innerHTML;
    /* const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
   document.body.innerHTML = originalContents;
  
  
  var myPrintContent = document.getElementById('divBarcode');
          var myPrintWindow = window.open('','','');
          myPrintWindow.document.write('<html><head>');
          myPrintWindow.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
  
          myPrintWindow.document.write('</head><body>');
          myPrintWindow.document.write(myPrintContent.innerHTML);
          myPrintWindow.document.write('<style type="text/css"> @page { size: auto } </style>');
          myPrintWindow.document.write('</body></html>');            
          //myPrintWindow.document.getElementById('hidden_div').style.display = 'block';
          myPrintWindow.document.close();
          myPrintWindow.focus();
          myPrintWindow.print();
          return false;
  
  */
    var divToPrint = document.getElementById('divBarcode');
    var newWin = window.open('', 'Print-Window');
    //var myStyle = '<link rel="stylesheet" href="../assets/css/clients.css" />';
    newWin.document.open();
    newWin.document.write('<html><head>' +
      //'<link href="../jhp-1.0/css/custom.css" rel="stylesheet" type="text/css" />'+
      //'<link href="../Content/DataTables/css/select.bootstrap.min.css" rel="stylesheet" type="text/css" />'+
      '<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" type="text/css" />' +
      '<link rel="stylesheet" href="../../assets/css/index.css" />' +
      '<link rel="stylesheet" href="../../assets/css/clients.css" />' +
      '<body onload="window.print()">' +
      '<script src="https://code.jquery.com/jquery-1.12.3.min.js" type="text/javascript"></script>' +
      '<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" type="text/javascript"></script>' +
      '<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" type="text/javascript"></script>' +
      //'<script src="../jhp-1.0/js/custom.min.js"></script> '+
      //'<script src="../Scripts/jquery-qrcode.js"></script> ' + 
      divToPrint.innerHTML +
      '</body>' +
      '</head></html>');
    newWin.document.close();
    setTimeout(function () { newWin.close(); }, 800);

    /*
      var mywindow = window.open('', 'new div', 'height=400,width=600');
          mywindow.document.write('<html><head><title></title>');
          mywindow.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"  media="screen,print" type="text/css" />');
          mywindow.document.write('</head><body >');
          mywindow.document.write(printContents);
          mywindow.document.write('</body></html>');
          mywindow.document.close();
          mywindow.focus();
          //setTimeout(function(){mywindow.print();},1000);
          //mywindow.close();
    
          setTimeout(function () {
            mywindow.print();
            mywindow.close();
            }, 1000)
            return true;
    
          //return true;
    */

  }

  /* Navigation button */

  /* Clear Order Entry Test*/
  clearOrderEntryTest() {
    const TCODE = document.getElementById('TCODE') as HTMLInputElement;
    const SITE_NO = document.getElementById('SITE_NO') as HTMLInputElement;
    const COL_DATE_TIME = document.getElementById('COL_DATE_TIME') as HTMLInputElement;
    const STS = document.getElementById('STS') as HTMLInputElement;
    const DT = document.getElementById('DT') as HTMLInputElement;
    const UPRICE = document.getElementById('UPRICE') as HTMLInputElement;
    const DSCNT = document.getElementById('DSCNT') as HTMLInputElement;
    const DPRICE = document.getElementById('DPRICE') as HTMLInputElement;
    const FULL_NAME = document.getElementById('FULL_NAME') as HTMLInputElement;
    const ACCN = document.getElementById('ACCN') as HTMLInputElement;
    const ST = document.getElementById('ST') as HTMLInputElement;
    var checkAutoSpecemenLogin = <HTMLInputElement>document.getElementById("checkAutoSpecemenLogin");
    TCODE.value = '';
    SITE_NO.value = '';
    COL_DATE_TIME.value = '';
    STS.innerText = '';
    DT.innerText = '';
    UPRICE.value = '';
    DPRICE.value = '';
    FULL_NAME.innerText = '';
    ACCN.value = '';
    ST.value = '';
    DSCNT.value = '';
    checkAutoSpecemenLogin.checked = false;
  }
  /* End Clear Order Entry Test */

  /* Disable Order Patient Informations*/
  diabledOrderPatientInformations() {
    const PAT_ID = document.getElementById('PAT_ID') as HTMLInputElement;
    const PAT_NAME = document.getElementById('PAT_NAME') as HTMLInputElement;
    const DOB = document.getElementById('DOB') as HTMLInputElement;
    const Age = document.getElementById('Age') as HTMLInputElement;
    const SEX = document.getElementById('SEX') as HTMLSelectElement;
    const CLN_IND = document.getElementById('CLN_IND') as HTMLInputElement;
    const SAUDI = document.getElementById('SAUDI') as HTMLInputElement;
    const NATIONALITY = document.getElementById('NATIONALITY') as HTMLInputElement;
    const IDNT = document.getElementById('IDNT') as HTMLInputElement;
    const LOC = document.getElementById('LOC') as HTMLInputElement;
    const CN = document.getElementById('CN') as HTMLInputElement;
    const DRNO = document.getElementById('DRNO') as HTMLInputElement;
    const InsNo = document.getElementById('InsNo') as HTMLInputElement;
    const SITE_NO = document.getElementById('SITE_NO') as HTMLInputElement;
    const REF_NO = document.getElementById('REF_NO') as HTMLInputElement;
    const TEL = document.getElementById('TEL') as HTMLInputElement;
    const cmbSalesmen = document.getElementById('cmbSalesmen') as HTMLInputElement;
    const EMAIL = document.getElementById('EMAIL') as HTMLInputElement;
    const cmbOrdertype = document.getElementById('cmbOrdertype') as HTMLInputElement;
    const RSVRD_DTTM = document.getElementById('RSVRD_DTTM') as HTMLInputElement;

    const BtnPat_ID = document.getElementById('BtnPat_ID') as HTMLElement | null;
    BtnPat_ID?.setAttribute('disabled', '');

    const BtnLOC = document.getElementById('btnLOC') as HTMLElement | null;
    BtnLOC?.setAttribute('disabled', '');
    const BtnCN = document.getElementById('btnCN') as HTMLElement | null;
    BtnCN?.setAttribute('disabled', '');
    const BtnDRNO = document.getElementById('BtnDRNO') as HTMLElement | null;
    BtnDRNO?.setAttribute('disabled', '');


    PAT_ID.disabled = true;
    PAT_NAME.disabled = true;
    DOB.disabled = true;
    Age.disabled = true;
    SEX.disabled = true;
    CLN_IND.disabled = true;
    SAUDI.disabled = true;
    NATIONALITY.disabled = true;
    IDNT.disabled = true;
    LOC.disabled = true;
    CN.disabled = true;
    DRNO.disabled = true;
    InsNo.disabled = true;
    SITE_NO.disabled = true;
    REF_NO.disabled = true;
    TEL.disabled = true;
    cmbSalesmen.disabled = true;
    EMAIL.disabled = true;
    cmbOrdertype.disabled = true;
    RSVRD_DTTM.disabled = true;

    this.OrderEntryForm.controls['SEX'].disable();
    this.OrderEntryForm.controls['OTP'].disable();
    this.OrderEntryForm.controls['SMC'].disable();
    this.OrderEntryForm.controls['SAUDI'].disable();
    this.OrderEntryForm.controls['NATIONALITY'].disable();
    this.OrderEntryForm.controls['cmbSpecimenstypes'].disable();

    this.OrderEntryForm.controls['TCODE'].disable();
    this.OrderEntryForm.controls['DSCNT'].disable();
    this.OrderEntryForm.controls['COL_DATE_TIME'].disable();
    this.OrderEntryForm.controls['UPRICE'].disable();
    this.OrderEntryForm.controls['DPRICE'].disable();
  }
  enableOrderPatientInformations() {
    const PAT_ID = document.getElementById('PAT_ID') as HTMLInputElement;
    const PAT_NAME = document.getElementById('PAT_NAME') as HTMLInputElement;
    const DOB = document.getElementById('DOB') as HTMLInputElement;
    const Age = document.getElementById('Age') as HTMLInputElement;
    const SEX = document.getElementById('SEX') as HTMLInputElement;
    const CLN_IND = document.getElementById('CLN_IND') as HTMLInputElement;
    const SAUDI = document.getElementById('SAUDI') as HTMLInputElement;
    const NATIONALITY = document.getElementById('NATIONALITY') as HTMLInputElement;
    const IDNT = document.getElementById('IDNT') as HTMLInputElement;
    const LOC = document.getElementById('LOC') as HTMLInputElement;
    const CN = document.getElementById('CN') as HTMLInputElement;
    const DRNO = document.getElementById('DRNO') as HTMLInputElement;
    const InsNo = document.getElementById('InsNo') as HTMLInputElement;
    const SITE_NO = document.getElementById('SITE_NO') as HTMLInputElement;
    const REF_NO = document.getElementById('REF_NO') as HTMLInputElement;
    const TEL = document.getElementById('TEL') as HTMLInputElement;
    const cmbSalesmen = document.getElementById('cmbSalesmen') as HTMLInputElement;
    const EMAIL = document.getElementById('EMAIL') as HTMLInputElement;
    const cmbOrdertype = document.getElementById('cmbOrdertype') as HTMLInputElement;
    const RSVRD_DTTM = document.getElementById('RSVRD_DTTM') as HTMLInputElement;
    PAT_ID.disabled = false;
    PAT_NAME.disabled = false;
    DOB.disabled = false;
    Age.disabled = false;
    SEX.disabled = false;
    CLN_IND.disabled = false;
    SAUDI.disabled = false;
    NATIONALITY.disabled = false;
    IDNT.disabled = false;
    LOC.disabled = false;
    CN.disabled = false;
    DRNO.disabled = false;
    InsNo.disabled = false;
    SITE_NO.disabled = false;
    REF_NO.disabled = false;
    TEL.disabled = false;
    cmbSalesmen.disabled = false;
    EMAIL.disabled = false;
    cmbOrdertype.disabled = false;
    RSVRD_DTTM.disabled = false;
    this.OrderEntryForm.controls['SEX'].enable();
    this.OrderEntryForm.controls['OTP'].enable();
    this.OrderEntryForm.controls['SMC'].enable();
    this.OrderEntryForm.controls['SAUDI'].enable();
    this.OrderEntryForm.controls['NATIONALITY'].enable();
    this.OrderEntryForm.controls['cmbSpecimenstypes'].enable();

    this.OrderEntryForm.controls['TCODE'].enable();
    this.OrderEntryForm.controls['DSCNT'].enable();
    this.OrderEntryForm.controls['COL_DATE_TIME'].enable();
    this.OrderEntryForm.controls['UPRICE'].enable();
    this.OrderEntryForm.controls['DPRICE'].enable();
    const BtnPat_ID = document.getElementById('BtnPat_ID') as HTMLElement | null;
    BtnPat_ID?.removeAttribute('disabled');

    const BtnLOC = document.getElementById('btnLOC') as HTMLElement | null;
    BtnLOC?.removeAttribute('disabled');
    const BtnCN = document.getElementById('btnCN') as HTMLElement | null;
    BtnCN?.removeAttribute('disabled');
    const BtnDRNO = document.getElementById('BtnDRNO') as HTMLElement | null;
    BtnDRNO?.removeAttribute('disabled');
  }
  /* End Clear Order Patient Informations */

  onFirst() {
    this.counter = 0;

    const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
    searchOrder.value = this.orderTransactionlist[this.counter].orD_NO;
    this.SearchOrderTrans();

    const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
    BtnFirst?.setAttribute('disabled', '');
    const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
    BtnPrevious?.setAttribute('disabled', '');
    const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
    BtnNext?.removeAttribute('disabled');
    const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
    BtnLast?.removeAttribute('disabled');
    this.clearOrderEntryTest();
    this.diabledOrderPatientInformations();
  }
  onPrevious() {
    if (this.counter > 0) {
      --this.counter;

      const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
      searchOrder.value = this.orderTransactionlist[this.counter].orD_NO;
      this.SearchOrderTrans();
      const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
      BtnNext?.removeAttribute('disabled');
      const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
      BtnLast?.removeAttribute('disabled');

      const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
      BtnFirst?.removeAttribute('disabled');
      const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
      BtnPrevious?.removeAttribute('disabled');
      this.clearOrderEntryTest();
      this.diabledOrderPatientInformations();
    } else {
      const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
      BtnFirst?.setAttribute('disabled', '');
      const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
      BtnPrevious?.setAttribute('disabled', '');
      const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
      BtnNext?.removeAttribute('disabled');
      const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
      BtnLast?.removeAttribute('disabled');
      this.clearOrderEntryTest();
      this.diabledOrderPatientInformations();
    }
  }
  onNext() {
    if (this.counter < this.orderTransactionlist.length - 1) {
      ++this.counter;

      const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
      searchOrder.value = this.orderTransactionlist[this.counter].orD_NO;
      this.SearchOrderTrans();

      const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
      BtnNext?.removeAttribute('disabled');
      const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
      BtnLast?.removeAttribute('disabled');

      const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
      BtnFirst?.removeAttribute('disabled');
      const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
      BtnPrevious?.removeAttribute('disabled');
      this.clearOrderEntryTest();
      this.diabledOrderPatientInformations();
    } else {
      const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
      BtnNext?.setAttribute('disabled', '');
      const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
      BtnLast?.setAttribute('disabled', '');

      const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
      BtnFirst?.removeAttribute('disabled');
      const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
      BtnPrevious?.removeAttribute('disabled');
      this.clearOrderEntryTest();
      this.diabledOrderPatientInformations();
    }
  }
  onLast() {
    this.counter = this.orderTransactionlist.length - 1;

    const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
    searchOrder.value = this.orderTransactionlist[this.counter].orD_NO;
    this.SearchOrderTrans();

    const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
    BtnNext?.setAttribute('disabled', '');
    const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
    BtnLast?.setAttribute('disabled', '');

    const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
    BtnFirst?.removeAttribute('disabled');
    const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
    BtnPrevious?.removeAttribute('disabled');
    this.clearOrderEntryTest();
    this.diabledOrderPatientInformations();
    this.selectBoolenValue = true;
  }
  /* End Navigation button */

  AddNotes() {
    var LblAddNOTES = document.getElementById("AddNOTES") as HTMLInputElement | null;
    this.OrderEntryForm.value.notes = LblAddNOTES.value;
    var LblARTID = document.getElementById("LblARTID_Notes") as HTMLInputElement | null;
    this.OrderEntryForm.value.atR_ID = LblARTID.innerText;


    this.orderentryService.AddNotesActiveTestsRequest(this.OrderEntryForm.value)
      .subscribe({
        next: (res) => {

          Swal.fire({
            title: 'Add notes successfully!',
            text: 'Add Notes Successfully added',
            icon: 'success'
          })
          this.SearchOrderTrans();
        },
        error: (err) => {
          alert(err?.error.message);
        }
      })
  }

  EnterPaid() {
    var inpTotalPaid = document.getElementById("inpTotalPaid") as HTMLInputElement | null;
    var inpGrandTotal = document.getElementById("inpGrandTotal") as HTMLInputElement | null;
    //this.OrderEntryForm.value.RMNG = parseFloat(this.OrderEntryForm.value.granD_VAL) - parseFloat(inpPAID.value);

    this.OrderEntryForm.patchValue({ RMNG: (parseFloat(inpGrandTotal.value) - parseFloat(inpTotalPaid.value)) });

  }

  ShowIssueInvoice() {
    this.OrderEntryForm.patchValue({ PAYTP: 'CASH' });
    const IssueInvoiceModal = document.getElementById('modalIssueInvoice') as HTMLElement;
    const myModal = new Modal(IssueInvoiceModal);
    myModal.show()
    const inpTotalPaid = document.getElementById('inpTotalPaid') as HTMLInputElement | null;
    setTimeout(() => inpTotalPaid.focus(), 1000);
  }
  IssueInvoice() {

    this.OrderEntryForm.controls['SEX'].enable();
    this.OrderEntryForm.controls['OTP'].enable();
    this.OrderEntryForm.controls['SMC'].enable();
    this.OrderEntryForm.controls['SAUDI'].enable();
    this.OrderEntryForm.controls['NATIONALITY'].enable();
    this.OrderEntryForm.value.CASH = this.OrderEntryForm.value.CASH == true ? "Y" : "N";

    this.orderentryService.UpdateIssueInvoince(this.OrderEntryForm.value)
      .subscribe({
        next: (res) => {

          Swal.fire({
            title: 'Issue Invoice successfully!',
            text: 'Issue Invoice Successfully updated',
            icon: 'success'
          })
          this.SearchOrderTrans();
          this.OrderEntryForm.controls['SEX'].disable();
          this.OrderEntryForm.controls['OTP'].disable();
          this.OrderEntryForm.controls['SMC'].disable();
          this.OrderEntryForm.controls['SAUDI'].disable();
          this.OrderEntryForm.controls['NATIONALITY'].disable();
        },
        error: (err) => {
          alert(err?.error.message);
        }
      })
  }

  //search Multiple Criteria
  ShowMulipleSearch() {
    const modalMulipleSearch = document.getElementById('modalMulipleSearch') as HTMLElement;
    const myModal = new Modal(modalMulipleSearch);
    myModal.show();
  }
  GetMultipleSearch() {
    this.multupleSearchList = [];

    var IDNT = document.getElementById("inpMIDNo") as HTMLInputElement | null;
    var TEL = document.getElementById("inpMTelNo") as HTMLInputElement | null;
    var PAT_ID = document.getElementById("inpMPatID") as HTMLInputElement | null;
    var PAT_NAME = document.getElementById("inpMPatName") as HTMLInputElement | null;
    var DOB = document.getElementById("inpMDOB") as HTMLInputElement | null;
    var SEX = document.getElementById("selMSEX") as HTMLSelectElement | null;
    var ORD_NO = document.getElementById("inpMOrdNo") as HTMLInputElement | null;
    var ACCN = document.getElementById("inpMAccn") as HTMLInputElement | null;
    this.orderentryService.GetMultipleSearch(IDNT.value == '' ? null : IDNT.value,
      TEL.value == '' ? null : TEL.value,
      PAT_ID.value == '' ? null : PAT_ID.value,
      PAT_NAME.value == '' ? null : PAT_NAME.value,
      DOB.value == '' ? new Date('0001-01-01T00:00:00Z').toDateString() : DOB.value,
      SEX.value == '' ? null : SEX.value,
      ORD_NO.value == '' ? null : ORD_NO.value,
      ACCN.value == '' ? null : ACCN.value)
      .subscribe({
        next: (res) => {
          //this.multupleSearchList.push(res.getMultipleSearch);
          for (var i = 0; i < res.getMultipleSearch.length; i++) {
            this.multupleSearchList.push(res.getMultipleSearch[i]);
          }
          this.GetMultipleSearchOrders(res.getMultipleSearch[0].paT_ID);
        },
        error: (err) => {
          alert(err?.error.message);
        }
      })
  }
  GetMultipleSearchOrders(PAT_ID: any) {
    this.multupleSearchOrdersList = [];
    this.orderentryService.GetMultipleSearchOrders(PAT_ID == '' ? null : PAT_ID)
      .subscribe({
        next: (res) => {

          for (var i = 0; i < res.getMultipleSearch.length; i++) {
            this.multupleSearchOrdersList.push(res.getMultipleSearch[i]);
          }
        },
        error: (err) => {
          alert(err?.error.message);
        }
      })
  }
  SearchOrderTransMultiple(ORD_NO: any) {
    const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
    searchOrder.value = ORD_NO;
    this.SearchOrderTrans();

  }
  ViewOrderTrackingDetails(ORD_NO: any, REQ_CODE: any, ACCN: any) {
    this.orderTrackingList = [];

    const inpTrcOrderNo = document.getElementById("inpTrcOrderNo") as HTMLInputElement | null;
    inpTrcOrderNo.value = ORD_NO;

    const inpAccNo = document.getElementById("inpAccNo") as HTMLInputElement | null;
    inpAccNo.value = ACCN;

    const inpTrcCode = document.getElementById("inpTrcCode") as HTMLInputElement | null;
    inpTrcCode.value = REQ_CODE;

    const ViewOrderTrackingModal = document.getElementById('ViewOrderTrackingModal') as HTMLElement;
    const myModal = new Modal(ViewOrderTrackingModal);
    myModal.show();



    this.multupleSearchOrdersList = [];
    this.orderentryService.GetOrderTrackingByOrdNo(ORD_NO, REQ_CODE)
      .subscribe({
        next: (res) => {

          for (var i = 0; i < res.geT_OrdTrc.length; i++) {
            this.orderTrackingList.push(res.geT_OrdTrc[i]);
          }

        },
        error: (err) => {
          alert(err?.error.message);
        }
      })
  }

  ViewAddProcModal(ATRTable: any) {
    const ACCN = document.getElementById("ACCN") as HTMLInputElement | null;
    ACCN.value = ATRTable.accn; ACCN.disabled = true;
    const r_STS = document.getElementById("ST") as HTMLInputElement | null;
    r_STS.value = ATRTable.r_STS; r_STS.disabled = true;

    const STS = document.getElementById("STS") as HTMLInputElement | null;
    STS.innerText = ATRTable.sts; STS.disabled = true;

    const COL_DATE_TIME = document.getElementById("COL_DATE_TIME") as HTMLInputElement | null;
    COL_DATE_TIME.value = ATRTable.drawN_DTTM; COL_DATE_TIME.disabled = true;

    const BtnAdd = document.getElementById("BtnAdd") as HTMLInputElement | null;
    BtnAdd.disabled = false;
    const BtnPRSave = document.getElementById("BtnPRSave") as HTMLInputElement | null;
    BtnPRSave.disabled = false;
    const BtnCancel = document.getElementById("BtnCancel") as HTMLInputElement | null;
    BtnCancel.disabled = false;
    const BtnCollect = document.getElementById("BtnCollect") as HTMLInputElement | null;
    BtnCollect.disabled = true;
    const BtnPRNew = document.getElementById("BtnPRNew") as HTMLInputElement | null;
    BtnPRNew.disabled = true;

    this.OrderEntryForm.controls['TCODE'].enable();
    this.OrderEntryForm.controls['DSCNT'].enable();
    this.OrderEntryForm.controls['COL_DATE_TIME'].enable();
    this.OrderEntryForm.controls['UPRICE'].enable();
    this.OrderEntryForm.controls['DPRICE'].enable();
    this.OrderEntryForm.controls['cmbSpecimenstypes'].enable();
    this.btnDisabled = true;

    const TCODE = document.getElementById("TCODE") as HTMLInputElement | null;
    TCODE.focus();
    //const addProcModal = document.getElementById('addProcModal') as HTMLElement;
    //const myModal = new Modal(addProcModal);
    //myModal.show();
  }

  BtnModify() {

    //document.getElementById("client").innerHTML = "";
    //document.getElementById("descrp").innerHTML = "";
    //document.getElementById("doctor").innerHTML = "";
    const PAT_IDElement = document.getElementById("PAT_ID") as HTMLInputElement | null;
    const PAT_NAMEElement = document.getElementById("PAT_NAME") as HTMLElement | null;
    //if (this.OrderEntryForm.value.PAT_ID == '')
    //  PAT_IDElement?.focus();
    //else
    PAT_NAMEElement?.focus();

    PAT_IDElement?.setAttribute('disabled', '');

    const BtnPRNew = document.getElementById('BtnPRNew') as HTMLElement | null;
    BtnPRNew?.setAttribute('disabled', '');

    const BtnPRSave = document.getElementById('BtnPRSave') as HTMLElement | null;
    BtnPRSave?.removeAttribute('disabled');

    const BtnAdd = document.getElementById('BtnAdd') as HTMLElement | null;
    BtnAdd?.removeAttribute('disabled');

    const BtnCancel = document.getElementById('BtnCancel') as HTMLElement | null;
    BtnCancel?.removeAttribute('disabled');


    //--------------------------------------------
    this.btnDisabled = true;
    //this.OrderEntryForm.reset(this.initialValueForm);
    //document.getElementById("client").innerHTML = "";
    //document.getElementById("descrp").innerHTML = "";
    //document.getElementById("doctor").innerHTML = "";
    //document.getElementById("FULL_NAME").innerHTML = "";
    //document.getElementById("DT").innerHTML = "";
    //document.getElementById("STS").innerHTML = "";
    //const searchElement = document.getElementById("PAT_ID") as HTMLElement | null;
    //searchElement?.focus();
    //this.ATRTable = [];
    //----------------------------
    const BtnFirst = document.getElementById('BtnFirst') as HTMLElement | null;
    BtnFirst?.setAttribute('disabled', '');
    const BtnPrevious = document.getElementById('BtnPrevious') as HTMLElement | null;
    BtnPrevious?.setAttribute('disabled', '');
    const BtnNext = document.getElementById('BtnNext') as HTMLElement | null;
    BtnNext?.setAttribute('disabled', '');
    const BtnLast = document.getElementById('BtnLast') as HTMLElement | null;
    BtnLast?.setAttribute('disabled', '');
    this.enableOrderPatientInformations();
    const RSVRD_DTTM = document.getElementById('RSVRD_DTTM') as HTMLInputElement | null;
    //RSVRD_DTTM.value = this.currentdatetime;

    const BtnPat_ID = document.getElementById('BtnPat_ID') as HTMLElement | null;
    BtnPat_ID?.setAttribute('disabled', '');

    const btnLOC = document.getElementById('btnLOC') as HTMLElement | null;
    btnLOC?.removeAttribute('disabled');
    const btnCN = document.getElementById('btnCN') as HTMLElement | null;
    btnCN?.removeAttribute('disabled');
    const BtnDRNO = document.getElementById('BtnDRNO') as HTMLElement | null;
    BtnDRNO?.removeAttribute('disabled');

    PAT_IDElement.disabled = true;

    //PAT_IDElement?.setAttribute('disabled', '');

    // if (PAT_IDElement.value == '')
    //  PAT_IDElement?.focus();
  }

}


