import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { isMoment } from 'moment';
import { Observable, Subject } from 'rxjs';
import { filter, finalize, takeUntil } from 'rxjs/operators';

import { CanDeactivateComponent } from '../../../shared/guards/can-deactivate-guard.model';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { LocationService } from '../../location/services/location-service.model';
import { AddressType } from '../../shared/models/address.model';
import { MessageService } from '../../shared/services/message.service';
import { Company } from '../company.model';
import { CompanyService } from '../company.service';
import { UserService } from '../../../iam/user/user.service';

@Component({
  selector: 'gp-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent implements OnInit, OnDestroy, AfterViewChecked, CanDeactivateComponent {
  createCompanyForm: UntypedFormGroup;
  additionalAddress = AddressType.Additional;
  isLoading = false;
  testOutlet: Boolean = false;

  productResponsible: Boolean = false;
  private unsubscribe = new Subject<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private snackBarService: SnackBarService,
    private messageService: MessageService,
    private locationService: LocationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initCompanyForm();
    this.subscribeToRegionChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.createCompanyForm.pristine;
  }

  scrollToFragment(fragment: string): void {
    const element = document.getElementById(fragment);
    if (fragment && element) {
      element.scrollIntoView();
    }
  }

  submitCompany(): void {
    this.formatDate('startOperationDate');
    this.formatDate('closeDownDate');
    this.createCompany();
  }

  reset(): void {
    this.createCompanyForm.reset();
  }

  private createCompany(): void {
    this.isLoading = true;
    this.createCompanyForm.markAsPristine();

    const company: Company = this.createCompanyForm.value;
    const distributionLevels = this.createCompanyForm.value.distributionLevels;

    this.companyService
      .createWithDistributionLevels(company, distributionLevels)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        (id: string) => {
          this.router.navigateByUrl('/outlet/' + id);
          this.snackBarService.showInfo('CREATE_COMPANY_SUCCESS');
        },
        error => {
          const createdRegisteredOfficeId = error.createdRegisteredOfficeId;
          if (createdRegisteredOfficeId) {
            this.router.navigateByUrl('/outlet/' + createdRegisteredOfficeId);
          }
          this.snackBarService.showError(error);
        }
      );
  }

  private formatDate(dateKey: string): void {
    if (
      this.createCompanyForm.value &&
      this.createCompanyForm.value[dateKey] &&
      isMoment(this.createCompanyForm.value[dateKey])
    ) {
      this.createCompanyForm.value[dateKey] =
        this.createCompanyForm.value[dateKey].format('YYYY-MM-DD');
    }
  }

  private initCompanyForm(): void {
    this.createCompanyForm = this.formBuilder.group({});
    this.checkTestOutletUser();
  }

  checkTestOutletUser(): void {
    this.userService.getRoles().subscribe(Roles => {
      if (Roles.includes('GSSNPLUS.TestOutletUser')) {
        this.testOutlet = true;
      } else if (Roles.includes('GSSNPLUS.ProductResponsible')) {
        this.productResponsible = true;
      }
    });
  }

  private subscribeToRegionChanges(): void {
    this.locationService
      .selectRegion()
      .pipe(
        filter(region => region !== undefined),
        takeUntil(this.unsubscribe)
      )
      .subscribe(region => {
        if (this.changed(this.createCompanyForm.value.state, region?.state)) {
          this.createCompanyForm.patchValue({
            state: region?.state
          });
          this.messageService.add('stateUpdated', true);
        }
        if (this.changed(this.createCompanyForm.value.province, region?.province)) {
          this.createCompanyForm.patchValue({
            province: region?.province
          });
          this.messageService.add('provinceUpdated', true);
        }
      });
  }

  private changed(first: any, second: any): boolean {
    if (!first && !second) {
      return false;
    }
    if (first && !second) {
      return true;
    }
    if (!first && second) {
      return true;
    }
    return first.trim() !== second.trim();
  }
}
