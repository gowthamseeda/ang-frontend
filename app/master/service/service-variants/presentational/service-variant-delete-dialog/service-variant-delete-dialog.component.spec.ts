import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { TestingModule } from '../../../../../testing/testing.module';
import { MasterServiceService } from '../../../master-service/master-service.service';
import { MasterServiceVariantMock } from '../../master-service-variant/master-service-variant.mock';
import { MasterServiceVariantService } from '../../master-service-variant/master-service-variant.service';

import { ServiceVariantDeleteDialogComponent } from './service-variant-delete-dialog.component';

describe('ServiceVariantDeleteDialogComponent', () => {
  const serviceVariantMock = MasterServiceVariantMock.asList();

  let component: ServiceVariantDeleteDialogComponent;
  let fixture: ComponentFixture<ServiceVariantDeleteDialogComponent>;
  let serviceSpy: Spy<MasterServiceService>;
  let serviceVariantSpy: Spy<MasterServiceVariantService>;
  let matDialogRef: MatDialogRef<unknown, unknown>;

  beforeEach(async () => {
    serviceSpy = createSpyFromClass(MasterServiceService);
    serviceVariantSpy = createSpyFromClass(MasterServiceVariantService);
    serviceVariantSpy.getBy.mockReturnValue(of(serviceVariantMock[0]));
    await TestBed.configureTestingModule({
      declarations: [ServiceVariantDeleteDialogComponent],
      imports: [TestingModule],
      providers: [
        { provide: MasterServiceService, useValue: serviceSpy },
        { provide: MasterServiceVariantService, useValue: serviceVariantSpy },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn()
          }
        },
        MatDialog,
        {
          provide: MAT_DIALOG_DATA,
          useValue: { serviceVariantIds: [1] }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    matDialogRef = TestBed.inject(MatDialogRef);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceVariantDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('init page', () => {
      component.ngOnInit();
      expect(component.initTableDataSource).toBeTruthy();
    });
  });

  describe('initTableDataSource()', () => {
    it('transform service variant into table data source', () => {
      component.initTableDataSource();

      expect(serviceVariantSpy.getBy).toHaveBeenCalled();
    });
  });

  describe('cancel()', () => {
    it('should cancel dialog with false value', () => {
      component.cancel();

      expect(matDialogRef.close).toHaveBeenCalledWith(false);
    });
  });

  describe('confirm()', () => {
    it('should confirm dialog with false value', () => {
      component.confirm();

      expect(matDialogRef.close).toHaveBeenCalledWith(true);
    });
  });
});
