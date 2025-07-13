import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { AppStoreModule } from '../../../store/app-store.module';
import { TestingModule } from '../../../testing/testing.module';
import { getMasterCountriesActivationMock } from '../../services/master-country-activation/master-country-activation.mock';
import { MasterCountryActivationService } from '../../services/master-country-activation/master-country-activation.service';
import {
  getMasterCountryTraitsMock,
  getMasterCountryTraitsUKMock
} from '../../services/master-country-traits/master-country-traits.mock';
import { MasterCountryTraitsService } from '../../services/master-country-traits/master-country-traits.service';
import { getDECountryFormMock, getUKCountryFormMock } from '../country-form.mock';

import {
  getMasterCountryDEMock,
  getMasterCountryUKMock,
  MasterCountryMock
} from './master-country.mock';
import { MasterCountry } from './master-country.model';
import { MasterCountryModule } from './master-country.module';
import { MasterCountryService } from './master-country.service';
import { MasterCountryCollectionService } from './store/master-country-collection.service';

describe('MasterCountryService', () => {
  const countryMock = MasterCountryMock.asList();
  let service: MasterCountryService;

  let sortingServiceSpy: Spy<SortingService>;
  let masterCountryCollectionService: MasterCountryCollectionService;

  let countryTraitsServiceSpy: Spy<MasterCountryTraitsService>;
  let countryActivationServiceSpy: Spy<MasterCountryActivationService>;

  beforeEach(() => {
    sortingServiceSpy = createSpyFromClass(SortingService);
    countryTraitsServiceSpy = createSpyFromClass(MasterCountryTraitsService);
    countryActivationServiceSpy = createSpyFromClass(MasterCountryActivationService);

    TestBed.configureTestingModule({
      imports: [TestingModule, MasterCountryModule, AppStoreModule],
      providers: [
        MasterCountryService,
        ApiService,
        LoggingService,
        MasterCountryCollectionService,
        { provide: SortingService, useValue: sortingServiceSpy },
        { provide: MasterCountryTraitsService, useValue: countryTraitsServiceSpy },
        { provide: MasterCountryActivationService, useValue: countryActivationServiceSpy }
      ]
    });

    masterCountryCollectionService = TestBed.inject(MasterCountryCollectionService);
    service = TestBed.inject(MasterCountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all service variants', done => {
      service.getAll().subscribe(result => {
        expect(result).toEqual(countryMock);
        done();
      });
    });
  });

  describe('fetchBy()', () => {
    it('should get service variant by Id', done => {
      service.fetchBy('GB').subscribe(result => {
        expect(result).toEqual(countryMock[0]);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should call masterCountryCollectionService.add', done => {
      const country: MasterCountry = {
        id: 'NZ',
        name: 'New Zealand',
        languages: []
      };
      service.create(country).subscribe(result => {
        expect(result.id).toEqual(country.id);
        expect(result.name).toEqual(country.name);
        expect(result.languages).toEqual(country.languages);

        expect(masterCountryCollectionService.add).toHaveBeenCalledWith(country);
      });
      done();
    });
  });

  describe('delete()', () => {
    it('should call masterCountryCollectionService.delete', done => {
      service.delete('GB').subscribe(() => {
        expect(masterCountryCollectionService.delete).toHaveBeenCalled();
      });
      done();
    });
  });

  describe('update()', () => {
    it('should call masterCountryCollectionService.update', done => {
      const country: MasterCountry = countryMock[0];
      country.name = 'updatedValue';

      service.update(country).subscribe(result => {
        expect(result.name).toEqual(country.name);

        expect(masterCountryCollectionService.update).toHaveBeenCalledWith(country);
      });
      done();
    });
  });

  describe('updateAll()', () => {
    beforeEach(() => {
      jest.spyOn(service, 'update').mockReturnValue(of({}));
      countryTraitsServiceSpy.update.nextWith(of({}));
    });

    it('should able to enable market structure', done => {
      service
        .updateAll(
          getMasterCountryDEMock(),
          getMasterCountryTraitsMock(),
          getMasterCountriesActivationMock(),
          getDECountryFormMock().marketStructureEnabled
        )
        .subscribe();
      expect(countryActivationServiceSpy.create).toHaveBeenCalled();
      done();
    });

    it('should not be able to enable market structure', done => {
      countryActivationServiceSpy.create.throwWith('Error');
      service
        .updateAll(
          getMasterCountryDEMock(),
          getMasterCountryTraitsMock(),
          getMasterCountriesActivationMock(),
          getDECountryFormMock().marketStructureEnabled
        )
        .subscribe(
          () => {},
          error => {
            expect(error).toEqual(new Error('UPDATE_COUNTRY_FAILED_COUNTRY_ACTIVATION'));
            done();
          }
        );
    });

    it('should able to disable market structure', done => {
      service
        .updateAll(
          getMasterCountryUKMock(),
          getMasterCountryTraitsUKMock(),
          getMasterCountriesActivationMock(),
          getUKCountryFormMock().marketStructureEnabled
        )
        .subscribe();
      expect(countryActivationServiceSpy.delete).toHaveBeenCalled();
      done();
    });

    it('should not be able to disable market structure', done => {
      countryActivationServiceSpy.delete.throwWith('Error');
      service
        .updateAll(
          getMasterCountryUKMock(),
          getMasterCountryTraitsUKMock(),
          getMasterCountriesActivationMock(),
          getUKCountryFormMock().marketStructureEnabled
        )
        .subscribe(
          () => {},
          error => {
            expect(error).toEqual(new Error('UPDATE_COUNTRY_FAILED_COUNTRY_ACTIVATION'));
            done();
          }
        );
    });
  });

  describe('checkCountryActivation()', () => {
    const countriesActivation = getMasterCountriesActivationMock();

    it('should return true when the country is market structure enabled', done => {
      expect(service.checkCountryActivation(countriesActivation, 'GB')).toBeTruthy();
      done();
    });

    it('should return false when the country is not market structure enabled', done => {
      expect(service.checkCountryActivation(countriesActivation, 'DE')).toBeFalsy();
      done();
    });
  });
});
