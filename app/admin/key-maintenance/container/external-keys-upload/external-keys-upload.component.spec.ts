import { ExternalKeysUploadComponent } from './external-keys-upload.component';
import {createSpyFromClass, Spy} from "jest-auto-spies";
import {SnackBarService} from "../../../../shared/services/snack-bar/snack-bar.service";
import {TestBed, waitForAsync} from "@angular/core/testing";
import {ApiService} from "../../../../shared/services/api/api.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {TestingModule} from "../../../../testing/testing.module";
import {LoggingService} from "../../../../shared/services/logging/logging.service";
import { MasterKeyService } from '../../../../master/services/master-key/master-key.service';

describe('ExternalKeysUploadComponent', () => {
  let component: ExternalKeysUploadComponent;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(waitForAsync(() => {
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    TestBed.configureTestingModule({
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ApiService,
        LoggingService,
        MasterKeyService,
        ExternalKeysUploadComponent,
        { provide: SnackBarService, useValue: snackBarServiceSpy }
      ]
    }).compileComponents();

    component = TestBed.inject(ExternalKeysUploadComponent)
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
