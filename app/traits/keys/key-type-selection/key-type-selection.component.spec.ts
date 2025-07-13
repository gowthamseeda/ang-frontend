import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TestingModule } from '../../../testing/testing.module';
import { KeyType } from '../key-type.model';
import { KeysService } from '../keys.service';

import { KeyTypeSelectionComponent } from './key-type-selection.component';
import {MasterKeyService} from "../../../master/services/master-key/master-key.service";
import {SortingService} from "../../../shared/services/sorting/sorting.service";

@Component({
  template:
    '<gp-key-type-selection [control]="control" countryId="DE"' +
    ' [selectedKeyTypes]="selectedKeyTypes">' +
    '</gp-key-type-selection>'
})
class TestComponent {
  @ViewChild(KeyTypeSelectionComponent)
  public keyTypeSelection: KeyTypeSelectionComponent;
  control = new FormControl([]);
  selectedKeyTypes: string[] = [];
}

describe('KeyTypeSelectionComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let keysServiceSpy: Spy<KeysService>;
  let masterKeyServiceSpy: Spy<MasterKeyService>;
  let sortingServiceSpy: Spy<SortingService>;

  beforeEach(
    waitForAsync(() => {
      keysServiceSpy = createSpyFromClass(KeysService);
      keysServiceSpy.getUpdatableKeyTypesBy.nextWith([]);
      masterKeyServiceSpy = createSpyFromClass(MasterKeyService);
      masterKeyServiceSpy.getAll.nextWith([]);
      sortingServiceSpy = createSpyFromClass(SortingService);
      TestBed.configureTestingModule({
        declarations: [KeyTypeSelectionComponent, TestComponent],
        imports: [MatSelectModule, ReactiveFormsModule, NoopAnimationsModule, TestingModule],
        providers: [
          { provide: KeysService, useValue: keysServiceSpy },
          { provide: MasterKeyService, useValue: masterKeyServiceSpy },
          { provide: SortingService, useValue: sortingServiceSpy }
        ],
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

  describe('availableKeyTypes', () => {
    it('should contain updatable key type values', () => {
      const expectedTypes = [KeyType.BRAND_CODE];
      keysServiceSpy.getUpdatableKeyTypesBy.nextWith(expectedTypes);
      expect(component.keyTypeSelection.filteredKeyTypes).toEqual(expectedTypes);
    });

    it('should not contain already selected single select key types', () => {
      component.selectedKeyTypes = [KeyType.ALIAS as string];
      keysServiceSpy.getUpdatableKeyTypesBy.nextWith([KeyType.ALIAS, KeyType.BRAND_CODE]);
      fixture.detectChanges();

      expect(component.keyTypeSelection.filteredKeyTypes).toEqual([KeyType.BRAND_CODE]);
    });
  });
});
