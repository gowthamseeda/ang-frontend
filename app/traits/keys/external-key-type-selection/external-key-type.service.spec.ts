import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';

import { ExternalKeyType } from './external-key-type.model';
import { ExternalKeyTypeService } from './external-key-type.service';

describe('ExternalKeyTypeService', () => {
  let service: ExternalKeyTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ExternalKeyTypeService, ApiService, LoggingService]
    });

    service = TestBed.inject(ExternalKeyTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all external key types from the traits contract', done => {
      service.getAll().subscribe((externalKeyTypes: ExternalKeyType[]) => {
        expect(externalKeyTypes).toEqual([
          {
            id: 'COFICO01',
            name: 'Cofico System ID 1',
            description: 'Description For COFICO01',
            maxValueLength: 256,
            countryRestrictions: ['DE'],
            brandRestrictions: ['SMT'],
            productGroupRestrictions: ['VAN']
          },
          {
            id: 'COFICO02',
            name: 'Cofico System ID 2',
            description: 'Description For COFICO02',
            translations: {
              'de-DE': {
                description: 'Description For COFICO02 in Germany'
              }
            },
            maxValueLength: 256
          },
          {
            id: 'COFICO03',
            name: 'Cofico System ID 3',
            description: 'Description For COFICO03',
            translations: {
              'de-DE': {
                description: 'Description For COFICO03 in Germany'
              }
            },
            maxValueLength: 40
          },
          {
            id: 'COFICOGB',
            name: 'Cofico System ID GB',
            description: 'Description For COFICOGB',
            translations: {
              'de-DE': {
                description: 'Description For COFICOGB in Germany'
              }
            },
            maxValueLength: 256,
            countryRestrictions: ['GB'],
            brandRestrictions: ['SMT'],
            productGroupRestrictions: ['VAN']
          },
          {
            id: 'GENESIS_ID',
            name: 'GENESIS ID (E-Location)',
            description: 'Description For GENESIS_ID',
            translations: {
              'de-DE': {
                description: 'Description For GENESIS_ID in Germany'
              }
            },
            maxValueLength: 40
          }
        ]);
        done();
      });
    });
  });

  describe('getAll(outletId)', () => {
    it('should get all external key types based on outlet country restriction from the traits contract ', done => {
      service.getAll('GS00000001').subscribe((externalKeyTypes: ExternalKeyType[]) => {
        expect(externalKeyTypes).toEqual([
          {
            id: 'COFICO02',
            name: 'Cofico System ID 2',
            maxValueLength: 256,
            description: 'Description For COFICO02'
          },
          {
            id: 'COFICO03',
            name: 'Cofico System ID 3',
            maxValueLength: 40
          },
          {
            id: 'GENESIS_ID',
            name: 'GENESIS ID (E-Location)',
            maxValueLength: 40
          },
          {
            id: 'COFICOGB',
            name: 'Cofico System ID GB',
            maxValueLength: 256,
            countryRestrictions: ['GB'],
            brandRestrictions: ['SMT'],
            productGroupRestrictions: ['VAN']
          }
        ]);
        done();
      });
    });
  });
});
