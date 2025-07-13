import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { GroupedFiltersComponent } from './grouped-filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgStringPipesModule } from 'ngx-pipes';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { FilterOption, TypedFilterOption } from '../../models/filter-option.model';
import { FilterType } from '../../models/filter-type.model';
import { FilterGroup } from '../../models/filter-group.model';

describe('GroupedFiltersComponent', () => {
  let component: GroupedFiltersComponent;
  let fixture: ComponentFixture<GroupedFiltersComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [OverlayModule, TranslateModule.forRoot(), NgStringPipesModule, PipesModule],
        declarations: [GroupedFiltersComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  describe('emitSelectedFilterGroup', () => {
    it('should emit a filter select event', () => {
      jest.spyOn(component.filterSelect, 'emit');
      component.filterOptions = [
        new TypedFilterOption(
          new FilterOption({
            value: 'any filter',
            group: FilterGroup.OUTLET
          }),
          FilterType.TAG
        )
      ];
      const expectedFilterGroup = new TypedFilterOption(
        new FilterOption({
          value: 'outlet',
          group: FilterGroup.OUTLET
        }),
        FilterType.TAG
      );

      component.emitSelectedFilterGroup();
      expect(component.filterSelect.emit).toHaveBeenCalledWith(expectedFilterGroup);
    });
  });
});
