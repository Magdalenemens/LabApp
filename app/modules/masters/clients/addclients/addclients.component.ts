import { Component, ElementRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators
} from '@angular/forms';

import { emailValidator } from '../../../../common/emailValidator.directive';
import { clientModel } from 'src/app/models/clientModel';
import { AddclientService } from './addclient.service';
import Swal from 'sweetalert2';
import { spsiteModel } from 'src/app/models/spsiteModel';
import { accountManagernModel } from 'src/app/models/accountManagerModel';
import { driverModel } from 'src/app/models/driverModel';
import { siteModel } from 'src/app/models/siteModel';
import { BAD_REQUEST_ERROR_MESSAGE, BAD_REQUEST_MESSAGE, deleteMessage, firstRecord, lastRecord, successMessage, updateSuccessMessage, warningMessage } from 'src/app/common/constant';
import { CommonService } from 'src/app/common/commonService';
import { Observable } from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-addclients',
  templateUrl: './addclients.component.html',
  styleUrls: ['./addclients.component.scss']
})
export class AddclientsComponent {

  keyword = 'client';
  form!: FormGroup;
  client: clientModel;
  submitted = false;
  IsEdit: boolean = false;
  IsAdd: boolean = false;
  IsCancel: boolean = true;
  Showupdate: boolean = false;

  Reset: boolean = false;
  Addnew: boolean = false;
  clientList!: any[];
  accmanmodel: accountManagernModel[] = [];
  driver: driverModel[] = [];
  sp: siteModel[] = [];
  Client_id: any;
  Max_Client_id: any;
  Min_Client_id: any;
  index: any;
  isDisabled = false;

  maxCNValue: string = "0001";
  isEditing: boolean = false; // Controls visibility of buttons
  isAdding: boolean = false; // Track if user is adding a new record
  isNavigationActive: boolean = true; // Default: navigation enabled

  isReadonly: boolean = true; // Controls field editability
  isCheckboxDisabled: boolean = true; // Initially disabled
  lastClientState: any = {}; // Store the last selected record before editing


