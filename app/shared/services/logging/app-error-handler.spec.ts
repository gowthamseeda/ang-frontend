import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { AppErrorHandler } from './app-error-handler';
import { LoggingService } from './logging.service';

describe('AppErrorHandler', () => {
  let handler: AppErrorHandler;
  let loggingServiceSpy: Spy<LoggingService>;

  beforeEach(() => {
    loggingServiceSpy = createSpyFromClass(LoggingService);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppErrorHandler, [{ provide: LoggingService, useValue: loggingServiceSpy }]]
    });

    handler = TestBed.inject(AppErrorHandler);
  });

  it('should create', () => {
    expect(handler).toBeTruthy();
  });

  it('should call error in logging service with simple message', () => {
    handler.handleError('my message');

    expect(loggingServiceSpy.error).toHaveBeenCalled();
  });

  it('should call error in logging service with Error', () => {
    const error = new Error('my message');
    handler.handleError(error);

    expect(loggingServiceSpy.error).toHaveBeenCalledWith('my message', error.stack);
  });
});
