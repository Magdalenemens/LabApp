import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Modal } from 'bootstrap';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { CommonService } from 'src/app/common/commonService';
import { TDModel, GTModel } from 'src/app/models/tdmodel';
import { MnService } from 'src/app/modules/masters/mn/mn.service';
import Swal from 'sweetalert2';
import { ProfileService } from '../../test-definition/profile/profile.service';
import { OrderentryService } from 'src/app/modules/orderprocessing/orderentry/add-orderentry/orderentry.service';
import { AddTestDirectoryService } from '../../test-definition/add-test-directory/add-test-directory.service';
import { evProfiledModel, evProfileGTDModel } from 'src/app/models/evTestDefinitionModel ';

@Component({
  selector: 'app-evtestdefinitionprofile',
  templateUrl: './evtestdefinitionprofile.component.html',
  styleUrls: ['./evtestdefinitionprofile.component.scss']
})
export class EvtestdefinitionprofileComponent {
  form: FormGroup;
  tdPopupData: any;
  evTestDefinitionProfileAllData: evProfiledModel[] = [];
  evProfileGTDList: evProfileGTDModel[] = [];
  evProfileData: evProfiledModel = new evProfiledModel();
  evGTDData: GTModel[] = [];
 
  constructor(private formBuilder: FormBuilder,
    private _profileService: ProfileService,
    public _commonAlertService: CommonAlertService,
    private _testDirectoryService: AddTestDirectoryService, private cdr: ChangeDetectorRef
  ) {
    this.form = this.formBuilder.group({
      txtdtNumber: new FormControl(),
      txtFullName: new FormControl(),
      txtSynm: new FormControl(),
      cmbStatus: new FormControl(),
      cmbOrderable: new FormControl(),
      cmbPrintResult: new FormControl(),
      cmblabDivision: new FormControl(),
    });
  }

  ngOnInit(): void {
    $('#btnsprofile').addClass("is-active");
    // this.getAllTestDirectoryProfileData();
    this.getAllEVTestDefinitionProfileData();
    this.fillTD();
  }

  // // Fetching all EV Test Definition Profile Data
  // getAllEVTestDefinitionProfileData(): void {
  //   this._testDirectoryService.getAllEVTestDefinitionProfile().subscribe(
  //     (res) => {
  //       console.log('All EV Test Definitions:', res);
  //       if (res && res.length > 0) {
  //         this.evTestDefinitionProfileAllData = res; // Store the fetched collection
  //         this.getRecord('last', this.evTestDefinitionProfileAllData.length - 1); // Get last record
  //       } else {
  //         console.error('No data found.');
  //         this.evTestDefinitionProfileAllData = []; // Clear the table if no data
  //         Swal.fire({ text: "No EV Test Definitions found." });
  //       }
  //     },
  //     (error) => {
  //       console.error('Error loading EV Test Definitions:', error);
  //       this.evList = []; // Clear the table on error
  //       Swal.fire({ text: "Error loading EV Test Definitions." });
  //     }
  //   );
  // }

  getAllEVTestDefinitionProfileData(): void {
    this._testDirectoryService.getAllEVTestDefinitionProfile().subscribe(res => {
      this.evTestDefinitionProfileAllData = res;
      this.getRecord("last", this.evTestDefinitionProfileAllData.length - 1);
      this.getEVProfieDataFromGTD(this.evProfileData.tcode);
    },
      (error) => {
        console.error('Error loading user list:', error);
      })
  }

  getEVProfieDataFromGTD(tCode: string) {
    this._testDirectoryService.getEVProfileFromGTD(tCode).subscribe((data) => {
      if (data) {
        this.evProfileGTDList = data;
      } else {
        console.error('GTD data not found:', data);
      }
    })
  }

  assignTheData() {
    if (!this.evProfileData) {
      console.error('No data available to assign. evProfileData is undefined.');
      return; // Exit if evProfileData is undefined to prevent runtime errors
    }
    this.form.reset({
      code: this.evProfileData.tcode,
      tesT_ID: this.evProfileData.tesT_ID,
      reportName: this.evProfileData.fulL_NAME,

    });
  };

  emptyTheForm() {
    this.form.reset({
      code: '',
      tesT_ID: '',
      reportName: '',
    });
  }

  BindSearchTDTable() {
    debugger;
    const searchTD = document.getElementById("searchTD") as HTMLInputElement;
    if (searchTD.value != '')
      this.fillTDBySearch(searchTD.value);
    else
      this.fillTD();
  }

  fillTD() {
    this.tdPopupData = this._profileService.GetTestDirectoryByDProfile().subscribe(x => {
      this.tdPopupData = x;
    })
  }

  fillTDBySearch(search: any) {
    this.tdPopupData = this._profileService.getSearchTestDirectoryByDProfile(search).subscribe(x => {
      this.tdPopupData = x;
    })
  }

