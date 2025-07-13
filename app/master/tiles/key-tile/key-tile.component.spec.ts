import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterKeyService } from '../../services/master-key/master-key.service';

import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { KeyTileComponent } from './key-tile.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

describe('KeyTileComponent', () => {
  let component: KeyTileComponent;
  let fixture: ComponentFixture<KeyTileComponent>;
  let keyServiceSpy: Spy<MasterKeyService>;
  let sortingServiceSpy: Spy<SortingService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;

  beforeEach(waitForAsync(() => {
    keyServiceSpy = createSpyFromClass(MasterKeyService);
    keyServiceSpy.getAll.nextWith([]);
    keyServiceSpy.delete.nextWith({});
    sortingServiceSpy = createSpyFromClass(SortingService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
    userSettingsServiceSpy.getLanguageId.nextWith('en');

    TestBed.configureTestingModule({
      declarations: [KeyTileComponent],
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MasterKeyService, useValue: keyServiceSpy },
        { provide: SortingService, useValue: sortingServiceSpy },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteKeyType()', () => {
    beforeEach(() => {
      component.deleteKeyType('COFICO02');
    });

    it('should delete the key type', () => {
      expect(keyServiceSpy.delete).toHaveBeenCalledWith('COFICO02');
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DELETE_KEY_TYPE_SUCCESS');
    });

    it('should give a error message', () => {
      const error = new Error('Error!');
      keyServiceSpy.delete.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  it('searchKeyTypeName()', () => {
    const name = 'COFICO01';
    component.searchKeyTypeName(name);
    expect(component.searchText).toEqual(name);
  });
});
