import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { TestingModule } from '../../../../testing/testing.module';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';
import { MultiSelectDataServiceMock } from '../../services/multi-select-service-data.service.mock';

import { MultiSelectActionsComponent } from './multi-select-actions.component';

describe('MultiSelectActionsComponent', () => {
  let component: MultiSelectActionsComponent;
  let fixture: ComponentFixture<MultiSelectActionsComponent>;

  let matDialogSpy: Spy<MatDialog>;
  let OfferedServiceServiceSpy: Spy<OfferedServiceService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  beforeEach(
    waitForAsync(() => {
      matDialogSpy = createSpyFromClass(MatDialog);
      OfferedServiceServiceSpy = createSpyFromClass(OfferedServiceService);
      distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);

      TestBed.configureTestingModule({
        declarations: [MultiSelectActionsComponent, TranslatePipeMock],
        imports: [TestingModule, CommonModule, BrowserModule],
        providers: [
          { provide: MatDialog, useValue: matDialogSpy },
          { provide: OfferedServiceService, useValue: OfferedServiceServiceSpy },
          { provide: DistributionLevelsService, useValue: distributionLevelsServiceSpy },
          { provide: UserAuthorizationService, useValue: userAuthorizationServiceSpy },
          { provide: MultiSelectDataService, useClass: MultiSelectDataServiceMock },
          { provide: MatDialogRef, useValue: {} },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              action: {
                icon: 'validity',
                tooltip: ''
              },
              outletId: 'GS01',
              serviceId: 120,
              countryId: 'DE'
            }
          }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
