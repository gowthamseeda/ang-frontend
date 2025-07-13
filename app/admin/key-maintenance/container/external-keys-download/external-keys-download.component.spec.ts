import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalKeysDownloadComponent } from './external-keys-download.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExternalKeysService } from "../../../../gssnplus-api-outlet/external-keys/external-keys";
import { ApiService } from "../../../../shared/services/api/api.service";
import {HttpClient} from "@angular/common/http";
import { createSpyFromClass, Spy } from "jest-auto-spies";
import { of } from "rxjs";
import {LoggingService} from "../../../../shared/services/logging/logging.service";

describe('ExternalKeysComponent', () => {
  let component: ExternalKeysDownloadComponent;
  let fixture: ComponentFixture<ExternalKeysDownloadComponent>;
  let httpClientSpy: Spy<HttpClient>;

  beforeEach(async () => {
    httpClientSpy = createSpyFromClass(HttpClient);
    httpClientSpy.get.mockReturnValue(of(""));

    await TestBed.configureTestingModule({
      declarations: [ ExternalKeysDownloadComponent ],
      imports: [
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        MatTabsModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ApiService,
        ExternalKeysService,
        LoggingService,
        { provide: HttpClient, useValue: httpClientSpy }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalKeysDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
