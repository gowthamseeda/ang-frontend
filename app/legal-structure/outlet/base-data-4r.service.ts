import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Status, Task } from '../../tasks/task.model';

@Injectable({
  providedIn: 'root'
})
export class BaseData4rService {
  private addressVerificationTasks = new BehaviorSubject<Task[]>([]);
  private additionalAddressVerificationTasks = new BehaviorSubject<Task[]>([]);
  private poBoxVerificationTasks = new BehaviorSubject<Task[]>([]);
  private gpsVerificationTasks = new BehaviorSubject<Task[]>([]);

  private allVerificationTasks = new BehaviorSubject<Task[]>([]);
  private allRemainVerificationTasks = new BehaviorSubject<string[]>([]);

  private isEditPage = new BehaviorSubject(false)

  constructor() { }

  public setAddressVerificationTasks(tasks: Task[]) {
    this.addressVerificationTasks.next(tasks);
  }

  public isAddressOpenVerificationTaskByAggregateField(aggregateField: string) {
    return this.addressVerificationTasks.pipe(
      map(
        tasks =>
          !!tasks.find(
            task => task.aggregateField === aggregateField && task.status === Status.OPEN
          )
      )
    );
  }

  public setAdditionalAddressVerificationTasks(tasks: Task[]) {
    this.additionalAddressVerificationTasks.next(tasks);
  }

  public isAdditionalAddressOpenVerificationTaskByAggregateField(aggregateField: string) {
    return this.additionalAddressVerificationTasks.pipe(
      map(
        tasks =>
          !!tasks.find(
            task => task.aggregateField === aggregateField && task.status === Status.OPEN
          )
      )
    );
  }

  public setPoBoxVerificationTasks(tasks: Task[]) {
    this.poBoxVerificationTasks.next(tasks);
  }

  public isPoBoxOpenVerificationTaskByAggregateField(aggregateField: string) {
    return this.poBoxVerificationTasks.pipe(
      map(
        tasks =>
          !!tasks.find(
            task => task.aggregateField === aggregateField && task.status === Status.OPEN
          )
      )
    );
  }

  public setGpsVerificationTasks(tasks: Task[]) {
    this.gpsVerificationTasks.next(tasks);
  }

  public isGpsOpenVerificationTaskByAggregateField(aggregateField: string) {
    return this.gpsVerificationTasks.pipe(
      map(
        tasks =>
          !!tasks.find(
            task => task.aggregateField === aggregateField && task.status === Status.OPEN
          )
      )
    );
  }

  public setAllVerificationTasks(tasks: Task[]) {
    this.allVerificationTasks.next(tasks);
  }

  public isOpenVerificationTaskByAggregateField(aggregateField: string) {
    return this.allVerificationTasks.pipe(
      map(
        tasks =>
          !!tasks.find(
            task => task.aggregateField === aggregateField && task.status === Status.OPEN
          )
      )
    );
  }

  public setEditPage(isEditPage: boolean) {
    this.isEditPage.next(isEditPage);
  }

  public getEditPage() {
    return this.isEditPage.asObservable();
  }

  public setCompletedVerificationTasks(aggregateFields: string[]) {
    let currentTasks = this.allRemainVerificationTasks.getValue();
    let filteredFields = aggregateFields.filter(field => this.allVerificationTasks.getValue().some(task => task.aggregateField === field));
    let updatedTasks = Array.from(new Set(currentTasks.concat(filteredFields)));
    this.allRemainVerificationTasks.next(updatedTasks);
  }

  public subscribeToAllCompletedVerificationTasks() {
    return this.allRemainVerificationTasks.asObservable();
  }
  public subscribeToAllVerificationTasks() {
    return this.allVerificationTasks.asObservable();
  }

  public resetServices() {
    this.addressVerificationTasks.next([]);
    this.additionalAddressVerificationTasks.next([]);
    this.poBoxVerificationTasks.next([]);
    this.gpsVerificationTasks.next([]);
    this.allVerificationTasks.next([]);
    this.isEditPage.next(false);
  }
}
