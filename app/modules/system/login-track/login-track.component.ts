import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { loginFlModel } from 'src/app/models/loginModel';
import { AuthService } from '../../auth/auth.service';
import { SiteService } from '../../masters/site/sites.service';
import { GetpageTrackRecordModel, pageTrackRecordModel } from 'src/app/models/pageTrackRecordModel';
import { Modal } from 'bootstrap';
import { CommonService } from 'src/app/common/commonService';
import { deleteErrorMessage } from 'src/app/common/constant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-track',
  templateUrl: './login-track.component.html',
  styleUrls: ['./login-track.component.scss']
})
export class LoginTrackComponent {
  userloginList: loginFlModel[] = [];
  userLoginList: { iN_DTTM?: string | Date, ouT_DTTM?: string | Date }[] = []; // Replace with your actual data type


  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: loginFlModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;
  userIdFromRoute: number;
  constructor(public _authService: AuthService,
    private _siteService: SiteService, private _commonSerice: CommonService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // const routeParams = this.route.snapshot.paramMap;
    // this.userIdFromRoute = Number(routeParams.get('userId'));
    // this.userloginList = [];
    // this.GetAllLoginHistory();
  }

  // GetAllLoginHistory(): void {
  //   this._siteService.getAllLoginHistory().subscribe(
  //     res => {
  //       this.userloginList = res;
  //       this.filteredList = [...this.userloginList];
  //       if (this.userIdFromRoute && this.userIdFromRoute != 0){
  //         this.userloginList=this.userloginList.filter(x=>x.u_ID===this.userIdFromRoute.toString());
  //       }
  //       this.updatePagination();
  //     },
  //     (error) => {
  //       console.error('Error loading login history:', error);
  //     }
  //   );
  // }


  onSearch(): void {
    // Use filteredList as the base data
    this.userloginList = [...this.filteredList];

    // Get the trimmed and uppercased search text
    const searchText = this.searchText.toUpperCase().trim();

    // If there's search text, filter the list
    if (searchText) {
      this.userloginList = this.userloginList.filter(item =>
        (item.useR_CODE && item.useR_CODE.toUpperCase().includes(searchText)) ||
        (item.fulL_NAME && item.fulL_NAME.toUpperCase().includes(searchText))
      );
    }

    // Update pagination afte


    // Update pagination after filtering
    this.updatePagination();
  }


  updatePagination(): void {
    const totalPages = Math.ceil(this.userloginList.length / this.itemsPerPage);
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



  // Method to calculate duration in HH:MM format
  calculateDuration(inDate?: string | Date, outDate?: string | Date): string {
    // Check if both dates are provided
    if (!inDate || !outDate) {
      return 'Active User';
    }

    // Calculate the difference in milliseconds
    const diff = new Date(outDate).getTime() - new Date(inDate).getTime();

    // Convert milliseconds to total minutes
    const totalMinutes = Math.floor(diff / 60000);

    // Calculate hours and remaining minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Format hours and minutes to ensure two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Return the time in "HH:MM" format
    return `${formattedHours}:${formattedMinutes}`;
  }

}