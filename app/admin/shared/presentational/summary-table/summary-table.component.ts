import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { Outlet } from '../../../../legal-structure/shared/models/outlet.model';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';
import { FEATURE_NAMES } from '../../../../shared/model/constants';
import { AdminType, ConstraintType } from '../../models/outlet.model';
import { SummaryTable } from '../../models/summary-table.model';
import { Precondition } from '../../service/api/admin-response.model';

@Component({
  selector: 'gp-summary-table',
  templateUrl: './summary-table.component.html',
  styleUrls: ['./summary-table.component.scss']
})
export class SummaryTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() preconditions: Precondition[];
  @Input() isLoading: boolean;
  @Input() adminType: AdminType;

  displayedColumns: string[] = ['status', 'description', 'details'];
  tableData: SummaryTable[];
  constraintTypeOther: ConstraintType = ConstraintType.OTHER;
  defaultConstraintTypes: ConstraintType[];
  unsubscribe = new Subject<void>();

  constructor(
    private outletService: OutletService,
    private translateService: TranslateService,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.defaultConstraintTypes = this.initDefaultConstraintTypes(this.adminType);
    this.createTableDataForPreconditions(this.preconditions);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  createTableDataForPreconditions(preconditions: Precondition[]): void {
    preconditions = preconditions ?? [];
    const summaryWithDefault = this.defaultConstraintTypes.map((type: ConstraintType) => {
      return this.mapDefaultStatusToTableItem(type);
    });

    const summaryWithPreconditions = preconditions.map((precondition: Precondition) => {
      return this.mapPreconditionToTableItem(precondition);
    });

    summaryWithDefault.map((defaultData: SummaryTable) => {
      summaryWithPreconditions.find((precondition: SummaryTable) => {
        if (defaultData.type === precondition.type) {
          defaultData.ids = precondition.ids;
          defaultData.isPassed = precondition.isPassed;
          defaultData.messages = precondition.messages;
          defaultData.translatedType = precondition.translatedType;
        }
      });
    });

    this.tableData = summaryWithDefault;
  }

  mapDefaultStatusToTableItem(type: ConstraintType): SummaryTable {
    return {
      type: type,
      translatedType: this.translateDescription(type),
      isPassed: true
    };
  }

  mapPreconditionToTableItem(precondition: Precondition): SummaryTable {
    return {
      type: precondition.type,
      translatedType: this.translateDescription(precondition.type),
      ids: precondition.ids,
      messages: precondition.messages,
      isPassed: false
    };
  }

  initDefaultConstraintTypes(adminType: AdminType): ConstraintType[] {
    switch (adminType) {
      case AdminType.moveOutlet:
        return [
          ConstraintType.COMPANYINACTIVE,
          ConstraintType.BUSINESSSITEINACTIVE,
          ConstraintType.MOVEREGISTEREDOFFICE,
          ConstraintType.OUTLETSTRUCTURE,
          ConstraintType.CONTRACTEE,
          ConstraintType.TASK,
          ConstraintType.OTHER
        ];
      case AdminType.switchRegisteredOffice:
        return [
          ConstraintType.BUSINESSSITEINACTIVE,
          ConstraintType.CONTRACTEE,
          ConstraintType.DEALERGROUP,
          ConstraintType.MARKETAREA,
          ConstraintType.REGIONALCENTER,
          ConstraintType.TASK,
          ConstraintType.OTHER
        ];
      default:
        return [];
    }
  }

  goTo(type: ConstraintType, id: string): void {
    switch (type) {
      case ConstraintType.TASK:
        this.navigateToLocation(`tasks/${id}`);
        break;
      case ConstraintType.DEALERGROUP:
        this.navigateToLocation(`structures/dealer-groups/${id}/edit`);
        break;
      case ConstraintType.REGIONALCENTER:
        this.navigateToLocation('structures/regional-center');
        break;
      case ConstraintType.MARKETAREA:
        this.navigateToLocation('structures/market-area');
        break;
      case ConstraintType.CONTRACTEE:
        this.contractPartnerToggle().subscribe(isEnabled => {
          if (isEnabled) {
            this.navigateToLocation(`outlet/${id}`);
          } else {
            this.navigateToRegisteredOffice(id);
          }
        });
        break;
      case ConstraintType.COMPANYINACTIVE:
        this.navigateToRegisteredOffice(id);
        break;
      case ConstraintType.BUSINESSSITEINACTIVE:
      case ConstraintType.MOVEREGISTEREDOFFICE:
      case ConstraintType.OUTLETSTRUCTURE:
        this.navigateToLocation(`outlet/${id}`);
        break;
    }
  }

  translateDescription(type: ConstraintType): string {
    switch (this.adminType) {
      case AdminType.moveOutlet:
        return this.translateForMoveOutlet(type);
      case AdminType.switchRegisteredOffice:
        return this.translateForSwitchRegisteredOffice(type);
      default:
        return '';
    }
  }

  translateForMoveOutlet(type: ConstraintType): string {
    return type === this.constraintTypeOther
      ? this.translateService.instant('OTHERS')
      : this.translateService.instant(`ADMIN_MOVE_OUTLET_PRECONDITION_${type}`);
  }

  translateForSwitchRegisteredOffice(type: ConstraintType): string {
    return type === this.constraintTypeOther
      ? this.translateService.instant('OTHERS')
      : this.translateService.instant(`ADMIN_SWITCH_RO_PRECONDITION_${type}`);
  }

  navigateToLocation(link: string): void {
    const origin = window.location.origin;
    const baseUrl = environment.settings.baseUrl || '/';
    window.open(`${origin}${baseUrl}app/${link}`, '_blank');
  }

  getRegisteredOfficeId(companyId: string): Observable<string> {
    return this.outletService.getCompany(companyId).pipe(
      map((outlet: Outlet) => {
        return outlet.registeredOfficeId ?? '';
      }),
      takeUntil(this.unsubscribe)
    );
  }

  navigateToRegisteredOffice(id: string): void {
    this.getRegisteredOfficeId(id).subscribe(outletId => {
      this.navigateToLocation(`outlet/${outletId}`);
    });
  }

  private contractPartnerToggle(): Observable<boolean> {
    return this.featureToggleService.isFeatureEnabled(FEATURE_NAMES.CONTRACT_PARTNER);
  }
}
