import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RegionalCenterTableComponent } from './regional-center-table.component';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';

describe('RegionalCenterTableComponent', () => {
  let component: RegionalCenterTableComponent;
  let fixture: ComponentFixture<RegionalCenterTableComponent>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;

  beforeEach(
    waitForAsync(() => {
      userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
      TestBed.configureTestingModule({
        declarations: [RegionalCenterTableComponent],
        providers: [{ provide: UserSettingsService, useValue: userSettingsServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionalCenterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
