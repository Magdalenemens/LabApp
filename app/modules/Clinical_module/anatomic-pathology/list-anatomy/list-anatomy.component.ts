import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { mbListSearchModel, microbiologyListModel } from 'src/app/models/microbiologyListModel';
import { microbiologyModel } from 'src/app/models/microbiologyModel';
import { MicroBiologyService } from '../../micro-biology/add-microbiology/micro-biology.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { AnatomicpathologyService } from '../add-pathology/anatomic-pathology.service';
import { anatomicModel, apRepportModel } from 'src/app/models/anatomicModel';
import { SortingComponent } from 'src/app/modules/pagination/sorting/sorting.component';

@Component({
  selector: 'app-list-anatomy',
  templateUrl: './list-anatomy.component.html',
  styleUrls: ['./list-anatomy.component.scss']
})
export class ListAnatomyComponent {

  anatomicData: anatomicModel = new anatomicModel();
  anatomicAllData: anatomicModel[] = [];
  apRepportData: apRepportModel = new apRepportModel();
  url = '';

  //Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: microbiologyListModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;
  id: string;

  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(private _anatomicpathologyService: AnatomicpathologyService, private fb: FormBuilder, private sortingService: SortingComponent,
    private router: Router, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.getAllanatomicData();
    $('#btnlist').addClass("is-active");
    this.route.paramMap.subscribe(params => {
      this.id = params.get('orD_NO');
      console.log('Received ID:', this.id);

      // Call the showPatient method using the retrieved ID
      this.showPatient(this.id);
    });
  }

    // Handle sorting
	sortData(column: string): void {
	  if (this.sortColumn === column) {
		this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
	  } else {
		this.sortColumn = column;
		this.sortDirection = 'asc';
	  }
	  
	  // Perform your sorting logic
	  this.anatomicAllData = this.sortingService.sortData([...this.anatomicAllData], column, this.sortDirection);
	}

  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'expand_less' : 'expand_more';
    }
    return 'unfold_more';
  }
  
  getSortIconClass(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'expand-less' : 'expand-more';
    }
    return '';
  }

  getAllanatomicData() {
    this._anatomicpathologyService.getAllAnatomicPathology().subscribe(res => {
      this.anatomicAllData = res;
    },
      (error) => {
        console.error('Error loadinng anatomic list:', error);
      })
  }

  view(id: any) {
    localStorage.setItem('orD_NO', id);
    this.url = '../clinical-module/Anatomic/addanatomic';
    this.router.navigate([this.url]);
  }

  showPatient(Id: any) {
    const isolModal = document.getElementById('patientModal') as HTMLElement;

    // Check for patient ID in local storage
    const storedPatientId = localStorage.getItem('orD_NO');

    // If local storage has a value, prioritize it; else use the passed Id
    const patientId = storedPatientId ? storedPatientId : Id;

    if (patientId) {
      // Fetch patient data based on the ID
      this.getPatientData(patientId);

      // Show the modal
      const myModal = new Modal(isolModal);
      myModal.show();
    } else {
      console.warn('No patient ID found in local storage or passed as argument.');
      // Optionally, handle this case, like showing an error message or alert.
    }
  }



  getPatientData(Id: any) {
    this._anatomicpathologyService.getAnatomicPathologyById(Id).subscribe(res => {
      this.anatomicData = res;
    },
      (error) => {
        console.error('Error loading Microbiology Patient details:', error);
      })
  }

  calculateAge(dob: string | null): number | null {
    if (!dob) {
      return null;
    }
    const birthDate = this.parseDate(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // If dob format is DD/MM/YYYY, use this method to parse 
  parseDate(dob: string): Date {
    const parts = dob.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day); // Create Date object with corrected month and day
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.anatomicAllData.length / this.itemsPerPage);
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