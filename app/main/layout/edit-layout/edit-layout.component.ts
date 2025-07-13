import { Component, Input } from '@angular/core';

import { AggregateDataField, Task } from '../../../tasks/task.model';
import { EditLayoutService } from './edit-layout.service';

@Component({
  selector: 'gp-edit-layout',
  templateUrl: './edit-layout.component.html',
  styleUrls: ['./edit-layout.component.scss']
})
export class EditLayoutComponent {
  @Input()
  isMTR: boolean = false;

  @Input()
  taskPresent: boolean = false;

  @Input()
  logo: string;

  @Input()
  title: string;

  @Input()
  closeLink: string;

  @Input()
  isRetailOutlet: boolean = false;

  @Input()
  set marginalColumnShown(show: boolean) {
    this.editLayoutService.marginalColumnShown = show;
  }

  @Input()
  set marginalColumnDisabled(disabled: boolean) {
    this.editLayoutService.marginalColumnDisabled = disabled;
  }

  @Input()
  isForRetailEnabled: boolean = false;

  @Input()
  aggregateDataFields: AggregateDataField[] = [];

  @Input()
  openTasks: Task[]

  isIconVisible: boolean = true;
  buttonLabel: string = 'Show changes';

  constructor(public editLayoutService: EditLayoutService) {
    this.editLayoutService.marginalColumnDisabled = false;
  }

  toggleMarginalColumn(): void {
    this.editLayoutService.toggleMarginalColumn();
  }


  get marginalColumnVisible(): boolean {
    return this.editLayoutService.marginalColumnVisible();
  }

  get isMarginalColumnExpandable(): boolean {
    return this.editLayoutService.isMarginalColumnExpandable();
  }

  get getGpFlexValue(): String {
    return this.editLayoutService.marginalColumnVisible() ? "70%" : '100%'
  }
}
