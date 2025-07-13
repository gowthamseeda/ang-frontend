import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { ValidityEnum } from '../../services/master-close-down-reasons/master-close-down-reason.model';

import { ChipsSelectionComponent } from './chips-selection.component';
import { getChipsMock } from './chips-selection.mock';
import { TestingModule } from '../../../testing/testing.module';

@Component({
  template:
    '<gp-chips-selection ' +
    '[control]="control" ' +
    '[itemList]="itemList">' +
    '</gp-chips-selection>'
})
class TestComponent {
  @ViewChild(ChipsSelectionComponent)
  public chipsSelection: ChipsSelectionComponent;
  control = new FormControl([]);
}

describe('ChipsSelectionComponent', () => {
  const chipsMock = getChipsMock();
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let sortingServiceSpy: Spy<SortingService>;

  beforeEach(
    waitForAsync(() => {
      sortingServiceSpy = createSpyFromClass(SortingService);

      TestBed.configureTestingModule({
        declarations: [ChipsSelectionComponent, TestComponent],
        imports: [MatSelectModule, ReactiveFormsModule, NoopAnimationsModule, TestingModule],
        providers: [{ provide: SortingService, useValue: sortingServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.chipsSelection.itemList = getChipsMock();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getItem', () => {
    it('should return item', () => {
      const expectedItem = chipsMock.find(item => item.id === 'MB')!.name;
      expect(component.chipsSelection.getItem('MB')).toEqual(expectedItem);
    });

    it('should return item with id in bracket', () => {
      component.chipsSelection.isLanguage = true;
      const expectedItem = chipsMock.find(item => item.id === 'MB')!;
      expect(component.chipsSelection.getItem('MB')).toEqual(
        `${expectedItem.name} [${expectedItem.id}]`
      );
    });

    it('should return item for enum', () => {
      component.chipsSelection.itemEnum = ValidityEnum;
      expect(component.chipsSelection.getItem('COMPANY')).toEqual(ValidityEnum.COMPANY);
    });

    it('should return empty string', () => {
      expect(component.chipsSelection.getItem('NONE')).toMatch('');
    });
  });

  describe('valueOrder', () => {
    it('should return enum value in asc order', () => {
      expect(
        component.chipsSelection.valueOrder(
          { key: 'COMPANY', value: 'Company' },
          { key: 'BUSINESS_SITE', value: 'Outlet' }
        )
      ).toEqual(-1);
    });
  });

  describe('removeItem', () => {
    beforeEach(() => {
      component.chipsSelection.control.setValue(chipsMock);
    });

    it('should update brand selection control when removing item', () => {
      component.chipsSelection.removeItem('MB', new Event('click'));

      expect(component.chipsSelection.control.value).not.toContain('MB');
    });

    it('should do nothing when removing not selected item', () => {
      component.chipsSelection.removeItem('NOT_EXISTENT', new Event('click'));

      expect(component.chipsSelection.control.value).toEqual(chipsMock);
    });
  });
});
