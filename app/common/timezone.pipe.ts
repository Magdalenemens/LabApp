import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timezone'
})
 
export class TimezonePipe implements PipeTransform {
  transform(value: TimezonePipe | string): string {
    if (!value) return '';

    // Format the time using Intl.TimeFormat
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Riyadh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Set to true if you want 12-hour format
    };

    const formattedTime = new Intl.DateTimeFormat('en-US', options).format();

    return `Logged at: ${formattedTime}`;
  }
}
