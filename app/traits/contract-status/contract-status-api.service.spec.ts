import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';

import { ContractStatusApiService } from './contract-status-api.service';
import { getContractStatusResponse } from './contract-status-response.mock';
import { ContractStatus } from './contract-status.model';

describe('Contract Status API service test suite', () => {
  let contractStatusApiService: ContractStatusApiService;
  const businessSiteId = 'GS00000001';
  const contractStatus: ContractStatus = {
    items: [
      {
        brandId: 'MB',
        required: true,
        languageId: 'de',
        disclosures: 'mein geheimnis',
        status: 'aktualisiert'
      },
      {
        brandId: 'SMT',
        required: false
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractStatusApiService, ApiService, LoggingService],
      imports: [TestingModule]
    });

    contractStatusApiService = TestBed.inject(ContractStatusApiService);
  });

  test('should create', () => {
    expect(contractStatusApiService).toBeTruthy();
  });

  describe('loadContractStatus should', () => {
    test('return contract status', done => {
      contractStatusApiService.loadContractStatus(businessSiteId).subscribe(response => {
        expect(response).toEqual(getContractStatusResponse());
        done();
      });
    });
  });

  describe('loadContractStatus should load empty list', () => {
    test('return contract status', done => {
      contractStatusApiService.loadContractStatus('GS00000003').subscribe(response => {
        expect(response).toEqual({ items: [] });
        done();
      });
    });
  });

  describe('updateContractStatus should', () => {
    test('update contract status', done => {
      contractStatusApiService
        .updateContractStatus(businessSiteId, contractStatus)
        .subscribe(response => {
          expect(response.status).toEqual('UPDATED');
          done();
        });
    });
  });
});
