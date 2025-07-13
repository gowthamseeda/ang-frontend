import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { isMoment } from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { LocaleService } from '../../../../shared/services/locale/locale.service';
import { UserSettings } from '../../../../user-settings/user-settings/model/user-settings.model';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { CloseDownReason } from '../../../close-down-reasons/close-down-reason.model';
import { CloseDownReasonsService } from '../../../close-down-reasons/close-down-reasons.service';
import { MessageService } from '../../services/message.service';
import { OutletService } from '../../services/outlet.service';

@Component({
  selector: 'gp-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit, OnDestroy {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  registeredOffice: boolean;
  @Input()
  companyId: string;
  @Input()
  closeDownReason: CloseDownReason | null;
  @Input()
  startOperationDate: string;
  @Input()
  closeDownDate: string;
  @Input()
  outletId: string;
  @Input()
  readonly = false;

  @Output()
  affectedBusinessSites: EventEmitter<AffectedBusinessSites> = new EventEmitter<AffectedBusinessSites>();

  closeDownReasons: CloseDownReason[];
  userSettings: Observable<UserSettings> = this.userSettingsService.get();
  closeDownReasonAllowed = false;
  datesChanged = false;

  messages: Observable<{ [key: string]: any } | void> = this.messageService.get();

  private unsubscribe = new Subject<void>();

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private closeDownReasonsService: CloseDownReasonsService,
    private localeService: LocaleService,
    private messageService: MessageService,
    private outletService: OutletService,
    private userAuthorizationService: UserAuthorizationService,
    private userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.setDatePickerFormat();
    this.initStatusFormControl();
    this.evaluateUserPermission();
    this.initCloseDownReasons();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  showCloseDownReason(): boolean {
    return this.parentForm && this.parentForm.value.closeDownDate && this.closeDownReasonAllowed;
  }

  duplicatesExists(event: any): void {
    this.parentForm.disable();
  }

  private setDatePickerFormat(): void {
    this.localeService
      .currentBrowserLocale()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(locale => {
        this.dateAdapter.setLocale(locale);
      });
  }

  private closeDownReasonIsNotCompanyClosed(): boolean {
    return !(this.closeDownReason && this.closeDownReason.id === 1);
  }

  private initStatusFormControl(): void {
    const startOperationDateControl = new UntypedFormControl({
      value: this.startOperationDate,
      disabled: this.parentForm.disabled
    });
    const closeDownDateControl = new UntypedFormControl({
      value: this.closeDownDate,
      disabled: this.parentForm.disabled
    });

    this.parentForm.addControl('startOperationDate', startOperationDateControl);
    this.parentForm.addControl('closeDownDate', closeDownDateControl);
    this.parentForm.addControl(
      'closeDownReasonId',
      new UntypedFormControl({
        value: '',
        disabled: this.parentForm.disabled
      })
    );

    startOperationDateControl.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value: any) => {
        this.datesChanged = true;

        if (this.registeredOffice && isMoment(value)) {
          const newDate = value.format('YYYY-MM-DD');
          this.handlePossibleAffectedBusinessSites(newDate);
        }
      });

    closeDownDateControl.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.datesChanged = true;
    });
  }

  private evaluateUserPermission(): void {
    this.userAuthorizationService.isAuthorizedFor
      .permissions(['legalstructure.businesssite.closedownreason.update'])
      .verify()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((hasPermission: boolean) => (this.closeDownReasonAllowed = hasPermission));
  }

  private initCloseDownReasons(): void {
    let retrievedCloseDownReasons: Observable<CloseDownReason[]>;
    if (this.registeredOffice) {
      retrievedCloseDownReasons = this.closeDownReasonsService.getAllValidForCompany();
    } else {
      retrievedCloseDownReasons = this.closeDownReasonsService.getAllValidForBusinessSite();
    }
    retrievedCloseDownReasons
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((closeDownReasons: CloseDownReason[]) => {
        this.closeDownReasons = closeDownReasons;
        if (this.closeDownReasonIsNotCompanyClosed()) {
          this.closeDownReasons = this.closeDownReasons.filter(cdr => cdr.id !== 1);
        }
        const closeDownReasonIdFormControl = this.parentForm.get('closeDownReasonId');
        if (this.closeDownReason && closeDownReasonIdFormControl) {
          closeDownReasonIdFormControl.setValue(this.closeDownReason.id);
        }
      });
  }

  private handlePossibleAffectedBusinessSites(newStartOperationDate: string): void {
    this.messageService.add('startOperationDateChanged', false);
    this.messageService.add('startOperationDateChangeRejected', false);

    this.outletService
      .getAffectedBusinessSiteIds(this.companyId, newStartOperationDate)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response: AffectedBusinessSites) => {
        if (
          response.businessSitesRequestStartOperationDateChange &&
          response.businessSitesRequestStartOperationDateChange.length > 0 &&
          this.startOperationDate !== newStartOperationDate
        ) {
          this.messageService.add('startOperationDateChanged', true);
        }

        if (
          response.businessSitesPreventCompanyToChangeStartOperationDate &&
          response.businessSitesPreventCompanyToChangeStartOperationDate.length > 0 &&
          this.startOperationDate !== newStartOperationDate
        ) {
          this.messageService.add('startOperationDateChangeRejected', true);
        }

        this.affectedBusinessSites.emit(response);
      });
  }
}

export interface AffectedBusinessSites {
  businessSitesRequestStartOperationDateChange: string[];
  businessSitesPreventCompanyToChangeStartOperationDate: string[];
}
