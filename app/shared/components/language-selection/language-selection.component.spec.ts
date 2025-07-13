import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  getLanguageEnglishPure,
  getLanguageGermanPure
} from '../../../geography/language/language.mock';
import { Language } from '../../../geography/language/language.model';
import { TestingModule } from '../../../testing/testing.module';

import { LanguageSelectionComponent } from './language-selection.component';

describe('LanguageSelectionComponent', () => {
  let component: LanguageSelectionComponent;
  let fixture: ComponentFixture<LanguageSelectionComponent>;
  const languagesMock: Language[] = [getLanguageGermanPure(), getLanguageEnglishPure()];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LanguageSelectionComponent],
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectionComponent);
    component = fixture.componentInstance;
    component.languages = languagesMock;
    component.sortedLanguages = languagesMock.sort((a, b) => a.name.localeCompare(b.name));
    component.isLoading = false;
  });

  test('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  test('contains same number of options like given languages if required', () => {
    component.required = true;
    fixture.detectChanges();

    const matOptionElements = fixture.debugElement.queryAll(By.css('mat-option'));

    expect(matOptionElements.length).toBe(languagesMock.length);
  });

  test('not contains the undefined option if required', () => {
    component.required = true;
    fixture.detectChanges();

    const matSelectElement = fixture.debugElement.query(By.css('mat-select'));

    expect(matSelectElement.nativeElement.innerHTML).not.toContain('NONE');
  });

  test('contains number of options like given languages +1 if not required', () => {
    component.required = false;
    fixture.detectChanges();

    const matOptionElements = fixture.debugElement.queryAll(By.css('mat-option'));

    expect(matOptionElements.length).toBe(languagesMock.length + 1);
  });

  test('contains the undefined option if not required', () => {
    component.required = false;
    fixture.detectChanges();

    const matSelectElement = fixture.debugElement.query(By.css('mat-select'));

    expect(matSelectElement.nativeElement.innerHTML).toContain('NONE');
  });

  test('updates the selected value when input changes', () => {
    component.selected = 'de';
    fixture.detectChanges();

    expect(component.selectedLanguage).toBe('de');
  });

  test('emits selected options value when selection is changed', done => {
    component.selected = 'de';
    fixture.detectChanges();

    component.languageSelectionChanged.subscribe(value => {
      expect(value).toBe('de');
      done();
    });

    component.emitSelectionChange('de');
  });

  test('not contains the undefined option if required', () => {
    component.label = 'TEST-LABEL';
    fixture.detectChanges();

    const matFormFieldElement = fixture.debugElement.query(By.css('mat-form-field'));

    expect(matFormFieldElement.nativeElement.innerHTML).toContain('TEST-LABEL');
  });

  test('displays language name', () => {
    component.languages = [getLanguageGermanPure()];
    fixture.detectChanges();

    const matSelectElement = fixture.debugElement.query(By.css('mat-select'));

    expect(matSelectElement.nativeElement.innerHTML).toContain(getLanguageGermanPure().name);
  });
});
