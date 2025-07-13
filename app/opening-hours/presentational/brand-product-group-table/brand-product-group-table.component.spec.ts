import { WeekDay } from '@angular/common';
import { Component, EventEmitter, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { clone } from 'ramda';

import { TestingModule } from '../../../testing/testing.module';
import { OpeningHourConvertion } from '../../brand-product-group/brand-product-group-opening-hours';
import { WeekDayOpeningHours } from '../../models/opening-hour.model';
import { Hours } from '../../store/reducers';

import { BrandProductGroupTableComponent } from './brand-product-group-table.component';
import { GroupedOpeningHourColumn } from './grouped-opening-hour-column.model';

const headerColumnsMock: GroupedOpeningHourColumn[] = [
  {
    columnDef: 'MBPC,VAN,BUS,TRUCK',
    brandId: 'MB',
    productGroups: [],
    cell: () => {
      return {};
    },
    isLastOfBrand: false,
    isEnabled: false
  }
];

const brandProductGroupsMock: Hours = {
  standardOpeningHours: [
    {
      brandId: 'MB',
      productGroupIds: ['PC', 'VAN', 'BUS', 'TRUCK'],
      openingHours: [
        { weekDay: WeekDay.Monday, times: [{ begin: '10:00', end: '19:00' }], closed: false },
        { weekDay: WeekDay.Tuesday, times: [{ begin: '08:00', end: '17:00' }], closed: false },
        { weekDay: WeekDay.Wednesday, times: [{ begin: '09:00', end: '17:00' }], closed: false },
        { weekDay: WeekDay.Thursday, times: [{ begin: '09:00', end: '16:00' }], closed: false },
        { weekDay: WeekDay.Friday, times: [{ begin: '09:00', end: '17:00' }], closed: false }
      ]
    },
    {
      brandId: 'MB',
      productGroupIds: ['UNIMOG'],
      openingHours: [
        { weekDay: WeekDay.Thursday, times: [{ begin: '09:00', end: '18:00' }], closed: false }
      ]
    }
  ],
  specialOpeningHours: []
};
@Component({
  template:
    '<gp-brand-product-group-table [groupedOpeningHourColumns]="groupedOpeningHourColumns" ' +
    '[weekdaysOpeningHours]="weekdaysOpeningHours"></gp-brand-product-group-table>'
})
class TestBrandProductGroupTableComponent {
  @ViewChild(BrandProductGroupTableComponent)
  public brandProductGroupTable: BrandProductGroupTableComponent;

  groupedOpeningHourColumns: GroupedOpeningHourColumn[] = headerColumnsMock;

  weekdaysOpeningHours: WeekDayOpeningHours[] = OpeningHourConvertion.convertToWeekDaysOpeningHours(
    brandProductGroupsMock,
    false,
    ['MB', 'SMT', 'STR', 'FUSO', 'THB', 'BAB', 'FTL', 'WST', 'STG', 'THB', 'MYB']
  );

  weekdaysOpeningHoursChange = new EventEmitter<WeekDayOpeningHours[]>();
}

describe('BrandProductGroupTableComponents', () => {
  let component: TestBrandProductGroupTableComponent;
  let fixture: ComponentFixture<TestBrandProductGroupTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BrandProductGroupTableComponent, TestBrandProductGroupTableComponent],
      imports: [
        MatTableModule,
        ReactiveFormsModule,
        FormsModule,
        TestingModule,
        MatFormFieldModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBrandProductGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init form and update columns if isEnabled is updated', () => {
    expect(component.brandProductGroupTable.columns).toEqual(headerColumnsMock);

    const updatedHeaderColumnsMock = clone(headerColumnsMock);
    updatedHeaderColumnsMock[0].isEnabled = true;

    component.groupedOpeningHourColumns = updatedHeaderColumnsMock;

    const brandProductGroupTableComponent = component.brandProductGroupTable;

    spyOn(brandProductGroupTableComponent, 'ngOnChanges').and.callThrough();
    fixture.detectChanges();
    expect(brandProductGroupTableComponent.ngOnChanges).toHaveBeenCalled();

    expect(component.brandProductGroupTable.columns).toEqual(updatedHeaderColumnsMock);
  });

  it('should init form and update columns if something is updated', () => {
    expect(component.brandProductGroupTable.columns).toEqual(headerColumnsMock);

    const updatedHeaderColumnsMock = clone(headerColumnsMock);
    updatedHeaderColumnsMock[0].productGroups = [
      {
        id: 'MBPC',
        hasMoveLeftAction: false,
        hasMoveRightAction: false
      }
    ];

    component.groupedOpeningHourColumns = updatedHeaderColumnsMock;

    const brandProductGroupTableComponent = component.brandProductGroupTable;

    spyOn(brandProductGroupTableComponent, 'ngOnChanges').and.callThrough();
    fixture.detectChanges();
    expect(brandProductGroupTableComponent.ngOnChanges).toHaveBeenCalled();

    expect(component.brandProductGroupTable.columns).toEqual(updatedHeaderColumnsMock);
  });

  it('should not init form if nothing is updated', () => {
    expect(component.brandProductGroupTable.columns).toEqual(headerColumnsMock);

    const updatedHeaderColumnsMock = clone(headerColumnsMock);

    component.groupedOpeningHourColumns = updatedHeaderColumnsMock;

    const brandProductGroupTableComponent = component.brandProductGroupTable;

    spyOn(brandProductGroupTableComponent, 'ngOnChanges').and.callThrough();
    fixture.detectChanges();
    expect(brandProductGroupTableComponent.ngOnChanges).toHaveBeenCalled();

    expect(component.brandProductGroupTable.columns).toEqual(headerColumnsMock);
  });
});
