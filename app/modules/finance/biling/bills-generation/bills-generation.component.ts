import { Component } from '@angular/core';
import { BillsGenerationService } from './bills-generation.service';
import { billingDataModel, clientNumberModel } from 'src/app/models/billingModel';
import { ConfirmDeleteBilling, ConfirmInvokeBilling, deleteErrorMessage, deleteMessage, firstRecord, invokeInvoiceFailed, invokeInvoiceSuccess, lastRecord, successMessage, warningMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-bills-generation',
  templateUrl: './bills-generation.component.html',
  styleUrls: ['./bills-generation.component.scss']
})
export class BillsGenerationComponent {

  billingData:billingDataModel[] = [];cn: clientNumberModel[] = [];
  cnData: clientNumberModel = new clientNumberModel();
  constructor(private _billingService: BillsGenerationService,public _commonAlertService: CommonAlertService,) {
    }

    ngOnInit(): void {      
      this.GetCNData();      
    }

  InvokeInvoice(){
    Swal.fire({
      title: 'Confirmation',
      text: ConfirmInvokeBilling,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._billingService.InvokeBilling().subscribe(
          (response) => {             
            if (response > 0) {
              this._commonAlertService.invokeInvoiceSuccess();
              this.GetCNData();    
            }
              else {
                this._commonAlertService.invokeInvoiceFailed();
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
  }
    
   
  DeleteInvoice(){
    Swal.fire({
      title: 'Confirmation',
      text: ConfirmDeleteBilling,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._billingService.DeleteBilling().subscribe(
          (response) => {             
            if (response > 0) {
              this._commonAlertService.deleteMessage();
              this.cnData =  new clientNumberModel();
              this.billingData = []  ;
            }
              else {
                this._commonAlertService.deleteErrorMessage();
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
  }
  

  GetBillingData(cn : string){
    this._billingService.GetBillingData(cn).subscribe(res => {         
      this.billingData = res;      
  });
  }

  GetCNData(){
    this._billingService.GetClientNumberData().subscribe(res => {
      if(res.length> 0){
      this.cn = res;
      this.cnData = this.cn[this.cn.length-1]
      this.GetBillingData(this.cnData.cn);
      }
  });
  }

  
  getRecord(input : any,SNO: number ) {
    let totalNumberOfRec = this.cn.length;
    debugger;
    if (input == 'first') {
      this.cnData = this.cn[0];
      this.GetBillingData(this.cnData.cn);
      if(this.cnData.sno == 1){
        this._commonAlertService.firstRecord();
        return;
      }
     
    } else if (input == 'prev' && SNO != 1) {
      this.cnData = this.cn.filter(x => x.sno == (SNO - 1))[0];
    }
    else if (input == 'next' && totalNumberOfRec > SNO) {
      this.cnData = this.cn.filter(x => x.sno == (SNO + 1))[0];
    }
    else if (input == 'last') {
      this.cnData = this.cn[this.cn.length-1];
      this.GetBillingData(this.cnData.cn);
      if(this.cnData != null){
      if(this.cnData.sno == totalNumberOfRec){
        this._commonAlertService.lastRecord();
        return;
      }
    }
    }
    this.GetBillingData(this.cnData.cn);
  }

}
