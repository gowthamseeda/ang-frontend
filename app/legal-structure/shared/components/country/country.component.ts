import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Country } from '../../../../geography/country/country.model';
import { CountryService } from '../../../../geography/country/country.service';
import { TranslateDataPipe } from '../../../../shared/pipes/translate-data/translate-data.pipe';
import { DataNotificationChangeFields } from "../../../../notifications/models/notifications.model";

@Component({
  selector: 'gp-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  providers: [TranslateDataPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  countryId: string;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields()
  isDataChanged = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private countryService: CountryService,
    private translateService: TranslateService,
    private translateDataPipe: TranslateDataPipe
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.initCountryFormControl();
    this.initCountryName();
    this.checkDataChanged()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkDataChanged();
  }

  private initCountryFormControl(): void {
    this.parentForm.addControl(
      'countryId',
      new UntypedFormControl({ value: this.countryId, disabled: true })
    );
    this.parentForm.addControl(
      'countryName',
      new UntypedFormControl({ value: '', disabled: this.parentForm.disabled })
    );
  }

  private initCountryName(): void {
    this.countryService
      .get(this.countryId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((country: Country) => {
        const translatedCountryName = this.transformCountryName(
          country,
          this.translateService.currentLang
        );
        this.parentForm.controls['countryName'].setValue(translatedCountryName);
      });
  }

  private transformCountryName(country: Country, language: string): string {
    return this.translateDataPipe.transform(country, language, true);
  }

  checkDataChanged() {
    this.isDataChanged = this.dataNotificationChangeFields.directChange.includes('COUNTRY')
  }
}
