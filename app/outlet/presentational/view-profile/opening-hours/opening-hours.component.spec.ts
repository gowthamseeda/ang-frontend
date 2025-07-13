import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { OpeningHoursComponent } from './opening-hours.component';

describe('OpeningHoursComponent', () => {
  let component: OpeningHoursComponent;
  let fixture: ComponentFixture<OpeningHoursComponent>;
  let translationService: Spy<TranslateService>;
  registerLocaleData(localeDe, 'de-DE');
  registerLocaleData(localeFr, 'fr-FR');
  const fromTime = '08:00';
  const toTime = '18:00';

  beforeEach(
    waitForAsync(() => {
      translationService = createSpyFromClass(TranslateService);
      TestBed.configureTestingModule({
        declarations: [OpeningHoursComponent],
        providers: [{ provide: TranslateService, useValue: translationService }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.fromTime = fromTime;
    component.toTime = toTime;
  });

  test('should create ', () => {
    expect(component).toBeTruthy();
  });

  describe('should aggregate content - date is in the future', () => {
    test('should show en content', () => {
      translationService.instant.mockReturnValue('Opens');
      component.currentLang = 'en-EN';
      component.date = '2020-02-16';
      const content = component.getContent();
      const expectation = 'Opens Sunday (16 Feb) ' + fromTime + ' - ' + toTime;
      expect(content).toBe(expectation);
    });

    test('should show de content', () => {
      translationService.instant.mockReturnValue('Öffnet');
      component.currentLang = 'de-DE';
      component.date = '2020-02-16';
      const content = component.getContent();
      const expectation = 'Öffnet Sonntag (16 Feb.) ' + fromTime + ' - ' + toTime;
      expect(content).toBe(expectation);
    });

    test('should show fr content', () => {
      translationService.instant.mockReturnValue('Ouvert');
      component.currentLang = 'fr-FR';
      component.date = '2020-02-16';
      const content = component.getContent();
      const expectation = 'Ouvert dimanche (16 févr.) ' + fromTime + ' - ' + toTime;
      expect(content).toBe(expectation);
    });
  });

  describe('should aggregate content - date is present', () => {
    const now = '2020-02-14';
    const today = new Date(now).valueOf();
    jest.spyOn(global.Date, 'now').mockImplementation(() => today);

    test('should show en content', () => {
      translationService.instant.mockReturnValue('Open today');
      component.currentLang = 'en-US';
      component.date = now;
      const content = component.getContent();
      const expectation = 'Open today ' + fromTime + ' - ' + toTime;
      expect(content).toBe(expectation);
    });

    test('should show de content', () => {
      translationService.instant.mockReturnValue('Geöffnet heute');
      component.currentLang = 'de-DE';
      component.date = now;
      const content = component.getContent();
      const expectation = 'Geöffnet heute ' + fromTime + ' - ' + toTime;
      expect(content).toBe(expectation);
    });

    test('should show fr content', () => {
      translationService.instant.mockReturnValue("Ouvert aujourd'hui");
      component.currentLang = 'fr-FR';
      component.date = now;
      const content = component.getContent();
      const expectation = "Ouvert aujourd'hui " + fromTime + ' - ' + toTime;
      expect(content).toBe(expectation);
    });
  });

  describe('opening hours not available', () => {
    test('should return not defined message for empty date', () => {
      translationService.instant.mockReturnValue('Opening hours not available');
      component.date = '';
      const content = component.getContent();
      const expectation = 'Opening hours not available';
      expect(content).toBe(expectation);
    });
    test('should return not defined message for invalid date', () => {
      translationService.instant.mockReturnValue('Opening hours not available');
      component.date = '2020-02-33';
      const content = component.getContent();
      const expectation = 'Opening hours not available';
      expect(content).toBe(expectation);
    });
    test('should return not defined message if date lies in the past', () => {
      const now = '2020-02-14';
      const today = new Date(now).valueOf();
      jest.spyOn(global.Date, 'now').mockImplementation(() => today);
      translationService.instant.mockReturnValue('Opening hours not available');
      component.date = '2020-02-13';
      const content = component.getContent();
      const expectation = 'Opening hours not available';
      expect(content).toBe(expectation);
    });
  });
});
