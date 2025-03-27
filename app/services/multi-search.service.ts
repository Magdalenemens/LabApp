import { Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { OrderentrynewService } from '../modules/orderprocessing/orderentrynew/add-orderentrynew/orderentrynew.service';
import { RenameOperation } from '@ckeditor/ckeditor5-engine';

@Injectable({
  providedIn: 'root'
})
export class MultiSearchService {
  constructor(private orderentryService: OrderentrynewService) { }
  async GetMultipleSearchOrders(PAT_ID: any) {
    var multupleSearchOrdersList: any[] = [];
    var res = await firstValueFrom(this.orderentryService.GetMultipleSearchOrders(PAT_ID == '' ? null : PAT_ID));
    for (var i = 0; i < res.getMultipleSearch.length; i++) {
      multupleSearchOrdersList.push(res.getMultipleSearch[i]);
    }
    return multupleSearchOrdersList;
  }

  async GetMultipleSearchService(mdl:string) {
    let multupleSearchList = [];
    var IDNT = document.getElementById("inpMIDNo") as HTMLInputElement | null;
    var TEL = document.getElementById("inpMTelNo") as HTMLInputElement | null;
    var PAT_ID = document.getElementById("inpMPatID") as HTMLInputElement | null;
    var PAT_NAME = document.getElementById("inpMPatName") as HTMLInputElement | null;
    var DOB = document.getElementById("inpMDOB") as HTMLInputElement | null;
    var SEX = document.getElementById("selMSEX") as HTMLSelectElement | null;
    var ORD_NO = document.getElementById("inpMOrdNo") as HTMLInputElement | null;
    var ACCN = document.getElementById("inpMAccn") as HTMLInputElement | null;
    var From_Date = document.getElementById("inpMDateFrom") as HTMLInputElement | null;
    var To_Date = document.getElementById("inpMDateTo") as HTMLInputElement | null;
    let res = await firstValueFrom(this.orderentryService.GetMultipleSearch(IDNT.value == '' ? null : IDNT.value,
      TEL.value == '' ? null : TEL.value,
      PAT_ID.value == '' ? null : PAT_ID.value,
      PAT_NAME.value == '' ? null : PAT_NAME.value,
      DOB.value == '' ? new Date('0001-01-01T00:00:00Z').toDateString() : DOB.value,
      SEX.value == '' ? null : SEX.value,
      ORD_NO.value == '' ? null : ORD_NO.value,
      ACCN.value == '' ? null : ACCN.value,
      mdl,
      From_Date.value == '' ? new Date('0001-01-01T00:00:00Z').toDateString() : From_Date.value,
      To_Date.value == '' ? new Date('0001-01-01T00:00:00Z').toDateString() : To_Date.value));

      for (var i = 0; i < res.getMultipleSearch.length; i++) {
        multupleSearchList.push(res.getMultipleSearch[i]);
      }
      await this.GetMultipleSearchOrders(res.getMultipleSearch[0].paT_ID);       

      return multupleSearchList;
  }

  async SearchOrderTransService(form,BindATRTable) {

    const searchOrder = document.getElementById("searchOrder") as HTMLInputElement | null;
    var result:any;
    if (searchOrder.value) {
      let res = await firstValueFrom(this.orderentryService.GET_v_ORD_TRANS(' ', searchOrder.value));
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

      form.patchValue({ PAT_ID: res.geT_v_ORD_TRANS.paT_ID });
      form.patchValue({ PAT_NAME: res.geT_v_ORD_TRANS.paT_NAME });
      form.patchValue({ SEX: res.geT_v_ORD_TRANS.sex });

      form.patchValue({ DOB: DOB.value });//res.geT_v_ORD_TRANS.dob });

      form.patchValue({ SAUDI: res.geT_v_ORD_TRANS.saudi });
      form.patchValue({ NATIONALITY: res.geT_v_ORD_TRANS.nationality });
      result.natid = res.geT_v_ORD_TRANS.nationality;
      form.patchValue({ IDNT: res.geT_v_ORD_TRANS.idnt });
      form.patchValue({ DRNO: res.geT_v_ORD_TRANS.drno });
      form.patchValue({ REF_NO: res.geT_v_ORD_TRANS.reF_NO });
      form.patchValue({ TEL: res.geT_v_ORD_TRANS.tel });

      form.patchValue({ SMC: res.geT_v_ORD_TRANS.scM_DESC });
      result.scmid = res.geT_v_ORD_TRANS.smc;
      form.patchValue({ OTP: res.geT_v_ORD_TRANS.otp + " " + res.geT_v_ORD_TRANS.otP_DESC });
      result.otpid = res.geT_v_ORD_TRANS.otp;
      form.patchValue({ EMAIL: res.geT_v_ORD_TRANS.email });
      form.patchValue({ CN: res.geT_v_ORD_TRANS.cn });
      form.patchValue({ LOC: res.geT_v_ORD_TRANS.loc });

      form.patchValue({ ORD_NO: res.geT_v_ORD_TRANS.orD_NO });

      form.patchValue({ CLN_IND: res.geT_v_ORD_TRANS.clN_IND });

      form.patchValue({ SITE_NO: res.geT_v_ORD_TRANS.sitE_NO });
      form.value.ORD_NO = res.geT_v_ORD_TRANS.orD_NO;

      result.PAT_ID = res.geT_v_ORD_TRANS.paT_ID;
      result.ORD_NO = res.geT_v_ORD_TRANS.orD_NO;

      //Issuing Invoice Only
      form.patchValue({ CASH: res.geT_v_ORD_TRANS.cash == 'N' ? false : true });
      form.patchValue({ TOTDSCNT: res.geT_v_ORD_TRANS.totdscnt });
      form.patchValue({ TOT_VALUE: res.geT_v_ORD_TRANS.toT_VALUE });
      form.patchValue({ DSCAMNT: res.geT_v_ORD_TRANS.dscamnt });
      form.patchValue({ NET_VALUE: res.geT_v_ORD_TRANS.neT_VALUE });
      form.patchValue({ PAID: res.geT_v_ORD_TRANS.paid });

      form.patchValue({ RMNG: res.geT_v_ORD_TRANS.granD_VAL - res.geT_v_ORD_TRANS.paid }); //res.geT_v_ORD_TRANS.rmng });

      form.patchValue({ VAT: res.geT_v_ORD_TRANS.vat });
      form.patchValue({ GRAND_VAL: res.geT_v_ORD_TRANS.granD_VAL });
      form.patchValue({ EXTRDSCT: res.geT_v_ORD_TRANS.extrdsct });
      form.patchValue({ PAYTP: res.geT_v_ORD_TRANS.paytp });
      form.patchValue({ VC_NO: res.geT_v_ORD_TRANS.vC_NO });

      BindATRTable(result.PAT_ID, result.ORD_NO);

      //this.BindOrderDetails(this.PAT_ID, this.ORD_NO);

      result.btnDisabled = false;

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
    }
    result.form = form
    return result;
  }
}
