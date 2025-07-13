import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject } from 'rxjs';

import { TestingModule } from '../../../testing/testing.module';
import { outletSnapshotEntriesMock } from '../../models/outlet-history-snapshot.mock';
import { HistorizationService } from '../../service/historization.service';
import { OutletHistoryComponent } from './outlet-history.component';

const activatedRouteStub = {
  paramMap: new BehaviorSubject(convertToParamMap({ outletId: 'GS00000001' }))
};

describe('OutletHistoryComponent', () => {
  let component: OutletHistoryComponent;
  let fixture: ComponentFixture<OutletHistoryComponent>;
  let historizationServiceSpy: Spy<HistorizationService>;

  beforeEach(waitForAsync(() => {
    historizationServiceSpy = createSpyFromClass(HistorizationService);
    historizationServiceSpy.get.nextWith({ groups: outletSnapshotEntriesMock });

    TestBed.configureTestingModule({
      declarations: [OutletHistoryComponent],
      imports: [TestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: HistorizationService, useValue: historizationServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on outletId changed', () => {
    it('should update outletId', () => {
      const newOutletId = 'GS00000002';
      jest.spyOn(component, 'onDateSelected');
      component.selectedDate = '2022-01-02';

      activatedRouteStub.paramMap.next(convertToParamMap({ outletId: newOutletId }));

      expect(component.outletId).toEqual(newOutletId);
    });
  });

  describe('onDateSelected', () => {
    it('should set selected date', () => {
      component.onDateSelected('2022-01-02');
      expect(component.selectedDate).toBe('2022-01-02');
    });

    it('should find and set selected snapshot entry', () => {
      const selectedDate = '2022-01-02';
      const expectData = outletSnapshotEntriesMock.find(entry => entry.group === selectedDate);

      component.onDateSelected(selectedDate);
      expect(component.selectedSnapshotEntry).toBe(expectData);
    });

    it('should find one entry before selected date and set comparing snapshot entry', () => {
      const selectedDate = '2022-01-02';
      const expectData = outletSnapshotEntriesMock.find(entry => entry.group === '2022-01-01');

      component.onDateSelected(selectedDate);
      expect(component.comparingSnapshotEntry).toBe(expectData);
    });
  });
});
