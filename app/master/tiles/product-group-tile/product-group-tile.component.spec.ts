import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterProductGroupService } from '../../product-group/master-product-group/master-product-group.service';

import { ProductGroupTileComponent } from './product-group-tile.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

describe('ProductGroupTileComponent', () => {
  let component: ProductGroupTileComponent;
  let fixture: ComponentFixture<ProductGroupTileComponent>;
  let productGroupServiceSpy: Spy<MasterProductGroupService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      productGroupServiceSpy = createSpyFromClass(MasterProductGroupService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      productGroupServiceSpy.getAll.nextWith([]);
      productGroupServiceSpy.delete.nextWith();

      TestBed.configureTestingModule({
        declarations: [ProductGroupTileComponent],
        imports: [TestingModule],
        providers: [
          { provide: MasterProductGroupService, useValue: productGroupServiceSpy },
          { provide: MatDialog, useClass: MatDialogMock },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search product group name', () => {
    component.searchProductGroupName('Passenger Car');
    expect(component.searchText).toEqual('Passenger Car');
  });

  describe('hasProductGroupIcon()', () => {
    it('should display product group icon when id is valid', () => {
      expect(component.hasProductGroupIcon('PC')).toBeTruthy();
    });

    it('should not display product group icon when id is not valid', () => {
      expect(component.hasProductGroupIcon('XYZ')).toBeFalsy();
    });
  });

  describe('deleteProductGroup()', () => {
    beforeEach(() => {
      component.deleteProductGroup('PC');
    });

    it('should delete the product group', () => {
      expect(productGroupServiceSpy.delete).toHaveBeenCalledWith('PC');
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DELETE_PRODUCT_GROUP_SUCCESS');
    });

    it('should give a error message', () => {
      const error = new Error('Error!');
      productGroupServiceSpy.delete.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
