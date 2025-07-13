import { Injectable } from '@angular/core';
import { Observable, map, BehaviorSubject } from 'rxjs';
import {Status, Task } from '../tasks/task.model';
import { ApiService } from '../shared/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationChannelsService {
  private communicationVerificationTasks = new BehaviorSubject<Task[]>([]);
 private allVerificationTasks = new BehaviorSubject<Task[]>([]);
 private allRemainVerificationTasks = new BehaviorSubject<string[]>([]);

 private isEditPage = new BehaviorSubject(false)


  constructor(private apiService: ApiService) {}

getCommunicationChannels(
    businessSiteId: string
  ): Observable<any> {
    return this.apiService.get(`/tasks/api/v1/business-sites/${businessSiteId}` +
      `/tasks?dataClusters=COMMUNICATION_CHANNELS&type=DATA_CHANGE&status=OPEN`)
  }

public setAllVerificationTasks(tasks: Task[]){
    this.allVerificationTasks.next(tasks);
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
    this.allVerificationTasks.next([]);
    this.isEditPage.next(false);
  }

public setCommunicationVerificationTasks(tasks: Task[]) {
    this.communicationVerificationTasks.next(tasks);
  }
public isCommunicationOpenVerificationTaskByAggregateField(aggregateField: string) {
    return this.communicationVerificationTasks.pipe(
      map(
        tasks =>
          !!tasks.find(
            task => task.aggregateField === aggregateField && task.status === Status.OPEN
          )
      )
    );
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
}
