import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FileUploadStatusService } from '../file-upload-status.service';
import { FileUploadStatusComponent } from './file-upload-status.component';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TestingModule } from '../../../testing/testing.module';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TranslateDataPipe } from '../../../shared/pipes/translate-data/translate-data.pipe';
import { fileUploadStatusDetailsMock } from '../model/file-upload-status.mock';

describe('FileUploadStatusComponent', () => {
  let component: FileUploadStatusComponent;
  let fileUploadStatusServiceSpy: Spy<FileUploadStatusService>;
  let fixture: ComponentFixture<FileUploadStatusComponent>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  
  /*beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploadStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });*/
  beforeEach(
    waitForAsync(() => {
      fileUploadStatusServiceSpy = createSpyFromClass(FileUploadStatusService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [
          FileUploadStatusComponent
        ],
        imports: [TranslateModule.forRoot(), NoopAnimationsModule, TestingModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          ApiService,
          LoggingService,
          TranslateDataPipe,
          { provide: FileUploadStatusService, useValue: fileUploadStatusServiceSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fileUploadStatusServiceSpy.getAll.nextWith(fileUploadStatusDetailsMock);
  
    fixture = TestBed.createComponent(FileUploadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  describe('transformToMatDataSource', () => {
    const expected = [
      {
        name: 'Offered-Services Mass Upload',
        status: 'COMPLETED',
        fileName: "test.xlsx",
        errorMsg: null,
        createTimestamp: new Date('2024-01-01T20:04:04.000Z'),
        updateTimestamp: new Date('2024-01-01T21:05:50.000Z')
      },
      {
        name: 'createTimestampOffered-Services Mass Upload',
        status: 'PROCESSING',
        fileName: "test.xlsx",
        errorMsg: null,
        createTimestamp: new Date('2024-01-02T20:04:04.000Z'),
        updateTimestamp: new Date('2024-01-02T21:05:50.000Z')
      },
      {
        name: 'Offered-Services Mass Upload',
        status: 'PROCESSING',
        fileName: "test.xlsx",
        errorMsg: null,
        createTimestamp: new Date('2024-01-03T20:04:04.000Z'),
        updateTimestamp: new Date('2024-01-03T21:05:50.000Z')
      },
      {
        name: 'Offered-Services Mass Upload',
        status: 'COMPLETED',
        fileName: "test.xlsx",
        errorMsg: null,
        createTimestamp: new Date('2024-01-04T20:04:04.000Z'),
        updateTimestamp: new Date('2024-01-04T21:05:50.000Z')
      }
    ];

    it('should transform to sortable mat Data Source', () => {
      fixture.detectChanges();
      expect(component.dataSource.data).toEqual(expected);
    });
  });

});


