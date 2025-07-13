import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { LoggingService } from './logging.service';

describe('LoggingService', () => {
  let service: LoggingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoggingService]
    });

    service = TestBed.inject(LoggingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log an error', () => {
    const error = 'error message';
    spyOn(console, 'error');
    service.error(error);

    expect(console.error).toHaveBeenCalledWith(error, []);
  });

  it('should send error to app service', () => {
    const error = 'error message';
    spyOn(console, 'error');

    service.error(error);

    const req = httpMock.expectOne(`${environment.settings.backend}/app/logs`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('level')).toBe('ERROR');
    expect(req.request.body).toContain(error);

    req.flush({});
  });
});
