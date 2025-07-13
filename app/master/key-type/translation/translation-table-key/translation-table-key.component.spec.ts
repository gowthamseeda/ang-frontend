import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { of } from 'rxjs';
import { CompModule } from '../../../../shared/components/components.module';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../../testing/testing.module';
import { MasterLanguageMock } from '../../../language/master-language/master-language.mock';
import { MasterLanguageService } from '../../../language/master-language/master-language.service';
import { TranslationTableKeyComponent } from './translation-table-key.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

describe('TranslationTableKeyComponent', () => {
  let component: TranslationTableKeyComponent;
  let fixture: ComponentFixture<TranslationTableKeyComponent>;
  let languageServiceSpy: Spy<MasterLanguageService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  const languageMock = MasterLanguageMock.asList();
  beforeEach(async () => {
    languageServiceSpy = createSpyFromClass(MasterLanguageService, ['getAll']);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    languageServiceSpy.getAll.nextWith([languageMock[0], languageMock[1]]);
    await TestBed.configureTestingModule({
      declarations: [TranslationTableKeyComponent],
      providers: [
        { provide: MasterLanguageService, useValue: languageServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: MatDialog, useClass: MatDialogMock }
      ],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        TestingModule,
        MatTableModule,
        MatInputModule,
        CompModule,
        MatDialogModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationTableKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return 3 Columns when action column is required', () => {
    const expectData = ['language', 'translation', 'actions'];
    component.IsActionRequired = true;
    expect(component.getColumn()).toEqual(expectData);
  });

  it('should return 2 Columns when action column is required', () => {
    const expectData = ['language', 'translation'];
    component.IsActionRequired = false;
    expect(component.getColumn()).toEqual(expectData);
  });

  it('should emit the removing language when dialog confirm delete button is clicked', () => {
    component.IsActionRequired = true;
    component.dataSource.data = [
      {
        language: 'en-UK',
        translation: 'name in English'
      },
      {
        language: 'en-EN',
        translation: 'name in English too'
      }
    ];
    spyOn(component.removeTranslationByLanguages, 'emit');

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#remove'));

    button.nativeElement.click();

    expect(component.removeTranslationByLanguages.emit).toHaveBeenCalled();
    expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DELETE_TRANSLATION_SUCCESS');
  });

  it('should emit edit translation event when edit button is clicked', () => {
    component.IsActionRequired = true;
    component.dataSource.data = [
      {
        language: 'en-UK',
        translation: 'name in English'
      },
      {
        language: 'en-EN',
        translation: 'name in English too'
      }
    ];
    spyOn(component.edit, 'emit');

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#edit'));

    button.nativeElement.click();

    expect(component.edit.emit).toHaveBeenCalled();
  });
});
