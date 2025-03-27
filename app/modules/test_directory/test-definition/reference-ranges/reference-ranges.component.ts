import { Component } from '@angular/core';
import { errorKeyCodeMessage, saveConfirmMessage,  successMessage } from 'src/app/common/constant';
import { tdDivModel, TDModel, TdRefRngModel } from 'src/app/models/tdmodel';
import Swal from 'sweetalert2';
import { ReferenceRangesService } from './reference-ranges.service';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-reference-ranges',
  templateUrl: './reference-ranges.component.html',
  styleUrls: ['./reference-ranges.component.scss']
})
export class ReferenceRangesComponent {
  maleText: string = '';
  femaleText: string = '';
  isAddModal: boolean = false;
  imageSource;
  _response: any;
  
  dvModel: tdDivModel[] = [];
  sectModel: tdDivModel[] = [];
  tdModel : TDModel[] = [];
  rrModel : TdRefRngModel[] = [];
  orgrrModel : TDModel[] = [];
  selRRModel: TdRefRngModel[] = []; index:number = 0;
  div:string='';sect:string=''; testTd : string=''; testCode: string = '';
  constructor(private _addRefRangeService: ReferenceRangesService, public _commonAlertService: CommonAlertService,) { }

  copyMtoF() {
    this.femaleText = this.maleText;
  }

  copyFtoM() {
    this.maleText = this.femaleText;
  }
  ngOnInit(): void {
    $('#btnreferencerange').addClass("is-active");
    this.GetdivData();
    this.GetTestDirectiveByDiv(0)
    this.GetReferenceRangeData();
    addEventListener('keypress', (event: KeyboardEvent) => {
      // Execute your logic here.
        console.log(event);
    });

  
  }

  

  
  openModal() {
    this.GetReferenceRangeData();
    this.isAddModal = true;
  }

  closeModal() {
    this.isAddModal = false;
  }
  
    
  GetdivData(): void {
    this._addRefRangeService.getTdDiv().subscribe(res => {
      this.dvModel = res;
    },
      (error) => {
        console.error('Error loading div list:', error);
      })
  }

  GetSect(event : any){  
    this._addRefRangeService.getSectByDiv(parseInt(event.target.value)).subscribe(res => {
      this.sectModel = res; this.div = event.target.value;
      this.GetTestDirectiveByDiv(parseInt(event.target.value));
      this.sect='';
    },
      (error) => {
        console.error('Error loading sect list:', error);
      })
  }

  GetBySect(event : any){
    this.GetTestDirectiveByDiv(parseInt(this.div));
    this.sect=event.target.value;   
  }

  GetTestDirectiveByDiv(div : number){  
    this._addRefRangeService.getAllTestDirectiveByDiv(div).subscribe(res => {
      this.tdModel = [];
      this.tdModel = res;
      if(this.sect != '')
       this.tdModel = this.tdModel.filter(x  => x.sect.trim().toUpperCase() == this.sect.toString().toUpperCase());
       this.orgrrModel = this.tdModel ;
    },
      (error) => {
        console.error('Error loading sect list:', error);
      })
  }


