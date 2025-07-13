import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterLabelService } from '../../services/master-label/master-label.service';

import { LabelTileComponent } from './label-tile.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

describe('LabelTileComponent', () => {
  let component: LabelTileComponent;
  let fixture: ComponentFixture<LabelTileComponent>;
  let labelServiceSpy: Spy<MasterLabelService>;
  let sortingServiceSpy: Spy<SortingService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      labelServiceSpy = createSpyFromClass(MasterLabelService);
      labelServiceSpy.getAll.nextWith([]);
      labelServiceSpy.delete.nextWith({});
      sortingServiceSpy = createSpyFromClass(SortingService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [LabelTileComponent],
        imports: [TestingModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: MasterLabelService, useValue: labelServiceSpy },
          { provide: SortingService, useValue: sortingServiceSpy },
          { provide: MatDialog, useClass: MatDialogMock },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteLabel()', () => {
    beforeEach(() => {
      component.deleteLabel(12);
    });

    it('should delete the label', () => {
      expect(labelServiceSpy.delete).toHaveBeenCalledWith(12);
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DELETE_LABEL_SUCCESS');
    });

    it('should give a error message', () => {
      const error = new Error('Error!');
      labelServiceSpy.delete.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  it('searchLabelName()', () => {
    const name = 'Authorized Dealer';
    component.searchLabelName(name);
    expect(component.searchText).toEqual(name);
  });
});
