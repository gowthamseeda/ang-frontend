import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterCountryGroupService } from '../../services/master-country-group/master-country-group.service';

import { CountryGroupTileComponent } from './country-group-tile.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

describe('CountryGroupTileComponent', () => {
  let component: CountryGroupTileComponent;
  let masterCountryGroupServiceSpy: Spy<MasterCountryGroupService>;
  let sortingServiceSpy: Spy<SortingService>;
  let fixture: ComponentFixture<CountryGroupTileComponent>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let countryGroupName: string;
  let countryGroupId: string;

  beforeEach(() => {
    masterCountryGroupServiceSpy = createSpyFromClass(MasterCountryGroupService);
    masterCountryGroupServiceSpy.getAll.nextWith([]);
    masterCountryGroupServiceSpy.delete.nextWith({});
    sortingServiceSpy = createSpyFromClass(SortingService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    countryGroupName = 'Electric Drive';
    countryGroupId = '1';

    TestBed.configureTestingModule({
      declarations: [CountryGroupTileComponent],
      imports: [TestingModule],
      providers: [
        { provide: MasterCountryGroupService, useValue: masterCountryGroupServiceSpy },
        { provide: SortingService, useValue: sortingServiceSpy },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: SnackBarService, useValue: snackBarServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryGroupTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search countryGroup name', () => {
    component.searchCountryGroupName(countryGroupName);
    expect(component.searchText).toEqual(countryGroupName);
  });

  describe('deleteCountryGroup()', () => {
    beforeEach(() => {
      component.deleteCountryGroup(countryGroupId);
    });

    it('should delete the countryGroup', () => {
      expect(masterCountryGroupServiceSpy.delete).toHaveBeenCalledWith(countryGroupId);
    });

    it('should give a success message', () => {
      masterCountryGroupServiceSpy.delete.nextWith({});
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DELETE_COUNTRY_GROUP_SUCCESS');
    });

    it('should give a error message', () => {
      const error = new Error('Error!');
      masterCountryGroupServiceSpy.delete.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
