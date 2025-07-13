import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterCountryService } from '../../country/master-country/master-country.service';

import { CountryTileComponent } from './country-tile.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

describe('CountryTileComponent', () => {
  let component: CountryTileComponent;
  let fixture: ComponentFixture<CountryTileComponent>;
  let countryServiceSpy: Spy<MasterCountryService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      countryServiceSpy = createSpyFromClass(MasterCountryService);
      countryServiceSpy.getAll.nextWith([]);
      countryServiceSpy.delete.nextWith();
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [CountryTileComponent],
        imports: [TestingModule],
        providers: [
          { provide: MasterCountryService, useValue: countryServiceSpy },
          { provide: MatDialog, useClass: MatDialogMock },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteCountry()', () => {
    beforeEach(() => {
      component.deleteCountry('de-DE');
    });

    it('should delete the country', () => {
      expect(countryServiceSpy.delete).toHaveBeenCalledWith('de-DE');
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DELETE_COUNTRY_SUCCESS');
    });

    it('should give a error message', () => {
      const error = new Error('Error!');
      countryServiceSpy.delete.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  it('searchCountryName()', () => {
    component.searchCountryName('german');
    expect(component.searchText).toEqual('german');
  });
});
