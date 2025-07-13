import { mockCountry_DE } from './../../model/regional-center.mock';
// import { RegionalCenterState } from './../model/regional-center-state';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { RegionalCenterService } from '../../services/regional-center.service';
import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { CountryService } from '../../../../geography/country/country.service';
import { TestingModule } from '../../../../testing/testing.module';
import { NgxPermissionsService } from 'ngx-permissions';
import { mockedServiceResponse } from './view-regional-centers.service.mock';
import {
  mockCountry_NL,
  mockCountry_AF,
  mockRegionalCenter_GS0MRC001
} from '../../model/regional-center.mock';
import { ViewRegionalCentersComponentService } from './view-regional-centers.service';
import { RegionalCenterActionService } from '../../services/regional-center-action.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('ViewRegionalCentersComponentService', () => {
  let componentService: ViewRegionalCentersComponentService;
  let regionalCenterService: RegionalCenterService;
  let countryService: CountryService;
  let permissionServiceSpy: Spy<NgxPermissionsService>;

  beforeEach(waitForAsync(() => {
    permissionServiceSpy = createSpyFromClass(NgxPermissionsService);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ViewRegionalCentersComponentService,
        RegionalCenterService,
        RegionalCenterActionService,
        CountryService,
        ApiService,
        LoggingService,
        { provide: NgxPermissionsService, useValue: permissionServiceSpy },
        provideMockStore()
      ]
    });

    componentService = TestBed.inject(ViewRegionalCentersComponentService);
    regionalCenterService = TestBed.inject(RegionalCenterService);
    countryService = TestBed.inject(CountryService);

    jest
      .spyOn(regionalCenterService, 'getAll')
      .mockReturnValue(of([mockRegionalCenter_GS0MRC001()]));
    jest
      .spyOn(countryService, 'getAll')
      .mockReturnValue(of([mockCountry_NL, mockCountry_AF, mockCountry_DE]));
  }));

  test('initializes successful', () => {
    expect(regionalCenterService).toBeTruthy();
  });

  test('returns regional center information with country translations', done => {
    componentService.getAll().subscribe(response => {
      expect(response).toStrictEqual(mockedServiceResponse());
      done();
    });
  });
});
