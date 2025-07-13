import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Spy } from 'jest-auto-spies';

import { TestingModule } from '../../../../testing/testing.module';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';
import { ServiceActionIconsComponent } from '../service-action-icons/service-action-icons.component';

import { MultiSelectServiceIconsComponent } from './multi-select-service-icons.component';

@Component({
  template:
    '<gp-multi-select-service-icons [serviceId]="serviceId"' +
    '[serviceSupportsClockAction]="serviceSupportsClockAction" ' +
    '[serviceTableRowHovered]="serviceTableRowHovered" ' +
    '[serviceTableSaved]="serviceTableSaved" ' +
    '[countryId]="countryId" ' +
    '[outletId]="outletId" ' +
    '[showUnmaintainedInfo]="showUnmaintainedInfo"></gp-multi-select-service-icons>'
})
class TestComponent {
  @ViewChild(MultiSelectServiceIconsComponent)
  public multiSelectServiceIconsComponent: MultiSelectServiceIconsComponent;
  serviceId = 100;
  serviceSupportsClockAction = false;
  serviceTableRowHovered = true;
  serviceTableSaved = false;
  countryId = 'DE';
  outletId = 'GS01';
  showUnmaintainedInfo = true;
}

describe('MultiSelectServiceIconsComponent', () => {
  let translateService: Spy<TranslateService>;
  let multiSelectDataService: Spy<MultiSelectDataService>;
  let matDialogSpy: Spy<MatDialog>;

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ServiceActionIconsComponent],
        providers: [
          { provide: TranslateService, useValue: translateService },
          { provide: MultiSelectDataService, useValue: multiSelectDataService },
          { provide: MatDialog, useValue: matDialogSpy }
        ],
        imports: [TestingModule, MatDialogModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
