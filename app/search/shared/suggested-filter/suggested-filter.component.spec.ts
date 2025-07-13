import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SuggestedFilterComponent } from './suggested-filter.component';
import { TypedFilterOption } from '../../models/filter-option.model';
import { FilterType } from '../../models/filter-type.model';
import { FilterGroup } from '../../models/filter-group.model';

describe('SuggestedFilterComponent', () => {
  let component: SuggestedFilterComponent;
  let fixture: ComponentFixture<SuggestedFilterComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SuggestedFilterComponent],
        imports: [TranslateModule.forRoot()],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getFilterOptions', () => {
    it('should get filter options of group BRANDS', () => {
      component.suggestedFilters = [
        { value: 'MB', type: FilterType.FLAG, group: FilterGroup.BRAND },
        { value: 'SMT', type: FilterType.FLAG, group: FilterGroup.BRAND },
        { value: 'active', type: FilterType.FLAG, group: FilterGroup.OUTLET }
      ];

      expect(component.getFilterOptionsBy(FilterGroup.OUTLET)).toEqual([
        component.suggestedFilters[2]
      ]);
    });
  });

  describe('emitSelectedFilter', () => {
    it('should emit a filter select event', () => {
      jest.spyOn(component.filterSelect, 'emit');
      const filter = new TypedFilterOption(
        { value: 'any filter', group: FilterGroup.OTHERS },
        FilterType.TAG
      );

      component.emitSelectedFilter(filter);
      expect(component.filterSelect.emit).toHaveBeenCalledWith(filter);
    });
  });
});
