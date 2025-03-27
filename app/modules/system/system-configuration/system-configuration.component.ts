import { Component } from '@angular/core';
import { sysconfigModel } from 'src/app/models/sysconfigModel';
import { SytemService } from '../system.service';
import { SortingComponent } from '../../pagination/sorting/sorting.component';

@Component({
  selector: 'app-system-configuration',
  templateUrl: './system-configuration.component.html',
  styleUrls: ['./system-configuration.component.scss']
})
export class SystemConfigurationComponent {
  sytemConfigList: sysconfigModel[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [10, 25, 50]; // Add page size options

  //Search
  filteredList: sysconfigModel[] = [];
  searchText: string = '';
  totalItems: number;
  pageChange: any;
  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(private _systemService: SytemService, private sortingService: SortingComponent) { }

  ngOnInit(): void {
    this.sytemConfigList = [];
    this.GetAllLoginHistory();
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
	  this.sytemConfigList = this.sortingService.sortData([...this.sytemConfigList], column, this.sortDirection);
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

  GetAllLoginHistory(): void {
    this._systemService.getAllSystemConfig().subscribe(
      res => {
        this.sytemConfigList = res;
        this.filteredList = [...this.sytemConfigList];
        this.updatePagination();
      },
      (error) => {
        console.error('Error loading login history:', error);
      }
    );
  }

  onSearch(): void {
    // Use filteredList as the base data
    this.sytemConfigList = [...this.filteredList];

    // Get the trimmed and uppercased search text
    const searchText = this.searchText.toUpperCase().trim();

    // If there's search text, filter the list
    if (searchText) {
      this.sytemConfigList = this.sytemConfigList.filter(item =>
        (item.deF_NAME && item.deF_NAME.toUpperCase().includes(searchText)) ||
        (item.seq && item.seq.includes(searchText))
      );
    }

    // Update pagination afte


    // Update pagination after filtering
    this.updatePagination();
  }


  updatePagination(): void {
    const totalPages = Math.ceil(this.sytemConfigList.length / this.itemsPerPage);
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


