
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BAD_REQUEST_ERROR_MESSAGE, alertThreeDigits, deleteMessage, successMessage, updateSuccessMessage, warningMessage, cancelRequest, collectedRequest } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
//import DataTable from 'datatables.net-bs4';
//import { ArrowFunctionExpr } from '@angular/compiler';
import { cleanData } from 'jquery';
import { PreAnalyticalReceivingService } from './preanalyticalreceiving.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  // selector: 'app-list-orderentry'
  //standalone: true,
  //imports: [],
  templateUrl: './preanalyticalreceiving.component.html',
  styleUrls: ['./preanalyticalreceiving.component.scss']
})
export class PreAnalyticalReceivingComponent implements OnInit {
  public OrdDtlTable: any[] = [];
  selectedSite: string = "";
  selectedrefSite: string = "";
  selectedUserId: string = "";
  dt: any;
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';

  constructor(private fb: FormBuilder, private preAnalyticalRcvdService: PreAnalyticalReceivingService, public _commonAlertService: CommonAlertService,
    private router: Router, private _commonService: CommonService) {
    this.dt = new Date().toISOString().substring(0, 16);

  }
  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.selectedSite = localStorage.getItem("selectedSite")
    this.selectedrefSite = localStorage.getItem("refSite")
    this.selectedUserId = localStorage.getItem("userId")
    const inpACCN = document.getElementById("ACCN") as HTMLInputElement;
    inpACCN.focus();
    setTimeout(() =>  inpACCN.focus(), 1000);
  }


  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.OderProcessing_PreAnalyticalReceiving, this.startTime, this.endTime);
  }

  BindOrdersTable() {
    const inpACCN = document.getElementById("ACCN") as HTMLInputElement;
    this.OrdDtlTable = [];
    const completeDate = new Date();
    this.preAnalyticalRcvdService.GetOrdersDetailsByAccn(inpACCN.value.trim(), 'PR')
      .subscribe({
        next: (res) => {
          if (res.ord_Dtl != null) {
            for (var i = 0; i < res.ord_Dtl.length; i++) {  // loop through the object array
              this.OrdDtlTable.push(res.ord_Dtl[i]);        // push each element to sys_id

              this.btnNewList();
            }

            console.log(this.OrdDtlTable);

            if (this.OrdDtlTable.length <= 0) {
              Swal.fire({
                title: 'Record not found or Order already received!',
                //text: successMessage,
                icon: 'info'
              })
            }
          } else {//null

            Swal.fire({
              title: 'Record not found!',
              //text: successMessage,
              icon: 'info'
            })
          }
        }
      })




  }

  btnNewList() {
    const BtnNewList = document.getElementById('BtnNewList') as HTMLElement | null;
    BtnNewList?.setAttribute('disabled', '');
    const BtnSubmit = document.getElementById('BtnSubmit') as HTMLElement | null;
    BtnSubmit?.removeAttribute('disabled');
    const BtnAbort = document.getElementById('BtnAbort') as HTMLElement | null;
    BtnAbort?.removeAttribute('disabled');
    const inpACCN = document.getElementById("ACCN") as HTMLInputElement;
    inpACCN.focus();
  }
  btnSubmit() {
    const BtnNewList = document.getElementById('BtnNewList') as HTMLElement | null;
    BtnNewList?.removeAttribute('disabled');
    const BtnSubmit = document.getElementById('BtnSubmit') as HTMLElement | null;
    BtnSubmit?.setAttribute('disabled', '');
    const BtnAbort = document.getElementById('BtnAbort') as HTMLElement | null;
    BtnAbort?.setAttribute('disabled', '');

    const inpACCN = document.getElementById("ACCN") as HTMLInputElement;
    console.log(this.OrdDtlTable);

    var tbl = document.getElementById("tablePreAnalyticalReceiving") as HTMLTableElement;
    var rCount = tbl.rows.length;
    console.log(rCount);
    for (var i = 1; i < tbl.rows.length; i++) {
      //console.log(tbl.rows[i].cells[5].getElementsByTagName("input")[0].value);// = tbl.rows[1].cells[3].getElementsByTagName("input")[0].value;
      //console.log(tbl.rows[i].cells[1].getElementsByTagName("input")[0].checked);
      if (tbl.rows[i].cells[1].getElementsByTagName("input")[0].checked == true) {
        var ATR_ID = this.OrdDtlTable[i - 1].atrid;
        var STS = this.OrdDtlTable[i - 1].sts;
        var RCVD_DTTM = tbl.rows[i].cells[5].getElementsByTagName("input")[0].value;
        var ACCN = this.OrdDtlTable[i - 1].accn;
        var REQ_CODE = this.OrdDtlTable[i - 1].reQ_CODE;
        var ORD_NO = this.OrdDtlTable[i - 1].orD_NO;
        var SECT = this.OrdDtlTable[i - 1].sect;
        this.preAnalyticalRcvdService.UpdatePreAnalyticalReceiving(this.OrdDtlTable, inpACCN.value, REQ_CODE, SECT, ATR_ID, ORD_NO, this.selectedSite, this.selectedUserId)
          .subscribe({
            next: (res) => {

              //Swal.fire({
              //  title: successMessage,
              //  text: successMessage,
              //  icon: 'success'
              //})
            },
            error: (err) => {

            }
          })

      }
    }
    //return;


    this._commonAlertService.successMessage();

    //this.BindPRTable();
    this.btnAbort();
  }

  btnAbort() {

    const BtnNewList = document.getElementById('BtnNewList') as HTMLElement | null;
    BtnNewList?.removeAttribute('disabled');
    const BtnSubmit = document.getElementById('BtnSubmit') as HTMLElement | null;
    BtnSubmit?.setAttribute('disabled', '');
    const BtnAbort = document.getElementById('BtnAbort') as HTMLElement | null;
    BtnAbort?.setAttribute('disabled', '');
    const inpACCN = document.getElementById("ACCN") as HTMLInputElement;
    inpACCN.value = '';
    this.OrdDtlTable = [];
    BtnNewList.focus();
  }


}






