import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../../testing/testing.module';

import { getHistoriesMock } from './history.mock';
import { Histories } from './history.model';
import { HistoryService } from './history.service';

describe('FocusLogService', () => {
  let service: HistoryService;
  let historiesMock: Histories;

  let apiService: ApiService;

  beforeEach(() => {
    historiesMock = getHistoriesMock();

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, HistoryService]
    });
    service = TestBed.inject(HistoryService);
    apiService = TestBed.inject(ApiService);
  });

  it('should create ', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get log for a user', done => {
      let url = 'URL';
      let userId = 'JONAS';
      let historyUrlCall = jest
        .spyOn(service, 'getUserDataRestrictionsHistoryUrl')
        .mockReturnValue(url);
      let apiServiceGetCall = jest.spyOn(apiService, 'get').mockReturnValue(of(historiesMock));

      service.get(userId).subscribe(histories => {
        expect(historyUrlCall).toHaveBeenCalledWith(userId);
        expect(apiServiceGetCall).toHaveBeenCalledWith(url);
        expect(histories).toEqual(historiesMock);
        done();
      });
    });
  });
});
