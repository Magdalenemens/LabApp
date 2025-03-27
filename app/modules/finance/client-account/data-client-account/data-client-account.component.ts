import { Component, ViewChild } from '@angular/core';
import { ClientAccountDataEntryService } from './data-client-account.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SortingComponent } from 'src/app/modules/pagination/sorting/sorting.component';
import { ActivatedRoute, Router } from '@angular/router';
import { clientAccountDataEntry} from 'src/app/models/clientAccountDataEntry';
import { EnvironmentalorderService } from 'src/app/modules/orderprocessing/environmentalorder/add-environmentalorder/environmentalorder.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-data-client-account',
  templateUrl: './data-client-account.component.html',
  styleUrls: ['./data-client-account.component.scss']
})
export class DataClientAccountComponent {
  @ViewChild('ngSelectInstance') ngSelectInstance!: NgSelectComponent;
  list: clientAccountDataEntry[] = [];
  record: clientAccountDataEntry = new clientAccountDataEntry();
  form: FormGroup;
  dataEntryDetails: clientAccountDataEntry = new clientAccountDataEntry();
  editEntry: clientAccountDataEntry = new clientAccountDataEntry();
  isAddButton = true;
  isEditButton = true;
  isreadonly = true;
  clientaccountId = 0;
  clientList: clientAccountDataEntry[] = []
  isDisabled = true;
  constructor(private _clientaccountservice: ClientAccountDataEntryService, private fb: FormBuilder,
    private sortingService: SortingComponent,
    private environmentalorderService: EnvironmentalorderService,) {
  }
  ngOnInit(): void {
    this.getAllclientAccountDetails();
    this.getclientAccountDetails(0);
    this.createForm();
  }

  addClick() {
    this.isAddButton = false;
    this.isEditButton = false;
    this.isreadonly = false;
    this.editEntry = { ...this.dataEntryDetails };
    this.dataEntryDetails.credit = 0;
    this.dataEntryDetails.clntacnT_ID = 0;
    this.dataEntryDetails.debit = 0;
    this.dataEntryDetails.remarks = '';
    this.dataEntryDetails.vC_NO = '';
    this.dataEntryDetails.rcT_NO = '';
    this.dataEntryDetails.tt = '';
    this.dataEntryDetails.date = new Date();
 
    this.form.patchValue(this.dataEntryDetails);
    const formattedDate = this.dataEntryDetails.date
    ? new Date(this.dataEntryDetails.date).toLocaleDateString('en-CA') // 'en-CA' ensures YYYY-MM-DD format
    : '';
  this.form.patchValue({
    date: formattedDate
  });

  }

  cancelClick() {
    this.dataEntryDetails = this.editEntry;
    this.form.patchValue(this.dataEntryDetails);
    // const formattedDate = this.dataEntryDetails.date ? new Date(this.dataEntryDetails.date).toISOString().split('T')[0] : '';
    const formattedDate = this.dataEntryDetails.date
      ? new Date(this.dataEntryDetails.date).toLocaleDateString('en-CA') // 'en-CA' ensures YYYY-MM-DD format
      : '';
    this.form.patchValue({
      date: formattedDate
    });
    this.isAddButton = true;

    if (this.dataEntryDetails.tt == 'I') {
      this.isEditButton = false;
    } else {
      this.isEditButton = true;
    }
    this.isreadonly = true;
  }

  saveClick() {

    if (this.dataEntryDetails.clntacnT_ID > 0) {
      this._clientaccountservice.updateClientAccountEntry(this.form.value).subscribe(response => {
        this.isAddButton = true;
        this.isreadonly = true;
        this.getclientAccountDetails(this.dataEntryDetails.clnT_FL_ID);
      })
    } else {
      this._clientaccountservice.insertClientAccountEntry(this.form.value).subscribe(response => {
        this.isAddButton = true;
        this.isreadonly = true;
        this.getclientAccountDetails(this.dataEntryDetails.clnT_FL_ID);
      })
    }

  }

  editClick() {
    this.isEditButton = false;
    this.isAddButton = false;
    this.isreadonly = false;
    this.editEntry = { ...this.dataEntryDetails };
  }

