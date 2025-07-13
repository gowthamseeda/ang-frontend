import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { announcementMock } from '../models/announcement.mock';
import { AnnouncementType } from '../models/announcement.model';
import { AnnouncementService } from './announcement.service';

describe('AnnouncementService', () => {
  let announcementService: AnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, AnnouncementService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    announcementService = TestBed.inject(AnnouncementService);
  });

  it('should be created', () => {
    expect(announcementService).toBeTruthy();
  });

  it('should get announcement', () => {
    jest.spyOn(announcementService, 'get').mockReturnValue(of(announcementMock));
    announcementService.get(AnnouncementType.DASHBOARD, 'en').subscribe(announcement => {
      expect(announcement).toMatchObject(announcementMock);
    });
  });

  it('should update announcement', () => {
    jest.spyOn(announcementService, 'update').mockReturnValue(of({ id: 'ID', status: 'UPDATED' }));
    announcementService.update(announcementMock).subscribe(response => {
      expect(response).toMatchObject({ status: 'UPDATED' });
    });
  });
});
