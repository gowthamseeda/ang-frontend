import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapshotLegalContractStatusComponent } from './snapshot-legal-contract-status.component';
import {
  comparingContractStatusHistorySnapshotMock,
  contractStatusChangedFields,
  currentContractStatusHistorySnapshotMock
} from '../../models/contractStatus-history-snapshot.mock';
import { PipesModule } from '../../../shared/pipes/pipes.module';

describe('SnapshotLegalContractStatusComponent', () => {
  let component: SnapshotLegalContractStatusComponent;
  let fixture: ComponentFixture<SnapshotLegalContractStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnapshotLegalContractStatusComponent],
      imports: [PipesModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SnapshotLegalContractStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.currentContractStatuses = currentContractStatusHistorySnapshotMock;
    component.comparingContractStatuses = comparingContractStatusHistorySnapshotMock;
    component.changes = contractStatusChangedFields;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return data if field exist in contract status data', () => {
    const result = component.getFieldData(
      'companyRelationshipId',
      currentContractStatusHistorySnapshotMock[0]
    );

    expect(result).toEqual('MBAG');
  });

  it('should return undefined if field does not exist in contract status data', () => {
    const result = component.getFieldData(
      'languageId',
      currentContractStatusHistorySnapshotMock[0]
    );

    expect(result).toEqual(undefined);
  });

  it('should return comparing data if current contract status id is found', () => {
    const result = component.getComparingData(component.currentContractStatuses[2]);

    expect(result).toEqual(comparingContractStatusHistorySnapshotMock[1]);
  });

  it('should return undefined if current contract status id is not found', () => {
    const result = component.getComparingData(component.currentContractStatuses[1]);

    expect(result).toEqual(undefined);
  });

  it('should return false if current contract status and comparing contract status is same', () => {
    const result = component.isFieldChangedCompareWholeData(component.currentContractStatuses[2]);

    expect(result).toEqual(false);
  });

  it('should return true if current contract status and comparing contract status is not same', () => {
    const result = component.isFieldChangedCompareWholeData(component.currentContractStatuses[0]);

    expect(result).toEqual(true);
  });

  it('should return editor if changed field exists', () => {
    const result = component.getChangeEditor(component.currentContractStatuses[0].contractStatusKey);

    expect(result).toEqual('USER');
  });

  it('should return empty if changed field does not exists', () => {
    const result = component.getChangeEditor(component.currentContractStatuses[2].contractStatusKey);

    expect(result).toEqual('');
  });

  it('should return true if changed field exists', () => {
    const result = component.isChanged(component.currentContractStatuses[0].contractStatusKey);

    expect(result).toEqual(true);
  });

  it('should return false if changed field does not exists', () => {
    const result = component.isChanged(component.currentContractStatuses[2].contractStatusKey);

    expect(result).toEqual(false);
  });

  it('should return data if field exist in comparing contract status data', () => {
    const result = component.getFieldDataFromComparingData(
      'brandId',
      currentContractStatusHistorySnapshotMock[0]
    );

    expect(result).toEqual('MB');
  });

  it('should return undefined if field does not exist in comparing contract status data', () => {
    const result = component.getFieldDataFromComparingData(
      'languageId',
      currentContractStatusHistorySnapshotMock[1]
    );

    expect(result).toEqual(undefined);
  });
});
