import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { OfferedService } from '../../../offered-service/offered-service.model';
import { ServiceVariant } from '../../../service-variant/service-variant.model';
import {
  MultiEditOfferedServiceStatus,
  getMultiEditOfferedServiceProcessState,
  MultiEditOfferedServiceProcessState,
  getMultiEditOfferedServiceCurrentProcessState
} from '../../../shared/util/multi-edit-offered-service-process-state';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';

@Component({
  selector: 'gp-copy-service-cell-toggle',
  templateUrl: './copy-service-cell-toggle.component.html',
  styleUrls: ['./copy-service-cell-toggle.component.scss']
})
export class CopyServiceCellToggleComponent implements OnChanges, OnDestroy {
  @Input() isAssignable: boolean;
  @Input() userHasPermissions: boolean;
  @Input() serviceVariant: ServiceVariant;
  @Input() offeredService: OfferedService | undefined;

  Status = MultiEditOfferedServiceStatus;
  processState?: MultiEditOfferedServiceProcessState;
  cellHovered: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private unsubscribe = new Subject<void>();

  private processStates = {
    [MultiEditOfferedServiceStatus.NOT_OFFERED]: {
      ...getMultiEditOfferedServiceProcessState(MultiEditOfferedServiceStatus.NOT_OFFERED)
    },
    [MultiEditOfferedServiceStatus.OFFERED]: {
      ...getMultiEditOfferedServiceProcessState(MultiEditOfferedServiceStatus.OFFERED)
    },
    [MultiEditOfferedServiceStatus.APPLICANT]: {
      ...getMultiEditOfferedServiceProcessState(MultiEditOfferedServiceStatus.APPLICANT)
    },
    [MultiEditOfferedServiceStatus.OFFERED_AND_VALID]: {
      ...getMultiEditOfferedServiceProcessState(MultiEditOfferedServiceStatus.OFFERED_AND_VALID)
    }
  };

  constructor(public multiSelectDataService: MultiSelectDataService) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.cellHovered.next(false);
    this.unsubscribe.complete();
    this.cellHovered.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['serviceVariant'] || changes['offeredService'] || changes['isAssignable']) {
      this.processState = this.getProcessState();
    }
  }

  private getProcessState(): MultiEditOfferedServiceProcessState | undefined {
    const isActive = this.serviceVariant?.active || false;
    const currentProcessState = getMultiEditOfferedServiceCurrentProcessState(
      this.offeredService,
      this.isAssignable,
      isActive
    );

    if (currentProcessState) {
      return this.processStates[currentProcessState.status];
    }

    return currentProcessState;
  }

  setcellHovered(show: boolean): void {
    this.cellHovered.next(show);
  }
}
