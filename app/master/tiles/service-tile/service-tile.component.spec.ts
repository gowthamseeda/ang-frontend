import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterServiceService } from '../../service/master-service/master-service.service';

import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { ServiceTileComponent } from './service-tile.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

describe('ServiceTileComponent', () => {
  let component: ServiceTileComponent;
  let masterServiceServiceSpy: Spy<MasterServiceService>;
  let sortingServiceSpy: Spy<SortingService>;
  let fixture: ComponentFixture<ServiceTileComponent>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let serviceName: string;
  let serviceId: number;
  let userSettingsServiceSpy: Spy<UserSettingsService>;

  beforeEach(waitForAsync(() => {
    masterServiceServiceSpy = createSpyFromClass(MasterServiceService);
    masterServiceServiceSpy.getAll.nextWith([]);
    masterServiceServiceSpy.delete.nextWith();
    sortingServiceSpy = createSpyFromClass(SortingService);
    sortingServiceSpy.sortByName.mockReturnValue('');
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
    userSettingsServiceSpy.getLanguageId.nextWith('en');

    serviceName = 'Electric Drive';
    serviceId = 1;

    TestBed.configureTestingModule({
      declarations: [ServiceTileComponent],
      imports: [TestingModule],
      providers: [
        { provide: MasterServiceService, useValue: masterServiceServiceSpy },
        { provide: SortingService, useValue: sortingServiceSpy },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search service name', () => {
    component.searchServiceName(serviceName);
    expect(component.searchText).toEqual(serviceName);
  });

  describe('deleteService()', () => {
    beforeEach(() => {
      component.deleteService(serviceId);
    });

    it('should delete the service', () => {
      expect(masterServiceServiceSpy.delete).toHaveBeenCalledWith(serviceId);
    });

    it('should give a success message', () => {
      masterServiceServiceSpy.delete.nextWith();
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DELETE_SERVICE_SUCCESS');
    });

    it('should give a error message', () => {
      const error = new Error('Error!');
      masterServiceServiceSpy.delete.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
