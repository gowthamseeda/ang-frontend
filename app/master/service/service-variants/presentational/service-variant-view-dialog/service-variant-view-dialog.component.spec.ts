import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';
import { TestingModule } from '../../../../../testing/testing.module';
import { MasterCountryMock } from '../../../../country/master-country/master-country.mock';
import { MasterCountryService } from '../../../../country/master-country/master-country.service';
import { MasterServiceService } from '../../../master-service/master-service.service';
import { MasterServiceVariantMock } from '../../master-service-variant/master-service-variant.mock';
import { MasterServiceVariantService } from '../../master-service-variant/master-service-variant.service';
import { ServiceVariantView } from '../../models/service-variant.model';

import { ServiceVariantViewDialogComponent } from './service-variant-view-dialog.component';

describe('ServiceVariantViewDialogComponent', () => {
  const serviceVariantMock = MasterServiceVariantMock.asList();
  const countryMock = MasterCountryMock.asList();

  let component: ServiceVariantViewDialogComponent;
  let fixture: ComponentFixture<ServiceVariantViewDialogComponent>;
  let serviceSpy: Spy<MasterServiceService>;
  let serviceVariantSpy: Spy<MasterServiceVariantService>;
  let countrySpy: Spy<MasterCountryService>;

  beforeEach(async () => {
    serviceSpy = createSpyFromClass(MasterServiceService);
    serviceVariantSpy = createSpyFromClass(MasterServiceVariantService);
    serviceVariantSpy.getBy.mockReturnValue(of(serviceVariantMock[0]));

    countrySpy = createSpyFromClass(MasterCountryService);
    countrySpy.getAll.mockReturnValue(of(countryMock));

    await TestBed.configureTestingModule({
      declarations: [ServiceVariantViewDialogComponent, TranslatePipeMock],
      imports: [TestingModule],
      providers: [
        { provide: MasterServiceService, useValue: serviceSpy },
        { provide: MasterServiceVariantService, useValue: serviceVariantSpy },
        { provide: MasterCountryService, useValue: countrySpy },
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceVariantViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('init page', () => {
      component.ngOnInit();
      expect(component.initCountriesSource).toBeTruthy();
      expect(component.initTableDataSource).toBeTruthy();
    });
  });

  describe('initCountriesSource()', () => {
    it('init countries', done => {
      component.initCountriesSource();

      expect(component.countries).toEqual(countryMock);
      done();
    });
  });

  describe('initTableDataSource()', () => {
    it('init table', done => {
      jest.spyOn(component, 'getServiceName').mockReturnValue('New Vehicle Sales');
      jest.spyOn(component, 'getCountryName').mockReturnValue([]);

      component.initTableDataSource();

      expect(component.getServiceName).toHaveBeenCalledTimes(1);
      expect(component.getCountryName).toHaveBeenCalledTimes(1);
      expect(component.dataSource[0]).toEqual({
        id: 1,
        brand: 'MB',
        productGroup: 'PC',
        service: 'New Vehicle Sales',
        active: true,
        countryRestrictions: []
      } as ServiceVariantView);
      done();
    });
  });
});
