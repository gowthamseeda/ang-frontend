import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../../testing/testing.module';
import { DealerGroupsService } from '../../../dealer-groups/dealer-groups.service';
import { dealerGroupsMock } from '../../../dealer-groups/model/dealer-groups.mock';
import { GeneralGroupsService } from '../../../general-groups/general-groups.service';
import { generalGroupsMock } from '../../../general-groups/model/general-groups.mock';

import { SuccessorSelectionComponent } from './successor-selection.component';

describe('SuccessorSelectionComponent', () => {
  let component: SuccessorSelectionComponent;
  let fixture: ComponentFixture<SuccessorSelectionComponent>;
  let dealerGroupsServiceSpy: Spy<DealerGroupsService>;
  let generalGroupsServiceSpy: Spy<GeneralGroupsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(() => {
    dealerGroupsServiceSpy = createSpyFromClass(DealerGroupsService);
    generalGroupsServiceSpy = createSpyFromClass(GeneralGroupsService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    TestBed.configureTestingModule({
      declarations: [SuccessorSelectionComponent],
      imports: [TestingModule],
      providers: [
        { provide: DealerGroupsService, useValue: dealerGroupsServiceSpy },
        { provide: GeneralGroupsService, useValue: generalGroupsServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: { generalGroupId : 'GG00000001' } },
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    generalGroupsServiceSpy.getAll.nextWith(generalGroupsMock);
    dealerGroupsServiceSpy.getAll.nextWith(dealerGroupsMock);
    fixture = TestBed.createComponent(SuccessorSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should handle get general groups', () => {

    it('should get general groups', () => {
      component.ngOnInit();
      expect(component.dataSource.data).toMatchObject(generalGroupsMock.generalGroups.slice(1, 3));
      expect(component.isLoading).toBeFalsy();
    });

    it('should handle get general groups error', () => {
      const errorMessage = 'error';
      generalGroupsServiceSpy.getAll.throwWith(errorMessage);
      component.ngOnInit();
      expect(component.isLoading).toBeFalsy();
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('should handle get dealer groups', () => {

    it('should get dealer groups', () => {
      component.data = { dealerGroupId : 'DG00000001' };
      component.ngOnInit();
      expect(component.dataSource.data).toMatchObject(dealerGroupsMock.dealerGroups.slice(1, 3));
      expect(component.isLoading).toBeFalsy();
    });

    it('should handle get dealer groups error', () => {
      component.data = { dealerGroupId : 'DG00000001' };
      const errorMessage = 'error';
      dealerGroupsServiceSpy.getAll.throwWith(errorMessage);
      component.ngOnInit();
      expect(component.isLoading).toBeFalsy();
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('should filter table', () => {
    component.dataSource.data = [
      ...generalGroupsMock.generalGroups.filter(generalGroup => generalGroup.active),
      {
        generalGroupId: 'GG00000006',
        name: 'General Group 2',
        active: true,
        country: {
          id: 'GB',
          name: 'United Kingdom'
        }
      }
    ];
    component.filterTable('Group 2');
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(
      component.dataSource.filteredData.find(member => member.name === 'General Group 2')
    ).toBeTruthy();
  });
});
