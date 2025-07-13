import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retryWhen } from 'rxjs/operators';

import { ApiService } from '../../shared/services/api/api.service';
import { delayedRetryStrategy } from '../../shared/util/delayed-retry-strategy';

import { FileUploadStatusDetails } from './model/file-upload-status.model';

@Injectable()
export class FileUploadStatusService {
  constructor(private apiService: ApiService) {}

  getAll(): Observable<FileUploadStatusDetails> {
    return this.apiService
      .get<FileUploadStatusDetails>(this.fileUploadStatusUrl())
      .pipe(retryWhen(delayedRetryStrategy()));
  }

  private fileUploadStatusUrl(): string {
    return '/file-upload-status/api/v1/file-upload-status';
  }
}