  loadTestTD(event:any){
      this.tdModel = this.orgrrModel.filter(x=> x.tcode.toString().startsWith(event.target.value.toString().toUpperCase()));
      this.tdModel = this.tdModel.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    })
  }

  GetReferenceRangeData(): void {
    this._addRefRangeService.getTdReferenceRange().subscribe(res => {
      this.rrModel = res; //this.orgrrModel = res;      
    },
      (error) => {
        console.error('Error loading reference range list:', error);
      })
  }

  GetReferenceRange(tCode : any,dec : number, rstp : string){
    this.selRRModel = this.rrModel.filter(x  => x.tcode.trim().toUpperCase() == tCode.toUpperCase());
    this.testCode  = tCode;
    if(this.selRRModel.length == 0)
    {
      const obj = new TdRefRngModel();
      obj.refid = 0; obj.sitE_NO= '';obj.dtno = 0; obj.tcode = tCode;obj.rstp = rstp;obj.s_TYPE = '';
      obj.sex= ''; obj.agE_F =  0;obj.aff = ''; obj.agE_T = 0;obj.atf = ''; obj.agE_FROM = 0;obj.agE_TO = 0;
      obj.reF_LOW = '0';obj.reF_HIGH = '0';obj.crtcL_LOW = '0';obj.crtcL_HIGH = '0';obj.lhf = ''; obj.response = ''; 
      obj.dec  = dec;obj.reF_RANGE = ''; obj.reF_LC= ''; obj.reF_HC = '';obj.remarks = ''; 
      this.selRRModel.push(obj);  
    }
    else
    {
      for(let i = 0; i< this.selRRModel.length ; i++){
      this.selRRModel[i].crtcL_LOW = parseFloat(this.selRRModel[i].crtcL_LOW.toString()).toFixed(dec);
      this.selRRModel[i].crtcL_HIGH = parseFloat(this.selRRModel[i].crtcL_HIGH.toString()).toFixed(dec);
      this.selRRModel[i].reF_LOW = parseFloat(this.selRRModel[i].reF_LOW.toString()).toFixed(dec);
      this.selRRModel[i].reF_HIGH = parseFloat(this.selRRModel[i].reF_HIGH.toString()).toFixed(dec);
      }
    }
  }

  addRow(tCode : any,event : any, i: number){

        const obj = new TdRefRngModel();
        if(this.selRRModel[i].agE_TO != 44895){
          obj.sex= this.selRRModel[i].sex;
          obj.aff =this.selRRModel[i].aff;
          obj.atf =this.selRRModel[i].atf;
        }
          obj.rstp =this.selRRModel[i].rstp; obj.dec  = this.selRRModel[i].dec;
          obj.refid = 0; obj.sitE_NO= '';obj.dtno = 0; obj.tcode = tCode;obj.s_TYPE = '';
          obj.agE_F =  0; obj.agE_T = 0;obj.agE_FROM = 0;obj.agE_TO = 0;
          obj.reF_LOW = '0';obj.reF_HIGH = '0';obj.crtcL_LOW = '0';obj.crtcL_HIGH = '0';obj.lhf = ''; obj.response = ''; 
          obj.reF_RANGE = ''; obj.reF_LC= ''; obj.reF_HC = '';obj.remarks = '';
          this.selRRModel.push(obj);  
          this.getDatCal(i+1);

}

formatRefLowHigh(){
  for(let i = 0; i< this.selRRModel.length ; i++){
    this.selRRModel[i].reF_LC = this.selRRModel[i].reF_LOW.toString();
    this.selRRModel[i].reF_HC = this.selRRModel[i].reF_HIGH.toString();
    }
}

