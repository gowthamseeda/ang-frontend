import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { UserDataRestrictionMapperService } from '../../shared/services/user-data-restriction-mapper/user-data-restriction-mapper.service';
import {
  getHistoriesMock,
  getHistoryWithAssignedRestrictionsMock
} from '../services/history/history.mock';
import { History } from '../services/history/history.model';
import { HistoryService } from '../services/history/history.service';
import { DataRestrictionType } from '../services/user-data-restrictions/data-restrictions-type.model';

import { HistoryComponent } from './history.component';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  let historyServiceSpy: Spy<HistoryService>;
  let userDataRestrictionMapperService: Spy<UserDataRestrictionMapperService>;

  beforeEach(
    waitForAsync(() => {
      historyServiceSpy = createSpyFromClass(HistoryService);
      userDataRestrictionMapperService = createSpyFromClass(UserDataRestrictionMapperService);

      TestBed.configureTestingModule({
        declarations: [HistoryComponent, TranslatePipeMock],
        imports: [NoopAnimationsModule, RouterTestingModule.withRoutes([])],
        providers: [
          { provide: HistoryService, useValue: historyServiceSpy },
          { provide: UserDataRestrictionMapperService, useValue: userDataRestrictionMapperService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initLog', () => {
    it('should initialize log', done => {
      jest.spyOn(historyServiceSpy, 'get').mockReturnValue(of(getHistoriesMock()));

      component.initLog();

      expect(historyServiceSpy.get).toHaveBeenCalled();
      expect(userDataRestrictionMapperService.getDataRestrictionValues).toHaveBeenCalled();
      done();
    });
  });

  describe('getAssignedDataRestrictions from History', () => {
    it('should return formatted assignedDataRestrictions from given snapshot history', () => {
      let history = getHistoryWithAssignedRestrictionsMock();
      let getDataRestrictionCall = jest.spyOn(component, 'getDataRestrictionFrom').mockImplementation(
        function (snapshot: History, dataRestrictionType: DataRestrictionType) {
          for (let type in DataRestrictionType) {
            if (DataRestrictionType[type] === dataRestrictionType) {
              return history.assignedDataRestrictions[dataRestrictionType];
            }
          }
          return [];
        }
      );


      let result = component.getAssignedDataRestrictions(history);

      for (let type in DataRestrictionType) {
        if (DataRestrictionType[type] === DataRestrictionType.FOCUSPRODUCTGROUP) {
          expect(getDataRestrictionCall).not.toHaveBeenCalledWith(
            history,
            DataRestrictionType[type]
          );
        } else {
          expect(getDataRestrictionCall).toHaveBeenCalledWith(history, DataRestrictionType[type]);
        }
      }
      expect(result.productGroupDataRestrictions).toEqual(
        history.assignedDataRestrictions[DataRestrictionType.PRODUCTGROUP]
      );
    });
  });

  describe('getDataRestrictionFrom from History based on DataRestrictionType', () => {
    it('should use userDataRestrictionMapperService and return the data restriction values ', done => {
      let history = getHistoryWithAssignedRestrictionsMock();
      let dataRestrictionType = DataRestrictionType.PRODUCTGROUP;
      let dataRestrictions = history.assignedDataRestrictions[dataRestrictionType];
      jest.spyOn(userDataRestrictionMapperService, 'getDataRestrictionValues').mockReturnValue(
        dataRestrictions
      );

      let result = component.getDataRestrictionFrom(history, dataRestrictionType);

      expect(userDataRestrictionMapperService.getDataRestrictionValues).toHaveBeenCalledWith(
        history.assignedDataRestrictions,
        dataRestrictionType
      );
      expect(result).toEqual(dataRestrictions);
      done();
    });
  });
});
