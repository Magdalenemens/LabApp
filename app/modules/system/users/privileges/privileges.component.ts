import { Component } from '@angular/core';
import { userAccessModel, userflModel } from 'src/app/models/userflModel';
import { UserService } from '../users.service';
import { CommonAlertService } from 'src/app/common/commonAlertService';
import { AbstractControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss']
})
export class PrivilegesComponent {
  form: FormGroup;
  userDropDown: userflModel[] = [];
  moduleDetails: userAccessModel[] = [];
  selectedUser: any;
  submitted = false;

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  totalItems: number;
  pageChange: any;

  constructor(public _userService: UserService, public _commonAlertService: CommonAlertService,) {
  }

  ngOnInit(): void {
    $('#btnprivileges').addClass("is-active");
    this.loadUsersDropdown();
  }

  loadUsersDropdown() {
    this._userService.getAllUser().subscribe({
      next: (users) => {
        this.userDropDown = users;
      },
      error: (error) => {
        this._commonAlertService.ERROR_FETCHING_DATA();
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // Method to get all reference range data based on Tcode for the right user
  getModuleAccessDetailsDataByUserId(userId: string) {
    this._userService.getModuleAccessDetailsByUserId(userId).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.moduleDetails = data; // Populate the module details if data exists
        } else {
          this.moduleDetails = []; // Clear the module details if no data is found          
          Swal.fire({
            text: 'No module details found for the selected user.',
          });
        }
      },
      (error) => {
        // Handle API errors gracefully
        this.moduleDetails = [];
        // console.error('Error fetching module access details:', error);
        // Swal.fire({
        //   text: 'Failed to fetch module details. Please try again later.',
        // });
      }
    );
  }

  // Method triggered when the user selection changes
  onUserChange(event: any) {
    const userId = event; // Extract userId from the event
    if (userId) {
      this.getModuleAccessDetailsDataByUserId(userId); // Fetch data for the selected user
    } else {
      this.moduleDetails = []; // Clear module details if no user is selected
      Swal.fire({
        text: 'Please select a valid user.',
      });
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.moduleDetails.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, totalPages) || 1;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(event: any): void {
    this.itemsPerPage = event;
    this.currentPage = 1; // Reset to first page when page size changes
    this.updatePagination();
  }
}