import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit { 
    @Input() totalItems!: number;
    @Input() itemsPerPage!: number;
    @Input() currentPage!: number;
    pageSizeOptions: number[] = [10, 25, 50];
    @Output() pageChange = new EventEmitter<number>();
    @Output() pageSizeChange = new EventEmitter<number>();
    firstItemIndex: number;
    lastItemIndex: number;
    pages: number[] = [];
  
    visiblePages: number[] = []; // Only show limited visible pages
    totalPages: number = 0; // Total pages based on data and items per page
  
    ngOnInit(): void {
      this.updatePagination();
    }
  
    ngOnChanges(): void {
      this.updatePagination();
    }
  
    updatePagination(): void {
      this.firstItemIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
      this.lastItemIndex = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);     
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updateVisiblePages();
    }
  
    updateVisiblePages(): void {
      const maxVisiblePages = 3; // Change this as per your requirement
      const currentPageIndex = this.currentPage - 1;
      const halfVisiblePages = Math.floor(maxVisiblePages / 2);
      const startPage = Math.max(0, currentPageIndex - halfVisiblePages);
      const endPage = Math.min(this.totalPages - 1, currentPageIndex + halfVisiblePages);
  
      this.visiblePages = this.pages.slice(startPage, endPage + 1);
    }
  
    goToPage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.pageChange.emit(this.currentPage);
        this.updateVisiblePages();
      }
    }
  
    onPageSizeChange(event: any): void {
      const newSize = parseInt(event.target.value, 10);
      if (newSize > 0) {
        this.itemsPerPage = newSize;
        this.pageSizeChange.emit(this.itemsPerPage);
        this.updatePagination();
      }
    }
  }
  