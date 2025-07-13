import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { Observable, of } from 'rxjs';

import { KeysPipe } from '../../../../shared/pipes/keys/keys.pipe';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { MultiSelectMode } from '../../models/multi-select.model';
import { ServiceFilterCriteria } from '../../models/service-table-row.model';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';
import { ServiceTableFilterService } from '../../services/service-table-filter.service';
import { ServiceTableSettingService } from '../../services/service-table-setting.service';

import { ServiceTableLayoutComponent } from './service-table-layout.component';
import { SnackBarService } from 'app/shared/services/snack-bar/snack-bar.service';
import { UserService } from 'app/iam/user/user.service';
import { Service } from '../../models/service.model';

function getFormMock(): UntypedFormGroup {
  return new UntypedFormBuilder().group({
    search: ''
  });
}

class MockServiceTableFilterService {
  get filterCriteria(): Observable<ServiceFilterCriteria> {
    return of({
      isOfferedService: {
        value: false,
        isEnabled: false
      }
    });
  }

  get pristineFilterCriteria(): Observable<ServiceFilterCriteria> {
    return this.filterCriteria;
  }
}

class MockServiceTableSettingService {
  unmaintainedInfo = of(false);
}

class MockMultiSelectDataService {
  get mode(): Observable<MultiSelectMode> {
    return of(MultiSelectMode.COPY);
  }

  get copyStatus(): Observable<boolean> {
    return of(false);
  }
}

describe('ServiceTableLayoutComponent', () => {
  const serviceFilterCriteriaMock: ServiceFilterCriteria = {
    isOfferedService: {
      value: true,
      isEnabled: false
    }
  };

  let component: ServiceTableLayoutComponent;
  let fixture: ComponentFixture<ServiceTableLayoutComponent>;

  let keysPipeSpy: Spy<KeysPipe>;
  let matDialogSpy: Spy<MatDialog>;
  let snackbarServiceSpy: Spy<SnackBarService>
  let userServiceSpy: Spy<UserService>

  beforeEach(waitForAsync(() => {
    keysPipeSpy = createSpyFromClass(KeysPipe);
    matDialogSpy = createSpyFromClass(MatDialog);
    snackbarServiceSpy = createSpyFromClass(SnackBarService)
    userServiceSpy = createSpyFromClass(UserService)

    userServiceSpy.getPermissions.nextWith(['services.service.detaildescription.update'])

    TestBed.configureTestingModule({
      declarations: [ServiceTableLayoutComponent],
      imports: [MatTableModule],
      providers: [
        UntypedFormBuilder,
        TranslatePipeMock,
        { provide: KeysPipe, useValue: keysPipeSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: ServiceTableFilterService, useClass: MockServiceTableFilterService },
        { provide: ServiceTableSettingService, useClass: MockServiceTableSettingService },
        { provide: MultiSelectDataService, useClass: MockMultiSelectDataService },
        { provide: SnackBarService, useValue: snackbarServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTableLayoutComponent);
    component = fixture.componentInstance;
    component.searchFormGroup = getFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openServiceFilterDialog', () => {
    it('should pass filter criteria', done => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(serviceFilterCriteriaMock) });

      component.openServiceFilterDialog();
      const search = component.searchFormGroup.controls['search'];

      expect(search.value).toBeNull();
      expect(component.servicesFilter).toBeTruthy();
      done();
    });

    it('should do nothing if close dialog', done => {
      const spy = jest.spyOn(component.servicesFilter, 'emit');
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(false) });

      component.openServiceFilterDialog();

      const search = component.searchFormGroup.controls['search'];

      expect(search.value).toBeFalsy();
      expect(spy).not.toHaveBeenCalled();
      done();
    });
  });

  describe('openServiceDetailDescriptionDialog', () => {
    it('should open dialog if trigger', () => {
      component.openServiceDetailDescriptionDialog(1);

      expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
    });
  });

  it('should order by specified product group order', () => {
    const result = component.orderBy([{ brandId: 'MB', productGroupId: 'VAN' }, { brandId: 'MB', productGroupId: 'PC' }])

    expect(result).toEqual([{ brandId: 'MB', productGroupId: 'PC' }, { brandId: 'MB', productGroupId: 'VAN' }])
  })

  it('set hover service id', () => {
    const rowSelectedClearSpy = spyOn(component.rowSelected, 'clear')
    const rowSelectedSetSpy = spyOn(component.rowSelected, 'set')

    component.setHoverServiceId(1, true)

    expect(rowSelectedClearSpy).toBeCalledTimes(1)
    expect(rowSelectedSetSpy).toBeCalledWith(1, true)
  })

  describe('show icon', () => {
    it('should show icon if row selected, user has permission to update and detail description is NOT empty', () => {
      component.canUpdate = true
      const mockService: Service = { id: 7, name: 'test service', detailDescription: "lala", position: 1, active: true, openingHoursSupport: true }
      component.rowSelected.set(7, true)

      const result = component.showServicesDetailsIcon(mockService)

      expect(result).toBeTruthy()
    })

    it('should show icon if row selected, user has permission to update and detail description is empty', () => {
      component.canUpdate = true
      const mockService: Service = { id: 7, name: 'test service', detailDescription: "", position: 1, active: true, openingHoursSupport: true }
      component.rowSelected.set(7, true)

      const result = component.showServicesDetailsIcon(mockService)

      expect(result).toBeTruthy()
    })

    it('should NOT show icon if row is NOT selected, user has permission to update and detail description is NOT empty', () => {
      component.canUpdate = true
      const mockService: Service = { id: 7, name: 'test service', detailDescription: "test", position: 1, active: true, openingHoursSupport: true }
      component.rowSelected.set(7, false)

      const result = component.showServicesDetailsIcon(mockService)

      expect(result).toBeFalsy()
    })

    it('should show icon if row selected, user CANNOT update and detail description is NOT empty', () => {
      component.canUpdate = false
      const mockService: Service = { id: 7, name: 'test service', detailDescription: "lala", position: 1, active: true, openingHoursSupport: true }
      component.rowSelected.set(7, true)

      const result = component.showServicesDetailsIcon(mockService)

      expect(result).toBeTruthy()
    })

    it('should NOT show icon if row selected, user CANNOT update and detail description is empty', () => {
      component.canUpdate = false
      const mockService: Service = { id: 7, name: 'test service', position: 1, active: true, openingHoursSupport: true }
      component.rowSelected.set(7, true)

      const result = component.showServicesDetailsIcon(mockService)

      expect(result).toBeFalsy()
    })

    it('should NOT show icon if row is NOT selected, user CANNOT update and detail description is NOT empty', () => {
      component.canUpdate = false
      const mockService: Service = { id: 7, name: 'test service', detailDescription: "test", position: 1, active: true, openingHoursSupport: true }
      component.rowSelected.set(7, false)

      const result = component.showServicesDetailsIcon(mockService)

      expect(result).toBeFalsy()
    })
  })
});
