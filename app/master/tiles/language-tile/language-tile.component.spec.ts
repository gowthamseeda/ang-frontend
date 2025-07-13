import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { MasterLanguageService } from '../../language/master-language/master-language.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';

import { LanguageTileComponent } from './language-tile.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

describe('LanguageTileComponent', () => {
  let component: LanguageTileComponent;
  let fixture: ComponentFixture<LanguageTileComponent>;
  let languageServiceSpy: Spy<MasterLanguageService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      languageServiceSpy = createSpyFromClass(MasterLanguageService);
      languageServiceSpy.getAll.nextWith([]);
      languageServiceSpy.delete.nextWith();
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [LanguageTileComponent],
        imports: [TestingModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: MasterLanguageService, useValue: languageServiceSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: MatDialog, useClass: MatDialogMock }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteLanguage()', () => {
    beforeEach(() => {
      component.deleteLanguage('de-DE');
    });

    it('should delete the language', () => {
      expect(languageServiceSpy.delete).toHaveBeenCalledWith('de-DE');
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DELETE_LANGUAGE_SUCCESS');
    });

    it('should give a error message', () => {
      const error = new Error('Error!');
      languageServiceSpy.delete.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  it('searchLanguageName()', () => {
    const name = 'German (Germany)';
    component.searchLanguageName(name);
    expect(component.searchText).toEqual(name);
  });
});
