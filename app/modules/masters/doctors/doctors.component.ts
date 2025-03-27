import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder, FormControl, FormGroup,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ADD_USER_ERROR, deleteErrorMessage, deleteMessage, errorMessage, NOT_FOUND_MESSAGE, registerSuccessMessage, REQUIRED_FIELDS, successMessage, updateSuccessMessage, USER_ALREADY_EXISTS, warningMessage } from 'src/app/common/constant';
import { Operation, PageName } from 'src/app/common/enums';
import { NotFoundError, Observable, Subject } from 'rxjs';
import { siteModel } from 'src/app/models/siteModel';
import { DoctorService } from './doctors.service';
import { doctorflModel } from 'src/app/models/doctorflModel';
import moment from 'moment';
import { CommonService } from 'src/app/common/commonService';
import { CommonAlertService } from 'src/app/common/commonAlertService';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent {
  @ViewChild('inputFile') inputFile!: ElementRef<HTMLInputElement>;
  @ViewChild('previewImage') previewImage!: ElementRef<HTMLImageElement>;
  // usersfl: doctorflModel;
  doctorData: doctorflModel = new doctorflModel();
  doctorAllData: doctorflModel[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  form: FormGroup;
  operation = 0; // 0 means show, 1 means add,2 means edit, 3 means delete // make enum for operation
  isAddBtnActive: boolean = false;
  isEditBtnActive: boolean = false;
  isDeleteBtnActive: boolean = false;
  isSaveBtnActive: boolean = true;
  isCancelBtnActive: boolean = true;
  submitted = false;
  IsDisabled = true;
  isEdit = false;
  isDelete = false;
  filteredDoctors: any[] = [];
  searchTerm: string = '';
  matchedSites: any[] = [];
  isNavigationActive: boolean = false;
  matchedDoctor$!: Observable<doctorflModel[]>;
  selectedDoctor: doctorflModel | undefined; // Property to hold the selected site
  isAdding: boolean = false;  // Flag to track if adding a new record
  isDisabled = false;
  currentDateTime = moment();
  startTime: string = '';
  endTime: string = '';

  constructor(private formBuilder: FormBuilder, public _DoctorService: DoctorService, public _commonAlertService: CommonAlertService,
    private el: ElementRef, private _doctorService: DoctorService, private _commonService: CommonService) {
    this.form = this.formBuilder.group({
      txtdrno: [{ value: '', disabled: true }],
      txtdoctor: [{ value: '', disabled: true }, Validators.required],
      txtcn: [{ value: '', disabled: true }, Validators.required],
      txtloc: [{ value: '', disabled: true }],
      txtTel: [{ value: '', disabled: true }],
      txtMob: [{ value: '', disabled: true }],
      txtfax: [{ value: '', disabled: true }],
      txtEmail: [{ value: '', disabled: true }, Validators.required],
      txtnotes: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.currentDateTime = moment();
    this.startTime = this.currentDateTime.format();
    this.getAllDoctorsData();
  }

  ngOnDestroy(): void {
    this.currentDateTime = moment();
    this.endTime = this.currentDateTime.format();
    this._commonService.logPageInOutTime(PageName.Master_Doctors, this.startTime, this.endTime);
    this.dtTrigger.unsubscribe();
  }

  // Method to check if a field is invalid
  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control && control.invalid && (control.dirty || control.touched || this.submitted);
  }

  getAllDoctorsData(): void {
    this._DoctorService.getAllDoctors().subscribe(res => {
      if (res && res.allDoctorFile) { // Check if res and res.allDoctorFile are defined
        this.doctorAllData = res.allDoctorFile; // Assuming allDoctorFile is the correct array
        if (this.doctorAllData.length > 0) {
          this.doctorData = this.doctorAllData[this.doctorAllData.length - 1]; // Get the last doctor
          this.getRecord("last", this.doctorAllData.length - 1); // Call getRecord with "last" and index
        } else {
          console.warn('No doctor data available.');
          // Handle case where doctorAllData is empty, if necessary
        }
      } else {
        console.error('No allDoctorFile found in the response.');
        // Handle the case where res.allDoctorFile is not defined or empty
      }
    }, error => {
      console.error('Error fetching doctor data:', error);
      // Handle errors, e.g., display a message to the user
    });
  }

  onSearchUser(event: any) {
    const filteredDoctors = this.doctorAllData.filter(site =>
      this.customSearch(event, site)
    );
    return new Observable(observer => {
      observer.next(filteredDoctors);
      observer.complete();
    });
  }

  customSearch(term: string, item: doctorflModel): boolean {
    if (typeof term !== 'string') {
      return false;
    }
    term = term.toLowerCase();
    return item.doctor.toLowerCase().includes(term);
  }

  onAddRecord() {
    this.isAdding = true;
    this.toggleReadonlyState(true);
    this.operation = Operation.add;
    this.isSaveBtnActive = false;
    this.isCancelBtnActive = false;
    this.isEditBtnActive = true;
    this.isDeleteBtnActive = true;
    this.emptyTheForm();
    this.isNavigationActive = true;
    setTimeout(() => {
      this.el.nativeElement.querySelector('#txtdoctor').focus();
    }, 500);
    this.isAddBtnActive = true;
  }

  emptyTheForm() {
    this.form.reset({
      txtdrno: '',
      txtdoctor: '',
      txtcn: '',
      txtloc: '',
      txtTel: '',
      txtfax: '',
      txtEmail: '',
      txtnotes: '',
    });
  }

  Add() {
    if (this.doctorData.drno && this.doctorData.doctor) {
      this._DoctorService.addUser(this.doctorData).subscribe(
        response => {
          if (response.status === 200 || response.status === 204) {
            this.getAllDoctorsData();
            this._commonAlertService.successMessage();
          }
          this.toggleReadonlyState(false);
          this.IsDisabled = false;
        },
        error => {
          this.IsDisabled = false;
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.warningMessage();
          } else {
            this._commonAlertService.errorMessage();
          }
        }
      );
    } else {
      Swal.fire({
        text: REQUIRED_FIELDS,
      });
      this.toggleReadonlyState(true);
      this.IsDisabled = false;
    }
  }

  onEditRecord() {
    this.toggleReadonlyState(true);
    this.isAddBtnActive = true;
    this.IsDisabled = false;
    this.isEdit = true;
    this.operation = Operation.edit;
    this.isNavigationActive = true;
    this.isSaveBtnActive = false;
    this.isCancelBtnActive = false;

  }

  Update(doctorData: doctorflModel) {
    const requiredFields = [
      this.doctorData.drno,
      this.doctorData.doctor
    ];
    const allFieldsFilled = requiredFields.every(field => field && field.trim().length > 0);
    if (allFieldsFilled) {
      this._DoctorService.updateUser(doctorData).subscribe(
        (response) => {
          if (response.status === 200 || response.status === 204) {
            this._commonAlertService.updateMessage();
          }
          this.toggleReadonlyState(false);
          this.IsDisabled = false;
        },
        (error) => {
          this.IsDisabled = false;
          const status = error.status;
          if (status === 409) {
            this._commonAlertService.userExistsMessage();
          } else {
            this._commonAlertService.addUserErrorMessage();
          }
        }
      );
    } else {
      this._commonAlertService.requiredFieldMessage();
      this.toggleReadonlyState(true);
      this.IsDisabled = false;
    }
  }

  onDeleteRecord(_id: number) {
    var delBtn = confirm("Do you want to delete this record?");
    if (delBtn == true) {
      this._DoctorService.deleteUser(_id).subscribe(
        (response: any) => {
          const status = response.status;
          if (status === 200 || response.status === 204) {
            this.isEditBtnActive = false;
            this.isAddBtnActive = false;
            this.isDeleteBtnActive = false;
            this.isCancelBtnActive = true;
            this.isSaveBtnActive = true;
            this.getAllDoctorsData();
            this._commonAlertService.deleteMessage();
          }
        },
        (error) => {
          console.error('error caught in component')
          const status = error.status;
          if (status === 400) {
            this._commonAlertService.deleteErrorMessage();
          }
        });
    }
  }

  onSubmit() {
    // if (this.form.invalid) {
    //   // If the form is invalid, highlight all invalid fields
    //   Object.keys(this.form.controls).forEach(field => {
    //     const control = this.form.get(field);
    //     control?.markAsTouched({ onlySelf: true });
    //   });
    //   return;
    // }
    if (!this.isEdit) {
      this.isSaveBtnActive = false;
      this.isCancelBtnActive = false;
      this.isEditBtnActive = true;
      this.isDeleteBtnActive = false;
      this.isNavigationActive = false;
      this.AssignTheValueUsingFormControl();
      this.Add();
    }
    else {
      // this.AssignTheValueUsingFormControl() ;
      this.Update(this.doctorData);
    }
  }

  onCancelRecord(_id: number) {
    this.toggleReadonlyState(false);
    if (this.isEdit) {
      // Find the index of the record with the given _id
      const index = this.doctorAllData.findIndex(x => x.doC_FL_ID === _id);
      if (index !== -1) {
        // Restore the original user data
        this.doctorData = this.doctorAllData[index]; // Deep copy to prevent mutation
        this.AssignTheValueUsingFormControl();

        // Update UI controls
        this.operation = Operation.cancel;
        this.isCancelBtnActive = true;
        this.isSaveBtnActive = true;
        this.isAddBtnActive = false;
        this.isNavigationActive = false;
      }
    } else {
      this.getAllDoctorsData();
      this.isAddBtnActive = false;
      this.isDeleteBtnActive = false;
      this.isCancelBtnActive = true;
    }
  }

  toggleReadonlyState(isEditable: boolean) {
    for (const controlName in this.form.controls) {
      if (this.form.controls.hasOwnProperty(controlName)) {
        const control = this.form.get(controlName);
        if (isEditable) {
          control?.enable();
        } else {
          control?.disable();
        }
      }
    }
  }

  AssignTheValueUsingFormControl() {
    const getFormValue = (controlName: string, defaultValue: any) => {
      const control = this.form.get(controlName);
      return control && control.value != null ? control.value : defaultValue;
    };
    this.doctorData = {
      sno: 0,
      doC_FL_ID: 0,
      drno: getFormValue('txtdrno', 0),
      doctor: getFormValue('txtdoctor', ''),
      cn: getFormValue('txtcn', 0),
      loc: getFormValue('txtloc', ''),
      fax: getFormValue('txtfax', ''),
      tel: getFormValue('txtTel', ''),
      mobile: getFormValue('txtMobile', ''),
      email: getFormValue('txtEmail', ''),
      notes: getFormValue('txtnotes', ''),
    };
  }

  assignTheData() {
    this.form.reset({
      drno: this.doctorData.drno,
      doctor: this.doctorData.doctor,
      cn: this.doctorData.cn,
      loc: this.doctorData.loc,
      fax: this.doctorData.fax,
      tel: this.doctorData.tel,
      email: this.doctorData.email,
      notes: this.doctorData.notes,
    })
  };


  getRecord(input: any, drno: number) {
    let totalNumberOfRec = this.doctorAllData.length;


    if (input == 'first') {
      if (drno === 1) {
        Swal.fire({
          text: "You are already at the first record.",
        });
      } else {
        this.doctorData = this.doctorAllData[0];

      }
    } else if (input == 'prev' && drno != 1) {
      const prevRecord = this.doctorAllData.find(x => x.sno == (drno - 1));
      if (prevRecord) {
        this.doctorData = prevRecord;

      }
    } else if (input == 'next' && totalNumberOfRec > drno) {
      const nextRecord = this.doctorAllData.find(x => x.sno == (drno + 1));
      if (nextRecord) {
        this.doctorData = nextRecord;

        if (drno === totalNumberOfRec) {
          Swal.fire({
            text: "You are already at the last record.",
          });
        }
      }
    } else if (input == 'last') {
      if (drno === totalNumberOfRec) {
        Swal.fire({
          text: "You are already at the last record.",
        });
      } else {
        const lastRecord = this.doctorAllData.find(x => x.sno == totalNumberOfRec);
        if (lastRecord) {
          this.doctorData = lastRecord;

        }
      }
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  calculateCurrentIndex(currentDRNO: number): number {
    let currentIndex = this.doctorAllData.findIndex(x => x.sno === currentDRNO);
    return currentIndex + 1; // Start index is one-based
  }

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
