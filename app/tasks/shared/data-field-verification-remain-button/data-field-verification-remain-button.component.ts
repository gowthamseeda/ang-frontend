import {Component, Input} from "@angular/core";
import {combineLatest, of, Subject} from "rxjs";
import {BaseData4rService} from "../../../legal-structure/outlet/base-data-4r.service";
import {map, takeUntil} from "rxjs/operators";

@Component({
  selector: 'gp-data-field-verification-remain-button',
  templateUrl: './data-field-verification-remain-button.component.html',
  styleUrls: ['./data-field-verification-remain-button.component.scss']
})
export class DataFieldVerificationRemainButtonComponent {
  @Input()
  aggregateFields: string[] = [];
  @Input()
  isBusinessSiteResponsible: boolean = false;
  isBlockVerificationsTasksRemained = of(false);
  private unsubscribe = new Subject<void>();

  constructor(
    private baseData4rService: BaseData4rService
  ) {
  }

  ngOnInit(): void {
    this.subscribeToRemainVerificationTasks();
  }

  onBlockRemainClick(): void {
    this.baseData4rService.setCompletedVerificationTasks(this.aggregateFields);
  }

  subscribeToRemainVerificationTasks(): void {
    const verificationTasks$ = this.baseData4rService.subscribeToAllVerificationTasks();
    const completedVerificationTasks$ = this.baseData4rService.subscribeToAllCompletedVerificationTasks();

    combineLatest([verificationTasks$, completedVerificationTasks$]).pipe(
      takeUntil(this.unsubscribe),
      map(([tasks, aggregateFields]) => {
        let taskAvailableFields = this.aggregateFields.filter(field => tasks.some(task => task.aggregateField === field));
        return taskAvailableFields.every(field => aggregateFields.includes(field));
      })
    ).subscribe(isBlockVerificationsTasksRemained => {
      this.isBlockVerificationsTasksRemained = of(isBlockVerificationsTasksRemained);
    });
  }
}