  matchedClients$: Observable<clientModel[]>;
  selectedClient: clientModel | undefined; // Property to hold the selected site
  hit: number = 0;
  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  constructor(private formBuilder: FormBuilder, public services: AddclientService,
    public _commonService: CommonService, public _commonAlertService: CommonAlertService,
    private el: ElementRef,) {
    this.client = new clientModel();
  }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.initializeComponent();
  }

  initializeFormGroup() {
    // Initializing the form
    this.form = this.formBuilder.group({
      cn: [''], // Ensure CN is included
      cmpnY_NO: [''],
      client: ['', Validators.required],  // ✅ Add required validation
      aclient: [''],
      ctgrY_CD: [''],
      clntvat: [''],
      acmngr: [''],
      drvrc: [''],
      dscnt: [0.0],
      dscnT_2: [0.0],
      dscnT_3: [0.0],
      dscnT_4: [0.0],
      dscnT_5: [0.0],
      sitE_NO: [''],
      tel: [''],
      contact: [''],
      mobile: [''],
      email: [''],
      emaiL2: [''],
      emaiL3: [''],
      clnT_ADDRESS: [''],
      grp: [''],
      cnclient: [''],
      reqnoreq: [false],
      cash: [false],
      crdtonly: [false],
      cashonly: [false],
      adscnt: [false],
      spcl: [false],
      nofax: [false],
      zeroval: [false],
      ytD_DEBIT: [0.0],
      ytD_CREDIT: [0.0],
      balance: [0.0],
      maxcrdt: [0.0],
      lsT_BAL: [0.0],
      lsT_ST_DT: [null], // Date should be initialized properly
      lsT_ST_NO: [''],
      habn: [false],
      telreq: [false],
      cu: [false],
      inactv: [false],
      notes: [''],
      aC_NO: [''],
      sP1: [0.0],
      sP3: [0.0],
      clnT_TP: [''],
      IsEdit: [false],
      IsAdd: [false],
      search: [''],
      maX_CN: [''],
    });
  }

  onSubmit(frmClient: NgForm) {
    this.submitted = true; // Mark form as submitted
    if (frmClient.valid) {
      // Perform save operation here

      // Reset form after successful insertion
      frmClient.resetForm();
      this.submitted = false; // Reset submitted status
    }
  }


  initializeComponent(): void {
    this.IsAdd = false;
    this.IsEdit = true;
    this.Showupdate = false;
    this.isReadonly = true;
    this.IsCancel = false;

    const storedClientId = localStorage.getItem('Client_id');

    if (storedClientId) {
      this.Client_id = storedClientId;
      this.getClientbybyId(this.Client_id);
    } else {
      this.getAllClientData();
    }

    // Remove unnecessary localStorage references
    localStorage.removeItem('ResetForm');

    // Initialize dropdowns
    this.fillAccountManagerDropDown();
    this.filldriverDropDown();
    this.fillsiteDropDown();
  }

  getAllClientData(): void {
    this.services.getAllclient().subscribe(response => {
      this.clientList = response.clients;  // Store clients list
      this.maxCNValue = response.maxCN; // Store max CN separately
      this.getRecord("last", this.clientList.length - 1);
      this.matchedClients$ = this.getFilteredClients('');
    },
      (error) => {
        console.error('Error loading Client list:', error);
      });
  }



  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  selectEvent(item: any) {
    // do something with selected item
    this.Client_id = item.clnT_FL_ID?.toString();
    if (this.Client_id) {
      this.getClientbybyId(this.Client_id);
      this.IsAdd = false;
      this.IsEdit = true;
    }
  }

  // Custom search function
  customSearch(term: string, item: clientModel): boolean {
    if (typeof term !== 'string') return false;

    term = term.toLowerCase();
    const formattedValue = `${item.cn} - ${item.client}`.toLowerCase();

    return formattedValue.includes(term);
  }

  // Function to filter clients based on search term
  getFilteredClients(term: string): Observable<clientModel[]> {
    const filteredClients = this.clientList.filter(client => this.customSearch(term, client));

    return new Observable(observer => {
      observer.next(filteredClients);
      observer.complete();
    });
  }

  // Handle search event
  onSearch(event: any): Observable<clientModel[]> {
    const filteredClients = this.clientList.filter(client => this.customSearch(event, client));

    return new Observable(observer => {
      observer.next(filteredClients);
      observer.complete();
    });
  }

  // Handle client selection
  onClientSelection(event: any, select: NgSelectComponent) {
    if (event && event.client !== undefined) {
      const selectedValue = event.client;
      const selectedClient = this.clientList.find(client => client.client === selectedValue);

      if (selectedClient) {
        this.client = selectedClient;
      }
    } else {
      if (this.hit !== 1) {
        this.getRecord("last", this.clientList.length - 1);
      }
    }

    select.handleClearClick();
    this.hit = 1;
  }

  // Format client name for dropdown display
  formatClientName(client: clientModel): string {
    return `${client.cn} - ${client.client}`;
  }


  fillAccountManagerDropDown() {
    this.services.GetAllAccountManager().subscribe(x => {

      this.accmanmodel = x;
    })
  }

  filldriverDropDown() {
    this.services.GetAllDriver().subscribe(x => {
      this.driver = x;
    })
  }

  fillsiteDropDown() {
    this.services.GetAllSite().subscribe(x => {
      this.sp = x as siteModel[];
    })
  }

  AddData(_item: clientModel) {
    // Ensure required fields are present
    if (_item.cn && _item.client) {
      this.services.addclient(_item).subscribe(
        (response) => {
          // Success scenario
          if (response.status === 200) {
            this._commonAlertService.successMessage();

            if (response.body) {
              _item.clnT_FL_ID = response.body;
            }
            this.toggleFormState(false);
          }
        },
        (error) => {
          // Error handling
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          } else if (status === 400) {
            this._commonAlertService.badRequestMessage();
          }
        }
      );

      // Reset Add and Edit states
      _item.IsAdd = false;
      _item.IsEdit = false;
    }
  }

  UpdateData(_item: clientModel) {
    if (_item.cn && _item.client && _item.clnT_FL_ID) {
      this.services.updateclient(_item).subscribe(
        (response) => {
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
            this.toggleFormState(false);
          }
        },
        (error) => {
          // Handle error
          //console.error('error caught in component')
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          }
          else if (status === 400) {
            this._commonAlertService.badRequestMessage();
          }
        });
      _item.IsAdd = true;
      _item.IsEdit = false;

    }
  }

  onAddRecord(frmClient?: NgForm) {
    // Wait until maxCNValue is available
    if (!this.maxCNValue) {
      setTimeout(() => {
        this.onAddRecord(frmClient);
      }, 100); // Retry after 100ms
      return;
    }

    let nextCN = "0001"; // Default CN if no records exist

    const parsedMaxCN = parseInt(this.maxCNValue, 10);
    if (!isNaN(parsedMaxCN)) {
      nextCN = parsedMaxCN.toString().padStart(4, '0'); // Keep it 4-digit formatted
    }

    // Reset the form before setting new values
    frmClient?.resetForm();

    // Assign the CN value
    this.client.cn = nextCN;

    // Update UI states
    this.isReadonly = false;
    this.isDisabled = true;
    this.isEditing = true;
    this.isAdding = true;
    this.updateNavigationState();
    setTimeout(() => {
      this.el.nativeElement.querySelector('#txtclientName').focus();
    }, 500);
  }

  onEditRecord() {
    this.lastClientState = { ...this.client };
    this.isReadonly = false; // Enable form editing
    this.isCheckboxDisabled = false; // Enable checkboxes when editing
    this.isEditing = true; // Show Update & Cancel buttons
    this.isAdding = false; // Editing existing record
    this.updateNavigationState();
  }

  onCancel() {
    if (this.isAdding) {
      // If AddRecord was clicked, load the last record
      this.isAdding = false;
      this.isEditing = false;
      this.updateNavigationState();

      if (this.clientList && this.clientList.length > 0) {
        this.getAllClientData();
      }
    } else {
      // Normal cancel behavior (e.g., during edit mode)
      this.isEditing = false;
      this.updateNavigationState();
      this.isReadonly = true; // Enable form editing
      this.isCheckboxDisabled = true; // Enable checkboxes when editing
    }
  }


  // Reset form states after adding or updating
  toggleFormState(isEditing: boolean) {
    this.isEditing = isEditing; // Controls Update & Cancel buttons
    this.isAdding = isEditing;  // Controls Save button (Add mode)
    this.isReadonly = !isEditing; // Controls field editability
    this.updateNavigationState();
  }

  getClientbybyId(Client_id: number) {
    this.services.getclientById(Client_id).subscribe(data => {
      this.client = data as clientModel;
    })
    localStorage.removeItem('Client_id');
    this.isDisabled = true;
  }

  updateNavigationState() {
    this.isNavigationActive = !(this.isEditing || this.isAdding);
  }

  deleteRow(_id: any) {
    var delBtn = confirm("Do you want to delete this record?"); //wrong
    if (delBtn == true) {

      this.services.deleteclient(_id).subscribe(
        (response: any) => {
          //console.log('response received')          
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this._commonAlertService.deleteMessage();
            this.clientList = this.clientList.filter(item => item.clnT_FL_ID !== _id);
            this.clientList.push();
            this.getRecord('last', -1);
          }
        },
        (error) => {
          console.error('error caught in component')
          const status = error.status;
          if (status === 400) {
            this._commonAlertService.badRequestMessage();
          }
        });
    }
  }

  getRecord(input: any, SNO: number) {
    let totalNumberOfRec = this.clientList.length;
    if (input == 'first') {
      if (SNO === 1) {
        Swal.fire({
          text: "You are already at the first record.",
        })
      } else {
        this.client = this.clientList[0];
      }
    }
    else if (input == 'prev' && SNO != 1) {
      const prevRecord = this.clientList.find(x => x.sno == (SNO - 1));
      if (prevRecord) {
        this.client = prevRecord;
      }
    }
    else if (input == 'next' && totalNumberOfRec > SNO) {
      const nextRecord = this.clientList.find(x => x.sno == (SNO + 1));
      if (nextRecord) {
        this.client = nextRecord;
      }
    }
    else if (input == 'last') {
      if (SNO === totalNumberOfRec) {
        Swal.fire({
          text: "You are already at the last record.",
        })
      } else {
        const lastRecord = this.clientList.find(x => x.sno == totalNumberOfRec);
        if (lastRecord) {
          this.client = lastRecord;
        }
      }
    }
  }
}
