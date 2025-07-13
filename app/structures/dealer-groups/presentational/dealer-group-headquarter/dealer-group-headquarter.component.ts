import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import {
  DealerGroupHeadquarter,
  DealerGroupHeadquarterAdded
} from '../../../models/dealer-group.model';
import { StructuresCountry } from '../../../shared/models/shared.model';
import { DealerGroupHeadquarterSelectionComponent } from '../dealer-group-headquarter-selection/dealer-group-headquarter-selection.component';

@Component({
  selector: 'gp-dealer-group-headquarter',
  templateUrl: './dealer-group-headquarter.component.html',
  styleUrls: ['./dealer-group-headquarter.component.scss']
})
export class DealerGroupHeadquarterComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  headquarter: DealerGroupHeadquarter;
  @Input()
  country: StructuresCountry;
  @Input()
  disabled = false;
  @Input() readOnly: boolean;
  @Output()
  headquarterAddedOrUpdated: EventEmitter<DealerGroupHeadquarterAdded> = new EventEmitter<DealerGroupHeadquarterAdded>();
  @Output()
  headquarterRemoved: EventEmitter<string> = new EventEmitter<string>();

  distributionLevelChips: string[] = [];

  private unsubscribe = new Subject<void>();

  constructor(
    public matDialog: MatDialog,
    private distributionLevelsService: DistributionLevelsService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getDistributionLevelForHeadquarter();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  removeHeadquarter(): void {
    this.headquarterRemoved.emit();
  }

  openSelectDealerGroupHeadquarterList(): void {
    const dialog = this.matDialog.open(DealerGroupHeadquarterSelectionComponent, {
      width: '650px',
      height: '650px',
      data: {
        excludedHeadquarterId: this.headquarter?.id
      }
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((headquarter: DealerGroupHeadquarterAdded | false) => {
        if (headquarter) {
          this.headquarterAddedOrUpdated.emit(headquarter);
        }
      });
  }

  private getDistributionLevelForHeadquarter(): void {
    if (this.headquarter) {
      this.distributionLevelsService
        .get(this.headquarter.id)
        .pipe(
          tap(distributionLevels => {
            this.distributionLevelChips = [];
            distributionLevels.forEach(distributionLevel => {
              this.distributionLevelChips.push(distributionLevel);
            });
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe();
    }
  }
}
