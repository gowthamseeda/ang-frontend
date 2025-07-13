import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipeMock implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    return items;
  }
}
