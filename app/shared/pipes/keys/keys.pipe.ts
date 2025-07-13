import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys', pure: false })
export class KeysPipe implements PipeTransform {
  transform(value: any): any {
    if (value != null && value !== undefined) {
      return Object.keys(value);
    }
    return [];
  }
}
