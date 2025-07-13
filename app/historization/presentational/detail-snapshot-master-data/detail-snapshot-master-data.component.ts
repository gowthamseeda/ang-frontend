import { Component, Inject, OnDestroy, OnInit, ViewChildren, AfterViewInit, ElementRef, QueryList } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { formatMeridiem } from '../../../shared/util/dates';
import { convertStringToUpperCaseAndUnderscore } from '../../../shared/util/strings';
import {
  DetailSnapshotMasterDataDescriptor,
  MasterDataBrands,
  MasterDataCountry,
  MasterDataKeyTypes,
  MasterDataLabels,
  MasterDataLanguage,
  MasterDataOutletRelationships,
  MasterDataProductGroup,
  MasterDataService,
  MasterDataSnapshot,
  MasterDataCloseDownReason
} from '../../models/master-data-history-snapshot.model';
import { HistorizationService } from '../../service/historization.service';

@Component({
  selector: 'gp-detail-snapshot-master-data',
  templateUrl: './detail-snapshot-master-data.component.html',
  styleUrls: ['./detail-snapshot-master-data.component.scss']
})
export class DetailSnapshotMasterDataComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChildren('itemElement', { read: ElementRef }) itemElements: QueryList<ElementRef>;

  detailSnapshotHeaders: string[] = ['event', 'time', 'value'];
  detailSnapshotTitle: string;
  detailMasterData: MasterDataSnapshot = { snapshots: [] };

  private unsubscribe = new Subject<void>();

  constructor(
    private historizationService: HistorizationService,
    public dialogRef: MatDialogRef<DetailSnapshotMasterDataComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      masterDataDescriptor: DetailSnapshotMasterDataDescriptor;
    }
  ) {}

  ngOnInit(): void {
    this.detailSnapshotTitle = this.translateDialogTitle(this.data.masterDataDescriptor.type);
    this.initMasterDataDescriptor(this.data.masterDataDescriptor)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((masterDataSnapshots: MasterDataSnapshot) => {
        this.translateMasterData(this.data.masterDataDescriptor.type, masterDataSnapshots);
        this.detailMasterData = masterDataSnapshots;
      });
  }

  ngAfterViewInit() {
    this.itemElements.changes.subscribe((elements: QueryList<ElementRef>) => {
      const highlightIndex = this.detailMasterData.snapshots.findIndex(
        snapshotdata => snapshotdata.highlight === true
      );

      const element = this.itemElements.toArray()[highlightIndex].nativeElement;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });    
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  translateDialogTitle(type: string) {
    switch (type) {
      case 'Brand':
        return 'HISTORY_OF_BRAND';
      case 'Label':
        return 'HISTORY_OF_LABEL';
      case 'Country':
        return 'HISTORY_OF_COUNTRY';
      case 'ProductGroup':
        return 'HISTORY_OF_PRODUCT_GROUP';
      case 'Language':
        return 'HISTORY_OF_LANGUAGE';
      case 'KeyType':
        return 'HISTORY_OF_KEY_TYPE';
      case 'Service':
        return 'HISTORY_OF_SERVICE';
      case 'OutletRelationship':
        return 'HISTORY_OF_OUTLET_RELATIONSHIP';
      case 'CloseDownReason':
        return 'HISTORY_OF_CLOSE_DOWN_REASON'; 
      default:
        return '';
    }
  }

  translateMasterData(type: string, masterDataSnapshots: MasterDataSnapshot) {
    switch (type) {
      case 'Brand':
        const masterDataBrands = masterDataSnapshots as MasterDataBrands;
        masterDataSnapshots.snapshots = masterDataBrands.brands;
        break;
      case 'Label':
        const masterDataLabels = masterDataSnapshots as MasterDataLabels;
        masterDataSnapshots.snapshots = masterDataLabels.labels;
        break;
      case 'Country':
        const masterDataCountries = masterDataSnapshots as MasterDataCountry;
        masterDataSnapshots.snapshots = masterDataCountries.countries;
        break;
      case 'ProductGroup':
        const masterDataProductGroups = masterDataSnapshots as MasterDataProductGroup;
        masterDataSnapshots.snapshots = masterDataProductGroups.productGroups;
        break;
      case 'Language':
        const masterDataLanguages = masterDataSnapshots as MasterDataLanguage;
        masterDataSnapshots.snapshots = masterDataLanguages.languages;
        break;
      case 'KeyType':
        const masterDataKeyTypes = masterDataSnapshots as MasterDataKeyTypes;
        masterDataSnapshots.snapshots = masterDataKeyTypes.keyTypes;
        break;
      case 'Service':
        const masterDataServices = masterDataSnapshots as MasterDataService;
        masterDataSnapshots.snapshots = masterDataServices.services;
        break;
      case 'OutletRelationship':
        const masterDataOutletRelationships = masterDataSnapshots as MasterDataOutletRelationships;
        masterDataSnapshots.snapshots = masterDataOutletRelationships.outletRelationships;
      case 'CloseDownReason':
        const masterDataCloseDownReasons = masterDataSnapshots as MasterDataCloseDownReason;
        masterDataSnapshots.snapshots = masterDataCloseDownReasons.closeDownReasons;
        break;
    }
    this.translateMasterDataItems(masterDataSnapshots.snapshots as any[]);
  }

  initMasterDataDescriptor(
    descriptor: DetailSnapshotMasterDataDescriptor
  ): Observable<MasterDataSnapshot | null> {
    const fieldValue = descriptor.fieldValue;
    const historyDate = descriptor.historyDate;
    switch (descriptor.fieldType) {
      case 'BrandId':
        return this.historizationService.getMasterDataBrand(fieldValue as string, historyDate);
      case 'CountryId':
        return this.historizationService.getMasterDataCountry(fieldValue as string, historyDate);
      case 'LabelId':
        return this.historizationService.getMasterDataLabel(fieldValue as string, historyDate);
      case 'KeyTypeId':
        return this.historizationService.getMasterDataKeyType(fieldValue as string, historyDate);
      case 'ProductGroupId':
        return this.historizationService.getMasterDataProductGroup(fieldValue as string, historyDate);
      case 'LanguageId':
        return this.historizationService.getMasterDataLanguage(fieldValue as string, historyDate);
      case 'ServiceId':
        return this.historizationService.getMasterDataService(fieldValue as number, historyDate);
      case 'OutletRelationshipId':
          return this.historizationService.getMasterDataOutletRelationship(fieldValue as string, historyDate)
      case 'CloseDownReasonId':
        return this.historizationService.getMasterDataCloseDownReason(fieldValue as number, historyDate); 
      default:
        return of(null);
    }
  }

  translateMasterDataItems(items: any[]) {
    for (const item of items) {
      item.eventName = convertStringToUpperCaseAndUnderscore(item.eventName);
      item.occurredOnForTimeOnly = formatMeridiem(item.occurredOn.toString());
    }
  }
  
}
