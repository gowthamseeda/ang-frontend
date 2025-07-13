import {getLocaleFirstDayOfWeek, WeekDay} from '@angular/common';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {
  GroupedOpeningHour,
  SpecialOpeningHour,
  StandardOpeningHour, Times,
  WeekDayOpeningHours
} from 'app/opening-hours/models/opening-hour.model';
import moment from 'moment';
import {combineLatest, Observable, of, Subject} from 'rxjs';
import {filter, skip, take, takeUntil, tap} from 'rxjs/operators';

import {AppConfigProvider} from '../../../app-config.service';
import {BrandService} from '../../../services/brand/brand.service';
import {CanDeactivateComponent} from '../../../shared/guards/can-deactivate-guard.model';
import {LocaleService} from '../../../shared/services/locale/locale.service';
import {NavigationService} from '../../../shared/services/navigation/navigation.service';
import {SnackBarService} from '../../../shared/services/snack-bar/snack-bar.service';
import {
  DataCluster,
  OpeningHoursData,
  OpeningHoursDiff, OpeningHoursDiffTime,
  Status,
  TaskFooterEvent,
  Type, Task,
  AggregateDataField
} from '../../../tasks/task.model';
import {UserSettingsService} from '../../../user-settings/user-settings/services/user-settings.service';
import {OpeningHourConvertion} from '../../brand-product-group/brand-product-group-opening-hours';
import {sortByBrandProductGroup} from '../../brand-product-group/brand-product-group-order';
import {EventCreationState, SavingStatus} from '../../models/saving-status.model';
import {
  BrandProductGroupSelection,
  GroupedOpeningHourColumn
} from '../../presentational/brand-product-group-table/grouped-opening-hour-column.model';
import {CalendarEvent} from '../../presentational/calendar/calendar.component';
import {EventListItem} from '../../presentational/event-list-item/event-list-item.model';
import {OpeningHoursConverterService} from '../../services/opening-hours-converter.service';
import {OpeningHoursPermissionService} from '../../services/opening-hours-permission.service';
import {OpeningHoursActionService} from '../../store/action-service';
import {Direction} from '../../store/actions/brand-product-group-opening-hours.actions';
import * as fromOpeningHours from '../../store/reducers';
import {Hours, Service} from '../../store/reducers';
import {
  selectBrandProductGroupOpeningHoursLoadingStatus,
  selectBrandProductGroupOpeningHoursSavingStatus,
  selectEditableOpeningHourDays,
  selectGroupedSpecialHoursAfter,
  selectIsDataChangeTaskPresentForOpeningHours,
  selectIsNotFoundError,
  selectIsVerificationTaskPresentForOpeningHours,
  selectOpeningHoursOutletBusinessSiteIdState,
  selectOpeningHoursServiceCharacteristic,
  selectOpeningHoursServiceState,
  selectReducedSpecialOpeningHoursState,
  selectReducedStandardOpeningHoursState,
  selectSelectedBrandProductGroupOpeningHoursState,
  selectSelectedSpecialOpeningHoursEnd,
  selectSelectedSpecialOpeningHoursStart,
  selectSpecialOpeningHourEvents
} from '../../store/selectors';
import {OpeningHourNotification} from "../../../notifications/models/notifications.model";
import {DataChangedNotificationService} from "../../../notifications/services/data-changed-notification.service";
import {UserService} from "../../../iam/user/user.service";
import {FeatureToggleService} from "../../../shared/directives/feature-toggle/feature-toggle.service";
import {
  OpeningHoursTaskNotificationComponent
} from "../opening-hours-task-notification/opening-hours-task-notification.component";
import {BusinessSiteTaskService} from "../../../tasks/shared/business-site-task.service";
import {
  WeekdayColumnComponent
} from "../../presentational/brand-product-group-table/weekday-column/weekday-column.component";
import {
  BrandProductGroupTableComponent
} from "../../presentational/brand-product-group-table/brand-product-group-table.component";
import { TaskDataService } from '../../../tasks/task/store/task-data.service';

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
  selector: 'gp-edit-opening-hours',
  templateUrl: './edit-opening-hours.component.html',
  styleUrls: ['./edit-opening-hours.component.scss']
})
export class EditOpeningHoursComponent implements OnInit, OnDestroy, CanDeactivateComponent {
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
  selectedEndDate: number;
  editableWeekDays: WeekDay[] = [];
  localizedWeekDays: WeekDay[] = [];
  isFormValid = false;
  savingStatus: SavingStatus;
  service: Service;
  currentSelectedLanguage: string;
  businessSiteId: string;
  sortedBrands: string[];
  translationLocale: Observable<string>;
  isVerificationTaskPresent: boolean | undefined = false;
  isBSR4RVerificationTaskPresent: boolean = false;
  taskTypeDataChange = Type.DATA_CHANGE;
  locale: string;
  queryParams: {
    productCategoryId: number;
    serviceId: number;
    serviceCharacteristicId: number;
  };
  isBSR: boolean = false;
  isMTR: boolean = false;
  is4RetailEnabled: boolean = false;
  openingHoursDataNotification: OpeningHourNotification[];
  displayOpeningHoursNotification: OpeningHourNotification[];
  notificationRetrieved: boolean = false;
  taskRetrieved: boolean = false;