  createForm(): void {
    this.form = this.fb.group({
      clntacnT_ID: new FormControl(this.dataEntryDetails.clntacnT_ID),
      cn: new FormControl(this.dataEntryDetails.cn),
      date: new FormControl(this.dataEntryDetails.date),
      tt: new FormControl(this.dataEntryDetails.tt),
      debit: new FormControl(this.dataEntryDetails.debit),
      credit: new FormControl(this.dataEntryDetails.credit),
      vC_NO: new FormControl(this.dataEntryDetails.vC_NO),
      rcT_NO: new FormControl(this.dataEntryDetails.rcT_NO),
      remarks: new FormControl(this.dataEntryDetails.remarks),
      client: new FormControl(this.dataEntryDetails.client),
      ytD_DEBIT: new FormControl(this.record.debit),
      ytD_CREDIT: new FormControl(this.record.credit),
      balance: new FormControl(this.record.balance),
    });
  }
  getClientAccountDataEntry(id) {

    this._clientaccountservice.getClientAccountDataEntry(id).subscribe(res => {
      this.list = res;
      if (this.list.length > 0) {
        this.record = this.list[0];
        this.dataEntryDetails.clntacnT_ID = this.record.clntacnT_ID;
        this.dataEntryDetails.remarks = this.record.remarks;
        this.dataEntryDetails.debit = this.record.debit;
        this.dataEntryDetails.credit = this.record.credit;
        this.dataEntryDetails.tt = this.record.tt;
        this.dataEntryDetails.clntacnT_ID = this.record.clntacnT_ID;
        this.clientaccountId = id;
        this.form.patchValue(this.dataEntryDetails);
        const formattedDate = this.dataEntryDetails.date
          ? new Date(this.dataEntryDetails.date).toLocaleDateString('en-CA') // 'en-CA' ensures YYYY-MM-DD format
          : '';
        this.form.patchValue({
          date: formattedDate
        });

        if (this.dataEntryDetails.tt == 'I') {
          this.isEditButton = false;
        } else {
          this.isEditButton = true;
        }
      } else {
        this.record = new clientAccountDataEntry();
      }
    },
      (error) => {
        console.error('Error loadinng anatomic list:', error);
      })
  }

  getclientAccountDetails(id) {
    this.isAddButton = true;
    this._clientaccountservice.getClientAccountById(id).subscribe(res => {
      
      this.dataEntryDetails = res;
      this.clientaccountId = this.dataEntryDetails.clnT_FL_ID;
      if (this.ngSelectInstance) {
        this.ngSelectInstance.writeValue(this.dataEntryDetails.clnT_FL_ID);
      }
      this.getClientAccountDataEntry(this.dataEntryDetails.clnT_FL_ID);
    },
      (error) => {
        console.error('Error loadinng anatomic list:', error);
      })
  }


  getClientAccountDataEntryDetails(id) {
    this._clientaccountservice.getClientAccountDataEntryById(id).subscribe(res => {
      this.record = res;
      this.dataEntryDetails.date = res.date;
      this.record.tt = res.tt;
      this.dataEntryDetails.debit = res.debit;
      this.dataEntryDetails.credit = res.credit;
      this.dataEntryDetails.vC_NO = res.vC_NO;
      this.dataEntryDetails.rcT_NO = res.rcT_NO;
      this.dataEntryDetails.client = res.client;
      this.dataEntryDetails.remarks = res.remarks;
      this.dataEntryDetails.tt = res.tt;
      this.dataEntryDetails.clntacnT_ID = res.clntacnT_ID;
      this.form.patchValue(this.dataEntryDetails);
      const formattedDate = this.dataEntryDetails.date
        ? new Date(this.dataEntryDetails.date).toLocaleDateString('en-CA') // 'en-CA' ensures YYYY-MM-DD format
        : '';
      if (this.dataEntryDetails.tt == 'I') {
        this.isEditButton = false;
      } else {
        this.isEditButton = true;
      }
      this.form.patchValue({
        date: formattedDate
      });
    },
      (error) => {
        console.error('Error loadinng anatomic list:', error);
      })
  }
  change($event: any) {
    if ($event != null) {
      this.getclientAccountDetails($event | 0);
    }
  }
  getAllclientAccountDetails() {
    this._clientaccountservice.getClientAccountList().subscribe(res => {
      this.clientList = res;
      if (this.clientList) {

      }
    },
      (error) => {
        console.error('Error loadinng anatomic list:', error);
      })
  }

}
