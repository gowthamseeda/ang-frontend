import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'emptyValuePipe', pure: false })
export class EmptyValuePipe implements PipeTransform {
  transform(value: any): any {
    return (value === undefined || value === null || value === '') ? '-' : value;
  }
}