  @ViewChild(OpeningHoursTaskNotificationComponent)
  openingHoursTaskNotificationChild: OpeningHoursTaskNotificationComponent;
  @ViewChild(WeekdayColumnComponent)
  weekdayColumnComponentChild: WeekdayColumnComponent;
  @ViewChild(BrandProductGroupTableComponent)
  brandProductGroupTableComponentChild: BrandProductGroupTableComponent;
  openingHourDiffList: OpeningHoursData[] = [];
  showDataChangeNotification: boolean = false;
  isTaskPresent?: boolean = false;
  isMarginalVisible = false;

  openDataChangeTask: Task[] = [];

  private unsubscribe = new Subject<void>();

  fieldData: AggregateDataField = {
      dataCluster: DataCluster.OPENING_HOURS.toString()
    };

  constructor(
    private store: Store<fromOpeningHours.State>,
    private actionService: OpeningHoursActionService,
    private snackBarService: SnackBarService,
    private permissionService: OpeningHoursPermissionService,
    private converterService: OpeningHoursConverterService,
    private brandService: BrandService,
    private localeService: LocaleService,
    private userSettingsService: UserSettingsService,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute,
    private appConfigProvider: AppConfigProvider,
    private featureToggleService: FeatureToggleService,
    private taskDataService: TaskDataService,
    private userService: UserService,
    private dataChangedNotificationService: DataChangedNotificationService,
    private businessSiteTaskService: BusinessSiteTaskService
  ) {
  }

