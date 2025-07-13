import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject, of } from 'rxjs';

import { TestingModule } from '../../../../testing/testing.module';
import { BusinessNameTableService } from '../../../../traits/business-names/business-name-table/business-name-table.service';
import { GroupedBusinessName } from '../../../../traits/business-names/business-names.model';
import { BusinessNamesService } from '../../../../traits/business-names/business-names.service';
import { GroupedKey } from '../../../../traits/keys/key.model';
import { KeyTableService } from '../../../../traits/keys/key-table/key-table.service';
import { KeyType } from '../../../../traits/keys/key-type.model';
import { KeysService } from '../../../../traits/keys/keys.service';
import { AssignedBrandLabelTableService } from '../../../../traits/label/assigned-brand-labels/assigned-brand-label-table/assigned-brand-label-table.service';
import { AssignedBrandLabelsService } from '../../../../traits/label/assigned-brand-labels/assigned-brand-labels.service';

import { BrandCodeSyncMessageComponent } from './brand-code-sync-message.component';

describe('BrandCodeSyncMessageComponent', () => {
  let component: BrandCodeSyncMessageComponent;
  let fixture: ComponentFixture<BrandCodeSyncMessageComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let businessNameTableServiceSpy: Spy<BusinessNameTableService>;
  let assignedBrandLabelTableServiceSpy: Spy<AssignedBrandLabelTableService>;
  let keyTableServiceSpy: Spy<KeyTableService>;
  let keysServiceSpy: Spy<KeysService>;
  let businessNamesService: Spy<BusinessNamesService>;
  let assignedBrandLabelsService: Spy<AssignedBrandLabelsService>;
  let translateServiceSpy: Spy<TranslateService>;

  const routerStub = {
    events: new BehaviorSubject<any>(null)
  };

  beforeEach(
    waitForAsync(() => {
      matDialogSpy = createSpyFromClass(MatDialog);
      translateServiceSpy = createSpyFromClass(TranslateService);
      keyTableServiceSpy = createSpyFromClass(KeyTableService);
      businessNameTableServiceSpy = createSpyFromClass(BusinessNameTableService);
      assignedBrandLabelTableServiceSpy = createSpyFromClass(AssignedBrandLabelTableService);
      keysServiceSpy = createSpyFromClass(KeysService);
      businessNamesService = createSpyFromClass(BusinessNamesService);
      assignedBrandLabelsService = createSpyFromClass(AssignedBrandLabelsService);

      keyTableServiceSpy.saveKeys.nextWith(false);
      businessNameTableServiceSpy.saveNames.nextWith(false);
      assignedBrandLabelTableServiceSpy.saveAssignedLabels.nextWith(false);
      translateServiceSpy.get.nextWith('');

      TestBed.configureTestingModule({
        imports: [TestingModule],
        declarations: [BrandCodeSyncMessageComponent],
        providers: [
          { provide: MatDialog, useValue: matDialogSpy },
          { provide: KeyTableService, useValue: keyTableServiceSpy },
          { provide: BusinessNameTableService, useValue: businessNameTableServiceSpy },
          { provide: AssignedBrandLabelTableService, useValue: assignedBrandLabelTableServiceSpy },
          { provide: KeysService, useValue: keysServiceSpy },
          { provide: BusinessNamesService, useValue: businessNamesService },
          { provide: AssignedBrandLabelsService, useValue: assignedBrandLabelsService },
          { provide: TranslateService, useValue: translateServiceSpy },
          { provide: Router, useValue: routerStub }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandCodeSyncMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should show the message when no brand code is set', fakeAsync(() => {
      keysServiceSpy.get.nextWith([]);
      businessNamesService.get.nextWith([]);
      assignedBrandLabelsService.getBrandLabelAssignments.nextWith([]);

      component.businessSiteId = of('GS1');
      component.ngOnInit();

      fixture.detectChanges();

      tick(500);

      expect(component.show).toBeTruthy();
    }));

    it('should show the message when brand code is set but does not contain all other brands', fakeAsync(() => {
      keysServiceSpy.get.nextWith([
        new GroupedKey(KeyType.BRAND_CODE, '2211', [
          { brandId: 'MB', readonly: false },
          { brandId: 'FUSO', readonly: false }
        ])
      ]);
      businessNamesService.get.nextWith([
        new GroupedBusinessName(
          'Business Name 1',
          [
            { brandId: 'MB', readonly: false },
            { brandId: 'SMT', readonly: false }
          ],
          {
            'en-EN': 'My translated name 1'
          }
        )
      ]);
      assignedBrandLabelsService.getBrandLabelAssignments.nextWith([]);

      component.businessSiteId = of('GS1');
      component.ngOnInit();

      fixture.detectChanges();

      tick(500);

      expect(component.show).toBeTruthy();
    }));

    it('should hide the message when brand code is set with all required brands', fakeAsync(() => {
      keysServiceSpy.get.nextWith([
        new GroupedKey(KeyType.BRAND_CODE, '2211', [
          { brandId: 'MB', readonly: false },
          { brandId: 'FUSO', readonly: false },
          { brandId: 'SMT', readonly: false }
        ]),
      ]);
      businessNamesService.get.nextWith([
        new GroupedBusinessName(
          'Business Name 1',
          [
            { brandId: 'MB', readonly: false },
            { brandId: 'SMT', readonly: false }
          ],
          {
            'en-EN': 'My translated name 1'
          }
        )
      ]);
      assignedBrandLabelsService.getBrandLabelAssignments.nextWith([]);

      component.businessSiteId = of('GS1');
      component.ngOnInit();

      fixture.detectChanges();

      tick(500);

      expect(component.show).toBeFalsy();
    }));
  });
});