  addTDTable(tdData: TDModel) {
    const obj = new GTModel();
    obj.rno = this.evGTDData.length + 1;
    obj.dtno = String(tdData.tesT_ID);
    obj.fulL_NAME = tdData.fulL_NAME;
    obj.gp = 'G';
    obj.grP_NO = '';
    obj.gtD_ID = 0;
    obj.gtno = String(this.evProfileData.tesT_ID);
    obj.mdl = 'EV';
    obj.pndg = "Y";
    obj.reQ_CODE = this.evProfileData.tcode;
    // obj.rstp = this.evProfileData.rstp;
    obj.s = '';
    obj.s_TYPE = '';
    obj.seq = '';
    obj.tcode = tdData.tcode;
    //obj.search = '';
    this.evGTDData.push(obj);
    //   this.Addrecord = true;
    this.fillTD();
  }

  findTD() {
    const searchTD = document.getElementById("searchTD") as HTMLInputElement;
    searchTD.value = '';
    const tdModal = document.getElementById('tdModal') as HTMLElement;
    const myModal = new Modal(tdModal);
    myModal.show();
  }


  SaveGTD() {
    this._profileService.saveTestDirectoryProfile(this.evGTDData).subscribe((data: any) => {
      if (data) {
        Swal.fire({
          text: 'TD Profile Updated successfully !!!.',
        });
        this.getAllEVTestDefinitionProfileData();
      } else {
        console.error('Test Directory Profile data not found:', data);
      }
    })
  }

  updateTDProfile() {
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
          this.SaveGTD();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            text: 'Not amended by the User!!!.',
          });
        }
      });
    }
  }

  deleteRow(gtd: any) {
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      const index = this.evGTDData.indexOf(gtd, 0);
      if (index > -1) {
        this.evGTDData.splice(index, 1);
      }
      for (var i = 0; i < this.evGTDData.length; i++) {  // loop through the object array
        this.evGTDData[i].rno = i + 1;
      }
    }
  }


  getRecord(input: any, SNO: number) {
    let totalNumberOfRec = this.evTestDefinitionProfileAllData.length;
    if (input == 'first') {
      if (this.evProfileData.sno == 1) {
        this._commonAlertService.firstRecord();
        return;
      }
      this.evProfileData = this.evTestDefinitionProfileAllData[0];
    } else if (input == 'prev' && SNO != 1) {
      this.evProfileData = this.evTestDefinitionProfileAllData.filter(x => x.sno == (SNO - 1))[0];
    }
    else if (input == 'next' && totalNumberOfRec > SNO) {
      this.evProfileData = this.evTestDefinitionProfileAllData.filter(x => x.sno == (SNO + 1))[0];
    }
    else if (input == 'last') {
      if (this.evProfileData != null) {
        if (this.evProfileData.sno == totalNumberOfRec) {
          this._commonAlertService.lastRecord();
          return;
        }
      }
      this.evProfileData = this.evTestDefinitionProfileAllData.filter(x => x.sno == totalNumberOfRec)[0];
    }
    this.getEVProfieDataFromGTD(this.evProfileData.tcode);
    this.assignTheData();
  }

  // getRecord(input: string, SNO: number) {
  //   const totalNumberOfRec = this.evTestDefinitionProfileAllData.length;

  //   if (totalNumberOfRec === 0) {
  //     Swal.fire({ text: "No records available." });
  //     return;
  //   }

  //   let selectedRecord: any;

  //   switch (input) {
  //     case 'first':
  //       if (SNO === 1 || SNO === 0) {
  //         Swal.fire({ text: "You are already at the first record." });
  //         return;
  //       }
  //       selectedRecord = this.evTestDefinitionProfileAllData[0];
  //       break;

  //     case 'search':
  //       selectedRecord = this.evTestDefinitionProfileAllData.find(x => x.sno === SNO);
  //       break;

  //     case 'prev':
  //       if (SNO <= 1) {
  //         Swal.fire({ text: "You are already at the first record." });
  //         return;
  //       }
  //       selectedRecord = this.evTestDefinitionProfileAllData.find(x => x.sno === (SNO - 1));
  //       break;

  //     case 'next':
  //       if (SNO >= totalNumberOfRec) {
  //         Swal.fire({ text: "You are already at the last record." });
  //         return;
  //       }
  //       selectedRecord = this.evTestDefinitionProfileAllData.find(x => x.sno === (SNO + 1));
  //       break;

  //     case 'last':
  //       if (SNO >= totalNumberOfRec) {
  //         Swal.fire({ text: "You are already at the last record." });
  //         return;
  //       }
  //       selectedRecord = this.evTestDefinitionProfileAllData[totalNumberOfRec - 1];
  //       break;

  //     default:
  //       Swal.fire({ text: "Invalid action." });
  //       return;
  //   }

  //   if (selectedRecord) {
  //     this.evProfileData = selectedRecord;


  //     const filteredRecords = this.evTestDefinitionProfileAllData.filter(item => item.reQ_CODE === selectedRecord.reQ_CODE);

  //     if (filteredRecords != null) {
  //       this.evList = filteredRecords;
  //       this.cdr.detectChanges();
  //     } else {
  //       console.warn(`No records found with the TCode ${selectedRecord.tcode}.`);
  //       this.evList = [];
  //     }
  //   } else {
  //     // Swal.fire({ text: "No matching record found for the action." });
  //     this.evList = [];
  //   }
  // }

  calculateCurrentIndex(currentSNO: number): number {
    let currentIndex = this.evTestDefinitionProfileAllData.findIndex(x => x.sno === currentSNO);
    return currentIndex + 1; // Start index is one-based
  }

}

