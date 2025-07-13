import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterCloseDownReasonsService } from '../../services/master-close-down-reasons/master-close-down-reasons.service';

import { CloseDownReasonTileComponent } from './close-down-reason-tile.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

describe('CloseDownReasonTileComponent', () => {
  let component: CloseDownReasonTileComponent;
  let fixture: ComponentFixture<CloseDownReasonTileComponent>;
  let closeDownReasonsServiceSpy: Spy<MasterCloseDownReasonsService>;
  let sortingServiceSpy: Spy<SortingService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      closeDownReasonsServiceSpy = createSpyFromClass(MasterCloseDownReasonsService);
      closeDownReasonsServiceSpy.getAll.nextWith([]);
      closeDownReasonsServiceSpy.delete.nextWith({});
      sortingServiceSpy = createSpyFromClass(SortingService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [CloseDownReasonTileComponent],
        imports: [TestingModule],
        providers: [
          { provide: MasterCloseDownReasonsService, useValue: closeDownReasonsServiceSpy },
          { provide: SortingService, useValue: sortingServiceSpy },
          { provide: MatDialog, useClass: MatDialogMock },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseDownReasonTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search close down reason name', () => {
    component.searchCloseDownReasonName('Outlet');
    expect(component.searchText).toEqual('Outlet');
  });

  describe('deleteCloseDownReason()', () => {
    beforeEach(() => {
      component.deleteCloseDownReason('1');
    });

    it('should delete the close down reason', () => {
      expect(closeDownReasonsServiceSpy.delete).toHaveBeenCalledWith('1');
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DELETE_CLOSE_DOWN_REASON_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      closeDownReasonsServiceSpy.delete.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
