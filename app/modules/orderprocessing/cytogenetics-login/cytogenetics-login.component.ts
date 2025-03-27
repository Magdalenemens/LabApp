import { Component, OnInit } from '@angular/core';
import { cytogeneticLoginARModel, cytogeneticLoginModel } from 'src/app/models/cytogeneticLoginModel';
import { CytogeneticLoginService } from './cytogenetic-login.service';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { anatomicModel, apRepportModel } from 'src/app/models/anatomicModel';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Subject, flatMap } from 'rxjs';
import { amendMessage, firstRecord, lastRecord, releaseMessage, saveMessage, updateSuccessMessage, validateMessage, verifyMessage, warningMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Modal } from 'bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { MnService } from '../../masters/mn/mn.service';
import { mnModel } from 'src/app/models/mnModel';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { PageName } from 'src/app/common/enums';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';


@Component({
  selector: 'app-cytogenetics-login',
  templateUrl: './cytogenetics-login.component.html',
  styleUrls: ['./cytogenetics-login.component.scss']
})
export class CytogeneticsLoginComponent {

  cgLogin: cytogeneticLoginModel = new cytogeneticLoginModel();
  accn: string = '';
  mnList: mnModel[] = [];
  form: FormGroup;
  cgLoginAR = [] as cytogeneticLoginARModel[];
  cgLoginSP = [] as cytogeneticLoginARModel[];
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';

  constructor(private formBuilder: FormBuilder, public _commonAlertService: CommonAlertService,
    private _cytogenticService: CytogeneticLoginService, private _mnService: MnService, private _commonService: CommonService) {
    this.form = this.formBuilder.group({
      accn: new FormControl(),
      paT_ID: new FormControl(),
      paT_NAME: new FormControl(),
      orD_NO: new FormControl(),
      reQ_CODE: new FormControl(),
      cliN_IND: new FormControl(),
      volume: new FormControl(),
      intgrty: new FormControl(),
      cntr: new FormControl(),
      color: new FormControl(),
      pac: new FormControl(),
      seq: new FormControl(),
      cnst: new FormControl(),
      rcvD_DTTM: this.addHours(new Date(), 3).toISOString().substring(0, 16),
      sP_TYPE: new FormControl(),
      comments: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.cgLogin.rcvD_DTTM = this.addHours(new Date(), 3).toISOString().substring(0, 16);
    this.getCytogeneticsLoginAR();
    this.GetmnData();
  }


  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.OderProcessing_CytogeneticsReceiving, this.startTime, this.endTime);
  }

  GetmnData(): void {
    this._mnService.getAllmn().subscribe(res => {
      this.mnList = res;
    },
      (error) => {
        console.error('Error loading mn list:', error);
      })
  }


  getCytogeneticsLogin(accn: any) {
    const cgModel = new cytogeneticLoginModel();
    cgModel.accn = accn; cgModel.orD_NO = ''; cgModel.paT_ID = ''; cgModel.paT_NAME = ''; cgModel.reQ_CODE = '';
    cgModel.cliN_IND = ''; cgModel.volume = ''; cgModel.intgrty = ''; cgModel.cntr = ''; cgModel.color = ''; cgModel.pac = ''; cgModel.seq = '';
    cgModel.cnst = ''; cgModel.rcvD_DTTM = ''; cgModel.sP_TYPE = ''; cgModel.comments = ''; 
    cgModel.sitE_NO = EncryptionHelper.decrypt(localStorage.getItem("site"));
    cgModel.uid = localStorage.getItem("userId");

    this._cytogenticService.getCytogeneticsLogin(cgModel).subscribe(x => {
      this.cgLogin = x;
      if (this.cgLogin.rcvD_DTTM != '') {
        let dStr: string = this.cgLogin.rcvD_DTTM;
        let res: Date = new Date(dStr);
        this.cgLogin.rcvD_DTTM = this.addHours(res, 3).toISOString().substring(0, 16);
      }
      else
        this.cgLogin.rcvD_DTTM = new Date().toISOString().substring(0, 16);
    });
  }

  getCytogeneticsLoginAR() {
    this._cytogenticService.getCytogeneticsLoginAR().subscribe(res => {
      if (res.length > 0) {
        this.cgLoginSP = res.filter(x => x.types == 2);
        this.cgLoginAR = res.filter(x => x.types == 1);
        this.cgLogin.sP_TYPE = res[0].cd;
      }
    },
      (error) => {
        console.error('Error loading CG Login AR list:', error);
      })
  }

  getCodeResponse(code: any, type: number) {
    const _codeResponse = this.cgLoginAR.filter(x => x.cd.trim().toUpperCase() == code.toUpperCase());
    if (_codeResponse.length > 0) {
      if (type === 1)
        this.cgLogin.cnst = _codeResponse[0].response;
      else if (type === 2)
        this.cgLogin.color = _codeResponse[0].response;
      else if (type === 3)
        this.cgLogin.pac = _codeResponse[0].response;
      else if (type === 4)
        this.cgLogin.cntr = _codeResponse[0].response;
      else if (type === 5)
        this.cgLogin.intgrty = _codeResponse[0].response;
    }

  }


  submitCGLogin() {
   
    const site = EncryptionHelper.decrypt(localStorage.getItem("site"));;
    const userId = EncryptionHelper.decrypt(localStorage.getItem("userId"));

    this.cgLogin.sitE_NO = site;
    this.cgLogin.uid = userId;

    if (this.cgLogin.accn != null) {
      Swal.fire({
        title: 'Confirmation',
        text: 'Confirm',//this.updateMgsAccordingToButton(clickNumber),
        //icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this._cytogenticService.updateCytogeneticsLogin(this.cgLogin).subscribe(
            (response) => {
              if (response.status === 200 || response.status === 204) {
                this._commonAlertService.updateMessage();
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
  }

  clear() {
    this.accn = '';
    this.cgLogin.accn = '';
    this.cgLogin.orD_NO = '';
    this.cgLogin.paT_ID = '';
    this.cgLogin.paT_NAME = '';
    this.cgLogin.reQ_CODE = '';
    this.cgLogin.cliN_IND = '';
    this.cgLogin.volume = '';
    this.cgLogin.intgrty = '';
    this.cgLogin.cntr = '';
    this.cgLogin.color = '';
    this.cgLogin.pac = '';
    this.cgLogin.seq = '';
    this.cgLogin.cnst = '';
    this.cgLogin.rcvD_DTTM = this.addHours(new Date(), 3).toISOString().substring(0, 16),
      this.cgLogin.sP_TYPE = '';
    this.cgLogin.comments = '';
  }

  addHours(date: Date, hours: number) {
    const hoursToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date;
  }

  onFetchAbbrevation(event: any) {
    debugger;
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
      this.cgLogin.comments = this.replaceAt(this.cgLogin.comments, this.cgLogin.comments.lastIndexOf(_tempWord), _codeResponse[0].mN_DESCRP);
    }
  }

  onFetchAbbrevationForCIndication(event: any) {
    debugger;
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
      this.cgLogin.cliN_IND = this.replaceAt(this.cgLogin.cliN_IND, this.cgLogin.cliN_IND.lastIndexOf(_tempWord), _codeResponse[0].mN_DESCRP);
    }
  }


  replaceAt(_string: string, index: number, replacement: string) {
    return _string.substring(0, index) + replacement + _string.substring(index + replacement.length);
  }

}
