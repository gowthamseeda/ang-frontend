import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'adjustFilter', pure: false })
export class AdjustFilterPipe implements PipeTransform {
  transform(value: any): any {
    if (value != null && value !== undefined && value === 'adamIds') {
      return 'adamId';
    }
    return value;
  }
}
