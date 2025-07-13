import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
//import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { DealerGroupHeadquarter } from '../../../models/dealer-group.model';
import { dealerGroupsMock } from '../../model/dealer-groups.mock';
import { DealerGroupHeadquarterSelectionComponent } from '../dealer-group-headquarter-selection/dealer-group-headquarter-selection.component';

import { DealerGroupHeadquarterComponent } from './dealer-group-headquarter.component';
//import { createSpyFromClass, Spy } from 'jest-auto-spies';

@Component({
  template:
    '<gp-dealer-group-headquarter [headquarter]="headquarterFromHost"></gp-dealer-group-headquarter>'
})
class TestDealerGroupHeadquarterComponentHostComponent {
  @ViewChild(DealerGroupHeadquarterComponent)
  dealerGroupHeadquarterComponent: any;
  headquarterFromHost: DealerGroupHeadquarter;
}
class DistributionLevelsServiceStub {
  get = () => of([]);
}

describe('DealerGroupHeadquarterComponent', () => {
  let component: DealerGroupHeadquarterComponent;
  let fixture: ComponentFixture<DealerGroupHeadquarterComponent>;
  const distributionLevelsServiceStub = new DistributionLevelsServiceStub();

  beforeEach(waitForAsync(() => {
    //matDialogSpy = createSpyFromClass(MatDialog);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatDialogModule],
      declarations: [DealerGroupHeadquarterComponent],
      providers: [{ provide: DistributionLevelsService, useValue: distributionLevelsServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerGroupHeadquarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('removeHeadquarter', () => {
    it('should emit headquarterRemoved', () => {
      spyOn(component.headquarterRemoved, 'emit');

      component.removeHeadquarter();
      expect(component.headquarterRemoved.emit).toHaveBeenCalled();
    });
  });

  describe('openSelectDealerGroupHeadquarterList', () => {
    it('should open select dealer group headquarter dialog and after closed emit value', () => {
      const selectedOutlet = {
        id: 'GS00000002',
        legalName: 'John Gill',
        address: {
          city: 'London'
        },
        isRegisteredOffice: false,
        countryId: 'GB',
        countryName: 'United Kingdom'
      };

      spyOn(component.matDialog, 'open').and.returnValue({ afterClosed: () => of(selectedOutlet) });
      spyOn(component.headquarterAddedOrUpdated, 'emit');

      component.openSelectDealerGroupHeadquarterList();
      expect(component.matDialog.open).toHaveBeenCalled();
      expect(component.headquarterAddedOrUpdated.emit).toHaveBeenCalledWith(selectedOutlet);
    });

    it('should call open and pass in current headquarter id as excluded headquarter id when headquarter exists', () => {
      spyOn(component.matDialog, 'open').and.returnValue({ afterClosed: () => of() });

      component.headquarter = {
        id: 'GS00000002',
        legalName: 'John Gill',
        address: {
          city: 'London'
        },
        isRegisteredOffice: false
      };
      component.openSelectDealerGroupHeadquarterList();
      expect(component.matDialog.open).toHaveBeenCalledWith(
        DealerGroupHeadquarterSelectionComponent,
        {
          width: '650px',
          height: '650px',
          data: {
            excludedHeadquarterId: 'GS00000002'
          }
        }
      );
    });
  });

  it('should not emit value if after closed result is undefined', () => {
    spyOn(component.matDialog, 'open').and.returnValue({ afterClosed: () => of(undefined) });
    spyOn(component.headquarterAddedOrUpdated, 'emit');

    component.openSelectDealerGroupHeadquarterList();
    expect(component.matDialog.open).toHaveBeenCalled();
    expect(component.headquarterAddedOrUpdated.emit).toHaveBeenCalledTimes(0);
  });
});

describe('TestDealerGroupHeadquarterComponentHostComponent', () => {
  let hostComponent: TestDealerGroupHeadquarterComponentHostComponent;
  let fixture: ComponentFixture<TestDealerGroupHeadquarterComponentHostComponent>;
  const distributionLevelsServiceStub = new DistributionLevelsServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatDialogModule],
      declarations: [
        DealerGroupHeadquarterComponent,
        TestDealerGroupHeadquarterComponentHostComponent
      ],
      providers: [{ provide: DistributionLevelsService, useValue: distributionLevelsServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDealerGroupHeadquarterComponentHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnChanges', () => {
    it('should get distribution levels', () => {
      //spyOn(distributionLevelsServiceStub, 'get').and.returnValue(of(['RETAILER'])); <-- prev version using jasmine spyOn
      //left empty array bcs get() return type is empty []
      //jest.spyOn(distributionLevelsServiceStub, 'get').mockReturnValue(of([]));
      spyOn(distributionLevelsServiceStub, 'get').and.returnValue(of(['RETAILER']));

      hostComponent.headquarterFromHost = dealerGroupsMock.dealerGroups[0].headquarter;
      const childComponent = hostComponent.dealerGroupHeadquarterComponent;

      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();
      expect(childComponent.ngOnChanges).toHaveBeenCalled();

      expect(childComponent.headquarter).toEqual(dealerGroupsMock.dealerGroups[0].headquarter);
      expect(childComponent.distributionLevelChips).toEqual(['RETAILER']);
    });
  });
});
