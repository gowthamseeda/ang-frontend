import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { isMoment } from 'moment';
import { combineLatest, concat, forkJoin, merge, Observable, of, Subject } from 'rxjs';
import { filter, finalize, map, mergeMap, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { CountryService } from '../../../geography/country/country.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { UserService } from '../../../iam/user/user.service';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { CanDeactivateComponent } from '../../../shared/guards/can-deactivate-guard.model';
import { OUTLET_AGGREGATES } from '../../../shared/model/constants';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { patchValue } from '../../../shared/util/objects';
import { AddressValidators } from '../../../shared/validators/address-validators';
import { countryStructureFormAttributeName } from '../../../structures/country-structure-description/presentational/country-structure/country-structure.component';
import { CountryStructureService } from '../../../structures/country-structure/service/country-structure.service';
import { TaskWebSocketService } from '../../../tasks/service/task-websocket.service';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import { AggregateDataField, DataCluster, Task, TaskData, TaskFooterEvent, Type } from '../../../tasks/task.model';
import { MTR_ROLE, PR_ROLE, RETAILER_ROLE, TOU_ROLE } from '../../../tasks/tasks.constants';
import { BusinessNameTableComponent } from '../../../traits/business-names/business-name-table/business-name-table.component';
import { BusinessNameTableService } from '../../../traits/business-names/business-name-table/business-name-table.service';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { BusinessSiteActionService } from '../../businessSite/services/business-site-action.service';
import { LegalStructureRoutingService } from '../../legal-structure-routing.service';
import { baseDataAggregateFields, baseDataDataClusters } from '../../legal-structure.constants';
import { PredecessorService } from '../../predecessor/predecessor/predecessor.service';
import {
  ActiveLanguage,
  ActiveLanguageService
} from '../../shared/components/language-toggle/active-language.service';
import { Outlet, OutletTranslation } from '../../shared/models/outlet.model';
import { MessageService } from '../../shared/services/message.service';
import { OutletService } from '../../shared/services/outlet.service';
import { TasksService } from '../../shared/services/tasks.service';

@Component({
  selector: 'gp-edit-outlet-view',
  templateUrl: './edit-outlet.component.html',
  styleUrls: ['./edit-outlet.component.scss']
})
export class EditOutletComponent
  implements OnInit, OnDestroy, AfterViewInit, CanDeactivateComponent {
  readonly outletAggregates: string[] = OUTLET_AGGREGATES;

  outlet: Outlet;
  outletForm: UntypedFormGroup;
  outletId: string;
  outletLoaded = false;
  countryLanguages: string[];
  activeTranslation: ActiveLanguage;
  countryId: string;
  fragment: string;
  @ViewChild(BusinessNameTableComponent) businessNameTableComponent: BusinessNameTableComponent;
  saveButtonDisabled = true;
  cancelButtonDisabled = true;
  outletOrBusinessNameOrDistributionLevelChanged: Observable<boolean>;
  readonly = false;
  isTaskPresent: boolean;
  isVerificationTaskPresent: boolean;
  taskType: Type = Type.DATA_CHANGE;
  hasPredecessorPermissions = false;
  isPredecessorChanged = false;
  isLoading = false;
  showDataChangeMessage = false;
  isRetailOutlet: boolean = false;
  isTestOutlet: boolean = false;
  dataChangeViewClicked = new EventEmitter<void>();
  openDataChangeTask: Task[] = [];
  aggregateDataFields: AggregateDataField[] = [];
  isMarketResponsible: boolean = false;
  isBusinessSiteResponsible: boolean = false;
  isProductResponsible: Boolean = false;
  isForRetailEnabled: boolean;

  private unsubscribe = new Subject<void>();
  private loadBusinessSite = new Subject<string>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private legalStructureRoutingService: LegalStructureRoutingService,
    private outletService: OutletService,
    private distributionLevelsService: DistributionLevelsService,
    private snackBarService: SnackBarService,
    private countryService: CountryService,
    private activeLanguageService: ActiveLanguageService,
    private userAuthorizationService: UserAuthorizationService,
    private businessNameTableService: BusinessNameTableService,
    private businessSiteActionService: BusinessSiteActionService,
    private businessSiteTaskService: BusinessSiteTaskService,
    private predecessorService: PredecessorService,
    private countryStructureService: CountryStructureService,
    private messageService: MessageService,
    private userService: UserService,
    private tasksService: TasksService,
    private taskWebSocketService: TaskWebSocketService,
    private featureToggleService: FeatureToggleService
  ) { }

  ngOnInit(): void {
    this.retrieveUserRole();
    this.subscribeToOutletChanges();
    this.subscribeToRouteFragmentChanges();
    this.subscribeToActiveTranslationChanges();
    this.subscribeToOutletAndBusinessNameChanges();
    this.subscribeTasksChanges();

    this.featureToggleService.isFeatureEnabled('FOR_RETAIL').subscribe(forRetailEnabled => {
      this.isForRetailEnabled = forRetailEnabled;
    });
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.scrollToFragment(this.fragment);
    }, 750);
  }

  canDeactivate(): Observable<boolean> | boolean {
    const isBusinessFormPristine =
      this.businessNameTableComponent === undefined
        ? true
        : this.businessNameTableComponent.businessNamesForm.pristine;

    const isOutletFormPristine = this.outletForm === undefined ? true : this.outletForm.pristine;

    return isOutletFormPristine && isBusinessFormPristine;
  }

  isBusinessNameTableEmpty(): Observable<boolean> | boolean {
    return this.businessNameTableComponent === undefined
      ? true
      : this.businessNameTableComponent.dataSource.filteredData.length === 0;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.tasksService.resetDataChangeTasks();
  }

  scrollToFragment(fragment: string): void {
    setTimeout(() => {
      const element = document.getElementById(fragment);
      if (fragment && element) {
        element.scrollIntoView();
      }
    }, 250);
  }

  submitOutlet(): void {
    this.formatDate('startOperationDate');
    this.formatDate('closeDownDate');
    this.submit();
  }

  requestOutletApproval(payload?: TaskData): void {
    this.formatDate('startOperationDate');
    this.formatDate('closeDownDate');
    this.request(payload);
  }

  setButtonStatuses(): void {
    // Set timeout so that changes child components are propagated to the parent. The current status like dirty or pristine
    // is available only after one tick.
    setTimeout(() => {
      this.cancelButtonDisabled = !this.isDirty();
      this.saveButtonDisabled = this.isSaveButtonDisabled();
    });
  }

  saveButtonClicked(): void {
    this.cancelButtonDisabled = true;
    this.saveButtonDisabled = true;

    if (!this.isOutletFormInvalidOrPristine()) {
      this.submitOutlet();
    }
    if (!this.businessNameTableComponent.isInvalidOrPristine()) {
      this.businessNameTableComponent.save();
    }
  }

  confirmButtonClicked(event: TaskFooterEvent): void {
    if (!this.outletForm.invalid && !this.outletForm.disabled) {
      this.requestOutletApproval(event?.payload);
    }

    if (!this.businessNameTableComponent.isInvalid()) {
      this.businessNameTableComponent
        .confirmSave(event)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          () => { },
          error => {
            this.snackBarService.showError(error);
          },
          () => {
            this.isTaskPresent = true;
            if (!this.isForRetailEnabled) {
              this.disableForm();
            }
          }
        );
    }

    this.cancelButtonDisabled = true;
    this.saveButtonDisabled = true;
  }

  cancelButtonClicked(): void {
    this.cancelButtonDisabled = true;
    this.saveButtonDisabled = true;

    if (this.outletForm.dirty) {
      this.outletForm.markAsPristine();
      this.resetBaseDataFields();
    }
    if (this.businessNameTableComponent.isDirty()) {
      this.businessNameTableComponent.reset();
    }
    this.predecessorService.clearCache();
    this.predecessorService.fetchForOutlet(this.outlet.id);
  }

  updateDistributionLevels(): Observable<any> {
    let response = of('');

    this.distributionLevelsService
      .getDistributionLevelsOfOutlet()
      .pipe(take(1))
      .subscribe(distributionLevels => {
        const distributionLevelsFromForm = this.outletForm.value.distributionLevels as String[];
        if (distributionLevelsFromForm !== distributionLevels) {
          response = this.distributionLevelsService.update(
            this.outletId,
            this.outletForm.value.distributionLevels
          );
        }
      });

    return response;
  }

  private isDirty(): boolean {
    let businessNameTableIsDirty = false;
    if (this.businessNameTableComponent) {
      businessNameTableIsDirty = this.businessNameTableComponent.isDirty();
    }

    return this.outletForm.dirty || businessNameTableIsDirty;
  }

  private isOutletFormInvalidOrPristine(): boolean {
    return this.outletForm.invalid || this.outletForm.pristine || this.outletForm.disabled;
  }

  private isSaveButtonDisabled(): boolean {
    let businessNameTableIsInvalid = false;
    if (this.businessNameTableComponent) {
      businessNameTableIsInvalid = this.businessNameTableComponent.isInvalid();
    }

    let businessNameTableIsPristine = false;
    if (this.businessNameTableComponent) {
      businessNameTableIsPristine = this.businessNameTableComponent.businessNamesForm.pristine;
    }

    const isInvalid =
      this.outletForm.invalid || this.outletForm.disabled || businessNameTableIsInvalid;

    const isPristine = this.outletForm.pristine && businessNameTableIsPristine;

    if (this.isVerificationTaskPresent) {
      return isInvalid;
    }

    return isInvalid || isPristine;
  }

  private subscribeToOutletChanges(): void {
    this.loadBusinessSite
      .asObservable()
      .pipe(
        tap(outletId => {
          this.outletLoaded = false;
          this.outletId = outletId;
        }),
        switchMap(outletId => this.outletService.getOrLoadBusinessSite(outletId)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (outlet: Outlet) => {
          this.countryId = outlet.countryId;
          this.outletLoaded = true;
          this.isTaskPresent = false;
          this.outlet = outlet;

          this.initOutletForm();
          this.initBusinessSiteAuthorization(outlet.id);
          this.initCountryLanguages(outlet.countryId);
          this.initPredecessors();
          this.initOutletDistributionLevelInfo()
        },
        error => this.snackBarService.showError(error)
      );

    this.legalStructureRoutingService.outletIdChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(outletId => this.loadBusinessSite.next(outletId));
  }

  private initBusinessSiteAuthorization(outletId: string): void {
    let permission: string;
    permission = this.isTestOutlet
      ? 'legalstructure.testoutlet.update'
      : 'legalstructure.businesssite.update';
    const authorization = this.userAuthorizationService.isAuthorizedFor
      .permissions([permission])
      .businessSite(outletId)
      .country(this.countryId)
      .observableDistributionLevels(this.distributionLevelsService.get(outletId))
      .verify();

    const allowed = authorization.pipe(filter(authorized => authorized));
    const denied = authorization.pipe(filter(authorized => !authorized));
    merge(
      allowed.pipe(
        tap(() => {
          this.enableForm();
          this.evaluateTaskStatus(outletId);
        })
      ),
      denied.pipe(tap(() => this.disableForm()))
    )
      .pipe(take(1))
      .subscribe();
  }

  private evaluateTaskStatus(outletId: string): void {
    const dataClusters = [
      DataCluster.BASE_DATA_ADDRESS,
      DataCluster.BASE_DATA_ADDITIONAL_ADDRESS,
      DataCluster.BASE_DATA_PO_BOX,
      DataCluster.BASE_DATA_GPS,
      DataCluster.BASE_DATA_NAME_ADDITION,
      DataCluster.BASE_DATA_STATE_AND_PROVINCE,
      DataCluster.BUSINESS_NAME
    ];

    const dataVerificationFields = this.businessSiteTaskService.findAllDataVerificationFields()
      .pipe(
        tap(dataVerificationFields => {
          dataVerificationFields.dataVerificationFields.filter(field => this.outletAggregates.includes(field.aggregateName))
            .forEach(field => {
              field.aggregateFields.forEach(aggField => {
                this.aggregateDataFields.push({
                  aggregateName: field.aggregateName,
                  aggregateField: aggField
                })
              })
            })

          this.aggregateDataFields.push({
            dataCluster: DataCluster.BUSINESS_NAME
          });
        })
      );
    const dataTaskPresent = combineLatest([
      this.businessSiteTaskService.getOpenStatusForDataChangeTask(outletId, dataClusters),
      this.businessSiteTaskService.getOpenStatusForDataChangeTask(
        outletId,
        [],
        null,
        this.outletAggregates
      )
    ]).pipe(
      tap(([dataClusterTask, aggregateTask]) => {
        this.openDataChangeTask = dataClusterTask.concat(aggregateTask);
        this.tasksService.nextOpenDataChangeTask(this.openDataChangeTask);
        this.aggregateDataFields = this.aggregateDataFields.filter(field => {
          return aggregateTask.map(task => task.aggregateField).includes(field.aggregateField) === false
        })

        this.aggregateDataFields = this.aggregateDataFields.filter(field => {
          return dataClusterTask.map(task => task.dataCluster?.toString()).includes(field.dataCluster) === false
        })
      }),
      map(([dataClusterTask, aggregateTask]) => [
        this.notNullOrEmpty(dataClusterTask),
        this.notNullOrEmpty(aggregateTask)
      ]),
      filter(
        ([dataChangeTaskExistForDataClusters, dataChangeTaskExistForAggregates]) =>
          dataChangeTaskExistForDataClusters || dataChangeTaskExistForAggregates
      ),
      tap(() => {
        this.isTaskPresent = true;
        if (!this.isForRetailEnabled) {
          this.disableForm();
        }
      })
    );
    const verificationTaskPresent = combineLatest([
      this.businessSiteTaskService.getOpenStatusForDataVerificationTask(outletId, dataClusters),
      this.businessSiteTaskService.getOpenStatusForDataVerificationTask(
        outletId,
        [],
        this.outletAggregates
      )
    ]).pipe(
      tap(([dataClusterTask, aggregateTask]) => {
        this.aggregateDataFields = this.aggregateDataFields.filter(field => {
          return aggregateTask.map(task => task.aggregateField).includes(field.aggregateField) === false
        })

        this.aggregateDataFields = this.aggregateDataFields.filter(field => {
          return dataClusterTask.map(task => task.dataCluster?.toString()).includes(field.dataCluster) === false
        })
      }),
      map(([dataClusterTask, aggregateTask]) => [
        this.notNullOrEmpty(dataClusterTask),
        this.notNullOrEmpty(aggregateTask)
      ]),
      filter(
        ([verificationTaskExistForDataClusters, verificationTaskExistForAggregates]) =>
          verificationTaskExistForDataClusters || verificationTaskExistForAggregates
      ),
      tap(([verificationTaskExistForDataClusters, verificationTaskExistForAggregates]) => {
        this.isVerificationTaskPresent =
          verificationTaskExistForDataClusters || verificationTaskExistForAggregates;
        this.saveButtonDisabled = this.isVerificationTaskPresent
          ? !this.isVerificationTaskPresent
          : this.saveButtonDisabled;
      })
    );

    concat(dataVerificationFields, dataTaskPresent, verificationTaskPresent).subscribe();
  }

  private disableForm(): void {
    this.outletForm.disable();
    this.readonly = true;
  }

  private enableForm(): void {
    this.outletForm.enable();
    this.readonly = false;
  }

  private subscribeToRouteFragmentChanges(): void {
    if (this.route.fragment) {
      this.route.fragment.subscribe(fragment => {
        if (fragment) {
          this.fragment = fragment;
        }
      });
    }
  }

  private initOutletForm(): void {
    this.outletForm = this.formBuilder.group(
      {},
      { validators: AddressValidators.addressAndGpsValidator }
    );
    this.subscribeToFormValueChanges();
  }

  private initOutletDistributionLevelInfo(): void {
    this.distributionLevelsService
      .get(this.outletId)
      .pipe(take(1))
      .subscribe(distributionList => {
          this.isRetailOutlet = distributionList.includes("RETAILER")
        }
      )
  }

  private subscribeToFormValueChanges(): void {
    this.outletForm.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.setButtonStatuses();
    });
  }

  private subscribeToActiveTranslationChanges(): void {
    this.activeLanguageService
      .get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(activeTranslation => {
        this.activeTranslation = activeTranslation;
      });
  }

  private initCountryLanguages(countryId: string): void {
    this.countryService
      .get(countryId)
      .pipe(take(1))
      .subscribe(country => {
        this.countryLanguages = country.languages ? country.languages : [];
      });
  }

  private formatDate(dateKey: string): void {
    if (
      this.outletForm.value &&
      this.outletForm.value[dateKey] &&
      isMoment(this.outletForm.value[dateKey])
    ) {
      this.outletForm.value[dateKey] = this.outletForm.value[dateKey].format('YYYY-MM-DD');
    }
  }

  private submit(): void {
    this.isLoading = true;
    forkJoin([
      this.updateOutlet(),
      this.updatePredecessors(),
      this.updateCountryStructure(),
      this.updateDistributionLevels()
    ])
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        () => {
          this.updateOutletState();
          this.outletForm.markAsPristine();
          this.snackBarService.showInfo('EDIT_OUTLET_UPDATE_SUCCESS');
        },
        error => {
          this.snackBarService.showError(error);
          this.cancelButtonDisabled = false;
        }
      );
  }

  private request(payload?: TaskData): void {
    this.requestUpdateOutlet(payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.snackBarService.showInfo('TASK_UPDATE_OUTLET_REQUEST_SUCCESS');
          if (!this.isForRetailEnabled) {
            this.disableForm();
          } else {
            this.businessNameTableComponent.resetSubmitInProgress();
          }
          this.isTaskPresent = true;
        },
        error => {
          this.snackBarService.showError(error);
        }
      );
    this.outletForm.markAsPristine();
  }

  private updatePredecessors(): Observable<any> {
    return this.hasPredecessorPermissions && this.isPredecessorChanged
      ? this.predecessorService.getBy(this.outletId).pipe(
        take(1),
        mergeMap(predecessor =>
          this.predecessorService.save({
            id: this.outletId,
            predecessors: predecessor?.predecessors
          })
        )
      )
      : of('');
  }

  private updateOutlet(): Observable<any> {
    const { companyId } = this.outlet;
    this.outlet = <Outlet>patchValue(this.outlet, this.outletForm.value);
    return this.outletService.update(companyId, this.outletId, this.outlet);
  }

  private updateOutletState(): void {
    this.businessSiteActionService.dispatchLoadOutlet(this.outlet.id);

    this.outletService
      .getOrLoadBusinessSite(this.outlet.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(outlet => {
        this.outlet = outlet;
      });
  }

  private updateCountryStructure(): Observable<any> {
    const countryStructureFormControl = this.outletForm.get(countryStructureFormAttributeName);
    return countryStructureFormControl && !countryStructureFormControl.pristine
      ? this.countryStructureService.setCountryStructureIdFor(
        this.outlet.id,
        this.outletForm.value[countryStructureFormAttributeName]
      )
      : of('');
  }

  private requestUpdateOutlet(payload?: TaskData): Observable<any> {
    const { companyId } = this.outlet;
    this.outlet = <Outlet>patchValue(this.outlet, this.outletForm.value);
    this.outlet = { ...this.outlet, taskData: { ...payload } };
    return this.outletService.update(companyId, this.outletId, this.outlet);
  }

  private subscribeToOutletAndBusinessNameChanges(): void {
    this.outletOrBusinessNameOrDistributionLevelChanged = merge(
      this.outletService.outletChanges().pipe(map(outlet => true)),
      this.businessNameTableService.saveNames()
    );
  }

  private initPredecessors(): void {
    this.predecessorService
      .isChanged(this.outletId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(isChanged => {
        if (isChanged) {
          this.setButtonStatuses();
          this.isPredecessorChanged = isChanged;
        }
      });

    const predecessorPermissions = [
      'legalstructure.predecessor.create',
      'legalstructure.predecessor.delete'
    ];

    this.userAuthorizationService.isAuthorizedFor
      .permissions(predecessorPermissions)
      .verify()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(authorized => {
        this.hasPredecessorPermissions = authorized;
      });

    if (this.isPredecessorChanged) {
      this.predecessorService.clearCache();
      this.predecessorService.fetchForOutlet(this.outletId);
      this.isPredecessorChanged = false;
    }
  }

  private resetTranslations(): void {
    this.outletForm.controls.additionalTranslations.reset();
    const translationsParentForms: UntypedFormGroup = this.formBuilder.group({});
    this.outletForm.addControl('additionalTranslations', translationsParentForms);
    if (this.outlet.additionalTranslations) {
      Object.entries(this.outlet.additionalTranslations).map(
        (additionalTranslationEntry: [string, OutletTranslation]) => {
          (<UntypedFormGroup>this.outletForm.get('additionalTranslations')).controls[
            additionalTranslationEntry[0]
          ].patchValue(additionalTranslationEntry[1]);
          (<UntypedFormGroup>this.outletForm.get('additionalTranslations')).controls[
            additionalTranslationEntry[0]
          ].patchValue({
            poBox: {
              zipCode: this.outlet.poBox?.zipCode,
              number: this.outlet.poBox?.number
            },
            countryId: this.outlet.countryId,
            countryName: this.prefixForCountryName(this.outlet.countryId, this.outlet.countryName),
            address: {
              zipCode: this.outlet.address.zipCode
            },
            additionalAddress: {
              zipCode: this.outlet.address.zipCode
            },
            gps: {
              latitude: this.outlet.gps?.latitude ?? '',
              longitude: this.outlet.gps?.longitude ?? ''
            }
          });
        }
      );
    }
  }

  private resetBaseDataFields(): void {
    this.messageService.clearCache();
    this.outletService.clearBusinessSite(this.outlet.id);

    this.distributionLevelsService
      .getDistributionLevelsOfOutlet()
      .subscribe(distributionsLevels =>
        this.outletForm.controls.distributionLevels.setValue(distributionsLevels)
      );

    this.outletService.getOrLoadBusinessSite(this.outlet.id).subscribe(outlet => {
      this.outlet = outlet;

      this.outletForm.patchValue({
        startOperationDate: outlet.startOperationDate,
        closeDownDate: outlet.closeDownDate,
        closeDownReasonId: outlet.closeDownReason?.id ?? '',
        legalName: outlet.legalName,
        nameAddition: outlet.nameAddition,
        countryId: outlet.countryId,
        countryName: this.prefixForCountryName(this.outlet.countryId, this.outlet.countryName),
        gps: {
          latitude: outlet.gps?.latitude ?? '',
          longitude: outlet.gps?.longitude ?? ''
        },
        poBox: {
          zipCode: outlet.poBox?.zipCode,
          number: outlet.poBox?.number,
          city: outlet.poBox?.city
        },
        address: {
          addressAddition: outlet.address?.addressAddition,
          city: outlet.address?.city,
          district: outlet.address?.district,
          street: outlet.address?.street,
          streetNumber: outlet.address?.streetNumber,
          zipCode: outlet.address?.zipCode
        },
        additionalAddress: {
          addressAddition: outlet.additionalAddress?.addressAddition,
          city: outlet.additionalAddress?.city,
          district: outlet.additionalAddress?.district,
          street: outlet.additionalAddress?.street,
          streetNumber: outlet.additionalAddress?.streetNumber,
          zipCode: outlet.additionalAddress?.zipCode
        },
        affiliate: outlet.affiliate,
        state: outlet.state,
        province: outlet.province
      });

      this.resetTranslations();
    });
  }

  showDataChangeNotification(isDataChange: boolean) {
    this.showDataChangeMessage = isDataChange;
  }

  onActionClick() {
    this.dataChangeViewClicked.emit();
  }

  private prefixForCountryName(countryId: string, countryName: string | undefined): string {
    return countryName + ' (' + countryId + ')';
  }

  private notNullOrEmpty(arr: any[]): boolean {
    return arr && arr.length > 0;
  }

  private retrieveUserRole(): void {
    this.userService
      .getRoles()
      .pipe(take(1))
      .subscribe(roles => {
        this.isMarketResponsible = roles.some(role => MTR_ROLE.includes(role));
        this.isBusinessSiteResponsible = roles.some(role => RETAILER_ROLE.includes(role));
        this.isProductResponsible = roles.some(role => PR_ROLE.includes(role));
        this.isTestOutlet = roles.some(role => TOU_ROLE.includes(role));
      });
  }

  private subscribeTasksChanges(): void {
    this.taskWebSocketService
      .getLiveTask()
      .pipe(
        takeUntil(this.unsubscribe),
        filter(
          data =>
            data.businessSiteId === this.outlet.id &&
            ((data.aggregateField != undefined &&
              baseDataAggregateFields.includes(data.aggregateField)) ||
              (data.dataCluster != undefined && baseDataDataClusters.includes(data.dataCluster)))
        )
      )
      .subscribe(_data => {
        this.resetBaseDataFields()
        this.evaluateTaskStatus(this.outlet.id);
      });
  }
}
