import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  BrandProductGroup,
  BrandProductGroupsGroupedByBrandId
} from 'app/services/brand-product-group/brand-product-group.model';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { KeysPipe } from '../../../../shared/pipes/keys/keys.pipe';
import { brandProductGroupUtils } from '../../../brand-product-group/brand-product-group.model';
import { OfferedService } from '../../../offered-service/offered-service.model';
import { ServiceFilterDialogComponent } from '../../containers/service-filter-dialog/service-filter-dialog.component';
import { MultiSelectMode } from '../../models/multi-select.model';
import { ServiceFilterCriteria, ServiceTableRow } from '../../models/service-table-row.model';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';
import { ServiceTableSettingService } from '../../services/service-table-setting.service';
import { ServiceDetailDialogComponent } from '../../containers/service-detail-dialog/service-detail-dialog.component';
import { UserService } from 'app/iam/user/user.service';
import { Service } from '../../models/service.model';

@Component({
  selector: 'gp-service-table-layout',
  templateUrl: './service-table-layout.component.html',
  styleUrls: ['./service-table-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceTableLayoutComponent implements OnInit, OnChanges, OnDestroy {
  @Input() serviceTableRows: MatTableDataSource<ServiceTableRow[]>;
  @Input() brandProductGroups: BrandProductGroupsGroupedByBrandId;
  @Input() countryId: string;
  @Input() outletId: string;
  @Input() serviceTableSaved: boolean;
  @Input() containerHeight: Number;

  @Output() addOfferedService = new EventEmitter<OfferedService>();
  @Output() removeOfferedService = new EventEmitter<string>();
  @Output() servicesFilter = new EventEmitter<ServiceFilterCriteria>();
  @Output() applyFilter = new EventEmitter<Event>();

  displayedColumns: string[] = ['name', 'brandProductGroups', 'actions'];
  displayedTopColumns: string[] = ['empty-left', 'brands', 'empty-right'];
  tableWidth = 0;
  searchFormGroup: UntypedFormGroup;
  unmaintainedInfoToggleFormGroup: UntypedFormGroup;
  multiEditFormGroup: UntypedFormGroup;
  showUnmaintainedInfo: boolean;
  copyOfferedServiceToggleStatus: boolean;
  rowSelected = new Map();
  canUpdate = false

  private brandProductGroupsColumnWidthMap: { [index: string]: any } = {};
  private borderWidth = 1;
  private columnWidth = 60;
  private filterCriteria: ServiceFilterCriteria;
  private unsubscribe = new Subject<void>();
  private inputSubject: Subject<Event> = new Subject();

  constructor(
    public multiSelectDataService: MultiSelectDataService,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private keysPipe: KeysPipe,
    private matDialog: MatDialog,
    private serviceTableSettingService: ServiceTableSettingService,
    private userService: UserService
  ) {
    this.serviceTableSettingService.unmaintainedInfo
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(showUnmaintainedToggle => {
        this.showUnmaintainedInfo = showUnmaintainedToggle;
      });
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.initUnmaintainedInformationToggling();
    this.inputSubject
      .pipe(debounceTime(500), takeUntil(this.unsubscribe))
      .subscribe(filterTextValue => this.applyFilter.emit(filterTextValue));

    this.initMultiEditToggle();
    this.initPermission()
  }

  ngOnChanges(): void {
    this.calculateTableAndBrandColumnWidth();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  orderBy(brandProductGroups: BrandProductGroup[]): BrandProductGroup[] {
    return brandProductGroupUtils.orderByProductGroupId(brandProductGroups);
  }

  brandProductGroupColumnWidthBy(brandId: string): number {
    return this.brandProductGroupsColumnWidthMap[brandId];
  }

  onKeyUp(filterValue: Event): void {
    this.inputSubject.next(filterValue);
  }

  setHoverServiceId(serviceId: number, show: boolean): void {
    this.rowSelected.clear();
    this.rowSelected.set(serviceId, show);
    this.changeDetectorRef.detectChanges();
  }

  showIcon(serviceId: number): boolean {
    return this.rowSelected.get(serviceId) ?? false;
  }

  showServicesDetailsIcon(service: Service): boolean {
    return (this.rowSelected.get(service.id) ?? false) && (this.canUpdate || (!this.canUpdate && !!service.detailDescription));
  }

  openServiceFilterDialog(): void {
    const dialog = this.matDialog.open(ServiceFilterDialogComponent, {
      width: '400px',
      data: this.filterCriteria
    });

    dialog.afterClosed().subscribe((serviceFilterCriteria: ServiceFilterCriteria | false) => {
      if (serviceFilterCriteria) {
        this.filterCriteria = serviceFilterCriteria;
        this.servicesFilter.emit(serviceFilterCriteria);
        this.searchFormGroup.reset();
      }
    });
  }

  openServiceDetailDescriptionDialog(serviceId: number): void {
    this.matDialog.open(ServiceDetailDialogComponent, {
      width: '40%',
      data: serviceId
    });
  }

  private initMultiEditToggle(): void {
    this.multiSelectDataService.copyStatus.pipe(takeUntil(this.unsubscribe)).subscribe(status => {
      this.copyOfferedServiceToggleStatus = status;
      this.searchFormGroup.reset();
    });

    this.multiEditFormGroup
      .get('mode')
      ?.valueChanges.subscribe(val =>
        this.multiSelectDataService.updateMode(val ? MultiSelectMode.EDIT : MultiSelectMode.COPY)
      );
  }

  private calculateTableAndBrandColumnWidth(): void {
    let brandProductGroupsColumnWidth = 0;
    for (const brandId of this.keysPipe.transform(this.brandProductGroups)) {
      const brandProductGroupWidth =
        this.columnWidth * this.brandProductGroups[brandId].length + this.borderWidth;
      this.brandProductGroupsColumnWidthMap[brandId] = brandProductGroupWidth;
      brandProductGroupsColumnWidth += brandProductGroupWidth;
    }
    this.tableWidth =
      brandProductGroupsColumnWidth +
      (brandProductGroupsColumnWidth * 2) / 3 -
      2 * this.borderWidth;
  }

  private initUnmaintainedInformationToggling(): void {
    this.unmaintainedInfoToggleFormGroup
      .get('unmaintainedInfo')
      ?.valueChanges.subscribe(val => this.serviceTableSettingService.toggleUnmaintainedInfo(val));
  }

  private initFormGroup(): void {
    this.searchFormGroup = this.formBuilder.group({
      search: ''
    });

    this.unmaintainedInfoToggleFormGroup = this.formBuilder.group({
      unmaintainedInfo: this.showUnmaintainedInfo
    });

    this.multiSelectDataService.mode.pipe(takeUntil(this.unsubscribe)).subscribe(mode => {
      this.multiEditFormGroup = this.formBuilder.group({
        mode: mode
      });
    });
  }

  private initPermission() {
    this.userService
      .getPermissions()
      .subscribe(permissions => {
        this.canUpdate = permissions.includes('services.service.detaildescription.update')
      });
  }

  selectBrand(brandId: string) {
    this.multiSelectDataService.selectBrand(brandId)
  }

  selectBrandProductGroup(brandId: string, productGroupId: string | undefined) {
    this.multiSelectDataService.selectBrandProductGroupId(brandId, productGroupId ?? "")
  }

  selectServiceId(serviceId: number) {
    this.multiSelectDataService.selectServiceId(serviceId)
    this.changeDetectorRef.detectChanges();
  }
}
