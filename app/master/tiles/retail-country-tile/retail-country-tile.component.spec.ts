import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetailCountryTileComponent } from './retail-country-tile.component';
import { MasterRetailCountryService } from '../../services/master-retail-country/master-retail-country.service';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { TestingModule } from '../../../testing/testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MasterTileComponent } from '../../shared/master-tile/master-tile.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

describe('RetailCountryTileComponent', () => {
  let component: RetailCountryTileComponent;
  let fixture: ComponentFixture<RetailCountryTileComponent>;
  let masterRetailCountryServiceSpy: Spy<MasterRetailCountryService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(waitForAsync(() => {
    masterRetailCountryServiceSpy = createSpyFromClass(MasterRetailCountryService);
    masterRetailCountryServiceSpy.getAll.nextWith([]);
    masterRetailCountryServiceSpy.delete.nextWith();
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    TestBed.configureTestingModule({
      declarations: [RetailCountryTileComponent, MasterTileComponent],
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MasterRetailCountryService, useValue: masterRetailCountryServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: MatDialog, useClass: MatDialogMock },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailCountryTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('searchRetailCountryName()', () => {
    const name = 'United Kingdom';
    component.searchRetailCountryName(name);
    expect(component.searchText).toEqual(name);
  });

  describe('deleteRetailCountry()', () => {
    beforeEach(() => {
      component.deleteRetailCountry('GB');
    });

    it('should delete the retail country', () => {
      expect(masterRetailCountryServiceSpy.delete).toHaveBeenCalledWith('GB');
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DELETE_RETAIL_COUNTRY_SUCCESS');
    });

    it('should give a error message', () => {
      const error = new Error('Error!');
      masterRetailCountryServiceSpy.delete.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
