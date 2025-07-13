import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, combineLatest, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map, mergeMap, take, takeUntil } from 'rxjs/operators';

import { AppConfigProvider } from '../../../../app-config.service';
import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { DefaultEditActionsComponent } from '../../../../shared/components/default-edit-actions/default-edit-actions.component';
import { CanDeactivateComponent } from '../../../../shared/guards/can-deactivate-guard.model';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { MultiSelectOfferedServiceIds } from '../../../service/models/multi-select.model';
import { Service } from '../../../service/models/service.model';
import { MultiSelectDataService } from '../../../service/services/multi-select-service-data.service';
import { ServiceService } from '../../../service/services/service.service';
import { ValidityConfirmationComponent } from '../../presentational/validity-confirmation/validity-confirmation.component';
import { ValidityTableStatusService } from '../../services/validity-table-status.service';
import { ValidityTableService } from '../../services/validity-table.service';
import {
  MultiOfferedService,
  OfferedServiceResource,
  OfferedServices,
  OfferedServiceValidity,
  Validity
} from '../../validity.model';
import {
  CopyToCompanyDialogData,
  SelectOutletsDialogComponent
} from '../../../shared/components/select-outlets-dialog/select-outlets-dialog.component';
import { OfferedService } from '../../../offered-service/offered-service.model';