deleteRow(td: any) {
  var delBtn = confirm("Do you want to delete this record?");
  if (delBtn == true) { 
    const index = this.selRRModel.indexOf(td, 0);
    if (index > -1) {
      this.selRRModel.splice(index, 1);
      }
    }
  }  

  saveReferenceRange(){
    if(this.selRRModel.length == 0){
      const obj = new TdRefRngModel();
        obj.sex= '';
        obj.aff = '';
        obj.atf =  '';
        obj.rstp = 'N'; obj.dec  = 0;
        obj.refid = 0; obj.sitE_NO= '';obj.dtno = 0; obj.tcode = this.testCode;obj.s_TYPE = '';
        obj.agE_F =  0; obj.agE_T = 0;obj.agE_FROM = 0;obj.agE_TO = 0;
        obj.reF_LOW = '0';obj.reF_HIGH = '0';obj.crtcL_LOW = '0';obj.crtcL_HIGH = '0';obj.lhf = ''; obj.response = ''; 
        obj.reF_RANGE = ''; obj.reF_LC= ''; obj.reF_HC = '';obj.remarks = '';
        this.selRRModel.push(obj);  
    }

    this.formatRefLowHigh();
    Swal.fire({
      title: 'Confirmation',
      text: saveConfirmMessage,
      //icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {

          this._addRefRangeService.saveReferenceRange(this.selRRModel).subscribe((data : any) => {
            this.GetReferenceRangeData();
            if (data) {
              this._commonAlertService.successMessage();
            } else {
              console.error('Reference Range data not found:', data);
            }
          })
      }
     else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        text: 'Not amended by the User!!!.',
      });
    }
  });

  }

  getDatCal(i : number){
    if(i > 0){
      if(this.selRRModel[i].sex == this.selRRModel[i-1].sex){
        this.selRRModel[i].agE_F =  (parseInt(this.selRRModel[i-1].agE_T.toString()) + 1) ;
        if(this.selRRModel[i-1].atf == 'D'){
          this.selRRModel[i].agE_FROM = (parseInt(this.selRRModel[i-1].agE_T.toString()) + 1)
        }
        else if(this.selRRModel[i-1].atf == 'M'){
          this.selRRModel[i].agE_FROM = ((parseInt(this.selRRModel[i-1].agE_T.toString())) * 30.4) + 1;
        }
        else if(this.selRRModel[i-1].atf == 'Y'){
          this.selRRModel[i].agE_FROM = ((parseInt(this.selRRModel[i-1].agE_T.toString())) * 365) + 1;  
        }
      }
    }
  }

  getDayCal(rr:TdRefRngModel, event:any, i){
    if(event.target.value != ''){
      if(rr.aff == 'D'){
        let days = 0;
        if(rr.agE_F == 0)
          days = (rr.agE_T  - rr.agE_F);
        else
          days = (rr.agE_T);
        rr.agE_TO = days * 1;
      }
      else if(rr.aff == 'M'){
        let months = 0;
        if(rr.agE_F == 0)
          months = (rr.agE_T  - rr.agE_F); 
        else
         months = (rr.agE_T);
        rr.agE_TO = months * 30.4;
      }
      else if(rr.aff == 'Y'){
        let years = 0;
        if(rr.agE_F == 0) 
        years = (rr.agE_T  - rr.agE_F);
        else 
        years = (rr.agE_T);
        rr.agE_TO = years * 365;
      }
    }
  }

  getdecimal(event : any,dec : number,i : number, type : string){
    if(dec == 0 && i > 0)
      dec = this.selRRModel[0].dec ;
    if(event.target.value.trim() != ''){
      if(type == 'LC')
        this.selRRModel[i].reF_LOW =  parseFloat(event.target.value).toFixed(dec);
      else if (type == 'HC')
        this.selRRModel[i].reF_HIGH =   parseFloat(event.target.value).toFixed(dec);
      else if (type == 'CLL')
        this.selRRModel[i].crtcL_LOW =   parseFloat(event.target.value).toFixed(dec);
      else if (type == 'CLH')
        this.selRRModel[i].crtcL_HIGH =   parseFloat(event.target.value).toFixed(dec);
    }
  }

  onRangeValue(event : any,i : number){
    if(event.keyCode == 188) {
          this.selRRModel[i].reF_LOW = '0';
          this.selRRModel[i].crtcL_LOW = '0';
        }
        else if(event.keyCode == 190){
          this.selRRModel[i].reF_HIGH  = '0';
          this.selRRModel[i].crtcL_HIGH = '0';
        }
        else if(event.keyCode != 8 &&  event.keyCode  !=   13 &&  event.keyCode  !=   9 &&  event.keyCode  !=   16 &&  event.keyCode  !=   17 &&  event.keyCode  !=   18 &&  event.keyCode  !=   19 &&  event.keyCode  !=   20 &&  event.keyCode  !=   27 &&  event.keyCode  !=   33 &&  event.keyCode  !=   32 &&  event.keyCode  !=   34 &&  event.keyCode  !=   35 &&  event.keyCode  !=   36 &&  event.keyCode  !=   37 &&  event.keyCode  !=   38 &&  event.keyCode  !=   39 &&  event.keyCode  !=   40 &&  event.keyCode  !=   44 &&  event.keyCode  !=   45 &&  event.keyCode  != 46){
          this._commonAlertService.errorKeyCodeMessage();
        }
    }

}
