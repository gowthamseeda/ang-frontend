import { OverlayModule } from '@angular/cdk/overlay';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TooltipDefaultPipeMock } from '../../../../testing/pipe-mocks/tooltipDefault';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';

import { ServiceCellToggleComponent } from './service-cell-toggle.component';
import { ServiceVariantMock } from '../../../service-variant/service-variant.mock';

describe('OfferedServiceToggleComponent', () => {
  let component: ServiceCellToggleComponent;
  let fixture: ComponentFixture<ServiceCellToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule],
      declarations: [ServiceCellToggleComponent, TranslatePipeMock, TooltipDefaultPipeMock],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCellToggleComponent);
    component = fixture.componentInstance;

    component.userHasPermissions = true;
    component.serviceVariant = ServiceVariantMock.asList()[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