@Component({
  selector: 'gp-validity-multi-edit',
  templateUrl: './validity-multi-edit.component.html',
  styleUrls: ['./validity-multi-edit.component.scss']
})
export class ValidityMultiEditComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  outletId: string;
  countryId: string;
  companyId: string;
  selectedServices: MultiSelectOfferedServiceIds[];
  serviceIds: number[];
  offeredServiceIds: string[];
  currentSelectedLanguage?: string;
  @ViewChild(DefaultEditActionsComponent) editComponents: DefaultEditActionsComponent;

  services: Observable<Service[] | undefined>;
  userHasPermissions: Observable<boolean>;
  pristine = this.validityTableStatusService.pristine;
  valid = this.validityTableStatusService.valid;
  isFormChanged = false;
  serviceIsAvailable = true;
  doNotShowMultiSelectConfirmationDialog: boolean;
  selectedOutletIdsToCopy: string[];
  selectedOutletOfferedServicesToCopy: OfferedService[] = []; 

  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private outletService: OutletService,
    private serviceService: ServiceService,
    private offeredServiceService: OfferedServiceService,
    private distributionLevelService: DistributionLevelsService,
    private validityTableStatusService: ValidityTableStatusService,
    private validityTableService: ValidityTableService,
    private userAuthorizationService: UserAuthorizationService,
    private userSettingsService: UserSettingsService,
    private appConfigProvider: AppConfigProvider,
    private multiSelectDataService: MultiSelectDataService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        mergeMap(({ outletId }) => {
          this.outletId = outletId;
          return this.outletService.getOrLoadBusinessSite(outletId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(outlet => {
        this.countryId = outlet.countryId;
        this.companyId = outlet.companyId;
        this.userHasPermissions = this.evaluateUserPermissions();
      });

    this.userSettingsService
      .get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(userSettings => {
        this.currentSelectedLanguage = userSettings.languageId;
        this.doNotShowMultiSelectConfirmationDialog =
          userSettings.doNotShowMultiSelectConfirmationDialog
            ? userSettings.doNotShowMultiSelectConfirmationDialog
            : false;
      });

    this.multiSelectDataService.multiSelected.pipe(take(1)).subscribe(selectedService => {
      if (!selectedService.targets.length) {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
      this.selectedServices = selectedService.targets;
      this.serviceIds = selectedService.targets.map(offeredService => offeredService.serviceId);
      this.offeredServiceIds = selectedService.targets.map(offeredService => offeredService.id);
      this.initServiceAvailable(this.serviceIds);
    });

    this.initFormChangeSubscription();
  }

  get saveButtonDisabled() {
    return combineLatest([this.pristine, this.valid]).pipe(
      map(([pristine, valid]) => {
        return pristine || !valid;
      })
    );
  }

  ngOnDestroy(): void {
    this.validityTableStatusService.changePristineTo(true);
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.multiSelectDataService.flushHoveredService();
  }

  canDeactivate(): boolean {
    return this.isFormChanged;
  }

  save(): void {
    const observableTableRow = this.validityTableService.getValidityTableRows().pipe(
      takeUntil(this.unsubscribe),
      map(validityTableData => {
        return validityTableData[0];
      }),
      take(1)
    );
    combineLatest([observableTableRow, this.services])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([validityTableRow, services]) => {
        const data = services?.map(service => {
          const brandProductGroups = this.selectedServices
            .filter(x => x.serviceId == service.id)
            .map(selectedService => {
              return {
                brandId: selectedService.brandId,
                productGroupId: selectedService.productGroupId
              };
            });
          return {
            ...service,
            brandProductGroups
          };
        });
        if (this.doNotShowMultiSelectConfirmationDialog) {
          this.saveValidities(validityTableRow);
        } else {
          this.promptMultiEditComfirmationDialog(validityTableRow, data);
        }
      });
  }

  promptMultiEditComfirmationDialog(validityTableRow: any, data: any): void {
    const dialogRef = this.matDialog.open(ValidityConfirmationComponent, {
      height: '45rem',
      width: '950px',
      data: {
        validityTableRow,
        services: data,
        outletIds: (this.selectedOutletIdsToCopy || []).concat(this.outletId)
      }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(saved => {
        if (saved) {
          this.saveValidities(validityTableRow);
        } else {
          this.resetPristine(saved);
        }
      });
  }

  saveValidities(validityTableRow: any): void {
    if (!!this.selectedOutletIdsToCopy && this.selectedOutletIdsToCopy.length > 0 ) {
      let selectedOutletIds  = [...this.selectedOutletIdsToCopy];
      selectedOutletIds.push(this.outletId);
      let multiOfferedServiceList: MultiOfferedService[] = [];
      let offeredServicesMap = validityTableRow.offeredServicesMap;
      
      for (const outletId of selectedOutletIds) {
        let offeredServicesList = Object.keys(offeredServicesMap)
        .filter(offeredServiceId => {
          const offeredService = offeredServicesMap[offeredServiceId];
          return offeredService.businessSite?.id === outletId;
        })
        .map(offeredServiceId => {
          const offeredService = offeredServicesMap[offeredServiceId];
          const validFrom = validityTableRow.validFrom || offeredService.validity?.validFrom;
          const validUntil = validityTableRow.validUntil || offeredService.validity?.validUntil;
          
          let valid = validityTableRow.valid;
          if (!validityTableRow.validFrom && offeredService.validity?.validFrom) {
            if (validFrom && validUntil) {
              valid = new Date(validFrom) <= new Date(validUntil);
            }
          }
          
          return {
            id: offeredServiceId,
            serviceId: offeredService.serviceId,
            productCategoryId: offeredService.productCategoryId,
            brandId: offeredService.brandId,
            productGroupId: offeredService.productGroupId,
            validity: new Validity({
              valid,
              validFrom,
              validUntil,
              application: validityTableRow.application,
              applicationValidUntil: validityTableRow.applicationValidUntil
            })
          } as OfferedServiceResource;
        });
        
        const multiOfferedService = new MultiOfferedService(
          outletId,
          new OfferedServices(offeredServicesList)
        );
        multiOfferedServiceList.push(multiOfferedService);
      }
      this.offeredServiceService.saveValiditiesInBatchForMultipleOutlets(multiOfferedServiceList);
    }else {
      const outletId = this.outletId;
      const offeredServiceValidities = Object.keys(validityTableRow.offeredServicesMap).map(
        offeredServiceId => {
          const offeredService = validityTableRow.offeredServicesMap[offeredServiceId];
          const validFrom = validityTableRow.validFrom || offeredService.validity?.validFrom;
          const validUntil = validityTableRow.validUntil || offeredService.validity?.validUntil;

          let valid = validityTableRow.valid;
          if (!validityTableRow.validFrom && offeredService.validity?.validFrom) {
            if (validFrom && validUntil) {
              valid = new Date(validFrom) <= new Date(validUntil);
            }
          }
          
          return {
            id: offeredServiceId,
            validity: new Validity({
              valid,
              validFrom,
              validUntil,
              application: validityTableRow.application,
              applicationValidUntil: validityTableRow.applicationValidUntil
            })
          } as OfferedServiceValidity;
        }
      );
      this.offeredServiceService.saveValiditiesInBatch(outletId, offeredServiceValidities);
    }
    
    this.resetPristine(true);
  }

  resetPristine(pristine: boolean) {
    this.validityTableStatusService.changePristineTo(pristine);
    this.validityTableStatusService.changeValidTo(true);
    if (this.editComponents) {
      this.editComponents.saveButtonDisabled = !!pristine;
    }
    this.changeDetectorRef.detectChanges();
  }

  cancel(): void {
    this.offeredServiceService.fetchAllForOutlet(this.outletId);
    combineLatest([this.offeredServiceService.getAll(), this.multiSelectDataService.multiSelected])
      .pipe(take(1))
      .subscribe(([offeredServices, { targets }]) => {
        let fetchedOfferedServices = offeredServices.filter(offeredService =>
          targets.some(target => target.id === offeredService.id)
        );

        this.validityTableService.initValidityMultiEditTableRows(of(fetchedOfferedServices));
      });
    this.validityTableStatusService.changePristineTo(true);
  }

  getEnableCompanyNavigation(): boolean {
    return this.appConfigProvider.getAppConfig().enableCompanyNavigationOnNewPage;
  }

  openCopyToCompanyDialog() {
    const dialogRef = this.matDialog.open<SelectOutletsDialogComponent, CopyToCompanyDialogData>(
      SelectOutletsDialogComponent,
      {
        height: '45rem',
        data: {
          selectedOutletIdsToCopy: this.selectedOutletIdsToCopy || [],
          companyId: this.companyId,
          serviceIds: this.serviceIds,
          selfOutletId: this.outletId
        }
      }
    );

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(saved => {
        if (saved) {
          this.selectedOutletIdsToCopy = saved.selectedOutletIdsToCopy;
          this.selectedOutletOfferedServicesToCopy = saved.selectedOutletOfferedServices;
          this.initializeForSelectedOutlets();
        }
      });
  }
  
  initializeForSelectedOutlets(): void {
    this.offeredServiceService.fetchAllForOutlet(this.outletId);
    combineLatest([this.offeredServiceService.getAll(), this.multiSelectDataService.multiSelected])
    .pipe(take(1))
    .subscribe(([offeredServices, { targets }]) => {
      let fetchedOfferedServices = offeredServices.filter(offeredService =>
        targets.some(target => target.id === offeredService.id)
      );
      const mappedServicesByOutlet: { [outletId: string]: OfferedService[] } = {};
      (this.selectedOutletIdsToCopy || []).forEach(outletId => {
        const existingServices = (this.selectedOutletOfferedServicesToCopy || []).filter(
          s => s.businessSite?.id === outletId
        );
        const mappedServices = fetchedOfferedServices.map(service => {
          const { serviceId } = this.splitGsIdAndServiceId(service.id);
          const exists = existingServices.some(existing => {
            const existingIds = this.splitGsIdAndServiceId(existing.id);
            return existingIds.serviceId === serviceId;
          });
          
          if (exists) {
            return existingServices.find(existing => {
              const existingIds = this.splitGsIdAndServiceId(existing.id);
              return existingIds.serviceId === serviceId;
            })!;
          } else {
            return {
              ...service,
              id: `${outletId}-${serviceId}`,
              businessSite: { ...service.businessSite, id: outletId },
              validity: {
                ...service.validity,
                valid: false,
                validFrom: '',
                validUntil : service.validity?.validUntil 
              }
            };
          }
        });
        
        mappedServicesByOutlet[outletId] = mappedServices;
      });

      mappedServicesByOutlet[this.outletId] = fetchedOfferedServices;
      this.validityTableService.getValidityTableRows().pipe(take(1)).subscribe(validityTableRows => {
        const validityTableRow = validityTableRows[0];
        
        const normalizedMappedServicesByOutlet = this.normalizeMappedServicesByOutlet(mappedServicesByOutlet);
        let allMappedServices = Object.values(normalizedMappedServicesByOutlet).reduce(
          (acc, val) => acc.concat(val),
          []
        );
        
        validityTableRow.offeredServicesMap = {};
        
        allMappedServices.forEach(service => {
          validityTableRow.offeredServicesMap[service.id] = service;
        });
      });
    });
  }

  private normalizeMappedServicesByOutlet(mappedServicesByOutlet: { [outletId: string]: any[] }): { [outletId: string]: any[] } {
    const normalized: { [outletId: string]: any[] } = {};
    
    Object.keys(mappedServicesByOutlet).forEach(outletId => {
      normalized[outletId] = mappedServicesByOutlet[outletId].map(service => {
        let normalizedService = { ...service };

        if (
          normalizedService.productCategory &&
          typeof normalizedService.productCategory === 'object' &&
          normalizedService.productCategory !== null &&
          typeof normalizedService.productCategory.id !== 'undefined'
        ) {
          normalizedService.productCategoryId = normalizedService.productCategory.id;
          delete normalizedService.productCategory;
        }

        if (
          normalizedService.productGroup &&
          typeof normalizedService.productGroup === 'object' &&
          normalizedService.productGroup !== null &&
          typeof normalizedService.productGroup.id !== 'undefined'
        ) {
          normalizedService.productGroupId = normalizedService.productGroup.id;
          delete normalizedService.productGroup;
        }

        if (
          normalizedService.brand &&
          typeof normalizedService.brand === 'object' &&
          normalizedService.brand !== null &&
          typeof normalizedService.brand.id !== 'undefined'
        ) {
          normalizedService.brandId = normalizedService.brand.id;
          delete normalizedService.brand;
        }

        if (
          normalizedService.service &&
          typeof normalizedService.service === 'object' &&
          normalizedService.service !== null &&
          typeof normalizedService.service.id !== 'undefined'
        ) {
          normalizedService.serviceId = normalizedService.service.id;
          const { id, ...restService } = normalizedService.service;
          normalizedService.service = restService;
        }

        if (!normalizedService.businessSite && typeof normalizedService.id === 'string') {
          const gsId = normalizedService.id.split('-')[0];
          normalizedService.businessSite = { id: gsId };
        }
        return normalizedService;
      });
    });
    return normalized;
  }

  private splitGsIdAndServiceId(combinedId: string): { gsId: string; serviceId: string } {
    const [gsId, serviceId] = combinedId.split('-');
    return { gsId, serviceId };
  }

  private initServiceAvailable(serviceIds: number[]): void {
    this.serviceService.fetchAll();
    this.services = this.serviceService.selectAllBy(serviceIds);

    combineLatest([this.services, this.serviceService.isLoading()]).subscribe(
      ([loadedService, isLoading]) => {
        if (!loadedService && !isLoading) {
          this.serviceIsAvailable = false;
        }
      }
    );
  }

  private evaluateUserPermissions(): Observable<boolean> {
    return this.distributionLevelService.getDistributionLevelsOfOutlet().pipe(
      mergeMap(distributionLevels => {
        return this.userAuthorizationService.isAuthorizedFor
          .permissions(['services.offeredservice.update'])
          .businessSite(this.outletId)
          .country(this.countryId)
          .distributionLevels(distributionLevels)
          .verify();
      })
    );
  }

  private initFormChangeSubscription(): void {
    combineLatest([this.pristine, this.valid])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([isPristine, isValid]) => {
        this.isFormChanged = !isValid || isPristine;
      });
  }

  highlightOfferedService(serviceId?: number) {
    this.multiSelectDataService.updateHoveredService(serviceId);
  }
}
