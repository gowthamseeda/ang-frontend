import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PipesModule } from '../../../shared/pipes/pipes.module';

import { TestingModule } from '../../../testing/testing.module';

import { SnapshotAdditionalTranslationsComponent } from './snapshot-additional-translations.component';
import {
  additionalTranslationsChangedMock,
  additionalTranslationsNotChangedMock,
  comparingTranslationSnapshotMock,
  currentTranslationSnapshotMock,
  translationChangesMock
} from '../../models/translation-history-snapshot-mock';
import { MatDialog } from "@angular/material/dialog";
import { Spy, createSpyFromClass } from "jest-auto-spies";
import { FeatureToggleService } from "../../../shared/directives/feature-toggle/feature-toggle.service";

describe('SnapshotAdditionalTranslationsComponent', () => {
  let component: SnapshotAdditionalTranslationsComponent;
  let fixture: ComponentFixture<SnapshotAdditionalTranslationsComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  const japanKey = 'ja-JP';

  beforeEach(waitForAsync(() => {
    matDialogSpy = createSpyFromClass(MatDialog);
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);

    TestBed.configureTestingModule({
      declarations: [SnapshotAdditionalTranslationsComponent],
      imports: [TestingModule, PipesModule],
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
    fixture = TestBed.createComponent(SnapshotAdditionalTranslationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.changes = translationChangesMock;
    component.currentAdditionalTranslations = currentTranslationSnapshotMock;
    component.comparingAdditionalTranslations = comparingTranslationSnapshotMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isFieldChanged', () => {
    it('should return false if changes is undefined', () => {
      component.changes = undefined;

      const changed = component.isFieldChanged(japanKey, 'state');

      expect(changed).toBeFalsy();
    });

    it('should return false if changes DOES NOT contains the fieldName', () => {
      const changed = component.isFieldChanged(japanKey, 'state');

      expect(changed).toBeFalsy();
    });

    it('should return true if changes contains the fieldName', () => {
      const changed = component.isFieldChanged(japanKey, 'legalName');

      expect(changed).toBeTruthy();
    });

    it('should return true if changes contains the fieldName (businessNames)', () => {
      const changed = component.isFieldChanged(japanKey, 'businessNames');

      expect(changed).toBeTruthy();
    });
  });

  describe('getChangedEditor', () => {
    it('should return empty string if changes is undefined', () => {
      component.changes = undefined;

      const editor = component.getChangeEditor(japanKey, 'state');

      expect(editor).toEqual('');
    });

    it('should return empty string if changes DOES NOT contains the field name', () => {
      const editor = component.getChangeEditor(japanKey, 'state');

      expect(editor).toEqual('');
    });

    it('should return editor if changes contains the fieldName', () => {
      const editor = component.getChangeEditor(japanKey, 'address.street');

      expect(editor).toEqual('USER 1');
    });

    it('should return editor if changes contains the fieldName (businessNames)', () => {
      const editor = component.getChangeEditor(japanKey, 'businessNames');

      expect(editor).toEqual('USER 4');
    });
  });

  describe('displayFieldValueBasedOnToggle', () => {
    it('should return current data if displayChangesToggleInput is toggled off', () => {
      component.displayChangesToggleInput = false;

      const concatPrevValue = component.displayFieldValueBasedOnToggle(japanKey, 'legalName');

      expect(concatPrevValue).toEqual('Test JP Legal Name Curr');
    });

    it('should return current data if the field is not changed AND displayChangesToggleInput is toggled on', () => {
      component.displayChangesToggleInput = true;

      const concatPrevValue = component.displayFieldValueBasedOnToggle(
        japanKey,
        'address.district'
      );

      expect(concatPrevValue).toEqual('Test JP District');
    });

    it('should return previous value + current data if displayChangesToggleInput is toggled on AND the field is changed ', () => {
      component.displayChangesToggleInput = true;

      const concatPrevValue = component.displayFieldValueBasedOnToggle(japanKey, 'province');

      expect(concatPrevValue).toEqual('[Test JP Province Prev] => [Test JP Province Curr]');
    });
  });

  describe('displayBusinessNameFieldValueBasedOnToggle', () => {
    it('should return current data if displayChangesToggleInput is toggled off', () => {
      component.displayChangesToggleInput = false;
      const currentBusinessNameData =
        component.currentAdditionalTranslations[japanKey].businessNames?.[0];

      if (currentBusinessNameData) {
        const concatPrevValue = component.displayBusinessNameFieldValueBasedOnToggle(
          japanKey,
          'businessName',
          currentBusinessNameData
        );

        expect(concatPrevValue).toEqual('Test Business Name Curr');
      }
    });

    it('should return current data if the field is not changed AND displayChangesToggleInput is toggled on', () => {
      component.displayChangesToggleInput = true;
      component.isFieldChanged = jest.fn().mockReturnValue(false);
      const currentBusinessNameData =
        component.currentAdditionalTranslations[japanKey].businessNames?.[0];

      if (currentBusinessNameData) {
        const concatPrevValue = component.displayBusinessNameFieldValueBasedOnToggle(
          japanKey,
          'brandId',
          currentBusinessNameData
        );

        expect(concatPrevValue).toEqual('SMT');
      }
    });

    it('should return previous value + current data if displayChangesToggleInput is toggled on AND the field is changed ', () => {
      component.displayChangesToggleInput = true;

      const currentBusinessNameData =
        component.currentAdditionalTranslations[japanKey].businessNames?.[0];

      if (currentBusinessNameData) {
        const concatPrevValue = component.displayBusinessNameFieldValueBasedOnToggle(
          japanKey,
          'businessName',
          currentBusinessNameData
        );

        expect(concatPrevValue).toEqual('[Test Business Name Prev] => [Test Business Name Curr]');
      }
    });
  });

  describe('Get Compatible Business Name Comparing Data', () => {
    it('should return comparing data if compatible', () => {
      const currentBusinessNameData =
        component.currentAdditionalTranslations[japanKey].businessNames?.[0];
      const comparingBusinessNameData =
        component.comparingAdditionalTranslations?.[japanKey].businessNames?.[0];

      if (currentBusinessNameData) {
        const resultComparingData = component.getBusinessNameCurrentComparingData(
          currentBusinessNameData,
          japanKey
        );

        expect(resultComparingData).toEqual(comparingBusinessNameData);
      }
    });
  });

  describe('isAdditionalTranslationsFieldChanged', () => {
    it('should return true if any of the field is true', () => {
      const changed = component.isAdditionalTranslationsFieldChanged(
        additionalTranslationsChangedMock
      );

      expect(changed).toBeTruthy();
    });

    it('should return false if all of the field is false', () => {
      const changed = component.isAdditionalTranslationsFieldChanged(
        additionalTranslationsNotChangedMock
      );

      expect(changed).toBeFalsy();
    });
  });
});
