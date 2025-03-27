import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaulttimezone'
})

export class DefulatTimezonePipe implements PipeTransform {
  transform(value: DefulatTimezonePipe | string): string {
    if (!value) return '';

    // Format the date and time using Intl.DateTimeFormat
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Set to true if you want 12-hour format
    };

    const formattedDateTime = new Intl.DateTimeFormat('en-GB', options).format(new Date());

    return `${formattedDateTime}`;
  }
}  
