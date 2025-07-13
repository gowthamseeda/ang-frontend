import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingService {
  constructor() {}

  sortByName(a: any, b: any): number {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  sortById(a: any, b: any): number {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  }

  sortByPosition(a: any, b: any): number {
    if (a.position === undefined || a.position === null) {
      return -1;
    }
    if (b.position === undefined || b.position === null) {
      return 1;
    }
    if (a.position < b.position) {
      return -1;
    }
    if (a.position > b.position) {
      return 1;
    }
    return 0;
  }
}
