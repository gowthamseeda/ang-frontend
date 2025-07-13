import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import { ServiceVariant } from '../../../service-variant/service-variant.model';
import {
  getCurrentProcessState,
  getProcessState,
  ProcessState,
  Status
} from '../../../shared/util/offered-service-process-state';
import { OfferedService } from '../../../offered-service/offered-service.model';

@Component({
  selector: 'gp-service-cell-toggle',
  templateUrl: './service-cell-toggle.component.html',
  styleUrls: ['./service-cell-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCellToggleComponent implements OnChanges {
  @Input() isAssignable: boolean;
  @Input() userHasPermissions: boolean;
  @Input() serviceVariant: ServiceVariant;
  @Input() offeredService: OfferedService | undefined;
  @Input() showAddIcon = false;
  @Output() add = new EventEmitter<OfferedService>();
  @Output() remove = new EventEmitter();

  Status = Status;
  processState?: ProcessState;

  private processStates = {
    [Status.NOT_OFFERED]: {
      ...getProcessState(Status.NOT_OFFERED),
      action: () => this.addService()
    },
    [Status.OFFERED]: {
      ...getProcessState(Status.OFFERED),
      action: () => this.removeService()
    },
    [Status.APPLICANT]: {
      ...getProcessState(Status.APPLICANT),
      action: () => this.removeService()
    },
    [Status.OFFERED_AND_VALID]: {
      ...getProcessState(Status.OFFERED_AND_VALID),
      action: () => this.removeService()
    }
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['serviceVariant']) {
      this.processState = this.getProcessState();
    }
    if (changes['offeredService']) {
      this.processState = this.getProcessState();
    }
    if (changes['isAssignable']) {
      this.processState = this.getProcessState();
    }
  }

  addService(): void {
    this.add.emit(this.offeredService);
  }

  removeService(): void {
    this.remove.emit();
  }

  getServiceIcon(): string | undefined {
    return this.processState?.icon === 'os-planned'
      ? this.processState?.icon.concat(
          '-pg-',
          this.serviceVariant?.productGroupId?.toLowerCase() ?? ''
        )
      : this.processState?.icon;
  }

  private getProcessState(): ProcessState | undefined {
    const isActive = this.serviceVariant?.active || false;
    const currentProcessState = getCurrentProcessState(
      this.offeredService,
      this.isAssignable,
      isActive
    );

    if (currentProcessState) {
      return this.processStates[currentProcessState.status];
    }

    return currentProcessState;
  }
}
