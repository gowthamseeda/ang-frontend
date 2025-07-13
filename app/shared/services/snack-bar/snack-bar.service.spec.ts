import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TestingModule } from '../../../testing/testing.module';
import { TproHttpLoader } from '../../../tpro/tpro-http-loader';
import { ApiError } from '../api/api.service';

import { SnackBarService } from './snack-bar.service';

describe('SnackBarService', () => {
  let service: SnackBarService;
  let matSnackBarSpy: Spy<MatSnackBar>;

  beforeEach(() => {
    matSnackBarSpy = createSpyFromClass(MatSnackBar);

    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        TestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TproHttpLoader,
            deps: [HttpClient]
          }
        })
      ],
      providers: [SnackBarService, { provide: MatSnackBar, useValue: matSnackBarSpy }]
    });

    service = TestBed.inject(SnackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showInfo()', () => {
    it('should call the matSnackBar open service for 9 sec.', () => {
      service.showInfo('MESSAGE');
      expect(matSnackBarSpy.open).toHaveBeenCalledWith('MESSAGE', 'OK', { duration: 9000 });
    });
  });

  describe('showError()', () => {
    it('should call the matSnackBar open service for errors without a time limit', () => {
      const error = new Error('error');
      service.showError(error);
      expect(matSnackBarSpy.open).toHaveBeenCalledWith('error', 'OK', {});
    });

    it('should call the matSnackBar open service for errors without a time limit traceId', () => {
      const error = new ApiError('error');
      service.showError(error);
      expect(matSnackBarSpy.open).toHaveBeenCalledWith('error', 'OK', {});
    });

    it('should call the matSnackBar open service for errors without a time limit and add traceId if exists', () => {
      const error = new ApiError('error', 'TRACE_ID');
      service.showError(error);
      expect(matSnackBarSpy.open).toHaveBeenCalledWith('error [TRACE_ID]', 'OK', {});
    });
  });

  describe('displayMessageWithLimitLength()', () => {
    it('should show ... if size limit more than 500', () => {
      const message =
        'Outlet Categories: Offered services are existing in RETAILER: [GS0000006-1]. ' +
        '- Outlet Categories: Offered services are existing in WHOLESALER: [GS0000006-1]. ' +
        '- Outlet Categories: Label \'Regional Office\' can not be changed to MANUFACTURER. ' +
        '- Outlet Categories: Regional centers are existing: [RC0000002]. ' +
        '- Outlet Categories: Offered services are existing in RETAILER: [GS0000006-1]. ' +
        '- Outlet Categories: Offered services are existing in WHOLESALER: [GS0000006-1]. ' +
        '- Outlet Categories: Label \'Regional Office\' can not be changed to MANUFACTURER. ';
      const result = service.displayMessageWithLengthLimit(message);
      expect(result.substr(result.length - 3)).toEqual('...');
    });

    it('should show whole message if size limit less than 500', () => {
      const message =
        'Outlet Categories: Offered services are existing in RETAILER: [GS0000006-1].';
      const result = service.displayMessageWithLengthLimit(message);
      expect(result.substr(result.length - 3)).not.toEqual('...');
    });
  });
});
