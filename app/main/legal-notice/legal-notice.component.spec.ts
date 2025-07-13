import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { CompModule } from '../../shared/components/components.module';
import { LegalService } from '../../shared/services/legal/legal.service';
import { getLicensesMock } from '../../shared/services/legal/license-entry.mock';
import { TestingModule } from '../../testing/testing.module';

import { LegalNoticeComponent } from './legal-notice.component';

describe('LegalNoticeComponent', () => {
  const licenseEntriesMock = getLicensesMock();
  let component: LegalNoticeComponent;
  let fixture: ComponentFixture<LegalNoticeComponent>;
  let legalServiceSpy: Spy<LegalService>;

  beforeEach(waitForAsync(() => {
    legalServiceSpy = createSpyFromClass(LegalService);
    legalServiceSpy.getLicenses.nextWith(licenseEntriesMock);

    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        TranslateModule.forRoot({}),
        CompModule,
        NoopAnimationsModule,
        MatDialogModule,
        MatExpansionModule
      ],
      declarations: [LegalNoticeComponent],
      providers: [
        { provide: LegalService, useValue: legalServiceSpy },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load license entries', () => {
      expect(component.licenseEntries).toEqual(licenseEntriesMock);
    });
  });
});
