import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { environment } from '../../../../environments/environment';
import { LoggingService } from '../logging/logging.service';
import { ApiService, ApiError } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpTestingController;
  let loggingServiceSpy: Spy<LoggingService>;

  beforeEach(() => {
    loggingServiceSpy = createSpyFromClass(LoggingService);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, [{ provide: LoggingService, useValue: loggingServiceSpy }]]
    });

    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('general behavior', () => {
    let request;
    let actualResponse;

    afterEach(() => {
      http.verify();
    });

    it('should return an generic error when no specific one is responded', () => {
      const genericError = new ApiError('GENERIC_API_ERROR', undefined, 400);

      service.get('test').subscribe(
        response => {
          actualResponse = response;
        },
        error => {
          actualResponse = error;
        }
      );

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'GET'
      });
      request.flush(null, { status: 400, statusText: 'Error' });

      expect(actualResponse).toEqual(genericError);
      expect(loggingServiceSpy.error).toHaveBeenCalled();
    });

    it('should add missing slash to URL', () => {
      const expectedUrl = '/test';
      service.get('test').subscribe();

      request = http.expectOne({
        url: environment.settings.backend + expectedUrl,
        method: 'GET'
      });

      expect(request.request.url).toEqual(expectedUrl);
    });

    it('should not add slash to URL', () => {
      const expectedUrl = '/test';
      service.get('/test').subscribe();

      request = http.expectOne({
        url: environment.settings.backend + expectedUrl,
        method: 'GET'
      });

      expect(request.request.url).toEqual(expectedUrl);
    });
  });

  describe('get()', () => {
    let request;
    let actualResponse;

    beforeEach(() => {
      service.get('test').subscribe(
        response => {
          actualResponse = response;
        },
        error => {
          actualResponse = error;
        }
      );
    });

    afterEach(() => {
      http.verify();
    });

    it('should make a successful GET request', () => {
      const expectedResponse = 'response';

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'GET'
      });
      request.flush(expectedResponse);

      expect(actualResponse).toEqual(expectedResponse);
    });

    it('should return the error which is responded', () => {
      const expectedResponse = new ApiError('Error', undefined, 400);

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'GET'
      });
      request.flush(expectedResponse, { status: 400, statusText: 'Error' });

      expect(actualResponse).toEqual(expectedResponse);
      expect(loggingServiceSpy.error).toHaveBeenCalled();
    });

    it('should return a generic error which is responded', () => {
      const expectedResponse = new ApiError('GENERIC_API_ERROR', undefined, 500);

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'GET'
      });
      request.flush(expectedResponse, { status: 500, statusText: 'Error' });

      expect(actualResponse).toEqual(expectedResponse);
      expect(loggingServiceSpy.error).toHaveBeenCalled();
    });
  });

  describe('get(params)', () => {
    let request;
    let actualResponse;

    beforeEach(() => {
      const params = new HttpParams().set('param', 'test');

      service.get('test', params).subscribe(
        response => {
          actualResponse = response;
        },
        error => {
          actualResponse = error;
        }
      );
    });

    afterEach(() => {
      http.verify();
    });

    it('should make a successful GET request with params', () => {
      const expectedResponse = 'response';

      request = http.expectOne({
        url: environment.settings.backend + '/test?param=test',
        method: 'GET'
      });
      request.flush(expectedResponse);

      expect(actualResponse).toEqual(expectedResponse);
    });
  });

  describe('put() with map', () => {
    let request;
    let actualResponse;

    beforeEach(() => {
      const map = new Map();
      map.set('test', ['test1', 'test2']);

      service.put('test', map).subscribe(
        response => {
          actualResponse = response;
        },
        error => {
          actualResponse = error;
        }
      );
    });

    afterEach(() => {
      http.verify();
    });

    it('should make a successful PUT request with map as payload', () => {
      const expectedResponse = { test: ['test1', 'test2'] };
      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'PUT'
      });
      request.flush(expectedResponse);
      expect(actualResponse).toEqual(expectedResponse);
    });
  });

  describe('put() with map', () => {
    let request;
    let actualResponse;

    beforeEach(() => {
      const map = new Map();
      map.set('test', [1, 'test2']);

      service.put('test', map).subscribe(
        response => {
          actualResponse = response;
        },
        error => {
          actualResponse = error;
        }
      );
    });

    afterEach(() => {
      http.verify();
    });

    it('should respond an empty object if key is not a string', () => {
      const expectedResponse = {};
      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'PUT'
      });
      request.flush(expectedResponse);
      expect(actualResponse).toEqual(expectedResponse);
    });
  });

  describe('put()', () => {
    let request;
    let actualResponse;

    beforeEach(() => {
      service.put('test', {}).subscribe(
        response => {
          actualResponse = response;
        },
        error => {
          actualResponse = error;
        }
      );
    });

    afterEach(() => {
      http.verify();
    });

    it('should make a successful PUT request', () => {
      const expectedResponse = 'response';

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'PUT'
      });
      request.flush(expectedResponse);

      expect(actualResponse).toEqual(expectedResponse);
    });

    it('should return the error which is responded', () => {
      const expectedResponse = new ApiError('Error', undefined, 400);

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'PUT'
      });
      request.flush(expectedResponse, { status: 400, statusText: 'Error' });

      expect(actualResponse).toEqual(expectedResponse);
      expect(loggingServiceSpy.error).toHaveBeenCalled();
    });

    it('should return a generic error which is responded', () => {
      const expectedResponse = new ApiError('GENERIC_API_ERROR', undefined, 500);

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'PUT'
      });
      request.flush(expectedResponse, { status: 500, statusText: 'Error' });

      expect(actualResponse).toEqual(expectedResponse);
      expect(loggingServiceSpy.error).toHaveBeenCalled();
    });
  });

  describe('post()', () => {
    let request;
    let actualResponse;

    beforeEach(() => {
      service.post('test', {}).subscribe(
        response => {
          actualResponse = response;
        },
        error => {
          actualResponse = error;
        }
      );
    });

    afterEach(() => {
      expect(request.request.method).toEqual('POST');
      http.verify();
    });

    it('should make a successful POST request', () => {
      const expectedResponse = 'response';

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'POST'
      });
      request.flush(expectedResponse);

      expect(actualResponse).toEqual(expectedResponse);
    });

    it('should return the error which is responded', () => {
      const expectedResponse = new ApiError('Error', undefined, 400);

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'POST'
      });
      request.flush(expectedResponse, { status: 400, statusText: 'Error' });

      expect(actualResponse).toEqual(expectedResponse);
      expect(loggingServiceSpy.error).toHaveBeenCalled();
    });

    it('should return a generic error which is responded', () => {
      const expectedResponse = new ApiError('GENERIC_API_ERROR', undefined, 500);

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'POST'
      });
      request.flush(expectedResponse, { status: 500, statusText: 'Error' });

      expect(actualResponse).toEqual(expectedResponse);
      expect(loggingServiceSpy.error).toHaveBeenCalled();
    });
  });

  describe('post(payload)', () => {
    let request;
    let actualResponse;

    const payload = {
      testString: 'should not be deleted',
      emptyString: '',
      nullField: null,
      undefienedField: undefined,
      emptyNestedObject: {},
      nestedObjectToBeDeleted: {
        emptyString: ''
      },
      nestedObject: {
        emptyString: 'should not be deleted'
      },
      nestedObjectsToBeDeleted: {
        emptyObject: {},
        emptyString: ''
      }
    };

    const expectedPayload = {
      testString: 'should not be deleted',
      nestedObject: {
        emptyString: 'should not be deleted'
      }
    };

    beforeEach(() => {
      service.post('test', payload).subscribe(
        response => {
          actualResponse = response;
        },
        error => {
          actualResponse = error;
        }
      );
    });

    afterEach(() => {
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toEqual(JSON.stringify(expectedPayload));
      http.verify();
    });

    it('should make a successful POST request', () => {
      const expectedResponse = 'response';

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'POST'
      });
      request.flush(expectedResponse);

      expect(actualResponse).toEqual(expectedResponse);
    });
  });

  describe('postBlob(payload)', () => {
    let request;
    let actualResponse;

    const payload = {
      externalKey: 'keyType',
      filterBrand: '',
      filterProductGroup: '',
      filterCountry: 'All',
      showAddress: true,
      showCity: true,
      showCountry: true,
      excludeNonExistExternalKey: false
    };

    beforeEach(() => {
      service.postBlob('test', payload).subscribe(
        response => {
          actualResponse = response;
        },
        error => {
          actualResponse = error;
        }
      );
    });

    afterEach(() => {
      expect(request.request.method).toEqual('POST');
      http.verify();
    });

    it('should make a successful POST blob request', () => {
      const dummyBlob = new Blob(['dummy content'], { type: 'application/vnd.ms-excel' });

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'POST'
      });
      expect(request.request.headers.get('Accept')).toBe('application/json');
      expect(request.request.headers.get('Content-Type')).toBe('application/json');
      expect(request.request.responseType).toBe('blob');

      request.flush(dummyBlob);

      expect(actualResponse).toEqual(dummyBlob);
    });
  });

  describe('delete(payload)', () => {
    let request;
    let actualResponse;
    const payload = {
      taskData: {
        comment: 'test comment'
      }
    };

    beforeEach(() => {
      service.delete('test', payload).subscribe(
        response => {
          actualResponse = response;
        },
        error => {
          actualResponse = error;
        }
      );
    });

    afterEach(() => {
      http.verify();
    });

    it('should make a successful DELETE request with payload', () => {
      const expectedResponse = { taskData: { comment: 'test comment' } };

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'DELETE'
      });
      request.flush(expectedResponse);

      expect(actualResponse).toEqual(expectedResponse);
    });
  });

  describe('delete()', () => {
    let request;
    let actualResponse;

    beforeEach(() => {
      service.delete('test').subscribe(
        response => {
          actualResponse = response;
        },
        error => {
          actualResponse = error;
        }
      );
    });

    afterEach(() => {
      http.verify();
    });

    it('should make a successful DELETE request', () => {
      const expectedResponse = 'response';

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'DELETE'
      });
      request.flush(expectedResponse);

      expect(actualResponse).toEqual(expectedResponse);
    });

    it('should return the error which is responded', () => {
      const expectedResponse = new ApiError('Error', undefined, 400);

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'DELETE'
      });
      request.flush(expectedResponse, { status: 400, statusText: 'Error' });

      expect(actualResponse).toEqual(expectedResponse);
      expect(loggingServiceSpy.error).toHaveBeenCalled();
    });

    it('should return a generic error which is responded', () => {
      const expectedResponse = new ApiError('GENERIC_API_ERROR', undefined, 500);

      request = http.expectOne({
        url: environment.settings.backend + '/test',
        method: 'DELETE'
      });
      request.flush(expectedResponse, { status: 500, statusText: 'Error' });

      expect(actualResponse).toEqual(expectedResponse);
      expect(loggingServiceSpy.error).toHaveBeenCalled();
    });
  });
});
