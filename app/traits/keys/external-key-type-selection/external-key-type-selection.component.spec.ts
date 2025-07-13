import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Spy, createSpyFromClass } from 'jest-auto-spies';

import { TestingModule } from '../../../testing/testing.module';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';

import { ExternalKeyTypeSelectionComponent } from './external-key-type-selection.component';
import { ExternalKeyTypeService } from './external-key-type.service';
import { TranslateDataPipe } from '../../../shared/pipes/translate-data/translate-data.pipe';
@Component({
  template: '<gp-external-key-type [control]="control"></gp-external-key-type>'
})
class TestComponent {
  @ViewChild(ExternalKeyTypeSelectionComponent)
  public externalKeyTypeSelection: ExternalKeyTypeSelectionComponent;
  control = new UntypedFormControl([]);
}

describe('ExternalKeyTypeSelectionComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let externalKeyTypeServiceSpy: Spy<ExternalKeyTypeService>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;

  beforeEach(waitForAsync(() => {
    externalKeyTypeServiceSpy = createSpyFromClass(ExternalKeyTypeService);
    externalKeyTypeServiceSpy.getAll.nextWith([]);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
    userSettingsServiceSpy.getLanguageId.nextWith('en');

    TestBed.configureTestingModule({
      declarations: [ExternalKeyTypeSelectionComponent, TestComponent, TranslateDataPipe],
      imports: [MatSelectModule, ReactiveFormsModule, NoopAnimationsModule, TestingModule],
      providers: [
        { provide: ExternalKeyTypeService, useValue: externalKeyTypeServiceSpy },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('availableExternalKeyTypes', () => {
    it('should contain external key type values', () => {
      const expectedTypes = [
        {
          id: 'COFICO01',
          name: 'Cofico System ID 1',
          maxValueLength: 256,
          description: 'Description For COFICO01'
        }
      ];
      externalKeyTypeServiceSpy.getAll.nextWith(expectedTypes);
      expect(component.externalKeyTypeSelection.availableExternalKeys).toEqual(expectedTypes);
    });
  });
});
