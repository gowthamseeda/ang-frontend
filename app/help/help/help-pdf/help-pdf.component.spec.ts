import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { FALLBACK_LANGUAGE, PDFS } from '../../help.constants';
import { HelpPdfComponent } from './help-pdf.component';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

const MOCK_PDF = PDFS[0];

describe('HelpPdfComponent', () => {
  let component: HelpPdfComponent;
  let fixture: ComponentFixture<HelpPdfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    TestBed.configureTestingModule({
      declarations: [HelpPdfComponent, TranslatePipeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPdfComponent);
    component = fixture.componentInstance;
    component.pdf = MOCK_PDF;
    component.language = FALLBACK_LANGUAGE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should handle path', () => {
    const path = 'local';

    //path = app/local
    it('should not append path to URL', () => {
      component.path = path;
      const pdfSource = component.getPdfSource('test');
      expect(pdfSource).not.toContain("local/");
    });

    //if path is not local or app
    it('should append path to URL', () => {
      component.path = path + 'test';
      const pdfSource = component.getPdfSource('test');
      expect(pdfSource).toContain(path);
    });
  });
});
