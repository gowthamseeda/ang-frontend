import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssignedBrandLabelTableService {
  private readonly assignedBrandLabelsSavedSubject = new Subject<boolean>();

  constructor() {}

  saveAssignedLabels(): Observable<boolean> {
    return this.assignedBrandLabelsSavedSubject;
  }

  assignedLabelsSaved(saved: boolean): void {
    this.assignedBrandLabelsSavedSubject.next(saved);
  }
}
