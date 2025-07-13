import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { of } from 'rxjs';
import { TestingModule } from '../../../testing/testing.module';
import { MasterDataSnapshot } from '../../models/master-data-history-snapshot.model';
import { HistorizationService } from '../../service/historization.service';
import { DetailSnapshotMasterDataComponent } from './detail-snapshot-master-data.component';

describe('DetailSnapshotMasterDataComponent', () => {
  let component: DetailSnapshotMasterDataComponent;
  let fixture: ComponentFixture<DetailSnapshotMasterDataComponent>;
  let historizationServiceSpy: Spy<HistorizationService>;
  let matDialogRefSpy: Spy<MatDialogRef<DetailSnapshotMasterDataComponent>>;
  const mockDialogData = { masterDataDescriptor: { type: 'Brand', fieldValue: 'someValue' } };

  beforeEach(async () => {
    historizationServiceSpy = createSpyFromClass(HistorizationService);
    matDialogRefSpy = createSpyFromClass(MatDialogRef) as Spy<
      MatDialogRef<DetailSnapshotMasterDataComponent, any>
    >;

    await TestBed.configureTestingModule({
      declarations: [DetailSnapshotMasterDataComponent],
      imports: [TestingModule],
      providers: [
        { provide: HistorizationService, useValue: historizationServiceSpy },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSnapshotMasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize master data descriptor on ngOnInit', () => {
    const mockMasterDataSnapshot: MasterDataSnapshot = { snapshots: [] };
    component.data = {
      masterDataDescriptor: { type: 'Brand', fieldType: 'BrandId', fieldValue: 'MB' , historyDate: '2024-01-01'}
    };
    historizationServiceSpy.getMasterDataBrand.mockReturnValue(of(mockMasterDataSnapshot));

    component.ngOnInit();

    expect(historizationServiceSpy.getMasterDataBrand).toHaveBeenCalledWith('MB', '2024-01-01');
    expect(component.detailMasterData).toEqual({"snapshots": []});
  });

  // ... (previous setup code)

  describe('DetailSnapshotMasterDataComponent', () => {
    // ... (previous beforeEach setup)

    // Test for ngOnDestroy
    it('should complete the unsubscribe subject on destroy', () => {
      const nextSpy = jest.spyOn(component['unsubscribe'], 'next');
      const completeSpy = jest.spyOn(component['unsubscribe'], 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    // Test for cancel method
    it('should close the dialog with false when cancel is called', () => {
      component.cancel();

      expect(matDialogRefSpy.close).toHaveBeenCalledWith(false);
    });

    // Test for translateDialogTitle method
    it('should translate the dialog title for Brand type', () => {
      const title = component.translateDialogTitle('Brand');

      expect(title).toEqual('HISTORY_OF_BRAND');
    });

    // Test for translateMasterData method
    it('should translate master data for Brand type', () => {
      const masterDataBrands = { brands: [{ eventName: 'BrandCreated', occurredOn: new Date() }] };
      const translatedEventName = "BRAND_CREATED";

      component.translateMasterData('Brand', masterDataBrands as unknown as MasterDataSnapshot);

      expect(masterDataBrands.brands[0].eventName).toEqual(translatedEventName);
    });
  });
});
