import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';

import { DistributionLevelComponent } from './distribution-level.component';

function getOutletFormMock() {
  return new FormBuilder().group({});
}

describe('DistributionLevelComponent', () => {
  let component: DistributionLevelComponent;
  let fixture: ComponentFixture<DistributionLevelComponent>;

  let distributionLevelServiceSpy: Spy<DistributionLevelsService>;

  beforeEach(
    waitForAsync(() => {
      distributionLevelServiceSpy = createSpyFromClass(DistributionLevelsService);
      distributionLevelServiceSpy.get.nextWith(['RETAILER']);

      TestBed.configureTestingModule({
        declarations: [DistributionLevelComponent, TranslatePipeMock],
        providers: [{ provide: DistributionLevelsService, useValue: distributionLevelServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionLevelComponent);
    component = fixture.componentInstance;
    component.parentForm = getOutletFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
