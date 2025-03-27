import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GTModel, TDModel } from 'src/app/models/tdmodel';
import { ProfileService } from './profile.service';
import { MnService } from 'src/app/modules/masters/mn/mn.service';
import { CommonService } from 'src/app/common/commonService';
import { firstRecord, lastRecord, warningMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  form: FormGroup;
  testDirectoryProfileAllData: TDModel[] = [];
  tdProfileData: TDModel = new TDModel();
  tdGTDData: GTModel[] = [];
  tdPopupData: any;
  constructor(private formBuilder: FormBuilder,
    private _profileService: ProfileService, private _mnService: MnService, private _commonService: CommonService, public _commonAlertService: CommonAlertService,) {
    this.form = this.formBuilder.group({
      accn: new FormControl(),
      paT_ID: new FormControl(),
      paT_NAME: new FormControl(),
      sex: new FormControl(),
      age: new FormControl(),
      dob: new FormControl(),
      saudi: new FormControl(),
      reQ_CODE: new FormControl(),
      tcode: new FormControl(),
      loc: new FormControl(),
      pr: new FormControl(),
      cn: new FormControl(),
      client: new FormControl(),
      drno: new FormControl(),
      doctor: new FormControl(),
      sno: new FormControl(),
      drawN_DTTM: new FormControl(),
      veR_DTTM: new FormControl(),
      r_STS: new FormControl(),
      notes: new FormControl(),

    });
  }

  ngOnInit(): void {
    $('#btnsprofile').addClass("is-active");
    this.getAllTestDirectoryProfileData();
    this.fillTD();
  }

  
  getAllTestDirectoryProfileData() {
    this._profileService.getAllTestDirectoryProfile().subscribe(res => {     
      this.testDirectoryProfileAllData = res;
      this.getRecord("last", this.testDirectoryProfileAllData.length - 1);
      if (localStorage.getItem('test_id')) {
        let test_id = localStorage.getItem('test_id')?.toString();
        if (test_id) {
          this.tdProfileData = this.testDirectoryProfileAllData.filter(x => x.tesT_ID == test_id)[0];
          this.assignTheData();
          this.getTestDirectoryGTD(this.tdProfileData.tesT_ID);
          localStorage.setItem('test_id', '');
        }
      }
      // this.getAlltdProfileDataSearch();
    },
      (error) => {
        console.error('Error loading Site list:', error);
      })
  }

  
  getRecord(input: any, SNO: number) {

    let totalNumberOfRec = this.testDirectoryProfileAllData.length;


    if (input == 'first') {
      if (this.tdProfileData.sno == 1) {
        this._commonAlertService.firstRecord();
        return;
      }
      this.tdProfileData = this.testDirectoryProfileAllData[0];
    } else if (input == 'prev' && SNO != 1) {
      this.tdProfileData = this.testDirectoryProfileAllData.filter(x => x.sno == (SNO - 1))[0];
    }
    else if (input == 'next' && totalNumberOfRec > SNO) {
      this.tdProfileData = this.testDirectoryProfileAllData.filter(x => x.sno == (SNO + 1))[0];
    }
    else if (input == 'last') {
      if (this.tdProfileData != null) {
        if (this.tdProfileData.sno == totalNumberOfRec) {
          this._commonAlertService.lastRecord();
          return;
        }
      }
      this.tdProfileData = this.testDirectoryProfileAllData.filter(x => x.sno == totalNumberOfRec)[0];
    }
    this.getTestDirectoryGTD(this.tdProfileData.tesT_ID);
    this.assignTheData();
  }

  
  assignTheData() {
    if (!this.tdProfileData) {
      console.error('No data available to assign. tdProfileData is undefined.');
      return; // Exit if tdProfileData is undefined to prevent runtime errors
    }

    this.form.reset({
      code: this.tdProfileData.tcode,
      tesT_ID: this.tdProfileData.tesT_ID,
      reportName: this.tdProfileData.fulL_NAME,
      // sex: this.tdProfileData.sex,
      // age: this.microBiologicData.age,
      // dob: this.tdProfileData.dob,
      // saudi: this.tdProfileData.saudi,
      // reQ_CODE: this.tdProfileData.reQ_CODE,
      // tcode: this.tdProfileData.tcode,
      // loc: this.tdProfileData.loc,
      // pr: this.tdProfileData.pr,
      // cn: this.tdProfileData.cn,
      // client: this.tdProfileData.client,
      // drno: this.tdProfileData.drno,
      // doctor: this.tdProfileData.doctor,
      // sno: this.tdProfileData.sno,
      // drawN_DTTM: this.tdProfileData.drawN_DTTM,
      // veR_DTTM: this.tdProfileData.veR_DTTM,
      // r_STS: this.tdProfileData.r_STS,
      // notes: this.tdProfileData.notes,
      // orD_NO: this.tdProfileData.orD_NO,
      // req_COD: this.tdProfileData.req_COD
    });    // this.isReadOnly = true; 
  };

  emptyTheForm() {
    this.form.reset({
      code: '',
      tesT_ID: '',
      reportName: '',
      // sex: '',
      // age: '',
      // dob: '',
      // saudi: '',
      // reQ_CODE: '',
      // tcode: '',
      // loc: '',
      // pr: '',
      // cn: '',
      // client: '',
      // drno: '',
      // doctor: '',
      // sno: '',
      // drawN_DTTM: '',
      // veR_DTTM: '',
      // r_STS: '',
      // notes: ''
    });
  }


  getTestDirectoryGTD(testId: string) {
    this._profileService.getTestDirectoryGTD(testId).subscribe((data) => {
      if (data) {
        this.tdGTDData = data;
      } else {
        console.error('GTD data not found:', data);
      }
    })
  }

  deleteRow(gtd: any) {
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      const index = this.tdGTDData.indexOf(gtd, 0);
      if (index > -1) {
        this.tdGTDData.splice(index, 1);
      }
      for (var i = 0; i < this.tdGTDData.length; i++) {  // loop through the object array
        this.tdGTDData[i].rno = i + 1;
      }
    }
  }

  
  BindSearchTDTable() {
    debugger;
    const searchTD = document.getElementById("searchTD") as HTMLInputElement;
    if (searchTD.value != '')
      this.fillTDBySearch(searchTD.value);
    else
      this.fillTD();


   
  }

  fillTD(){
    this.tdPopupData = this._profileService.GetTestDirectoryByDProfile().subscribe(x => {
      this.tdPopupData = x;
    })  
  }

  fillTDBySearch(search: any){
    this.tdPopupData = this._profileService.getSearchTestDirectoryByDProfile(search).subscribe(x => {
      this.tdPopupData = x;
    }) 
  }


  addTDTable(tdData: TDModel) {    
    // try {
    //   filteredArray = this._profileService.filter((item, index, self) =>
    //     index === self.findIndex((t) => (
    //       t.isoL_CD.trimLeft().trimRight() === isol.isoL_CD.trimLeft().trimRight()
    //     ))
    //   );
    // }
    // catch (e) {
    //   alert((e as Error).message);
    //   console.log((e as Error).message);
    // }

    // if (filteredArray.length == 0) {

      const obj = new GTModel();
      // obj.IsAdd = true;
      // this.visible = false;
      obj.rno       = this.tdGTDData.length + 1;
      obj.dtno		  = String(tdData.tesT_ID);
      obj.fulL_NAME	= tdData.fulL_NAME;
      obj.gp			  = 'G';
      obj.grP_NO		= '';
      obj.gtD_ID		= 0;
      obj.gtno		  = String(this.tdProfileData.tesT_ID);
      obj.mdl			  = 'EV' ;
      obj.pndg      = "Y";
      obj.reQ_CODE	= this.tdProfileData.tcode ;
      obj.rstp		  = this.tdProfileData.rstp;
      obj.s			    = '';
      obj.s_TYPE		= '' ;
      obj.seq			  = '';
      obj.tcode		  = tdData.tcode;
      //obj.search = '';
      this.tdGTDData.push(obj);
    //   this.Addrecord = true;
       this.fillTD();
    // }
    // else {
    //   Swal.fire({
    //     text: warningMessage,
    //   });
    //   const isolModal = document.getElementById('isolModal') as HTMLElement;
    //   const myModal = new Modal(isolModal);
    //   myModal.show();
    // }
    //this.SaveIsol();
  }

  findTD(){

    const searchTD = document.getElementById("searchTD") as HTMLInputElement;
    searchTD.value = '';
    const tdModal = document.getElementById('tdModal') as HTMLElement;
    const myModal = new Modal(tdModal);
    myModal.show();
  }

  
  SaveGTD() {
    this._profileService.saveTestDirectoryProfile(this.tdGTDData).subscribe((data: any) => {
      if (data) {
        Swal.fire({
          text: 'TD Profile Updated successfully !!!.',
        });
        this.getAllTestDirectoryProfileData();
      } else {
        console.error('Test Directory Profile data not found:', data);
      }
    })


   
  }

  updateTDProfile(){

    {
      Swal.fire({
        title: 'Confirmation',
        text: "Do you want to update the TD Profile",
        //icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.SaveGTD() ;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            text: 'Not amended by the User!!!.',
          });
        }
      });
    }


   
  }


}
