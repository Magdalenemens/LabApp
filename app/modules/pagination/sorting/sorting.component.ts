import { Component } from '@angular/core';
import { Injectable } from '@angular/core';


@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class SortingComponent {
  sortDirection: string = 'asc'; // Default sort direction
  sortColumn: string = '';       // Column being sorted

  // Function to sort data
  sortData(data: any[], column: string, direction: string): any[] {
    this.sortDirection = direction;

    return data.sort((a, b) => {
      let compareA = a[column];
      let compareB = b[column];

      if (this.sortDirection === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
  }

  // Function to get the sort direction
  toggleDirection(currentDirection: string): string {
    return currentDirection === 'asc' ? 'desc' : 'asc';
  }

  // Function to get the appropriate sort icon
  getSortIcon(column: string, sortColumn: string, sortDirection: string): string {
    if (column === sortColumn) {
      return sortDirection === 'asc' ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
    }
    return '';
  }
}
