import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterBrandService } from '../../brand/master-brand/master-brand.service';

import { BrandTileComponent } from './brand-tile.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

describe('BrandTileComponent', () => {
  let component: BrandTileComponent;
  let fixture: ComponentFixture<BrandTileComponent>;
  let brandServiceSpy: Spy<MasterBrandService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      brandServiceSpy = createSpyFromClass(MasterBrandService);
      brandServiceSpy.getAll.nextWith([]);
      brandServiceSpy.delete.nextWith();
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [BrandTileComponent],
        imports: [TestingModule],
        providers: [
          { provide: MasterBrandService, useValue: brandServiceSpy },
          { provide: MatDialog, useClass: MatDialogMock },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search brand name', () => {
    component.searchBrandName('Benz');
    expect(component.searchText).toEqual('Benz');
  });

  describe('deleteBrand()', () => {
    beforeEach(() => {
      component.deleteBrand('MB');
    });

    it('should delete the brand', () => {
      expect(brandServiceSpy.delete).toHaveBeenCalledWith('MB');
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DELETE_BRAND_SUCCESS');
    });

    it('should give a error message', () => {
      const error = new Error('Error!');
      brandServiceSpy.delete.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