  ngOnInit(): void {
    this.isLoading = this.store.pipe(
      takeUntil(this.unsubscribe),
      select(selectBrandProductGroupOpeningHoursLoadingStatus)
    );
    this.featureToggleService.isFeatureEnabled('FOR_RETAIL')
      .subscribe(forRetailEnabled => {
        this.is4RetailEnabled = forRetailEnabled
      })
    this.initUserRole();
    this.initializeOpeningHourTable();
    this.initializeServiceAttributes();
    this.initializeBusinessSiteAndTaskStatus();
    this.initializeSpecialOpeningHourCalendar();
    this.initializeSpecialOpeningHourList();
    this.initializeLocaleAndWeekdays();
    this.reRouteOnNotFoundError();
    this.initializeSavingStatus();

    this.activatedRoute.queryParams
      .pipe(
        tap((params: ParamMap) => {
          this.queryParams = {
            productCategoryId: params['productCategoryId'],
            serviceId: params['serviceId'],
            serviceCharacteristicId: params['serviceCharacteristicId']
          };
        }),
        skip(1),
        tap(() => this.dispatchLoadOpeningHours())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  canDeactivate(): boolean {
    return !this.savingStatus.updated;
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
    if (
      this.permissionService.isCreateSpecialOpeningHourAllowed() &&
      this.dayIsValid(timeOfSelectedDay) &&
      (!this.isTaskPresent || this.is4RetailEnabled)
    ) {
      this.calendarDate = moment(timeOfSelectedDay).toDate();

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
    if (this.isVerificationTaskPresent) {
      return !(this.isFormValid && this.isVerificationTaskPresent);
    }
    return !(this.isFormValid && this.savingStatus.updated);
  }

  isCancelButtonDisabled(): boolean {
    return !this.savingStatus.updated;
  }

  hasPermissionToSave(): Observable<boolean> {
    return this.permissionService.isSaveAllowed();
  }

  saveButtonClicked(event?: TaskFooterEvent): void {
    const firstDaySelected = this.savingStatus.newEventState === EventCreationState.FirstDay;
    const secondDaySelected = this.savingStatus.newEventState === EventCreationState.SecondDay;

    if (firstDaySelected || secondDaySelected) {
      this.actionService.dispatchCloseSelectedSpecialOpeningHours();
      this.actionService.dispatchRemoveUnchangedSpecialOpeningHours();
    }

    this.initialHours = undefined;
    this.actionService.dispatchOpeningHoursSubmit(this.businessSiteId, this.service, event);

    if (!!event) {
      if(!this.is4RetailEnabled){
        this.editableWeekDays = [];
        this.isTaskPresent = true;
      }
      this.isBSR4RVerificationTaskPresent = false
    }
  }

  cancelButtonClicked(): void {
    this.dispatchLoadOpeningHours();
  }

  getEnableCompanyNavigation(): boolean {
    return this.appConfigProvider.getAppConfig().enableCompanyNavigationOnNewPage;
  }

  initDataChangeTasks(): void {
    if (this.is4RetailEnabled) {
      if (this.isMTR || this.isBSR) {
        if (!this.taskRetrieved) {
          this.businessSiteTaskService
            .getByOutletId(this.businessSiteId)
            .pipe(
              take(1)
            )
            .subscribe(data => {
              this.openDataChangeTask =data;
              this.openingHourDiffList = [];

              data.filter(
                task => task.type === Type.DATA_CHANGE
                  && task.status === Status.OPEN
                  && task.dataCluster === DataCluster.OPENING_HOURS
              ).forEach(task => {
                let openingHourDiff = task.diff as OpeningHoursDiff
                openingHourDiff.openingHoursDiff.forEach(diff => {
                    if (diff.serviceId == this.service.serviceId) {
                      this.openingHourDiffList.push(diff);
                    }
                  }
                )
              })
              this.taskRetrieved = true
              this.appendDataChangeTasks();
            });
        } else {
          this.appendDataChangeTasks();
        }
      }
    }
  }

  populateDataChangeTaskOpeningHour(brandIds: string[]) {
    const dayMapping: { [key: string]: number } = {
      SU: 0,
      MO: 1,
      TU: 2,
      WE: 3,
      TH: 4,
      FR: 5,
      SA: 6,
    };
    brandIds.forEach(brandId => {
      if (this.openingHourDiffList.length >= 0) {
        this.openingHourDiffList = this.combineOpeningHoursData(this.openingHourDiffList);
        this.openingHourDiffList.forEach(openingHourDiff => {
          if (openingHourDiff.brandId === brandId) {
            const normalizedProductGroupId = openingHourDiff.productGroupId
            .split(',')
            .map(id => id.trim())
            .sort()
            .join(',');
            const weekday: WeekDayOpeningHours = {
              weekDay: dayMapping[openingHourDiff.day],
              openingHours: [this.getOpeningHoursFromTask(brandId, openingHourDiff,normalizedProductGroupId)]
            }
            let existingDay = this.weekdaysOpeningHours.find(day => day.weekDay === weekday.weekDay);
            if (existingDay) {
              let existingOpeningHour = existingDay.openingHours.find(
                openingHour => openingHour.groupId === weekday.openingHours[0].groupId
              );
              if (existingOpeningHour) {
                existingOpeningHour.times = this.convertOpeningHoursDiffNewToTimes(weekday.openingHours[0].dataChangeTask?.new.times);
                existingOpeningHour.dataChangeTask = weekday.openingHours[0].dataChangeTask;
              }
            }else {
              this.weekdaysOpeningHours.push(weekday)
            }
          }
        })
      }
    })
  }


  combineOpeningHoursData(data: OpeningHoursData[]): OpeningHoursData[] {
    const combinedDataMap = new Map<string, OpeningHoursData>();

    data.forEach(item => {
      const key = `${item.serviceId}-${item.brandId}-${item.day}-${JSON.stringify(item.diff)}`;
      if (combinedDataMap.has(key)) {
        const existingItem = combinedDataMap.get(key)!;
        existingItem.productGroupId += `,${item.productGroupId}`;
      } else {
        combinedDataMap.set(key, { ...item });
      }
    });

    return Array.from(combinedDataMap.values()).map(item => {
      item.productGroupId = Array.from(new Set(item.productGroupId.split(','))).join(',');
      return item;
    });
  }

  convertOpeningHoursDiffNewToTimes(openingHoursDiffTimes: OpeningHoursDiffTime[] = []): Times[] {
    return openingHoursDiffTimes.map(openingHourDiffTime => {
      return {
        begin: openingHourDiffTime.begin,
        end: openingHourDiffTime.end,
        enabled: true
      };
    });
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

  private evaluateTaskStatus(): void {
    this.store
      .pipe(select(selectIsDataChangeTaskPresentForOpeningHours), takeUntil(this.unsubscribe))
      .subscribe(isDataChangeTaskPresent => {
        this.isTaskPresent = isDataChangeTaskPresent;
        if (isDataChangeTaskPresent && !this.is4RetailEnabled) {
          this.editableWeekDays = [];
        }
      });
    this.store
      .pipe(select(selectIsVerificationTaskPresentForOpeningHours), takeUntil(this.unsubscribe))
      .subscribe(isVerificationTaskPresent => {
        this.isVerificationTaskPresent = isVerificationTaskPresent;
      });
  }

  private initializeBusinessSiteAndTaskStatus(): void {
    this.store
      .pipe(select(selectOpeningHoursOutletBusinessSiteIdState), takeUntil(this.unsubscribe))
      .subscribe(businessSiteId => {
        this.businessSiteId = businessSiteId;
      });
    this.evaluateTaskStatus();
  }

  private initializeSpecialOpeningHourCalendar(): void {
    this.store
      .pipe(select(selectSpecialOpeningHourEvents(moment().toDate())), takeUntil(this.unsubscribe))
      .subscribe((specialOpeningHours: SpecialOpeningHour[]) => {
        this.calendarEvents = specialOpeningHours.map(hours => {
          return {
            startDate: moment(hours.startDate).toDate(),
            endDate: moment(hours.endDate).toDate(),
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

  private initUserRole(): void {
    this.userService
      .getRoles()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(roles => {
        this.isMTR = roles.includes('GSSNPLUS.MarketTaskResponsible');
        this.isBSR = roles.includes('GSSNPLUS.BusinessSiteResponsible');
      });
  }

  private init4RVerificationNotification(): void {
    this.taskDataService
      .getOpenOpeningHoursVerificationTaskByServiceId(this.businessSiteId, this.service.serviceId)
      .pipe(take(1))
      .subscribe(response => {
        this.isBSR4RVerificationTaskPresent = response != null;
      })
  }

  private initOpeningHoursNotifications(): void {
    if (this.is4RetailEnabled) {
      if (this.isBSR) {
        if (this.businessSiteId !== undefined && this.service !== undefined && this.service.serviceId !== undefined) {
          if (!this.notificationRetrieved) {
            this.dataChangedNotificationService
              .getOpeningHoursNotification(this.businessSiteId, this.service.serviceId)
              .pipe(take(1))
              .subscribe(
                openingHoursNotification => {
                  this.openingHoursDataNotification = openingHoursNotification
                  this.displayOpeningHoursNotification = openingHoursNotification
                  this.notificationRetrieved = true
                  this.appendOpeningHoursNotification()
                }
              )
          } else {
            this.init4RVerificationNotification()
            this.appendOpeningHoursNotification()
          }
        }
      } else {
        this.init4RVerificationNotification()
      }
    }
  }

  resetNotification(): void {
    if (this.displayOpeningHoursNotification && this.displayOpeningHoursNotification.length > 0) {
      this.displayOpeningHoursNotification = [];
      this.appendOpeningHoursNotification();
    }
  }

  showNotification(notificationType: string): void {
    const filteredNotifications = this.openingHoursDataNotification.filter(
      (notification) => notification.taskStatus === notificationType
    );
    for (let filteredNotification of filteredNotifications) {
      if (!this.displayOpeningHoursNotification.some((existingNotification) =>
        JSON.stringify(existingNotification) == JSON.stringify(filteredNotification))) {
        this.displayOpeningHoursNotification.push(filteredNotification)
      }
    }
    this.appendOpeningHoursNotification()
  }
  showDataChangeTaskNotification(): void {
    this.showDataChangeNotification = true
    this.weekdayColumnComponentChild.calculateHeightForCell()
    this.brandProductGroupTableComponentChild.fillForm()
  }
  removeDataChangeNotification():void {
    this.showDataChangeNotification = false
    this.weekdayColumnComponentChild.calculateHeightForCell()
    this.brandProductGroupTableComponentChild.fillForm()
  }

  removeNotification(notificationType: string): void {
    this.showDataChangeNotification = false
    this.displayOpeningHoursNotification = this.displayOpeningHoursNotification.filter(
      (notification) => notification.taskStatus != notificationType
    )
    this.appendOpeningHoursNotification()
  }

  private appendOpeningHoursNotification(): void {
    let startDate: string = ""
    let endDate: string = ""

    for (const specialOpeningHour of this.listEvents) {
      if (specialOpeningHour.eventListItem.selected) {
        startDate = specialOpeningHour.eventListItem.start.toLocaleDateString('en-CA')
        endDate = specialOpeningHour.eventListItem.end ?
          specialOpeningHour.eventListItem.end.toLocaleDateString('en-CA') : ''
      }
    }

    this.weekdaysOpeningHours = this.weekdaysOpeningHours.map((daysOpeningHours) => ({
      ...daysOpeningHours,
      openingHours: daysOpeningHours.openingHours.map((brandOpeningHours) => ({
        ...brandOpeningHours,
        notification: this.findMatchingOpeningHourNotification(
          brandOpeningHours.groupId,
          daysOpeningHours.weekDay,
          startDate,
          endDate
        ),
      })),
    }));
  }

  appendDataChangeTasks(): void {
    this.populateDataChangeTaskOpeningHour(this.sortedBrands)
    this.weekdayColumnComponentChild.calculateHeightForCell()
    this.brandProductGroupTableComponentChild.fillForm()
  }

  private findMatchingOpeningHourNotification(
    groupId: string,
    weekday: number,
    startDate: string,
    endDate: string
  ): string {
    const dayMapping: { [key: string]: number } = {
      SU: 0,
      MO: 1,
      TU: 2,
      WE: 3,
      TH: 4,
      FR: 5,
      SA: 6,
    };

    for (const openingHoursNotification of this.displayOpeningHoursNotification) {
      if (openingHoursNotification.startDate === undefined) {
        if (`${openingHoursNotification.brandId}${openingHoursNotification.productGroupId}` === groupId &&
          dayMapping[openingHoursNotification.day || ""] === weekday &&
          startDate === "" &&
          endDate === "") {
          return openingHoursNotification.taskStatus
        }
      } else if (`${openingHoursNotification.brandId}${openingHoursNotification.productGroupId}` === groupId &&
        dayMapping[openingHoursNotification.day || ""] === weekday &&
        startDate === openingHoursNotification.startDate &&
        endDate === openingHoursNotification.endDate) {
        return openingHoursNotification.taskStatus
      }
    }

    return ""
  }

  private getOpeningHoursFromTask(brandId: string, openingHourTaskDiffData: OpeningHoursData , normalizedProductGroupId : string): GroupedOpeningHour {
    const groupedOpeningHours: GroupedOpeningHour = {
      groupId: `${brandId}${normalizedProductGroupId}`,
      times: [],
      closed: false,
      dataChangeTask: openingHourTaskDiffData.diff
    }
    return groupedOpeningHours;
  }

  private initializeOpeningHourTable(): void {
    combineLatest([
      this.store.pipe(select(selectSelectedBrandProductGroupOpeningHoursState)),
      this.store.pipe(select(selectSelectedSpecialOpeningHoursStart)),
      this.store.pipe(select(selectSelectedSpecialOpeningHoursEnd)),
      this.permissionService.isAllowed(),
      this.permissionService.getRestrictedBrands(),
      this.permissionService.getRestrictedProductGroups(),
      this.store.pipe(select(selectOpeningHoursServiceState)),
      this.brandService.getAllIds(),
      this.userSettingsService.getLanguageId(),
      this.store.pipe(select(selectIsDataChangeTaskPresentForOpeningHours))
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (
          data: [
            Hours,
            number,
            number,
            boolean,
            string[],
            string[],
            Service,
            string[],
            string,
            boolean | undefined
          ]
        ) => {
          const [
            brandProductGroupState,
            selectedStartDateState,
            selectedEndDateState,
            isAllowedState,
            allowedBrandsState,
            allowedProductGroupsState,
            serviceState,
            brands,
            languageId,
            dataChangeTaskPresent
          ] = data;
          this.sortedBrands = brands;
          this.groupedOpeningHourColumns = this.converterService.convertToGroupedOpeningHourColumns(
            brandProductGroupState,
            selectedStartDateState !== -1,
            isAllowedState && (!dataChangeTaskPresent || this.is4RetailEnabled),
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
          this.service = serviceState;
          this.currentSelectedLanguage = languageId;
          this.initOpeningHoursNotifications()
          this.initDataChangeTasks()
        }
      );
  }

  private initializeSpecialOpeningHourList(): void {
    combineLatest([
      this.store.pipe(select(selectGroupedSpecialHoursAfter(moment().toDate()))),
      this.permissionService.isAllowed(),
      this.permissionService.getRestrictedBrands(),
      this.permissionService.getRestrictedProductGroups(),
      this.store.pipe(select(selectSelectedSpecialOpeningHoursStart)),
      this.store.pipe(select(selectIsDataChangeTaskPresentForOpeningHours))
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ([
           groupedSpecialHours,
           isAllowed,
           restrictedBrands,
           restrictedProductGroups,
           selectedSpecial,
           dataChangeTaskPresent
         ]) => {
          this.listEvents = groupedSpecialHours
            .filter(specialHour => specialHour.configured)
            .map(specialHour => {
              return {
                eventListItem: {
                  start: moment(specialHour.startDate).toDate(),
                  end: moment(specialHour.endDate).toDate(),
                  selected: moment(selectedSpecial).isSame(specialHour.startDate, 'day'),
                  deletable: this.permissionService.isDeleteSpecialOpeningHourAllowed(
                    specialHour,
                    restrictedBrands,
                    restrictedProductGroups,
                    isAllowed && !dataChangeTaskPresent
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
          this.initOpeningHoursNotifications()
          this.initDataChangeTasks()
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
      this.store.pipe(select(selectReducedStandardOpeningHoursState), skip(1)),
      this.store.pipe(select(selectReducedSpecialOpeningHoursState), skip(1)),
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
        this.actionService.dispatchUpdateSavingStatus(storeUpdated  && (!this.isTaskPresent || this.is4RetailEnabled));
      });
  }

  private dispatchLoadOpeningHours(): void {
    this.initialHours = undefined;
    this.actionService.dispatchLoadOpeningHours(
      this.businessSiteId,
      this.queryParams.productCategoryId,
      this.queryParams.serviceId,
      this.queryParams.serviceCharacteristicId
    );
  }
}
