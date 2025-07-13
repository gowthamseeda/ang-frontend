import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { TranslateOutputType } from '../../../../shared/pipes/translate-data/translate-output-type.model';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { ServiceTableRow } from '../../models/service-table-row.model';

@Component({
  selector: 'gp-service-table-name-cell',
  templateUrl: './service-table-name-cell.component.html',
  styleUrls: ['./service-table-name-cell.component.scss']
})
export class ServiceTableNameCellComponent implements OnInit, OnDestroy {
  @Input() serviceTableRow: ServiceTableRow;

  currentSelectedLanguage?: string;
  userHasPermissions: Observable<boolean>;
  translateType = TranslateOutputType;

  private unsubscribe = new Subject<void>();

  constructor(
    private distributionLevelsService: DistributionLevelsService,
    private userAuthorizationService: UserAuthorizationService,
    private userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.userHasPermissions = this.evaluateUserPermission();

    this.userSettingsService
      .getLanguageId()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(languageId => (this.currentSelectedLanguage = languageId));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private evaluateUserPermission(): Observable<boolean> {
    return this.distributionLevelsService.getDistributionLevelsOfOutlet().pipe(
      mergeMap(distributionLevels => {
        return this.userAuthorizationService.isAuthorizedFor
          .permissions(['services.offeredservice.update'])
          .distributionLevels(distributionLevels)
          .verify();
      })
    );
  }

  get TranslateOutputType() {
    return TranslateOutputType;
  }
}
