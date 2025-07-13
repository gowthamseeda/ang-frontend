import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy} from 'jest-auto-spies';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { OutletRelationshipTileComponent } from './outlet-relationship-tile.component';
import { TestingModule } from "../../../testing/testing.module";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {of} from "rxjs";
import {
  MasterOutletRelationshipService
} from "../../services/master-outlet-relationship/master-outlet-relationship.service";

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

describe('OutletRelationshipTileComponent', () => {
  let component: OutletRelationshipTileComponent;
  let fixture: ComponentFixture<OutletRelationshipTileComponent>;
  let outletRelationshipServiceSpy: Spy<MasterOutletRelationshipService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(async () => {
    outletRelationshipServiceSpy = createSpyFromClass(MasterOutletRelationshipService);
    outletRelationshipServiceSpy.getAll.nextWith([]);
    outletRelationshipServiceSpy.delete.nextWith({});
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    await TestBed.configureTestingModule({
      declarations: [ OutletRelationshipTileComponent ],
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MasterOutletRelationshipService, useValue: outletRelationshipServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: MatDialog, useClass: MatDialogMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutletRelationshipTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter outlet relationship ', () => {
    const name = 'Is Branch of';
    component.searchOutletRelationshipName(name);
    expect(component.searchText).toEqual(name);
  });

  describe('deleteOutletRelationship()', () => {
    beforeEach(() => {
      component.deleteOutletRelationship("is_Branch_of");
    });

    it('should delete the outlet relationship', () => {
      expect(outletRelationshipServiceSpy.delete).toHaveBeenCalledWith("is_Branch_of");
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DELETE_OUTLET_RELATIONSHIP_SUCCESS');
    });

    it('should give a error message', () => {
      const error = new Error('Error!');
      outletRelationshipServiceSpy.delete.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
