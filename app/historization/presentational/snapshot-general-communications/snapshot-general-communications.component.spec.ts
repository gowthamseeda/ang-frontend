import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { TestingModule } from '../../../testing/testing.module';
import {
  comparingGeneralCommunicationsSnapshotEntriesMock,
  currentGeneralCommunicationsSnapshotEntriesMock
} from '../../models/general-communications-snapshot.mock';
import { CommunicationData } from '../../models/outlet-history-snapshot.model';

import { SnapshotGeneralCommunicationsComponent } from './snapshot-general-communications.component';

describe('SnapshotGeneralCommunicationsComponent', () => {
  let component: SnapshotGeneralCommunicationsComponent;
  let fixture: ComponentFixture<SnapshotGeneralCommunicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnapshotGeneralCommunicationsComponent],
      imports: [TestingModule, PipesModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshotGeneralCommunicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.currentGeneralCommunications =
      currentGeneralCommunicationsSnapshotEntriesMock.communicationData;
    component.comparingGeneralCommunications =
      comparingGeneralCommunicationsSnapshotEntriesMock.communicationData;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return previous field value if getFieldDataFromComparingData invoked and previous snapshot exists', () => {
    const communicationData: CommunicationData = {
      communicationFieldId: 'PHONE',
      value: '000-0000000'
    };

    const result = component.getFieldDataFromComparingData('value', communicationData);

    expect(result).toEqual('0123-45678');
  });

  it('should return undefined if getFieldDataFromComparingData invoked and previous snapshot doesnt exists', () => {
    const communicationData: CommunicationData = {
      communicationFieldId: 'EMAIL',
      brandId: 'MB',
      value: 'test@gmail.com'
    };

    const result = component.getFieldDataFromComparingData('value', communicationData);

    expect(result).toBeUndefined();
  });

  function findCommunicationData(communicationFieldId: string, brandId: string | null) {
    if (component.currentGeneralCommunications !== undefined) {
      if (brandId === null) {
        return component.currentGeneralCommunications.find(
          communicationData => communicationData.communicationFieldId === communicationFieldId
        );
      }
      return component.currentGeneralCommunications.find(
        communicationData =>
          communicationData.communicationFieldId === communicationFieldId &&
          communicationData.brandId === brandId
      );
    }
  }

  it('should return true for isChanged method if API return communicationData.{communicationFieldId} in the changes array', () => {
    spyOn(component, 'getSnapshotChangeData').and.returnValue({
      changedField: 'communicationData.PHONE',
      userId: 'USER'
    });
    const result = component.isChanged(findCommunicationData('PHONE', null)!!);

    expect(result).toEqual(true);
  });

  it('should return true for isChanged method if API return communicationData.{communicationFieldId}.{brandId} in the changes array', () => {
    spyOn(component, 'getSnapshotChangeData').and.returnValue({
      changedField: 'communicationData.PHONE.MB',
      userId: 'USER'
    });
    const result = component.isChanged(findCommunicationData('PHONE', 'MB')!!);

    expect(result).toEqual(true);
  });
});

///got change
// no previous snap - new -> undefined
//there is previous changes - update -> got previous change
