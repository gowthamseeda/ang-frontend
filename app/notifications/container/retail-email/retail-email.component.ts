import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FeatureToggleService } from 'app/shared/directives/feature-toggle/feature-toggle.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { UserService } from '../../../iam/user/user.service';
import {
  CompanyRelation,
  companyRelationMap
} from '../../../legal-structure/shared/models/company-relation.model';
import { ProductGroupService } from '../../../services/product-group/product-group.service';
import { ApiError } from '../../../shared/services/api/api.service';
import { ObjectStatus } from '../../../shared/services/api/objectstatus.model';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { Language } from '../../../tpro/language/language.model';
import { LanguageService } from '../../../tpro/language/language.service';
import { EmailSettingService } from '../../services/email-setting.service';
import { EmailSetting, NotificationEmail } from '../../models/notifications.model';

@Component({
  selector: 'gp-retail-email',
  templateUrl: './retail-email.component.html',
  styleUrls: ['./retail-email.component.scss']
})
export class RetailEmailComponent implements OnInit {
  languages: Observable<Language[]>;
  emailSetting: EmailSetting = { countryId: '' };
  focusGroupType: Array<string> = ['MBAG', 'DTAG'];
  focusFeatureToggleFlag: Observable<Boolean>;
  focusEnabled = false;

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    countryId: new UntypedFormControl('', Validators.required),
    mailFrom: new UntypedFormControl('', Validators.email),
    mbagMailFrom: new UntypedFormControl('', Validators.email),
    dtagMailFrom: new UntypedFormControl('', Validators.email),
    npmMail: new UntypedFormControl('', Validators.email),
    mbagNpmMail: new UntypedFormControl('', Validators.email),
    dtagNpmMail: new UntypedFormControl('', Validators.email),
    countryDefaultLanguage: new UntypedFormControl('')
  });

  showMBAG = false;
  showDTAG = false;

  constructor(
    private userService: UserService,
    private languageService: LanguageService,
    private emailSettingService: EmailSettingService,
    private snackBarService: SnackBarService,
    private featureToggleService: FeatureToggleService,
    private productGroupService: ProductGroupService
  ) {}

  ngOnInit(): void {
    this.languages = this.languageService.getAll();
    this.getFocusFeatureToggle();
    this.setShowMBAGOrDTAG();

    this.userService
      .getCountryRestrictions()
      .pipe(
        tap(countryRestrictions => {
          const countryId = countryRestrictions.sort()[0];
          if (countryId) {
            this.getEmailSetting(countryId);
          }
        })
      )
      .subscribe();
  }

  getEmailSetting(countryId: string): void {
    this.emailSettingService
      .get(countryId)
      .pipe(
        tap(emailSetting => {
          this.emailSetting = emailSetting;
          this.formGroup.reset(this.createFormGroupValue(this.emailSetting));
        }),
        catchError((error: ApiError) => {
          this.emailSetting = { countryId };
          this.formGroup.reset({ countryId });
          if (error.state !== 404) {
            this.snackBarService.showError(error);
          }
          return of(null);
        })
      )
      .subscribe();
  }

  createFormGroupValue(emailSetting: EmailSetting): object {
    const newEmailSetting = {
      countryId: emailSetting.countryId,
      mailFrom: emailSetting.mailFrom,
      mbagMailFrom: this.getEmailAddressByFocusGroupType(
        CompanyRelation.MBAG,
        emailSetting.mailFroms
      ),
      dtagMailFrom: this.getEmailAddressByFocusGroupType(
        CompanyRelation.DTAG,
        emailSetting.mailFroms
      ),
      npmMail: emailSetting.npmMail,
      mbagNpmMail: this.getEmailAddressByFocusGroupType(
        CompanyRelation.MBAG,
        emailSetting.npmMails
      ),
      dtagNpmMail: this.getEmailAddressByFocusGroupType(
        CompanyRelation.DTAG,
        emailSetting.npmMails
      ),
      countryDefaultLanguage: emailSetting.countryDefaultLanguage
    };

    return newEmailSetting;
  }

  cancelButtonClicked(): void {
    this.formGroup.reset(this.createFormGroupValue(this.emailSetting));
  }

  saveButtonClicked(): void {
    const formValue = this.formGroup.value;

    const emailSetting: EmailSetting = {
      countryId: formValue.countryId,
      mailFrom: formValue.mailFrom,
      mailFroms: this.getEmailBy(formValue.mbagMailFrom, formValue.dtagMailFrom),
      npmMail: formValue.npmMail,
      npmMails: this.getEmailBy(formValue.mbagNpmMail, formValue.dtagNpmMail),
      countryDefaultLanguage: formValue.countryDefaultLanguage
    };

    for (const prop in emailSetting) {
      if (
        !emailSetting[prop] ||
        (emailSetting[prop] instanceof Array && emailSetting[prop].length === 0)
      ) {
        delete emailSetting[prop];
      }
    }

    if (Object.keys(emailSetting).length === 1 && 'countryId' in emailSetting) {
      this.handleUpdateEmailSetting(
        this.emailSettingService.delete(emailSetting.countryId),
        emailSetting
      );
    } else {
      this.handleUpdateEmailSetting(this.emailSettingService.update(emailSetting), emailSetting);
    }
  }

  handleUpdateEmailSetting(observable: Observable<ObjectStatus>, emailSetting: EmailSetting): void {
    observable
      .pipe(
        tap(() => {
          this.emailSetting = emailSetting;
          this.formGroup.reset(this.createFormGroupValue(this.emailSetting));
          this.snackBarService.showInfo('4RETAIL_EMAIL_UPDATE_SUCCESS');
        }),
        catchError(error => {
          this.snackBarService.showError(error);
          return of(null);
        })
      )
      .subscribe();
  }

  private getEmailAddressByFocusGroupType(
    focusGroupType: string,
    emails?: NotificationEmail[]
  ): string | undefined {
    return emails?.find(email => email.focusGroupType === focusGroupType)?.emailAddress;
  }

  private getEmailBy(mbagMail?: string, dtagMail?: string): NotificationEmail[] | undefined {
    const emails: NotificationEmail[] = [];

    if (mbagMail) {
      emails.push({
        emailAddress: mbagMail,
        focusGroupType: CompanyRelation.MBAG
      });
    }

    if (dtagMail) {
      emails.push({
        emailAddress: dtagMail,
        focusGroupType: CompanyRelation.DTAG
      });
    }

    return emails.length !== 0 ? emails : undefined;
  }

  private getFocusFeatureToggle(): void {
    this.focusFeatureToggleFlag = this.featureToggleService.isFocusFeatureEnabled().pipe(
      map((focusEnabled: boolean) => {
        this.focusEnabled = focusEnabled;
        return focusEnabled;
      })
    );
  }

  private setShowMBAGOrDTAG(): void {
    this.focusFeatureToggleFlag.subscribe(focusEnabled => {
      const isFocusEnabled = focusEnabled.valueOf();
      if (isFocusEnabled) {
        this.productGroupService
          .getAllForUserDataRestrictions(isFocusEnabled)
          .subscribe(userProductGroupRestrictions => {
            this.showMBAG = companyRelationMap[CompanyRelation.MBAG].some((pg1: string) =>
              userProductGroupRestrictions.map(pg2 => pg2.id).includes(pg1)
            );
            this.showDTAG = companyRelationMap[CompanyRelation.DTAG].some((pg1: string) =>
              userProductGroupRestrictions.map(pg2 => pg2.id).includes(pg1)
            );
          });
      }
    });
  }
}
