
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BAD_REQUEST_ERROR_MESSAGE, alertThreeDigits, deleteMessage, successMessage, updateSuccessMessage, warningMessage, cancelRequest, collectedRequest } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
//import DataTable from 'datatables.net-bs4';
//import { ArrowFunctionExpr } from '@angular/compiler';
import { cleanData } from 'jquery';
import { CentralReceivingService } from './centralreceiving.service';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { kolkovEditorService } from 'src/app/common/kolkovEditorService';
@Component({
  selector: 'app-list-orderentry',
  //standalone: true,
  //imports: [],
  templateUrl: './order-receiving.component.html',
  styleUrls: ['./order-receiving.component.scss']
})
export class OrderReceivingComponent implements OnInit {
  name = 'Angular 6';
  htmlContent = '';
  content = 'This is the initial content of the editor.';

  
  public OrdDtlTable: any[] = [];
  selectedSite: string = "";
  selectedrefSite: string = "";
  selectedUserId: string = "";
  dt;

  constructor(private fb: FormBuilder, private centralRcvdService: CentralReceivingService, private router: Router, public _commonAlertService: CommonAlertService, public editorService: kolkovEditorService) {
    this.dt = new Date().toISOString().substring(0, 16);
    
  }
  ngOnInit(): void {
    this.selectedSite = localStorage.getItem("selectedSite")
    this.selectedrefSite = localStorage.getItem("refSite")
    this.selectedUserId = localStorage.getItem("userId")
    const inpACCN = document.getElementById("ACCN") as HTMLInputElement;
    inpACCN.focus();
    setTimeout(() =>  inpACCN.focus(), 1000);
  }

  onLineSpacingChange(event: Event) {
    const spacing = (event.target as HTMLSelectElement).value;
    if (spacing) {
      this.editorService.setLineSpacing(spacing);
    }
  }

  BindPRTable() {
    const inpACCN = document.getElementById("ACCN") as HTMLInputElement;
    this.OrdDtlTable = [];
    const completeDate = new Date();
    this.centralRcvdService.GetOrdersDetailsByAccn(inpACCN.value.trim(),'CR')
      .subscribe({
        next: (res) => {

          for (var i = 0; i < res.ord_Dtl.length; i++) {  // loop through the object array
            this.OrdDtlTable.push(res.ord_Dtl[i]);        // push each element to sys_id
          }
         
          if (this.OrdDtlTable.length <= 0) {
            Swal.fire({
              title: 'Record not found or Order already received!',
              //text: successMessage,
              icon: 'info'
            })
          }

        },
        error: (err) => {

        }
      })



    this.btnNewList();
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
    
    var tbl = document.getElementById("tableCentralReceiving") as HTMLTableElement;
    var rCount = tbl.rows.length;
    console.log(rCount);
    for (var i = 1; i < tbl.rows.length; i++) {

      console.log(tbl.rows[i].cells[5].getElementsByTagName("input")[0].value);// = tbl.rows[1].cells[3].getElementsByTagName("input")[0].value;

      console.log(tbl.rows[i].cells[1].getElementsByTagName("input")[0].checked);

      if (tbl.rows[i].cells[1].getElementsByTagName("input")[0].checked == true) {

        var ATR_ID = this.OrdDtlTable[i - 1].atrid;
        var STS = this.OrdDtlTable[i - 1].sts;
        var RCVD_DTTM = tbl.rows[i].cells[5].getElementsByTagName("input")[0].value;
        var ACCN = this.OrdDtlTable[i - 1].accn;
        var REQ_CODE = this.OrdDtlTable[i - 1].reQ_CODE;
        var ORD_NO = this.OrdDtlTable[i - 1].orD_NO;
        var SECT = this.OrdDtlTable[i - 1].sect;

        console.log(RCVD_DTTM);
        this.centralRcvdService.UpdateCentralReceiving(this.OrdDtlTable, inpACCN.value, REQ_CODE, SECT, ATR_ID, ORD_NO, this.selectedSite, this.selectedUserId)
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






