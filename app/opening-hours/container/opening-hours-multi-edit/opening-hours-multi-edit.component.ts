import { getLocaleFirstDayOfWeek, WeekDay } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  SpecialOpeningHour,
  StandardOpeningHour,
  WeekDayOpeningHours
} from 'app/opening-hours/models/opening-hour.model';
import { Service } from 'app/services/service/models/service.model';
import moment from 'moment';
import { combineLatest, lastValueFrom, Observable, of, Subject } from 'rxjs';
import { filter, map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { AppConfigProvider } from '../../../app-config.service';
import { OfferedService } from '../../../communication/model/offered-service.model';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { LegalStructureRoutingService } from '../../../legal-structure/legal-structure-routing.service';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { BrandService } from '../../../services/brand/brand.service';
import { OfferedServiceService } from '../../../services/offered-service/offered-service.service';
import { MultiSelectOfferedServiceIds } from '../../../services/service/models/multi-select.model';
import { MultiSelectDataService } from '../../../services/service/services/multi-select-service-data.service';
import { ServiceService } from '../../../services/service/services/service.service';
import { CanDeactivateComponent } from '../../../shared/guards/can-deactivate-guard.model';
import { LocaleService } from '../../../shared/services/locale/locale.service';
import { NavigationService } from '../../../shared/services/navigation/navigation.service';
import { ProgressBarService } from '../../../shared/services/progress-bar/progress-bar.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import { DataCluster, TaskFooterEvent, Type } from '../../../tasks/task.model';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { OpeningHourConvertion } from '../../brand-product-group/brand-product-group-opening-hours';
import { sortByBrandProductGroup } from '../../brand-product-group/brand-product-group-order';
import { EventCreationState, SavingStatus } from '../../models/saving-status.model';
import {
  BrandProductGroupSelection,
  GroupedOpeningHourColumn
} from '../../presentational/brand-product-group-table/grouped-opening-hour-column.model';
import { CalendarEvent } from '../../presentational/calendar/calendar.component';
import { EventListItem } from '../../presentational/event-list-item/event-list-item.model';
import { OpeningHoursConfirmationComponent } from '../../presentational/opening-hours-confirmation/opening-hours-confirmation.component';
import { OpeningHoursConverterService } from '../../services/opening-hours-converter.service';
import { OpeningHoursPermissionService } from '../../services/opening-hours-permission.service';
import { OpeningHoursActionService } from '../../store/action-service';
import { Direction } from '../../store/actions/brand-product-group-opening-hours.actions';
import * as fromOpeningHours from '../../store/reducers';
import { Hours } from '../../store/reducers';
import {
  selectBrandProductGroupOpeningHoursSavingStatus,
  selectEditableOpeningHourDays,
  selectGroupedSpecialHoursAfter,
  selectIsNotFoundError,
  selectOpeningHoursServiceCharacteristic,
  selectReducedSpecialOpeningHoursState,
  selectReducedStandardOpeningHoursState,
  selectSelectedBrandProductGroupOpeningHoursState,
  selectSelectedSpecialOpeningHoursEnd,
  selectSelectedSpecialOpeningHoursStart,
  selectSpecialOpeningHourEvents
} from '../../store/selectors';
import {UserSettings} from "../../../user-settings/user-settings/model/user-settings.model";
import {
  CopyToCompanyDialogData,
  SelectOutletsDialogComponent
} from "../../../services/shared/components/select-outlets-dialog/select-outlets-dialog.component";
import { OfferedServiceDataService } from 'app/services/offered-service/store/offered-service-data.service';

interface ExtendedEventListItem {
  eventListItem: EventListItem;
  containsRestrictedColumns: boolean;
}

export const weekStartSaturday = [
  WeekDay.Saturday,
  WeekDay.Sunday,
  WeekDay.Monday,
  WeekDay.Tuesday,
  WeekDay.Wednesday,
  WeekDay.Thursday,
  WeekDay.Friday
];

export const weekStartSunday = [
  WeekDay.Sunday,
  WeekDay.Monday,
  WeekDay.Tuesday,
  WeekDay.Wednesday,
  WeekDay.Thursday,
  WeekDay.Friday,
  WeekDay.Saturday
];

export const weekStartMonday = [
  WeekDay.Monday,
  WeekDay.Tuesday,
  WeekDay.Wednesday,
  WeekDay.Thursday,
  WeekDay.Friday,
  WeekDay.Saturday,
  WeekDay.Sunday
];

@Component({
  selector: 'gp-opening-hours-multi-edit',
  templateUrl: './opening-hours-multi-edit.component.html',
  styleUrls: ['./opening-hours-multi-edit.component.scss']
})
export class OpeningHoursMultiEditComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  groupedOpeningHourColumns: GroupedOpeningHourColumn[] = [];
  weekdaysOpeningHours: WeekDayOpeningHours[] = [];
  initialHours: Hours | undefined;
  isLoading: Observable<boolean> = of(true);
  numberOfMonths = 2;
  serviceCharacteristicName: string;
  listEvents: ExtendedEventListItem[] = [];
  calendarEvents: CalendarEvent[];
  calendarDate: Date = new Date();
  selectedStartDate: number;
  serviceIds: number[];
  selectedEndDate: number;
  services: Observable<Service[] | undefined>;
  editableWeekDays: WeekDay[] = [];
  localizedWeekDays: WeekDay[] = [];
  isFormValid = false;
  savingStatus: SavingStatus;
  selectedServices: MultiSelectOfferedServiceIds[];
  offeredServiceIds: string[];
  currentSelectedLanguage: string | undefined;
  sortedBrands: string[];
  translationLocale: Observable<string>;
  taskTypeDataChange = Type.DATA_CHANGE;
  locale: string;
  businessSiteId: Observable<string>;
  isEditable: Observable<boolean>;
  saveButtonDisabled: boolean;
  offeredServicesOfOutlet: Observable<OfferedService[]>;
  offeredServices: Observable<OfferedService[]>;
  serviceIsAvailable = true;
  cancelButtonDisabled = true;
  noTaskOfferedServices: MultiSelectOfferedServiceIds[] = [];
  doNotShowMultiSelectConfirmationDialog: boolean;
  selectedOutletIdsToCopy: string[];
  companyId: string;
  outletId: string;

  private unsubscribe = new Subject<void>();

  constructor(
    private store: Store<fromOpeningHours.State>,
    private actionService: OpeningHoursActionService,
    private snackBarService: SnackBarService,
    private serviceService: ServiceService,
    private permissionService: OpeningHoursPermissionService,
    private converterService: OpeningHoursConverterService,
    private brandService: BrandService,
    private localeService: LocaleService,
    private userSettingsService: UserSettingsService,
    private navigationService: NavigationService,
    private appConfigProvider: AppConfigProvider,
    private multiSelectDataService: MultiSelectDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private legalStructureRoutingService: LegalStructureRoutingService,
    private outletService: OutletService,
    private userAuthorizationService: UserAuthorizationService,
    private distributionLevelsService: DistributionLevelsService,
    private businessSiteTaskService: BusinessSiteTaskService,
    private offeredServiceService: OfferedServiceService,
    private matDialog: MatDialog,
    private progressBarService: ProgressBarService,
    private offeredServiceDataService: OfferedServiceDataService
  ) {}

  ngOnInit(): void {
    this.businessSiteId = this.legalStructureRoutingService.outletIdChanges;
    this.initOpeningHourMultiEdit();
    this.initServiceAvailable();
    this.initPermission();

    this.initializeOpeningHourTable();
    this.initializeServiceAttributes();
    this.initializeSpecialOpeningHourCalendar();
    this.initializeSpecialOpeningHourList();
    this.initializeLocaleAndWeekdays();
    this.reRouteOnNotFoundError();
    this.initializeSavingStatus();
    this.initServiceAvailable();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initOpeningHourMultiEdit(): void {
    this.multiSelectDataService.multiSelected.pipe(take(1)).subscribe(selectedService => {
      this.selectedServices = selectedService.targets;
      if (!selectedService.targets.length) {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
      }
      this.serviceIds = selectedService.targets.map(offeredService => offeredService.serviceId);
      this.selectedServices = selectedService.targets;
      this.offeredServiceIds = selectedService.targets.map(offeredService => offeredService.id);
      let standardOpeningHours: StandardOpeningHour[] = [];
      selectedService.targets.map(serviceSelected => {
        let brandPushed = standardOpeningHours.find(
          hour => hour.brandId === serviceSelected.brandId
        );
        if (brandPushed) {
          if (!brandPushed.productGroupIds.includes(serviceSelected.productGroupId)) {
            brandPushed.productGroupIds.push(serviceSelected.productGroupId);
          }
        } else {
          standardOpeningHours.push({
            brandId: serviceSelected.brandId,
            openingHours: [],
            productGroupIds: [serviceSelected.productGroupId]
          });
        }
      });
      this.actionService.dispatchInitMultiEditOpeningHours({
        hours: {
          specialOpeningHours: [],
          standardOpeningHours: standardOpeningHours
        }
      });
    });
  }

  private initServiceAvailable(): void {
    this.services = this.serviceService.selectAllBy(this.serviceIds);

    this.offeredServicesOfOutlet = this.legalStructureRoutingService.outletIdChanges.pipe(
      tap(outletId => this.offeredServiceService.fetchAllForOutlet(outletId)),
      switchMap(() => this.offeredServiceService.getAll())
    );

    this.offeredServices = combineLatest([
      this.offeredServicesOfOutlet,
      this.multiSelectDataService.multiSelected
    ]).pipe(
      take(1),
      map(([offeredServicesOfOutlet, { targets }]) => {
        return offeredServicesOfOutlet.filter(offeredService =>
          targets.some(target => target.id === offeredService.id)
        );
      })
    );

    // this.serviceService.fetchAll();
    // this.services = this.serviceService.selectAllBy(this.serviceIds);

    // combineLatest([this.services, this.serviceService.isLoading()]).subscribe(
    //   ([loadedService, isLoading]) => {
    //     if (!loadedService && !isLoading) {
    //       this.serviceIsAvailable = false;
    //     }
    //   }
    // );
  }
  canDeactivate(): boolean {
    return this.cancelButtonDisabled && this.saveButtonDisabled;
  }

  showUpdatedOpeningHours(weekdaysOpeningHours: WeekDayOpeningHours[]): void {
    this.weekdaysOpeningHours = weekdaysOpeningHours;
  }

  useSpecialOpeningHours(): boolean {
    return this.selectedStartDate !== -1;
  }

  formValidityChanged(isValid: boolean): void {
    if (isValid) {
      const firstDaySelected = this.savingStatus.newEventState === EventCreationState.FirstDay;
      const secondDaySelected = this.savingStatus.newEventState === EventCreationState.SecondDay;
      const updatedHourValues =
        OpeningHourConvertion.convertWeekDaysOpeningHoursToBrandProductGroupOpeningHours(
          this.groupedOpeningHourColumns,
          this.weekdaysOpeningHours,
          this.useSpecialOpeningHours(),
          this.sortedBrands
        );

      if (firstDaySelected || secondDaySelected) {
        this.actionService.dispatchSpecialOpeningHoursChangedFirstTime(
          this.selectedStartDate,
          updatedHourValues
        );
      }
      this.actionService.dispatchUpdateOpeningHours(this.selectedStartDate, updatedHourValues);
    }
    this.isFormValid = isValid;
    if (this.isFormValid) this.disableSaveButton(false);
    else this.disableSaveButton();
    this.disableCancelButton(false);
  }

  calendarDayOfEventClicked(timeOfSelectedDay: number): void {
    const selectedDay = new Date(timeOfSelectedDay);
    const calendarEvent = this.findCalendarEventRangeBy(selectedDay);
    if (calendarEvent) {
      this.calendarDate = selectedDay;
      switch (this.savingStatus.newEventState) {
        case EventCreationState.FirstDay:
        case EventCreationState.SecondDay:
          this.actionService.dispatchRemoveUnchangedSpecialOpeningHours();
          break;
        case EventCreationState.Updated:
          this.actionService.dispatchCloseSelectedSpecialOpeningHours();
          break;
      }
      this.actionService.dispatchUpdateSelectedSpecialOpeningHours(
        calendarEvent.startDate.getTime()
      );
    }
  }

  calenderFreeDayClicked(timeOfSelectedDay: number): void {
    combineLatest([this.isEditable]).subscribe((data: [boolean]) => {
      const [isEditable] = data;
      if (isEditable && this.dayIsValid(timeOfSelectedDay)) {
        this.calendarDate = new Date(timeOfSelectedDay);
        switch (this.savingStatus.newEventState) {
          case EventCreationState.None:
          case EventCreationState.Updated:
          case EventCreationState.SecondDay:
            this.actionService.dispatchRemoveUnchangedSpecialOpeningHours();
            this.actionService.dispatchSpecialOpeningHoursFirstDaySelected(timeOfSelectedDay);
            this.actionService.dispatchUpdateSelectedSpecialOpeningHours(timeOfSelectedDay);
            break;

          case EventCreationState.FirstDay:
            if (this.isCrossingOtherEvents(timeOfSelectedDay, this.selectedStartDate)) {
              this.snackBarService.showInfo('Error crossing date ranges!');
            } else {
              this.actionService.dispatchSpecialOpeningHoursSecondDaySelected(
                this.selectedStartDate,
                this.selectedStartDate,
                timeOfSelectedDay
              );
              if (timeOfSelectedDay < this.selectedStartDate) {
                this.actionService.dispatchUpdateSelectedSpecialOpeningHours(timeOfSelectedDay);
              }
            }
        }
      }
    });
  }

  specialOpeningHourEventSelected(startTime: number): void {
    const startDate = new Date(startTime);
    const calendarEvent = this.findCalendarEventBy(startDate);
    if (calendarEvent) {
      this.calendarDate = startDate;
      switch (this.savingStatus.newEventState) {
        case EventCreationState.FirstDay:
        case EventCreationState.SecondDay:
          this.actionService.dispatchRemoveUnchangedSpecialOpeningHours();
          break;
        case EventCreationState.Updated:
          this.actionService.dispatchCloseSelectedSpecialOpeningHours();
      }
      this.actionService.dispatchUpdateSelectedSpecialOpeningHours(
        calendarEvent.startDate.getTime()
      );
    }
  }

  specialOpeningHourEventDeleted(startTime: number): void {
    const isShownEventDeleted = moment(startTime).isSame(this.selectedStartDate, 'd');
    const newEventUpdated = this.savingStatus.newEventState === EventCreationState.Updated;
    const noNewEvent = this.savingStatus.newEventState === EventCreationState.None;

    if (isShownEventDeleted && (newEventUpdated || noNewEvent)) {
      this.actionService.dispatchCloseSelectedSpecialOpeningHours();
    }

    this.actionService.dispatchDeleteSpecialOpeningHours(startTime);
  }

  specialOpeningHourEventReset(startTime: number): void {
    combineLatest([
      this.permissionService.getRestrictedBrands(),
      this.permissionService.getRestrictedProductGroups()
    ])
      .pipe(take(1))
      .subscribe(([restrictedBrands, restrictedProductGroups]) => {
        this.actionService.dispatchResetSpecialOpeningHours(
          startTime,
          restrictedBrands,
          restrictedProductGroups
        );
      });
  }

  onSelectedSpecialHourClose(): void {
    this.actionService.dispatchCloseSelectedSpecialOpeningHours();
    this.actionService.dispatchRemoveUnchangedSpecialOpeningHours();
  }

  moveProductGroupLeftClicked(brandProductGroup: BrandProductGroupSelection): void {
    if (brandProductGroup.isOnliestProduct) {
      this.actionService.dispatchDropProductGroupColumn(
        brandProductGroup.brandId,
        brandProductGroup.productGroupId,
        this.useSpecialOpeningHours() ? this.selectedStartDate : undefined
      );
    } else {
      if (this.useSpecialOpeningHours()) {
        this.actionService.dispatchMoveSpecialOpeningHoursProductGroup(
          brandProductGroup.brandId,
          brandProductGroup.productGroupId,
          this.selectedStartDate,
          Direction.Left
        );
      } else {
        this.actionService.dispatchMoveStandardOpeningHoursProductGroup(
          brandProductGroup.brandId,
          brandProductGroup.productGroupId,
          Direction.Left
        );
      }
    }
  }

  moveProductGroupRightClicked(brandProductGroup: BrandProductGroupSelection): void {
    if (brandProductGroup.isLastColumnOfBrand) {
      this.actionService.dispatchDetachProductGroupFromBrand(
        brandProductGroup.brandId,
        brandProductGroup.productGroupId,
        this.useSpecialOpeningHours() ? this.selectedStartDate : undefined
      );
    } else {
      if (this.useSpecialOpeningHours()) {
        this.actionService.dispatchMoveSpecialOpeningHoursProductGroup(
          brandProductGroup.brandId,
          brandProductGroup.productGroupId,
          this.selectedStartDate,
          Direction.Right
        );
      } else {
        this.actionService.dispatchMoveStandardOpeningHoursProductGroup(
          brandProductGroup.brandId,
          brandProductGroup.productGroupId,
          Direction.Right
        );
      }
    }
  }

  isSaveButtonDisabled(): boolean {
    return this.saveButtonDisabled;
  }

  disableSaveButton(disable: boolean = true) {
    this.saveButtonDisabled = disable;
  }

  isCancelButtonDisabled(): boolean {
    return this.cancelButtonDisabled;
  }

  disableCancelButton(disable: boolean = true) {
    this.cancelButtonDisabled = disable;
  }

  hasPermissionToSave(): Observable<boolean> {
    return this.permissionService.isSaveAllowed();
  }

  saveButtonClicked(event?: TaskFooterEvent): void {
    this.services.pipe(takeUntil(this.unsubscribe)).subscribe(services => {
      const servicesData = services
        ?.filter(service =>
          this.noTaskOfferedServices.find(noTaskService => noTaskService.serviceId === service.id)
        )
        .map(service => {
          const brandProductGroups = this.noTaskOfferedServices
            .filter(noTaskService => noTaskService.serviceId == service.id)
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

      const blockedOfferedServices = this.selectedServices.filter(
        offeredService =>
          !this.noTaskOfferedServices.find(noTaskService => noTaskService.id === offeredService.id)
      );

      const blockedServicesData = services
        ?.filter(service =>
          blockedOfferedServices.find(blockedService => blockedService.serviceId === service.id)
        )
        .map(service => {
          const brandProductGroups = blockedOfferedServices
            .filter(blockedService => blockedService.serviceId == service.id)
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

      this.disableSaveButton();
      this.disableCancelButton();
      this.progressBarService.start();

      const firstDaySelected = this.savingStatus.newEventState === EventCreationState.FirstDay;
      const secondDaySelected = this.savingStatus.newEventState === EventCreationState.SecondDay;

      var selectedOfferedServices: MultiSelectOfferedServiceIds[] = [];

      if (!!this.selectedOutletIdsToCopy && this.selectedOutletIdsToCopy.length > 0 ) {
        this.selectedOutletIdsToCopy.forEach(
          selectedOutletId => {
              this.noTaskOfferedServices.forEach(
                selectedOfferedService =>
                  selectedOfferedServices.push(
                    ({
                    id: this.replaceOfferedServiceIdWithOutletId(selectedOfferedService.id,selectedOutletId ),
                    outletId: selectedOutletId,
                    serviceId: selectedOfferedService.serviceId,
                    brandId: selectedOfferedService.brandId,
                    productGroupId: selectedOfferedService.productGroupId,
                    serviceCharactereisticId: selectedOfferedService.serviceCharactereisticId,
                    productCategoryId: selectedOfferedService.productCategoryId,
                  } as MultiSelectOfferedServiceIds)
                )
              );
        });
      }

      const concatedOfferedService = selectedOfferedServices.concat(this.noTaskOfferedServices)

      if(this.doNotShowMultiSelectConfirmationDialog){
          this.createOfferedServiceAndSaveOpeningHours(
            selectedOfferedServices,
            firstDaySelected,
            secondDaySelected,
            concatedOfferedService,
            event
          )

          this.initialHours = undefined;
          if (!!event) {
            this.editableWeekDays = [];
          }
          this.progressBarService.stop();
      } else {
        const dialogRef = this.matDialog.open(OpeningHoursConfirmationComponent, {
          height: '45rem',
          data: {
            firstDaySelected,
            secondDaySelected,
            selectedServices: concatedOfferedService,
            event,
            services: servicesData,
            blockedServices: blockedServicesData,
            outletIds: (this.selectedOutletIdsToCopy || []).concat(this.outletId)
          }
        });

        dialogRef
        .afterClosed()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(saved => {
          if(saved){
            this.createOfferedServiceAndSaveOpeningHours(
              selectedOfferedServices,
              firstDaySelected,
              secondDaySelected,
              concatedOfferedService,
              event
            )
          }
          this.initialHours = undefined;
          if (!!event) {
            this.editableWeekDays = [];
          }
          this.progressBarService.stop();
        });
      }
    });
  }

  async createOfferedServiceAndSaveOpeningHours(
    selectedOfferedServices: MultiSelectOfferedServiceIds[],
    firstDaySelected: boolean,
    secondDaySelected: boolean,
    concatedOfferedService: MultiSelectOfferedServiceIds[],
    event?: TaskFooterEvent
  ){
    // call offered service creation API for selectedOfferedService if OS not being created
    await lastValueFrom (this.offeredServiceDataService.createOfferedService(selectedOfferedServices))

    // wait 1 sec before create opening hour to make sure offered service created in opening hour microservice
    return new Promise<void>(resolve => {
      setTimeout(() => {
      this.saveOpeningHours({
        firstDaySelected,
        secondDaySelected,
        selectedServices: concatedOfferedService,
        event})
        resolve()
    }, 1000)
    })
  }

  replaceOfferedServiceIdWithOutletId(offeredServiceId: string, outletId: string) {
    const splittedOfferedServiceId = offeredServiceId.split('-');
    splittedOfferedServiceId[0] = outletId;
    const changedOfferredService:string = splittedOfferedServiceId.join("-");
    return changedOfferredService
  }

  saveOpeningHours(OpeningHoursData: any){
    const { firstDaySelected, secondDaySelected, selectedServices, event } = OpeningHoursData;

    if (firstDaySelected || secondDaySelected) {
      this.actionService.dispatchCloseSelectedSpecialOpeningHours();
      this.actionService.dispatchRemoveUnchangedSpecialOpeningHours();
    }

    this.actionService.dispatchMultiEditOpeningHoursSubmit(selectedServices, event);
  }

  cancelButtonClicked(): void {
    this.onSelectedSpecialHourClose();
    this.initialHours = undefined;
    this.initOpeningHourMultiEdit();
    this.disableSaveButton();
    this.disableCancelButton();
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
          this.selectedOutletIdsToCopy = saved;
        }
      });
  }

  getEnableCompanyNavigation(): boolean {
    return this.appConfigProvider.getAppConfig().enableCompanyNavigationOnNewPage;
  }

  highlightOfferedServiceProductGroup(serviceId?: number) {
    this.multiSelectDataService.updateHoveredService(serviceId);
  }

  private findCalendarEventBy(startDate: Date): CalendarEvent | undefined {
    const dateAsString = startDate.toDateString();
    return this.calendarEvents.find(
      calendarEvent => calendarEvent.startDate.toDateString() === dateAsString
    );
  }

  private findCalendarEventRangeBy(startDate: Date): CalendarEvent | undefined {
    const dateAsString = startDate.toDateString();
    return this.calendarEvents.find(
      calendarEvent =>
        calendarEvent.startDate.toDateString() === dateAsString ||
        (moment(calendarEvent.startDate).isBefore(startDate) &&
          moment(calendarEvent.endDate).isAfter(startDate)) ||
        calendarEvent.endDate.toDateString() === dateAsString
    );
  }

  private dayIsValid(timeOfSelectedDay: number): boolean {
    return moment(timeOfSelectedDay).isSameOrAfter(moment(), 'day');
  }

  private isCrossingOtherEvents(firstDay: number, secondDay: number): CalendarEvent | undefined {
    const start = firstDay <= secondDay ? moment(firstDay) : moment(secondDay);
    const end = firstDay > secondDay ? moment(firstDay) : moment(secondDay);

    return this.calendarEvents.find(
      (calendarEvent: CalendarEvent) =>
        !calendarEvent.selected &&
        ((start.isSameOrBefore(calendarEvent.startDate, 'day') &&
          end.isSameOrAfter(calendarEvent.startDate, 'day')) ||
          (start.isSameOrBefore(calendarEvent.endDate, 'day') &&
            end.isSameOrAfter(calendarEvent.endDate, 'day')))
    );
  }

  private localeWeekDays(locale: string): WeekDay[] {
    const firstDayOfWeek = getLocaleFirstDayOfWeek(locale);
    switch (firstDayOfWeek) {
      case WeekDay.Monday:
        return weekStartMonday;
      case WeekDay.Saturday:
        return weekStartSaturday;
      default:
        return weekStartSunday;
    }
  }

  private initializeLocaleAndWeekdays(): void {
    this.store
      .pipe(select(selectEditableOpeningHourDays), takeUntil(this.unsubscribe))
      .subscribe(editableWeekDays => (this.editableWeekDays = editableWeekDays));

    this.translationLocale = this.localeService.currentTranslationLocale();

    this.localeService
      .currentTranslationLocale()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(locale => {
        this.localizedWeekDays = this.localeWeekDays(locale);
        this.locale = locale;
      });
  }

  private initializeSpecialOpeningHourCalendar(): void {
    this.store
      .pipe(select(selectSpecialOpeningHourEvents(moment().toDate())), takeUntil(this.unsubscribe))
      .subscribe((specialOpeningHours: SpecialOpeningHour[]) => {
        this.calendarEvents = specialOpeningHours.map(hours => {
          return {
            startDate: new Date(hours.startDate),
            endDate: new Date(hours.endDate),
            selected: moment(this.selectedStartDate).isSame(hours.startDate, 'day')
          };
        });
      });
  }

  private initializeServiceAttributes(): void {
    this.store
      .pipe(select(selectOpeningHoursServiceCharacteristic), takeUntil(this.unsubscribe))
      .subscribe(serviceCharacteristic => (this.serviceCharacteristicName = serviceCharacteristic));
  }

  private initPermission(): void {
    this.isEditable = this.businessSiteId.pipe(
      switchMap(businessSiteId => this.outletService.getOrLoadBusinessSite(businessSiteId)),
      switchMap(outlet => {
          this.companyId = outlet.companyId;
          this.outletId = outlet.id;
          return this.evaluateUserPermissions(outlet.id, outlet.countryId);
        }
      )
    );

    this.selectedServices.forEach(service => {
      combineLatest([this.isEditable, this.businessSiteId])
        .pipe(
          takeUntil(this.unsubscribe),
          switchMap(([isEditable, businessSiteId]) =>
            isEditable
              ? this.businessSiteTaskService.existsOpenDataChangeFor(
                  businessSiteId,
                  [DataCluster.OPENING_HOURS],
                  `serviceId=${service.serviceId},productCategoryId=${service.productCategoryId}`
                )
              : of(false)
          ),
          take(1)
        )
        .subscribe(taskPresent => {
          if (!taskPresent) {
            this.noTaskOfferedServices.push(service);
          }
        });
    });

    this.allowEditWithoutChangesIfVerification(this.isEditable);
  }

  private allowEditWithoutChangesIfVerification(userIsAllowedToEdit: Observable<boolean>): void {
    combineLatest([userIsAllowedToEdit, this.businessSiteId])
      .pipe(
        switchMap(([isAllowedToEdit, businessSiteId]) =>
          isAllowedToEdit
            ? this.businessSiteTaskService
                .existsOpenVerificationTaskFor(businessSiteId, [DataCluster.OPENING_HOURS])
                .pipe(startWith(false))
            : of(false)
        ),
        takeUntil(this.unsubscribe)
      )
      .subscribe(isVerificationTaskPresent => {
        this.saveButtonDisabled = !isVerificationTaskPresent;
      });
  }

  private evaluateUserPermissions(businessSiteId: string, countryId: string): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor
      .permissions(['openinghours.openinghours.update'])
      .businessSite(businessSiteId)
      .country(countryId)
      .observableDistributionLevels(this.distributionLevelsService.get(businessSiteId))
      .verify();
  }

  private initializeOpeningHourTable(): void {
    combineLatest([
      this.store.pipe(select(selectSelectedBrandProductGroupOpeningHoursState)),
      this.store.pipe(select(selectSelectedSpecialOpeningHoursStart)),
      this.store.pipe(select(selectSelectedSpecialOpeningHoursEnd)),
      this.isEditable,
      this.permissionService.getRestrictedBrands(),
      this.permissionService.getRestrictedProductGroups(),
      this.brandService.getAllIds(),
      this.userSettingsService.get()
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data: [Hours, number, number, boolean, string[], string[], string[], UserSettings]) => {
        const [
          brandProductGroupState,
          selectedStartDateState,
          selectedEndDateState,
          isEditable,
          allowedBrandsState,
          allowedProductGroupsState,
          brands,
          userSettings
        ] = data;
        this.sortedBrands = brands;
        this.groupedOpeningHourColumns = this.converterService.convertToGroupedOpeningHourColumns(
          brandProductGroupState,
          selectedStartDateState !== -1,
          isEditable,
          allowedBrandsState,
          allowedProductGroupsState,
          brands
        );
        this.weekdaysOpeningHours = OpeningHourConvertion.convertToWeekDaysOpeningHours(
          brandProductGroupState,
          selectedStartDateState !== -1,
          brands
        );
        this.selectedStartDate = selectedStartDateState;
        this.selectedEndDate = selectedEndDateState;
        this.isFormValid = true;
        this.currentSelectedLanguage = userSettings.languageId;
        this.doNotShowMultiSelectConfirmationDialog = userSettings.doNotShowMultiSelectConfirmationDialog ?
          userSettings.doNotShowMultiSelectConfirmationDialog : false;
      });
  }

  private initializeSpecialOpeningHourList(): void {
    combineLatest([
      this.store.pipe(select(selectGroupedSpecialHoursAfter(moment().toDate()))),
      this.isEditable,
      this.permissionService.getRestrictedBrands(),
      this.permissionService.getRestrictedProductGroups(),
      this.store.pipe(select(selectSelectedSpecialOpeningHoursStart))
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ([
          groupedSpecialHours,
          isEditable,
          restrictedBrands,
          restrictedProductGroups,
          selectedSpecial
        ]) => {
          this.listEvents = groupedSpecialHours
            .filter(specialHour => specialHour.configured)
            .map(specialHour => {
              return {
                eventListItem: {
                  start: new Date(specialHour.startDate),
                  end: new Date(specialHour.endDate),
                  selected: moment(selectedSpecial).isSame(specialHour.startDate, 'day'),
                  deletable: this.permissionService.isDeleteSpecialOpeningHourAllowed(
                    specialHour,
                    restrictedBrands,
                    restrictedProductGroups,
                    isEditable
                  )
                },
                containsRestrictedColumns:
                  this.permissionService.containsRestrictedBrandProductGroupCombination(
                    specialHour,
                    restrictedBrands,
                    restrictedProductGroups
                  )
              };
            });
        }
      );
  }

  private reRouteOnNotFoundError(): void {
    this.store
      .pipe(
        select(selectIsNotFoundError),
        filter((is404Error: boolean) => is404Error),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.navigationService.navigateAbsoluteTo('/dashboard').then();
      });
  }

  private initializeSavingStatus(): void {
    this.store
      .pipe(select(selectBrandProductGroupOpeningHoursSavingStatus), takeUntil(this.unsubscribe))
      .subscribe(status => (this.savingStatus = status));

    combineLatest([
      this.store.pipe(select(selectReducedStandardOpeningHoursState)),
      this.store.pipe(select(selectReducedSpecialOpeningHoursState)),
      this.brandService.getAllIds()
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data: [StandardOpeningHour[], SpecialOpeningHour[], string[]]) => {
        const [standardHours, specialHours, brandIds] = data;

        const currentHours = {
          standardOpeningHours: sortByBrandProductGroup(standardHours, brandIds),
          specialOpeningHours: sortByBrandProductGroup(specialHours, brandIds)
        } as Hours;

        this.initialHours = this.initialHours ?? currentHours;
        const actualHoursAsText = JSON.stringify(currentHours).normalize();
        const initialHoursAsText = JSON.stringify(this.initialHours).normalize();
        const storeUpdated = actualHoursAsText !== initialHoursAsText;
        this.actionService.dispatchUpdateSavingStatus(storeUpdated);
      });
  }
}
