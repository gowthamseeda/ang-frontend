import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { getOutletMock } from '../../../../legal-structure/shared/models/outlet.mock';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { AdminType, ConstraintType } from '../../models/outlet.model';
import { Precondition } from '../../service/api/admin-response.model';

import { SummaryTableComponent } from './summary-table.component';

const preconditionsMock: Precondition[] = [
  {
    type: ConstraintType.TASK,
    ids: ['1'],
    messages: ['constraint found']
  },
  {
    type: ConstraintType.OTHER,
    messages: ['XXX']
  }
];

@Component({
  template: '<gp-summary-table [preconditions]="preconditions" ></gp-summary-table>'
})
class TestComponent {
  @ViewChild(SummaryTableComponent)
  public serviceVariantConfigureTable: SummaryTableComponent;
  preconditions: Precondition[] = preconditionsMock;
}

describe('SummaryTableComponent', () => {
  let translateService: Spy<TranslateService>;
  let outletServiceSpy: Spy<OutletService>;
  let featureToggleService: Spy<FeatureToggleService>;

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    translateService = createSpyFromClass(TranslateService);
    outletServiceSpy = createSpyFromClass(OutletService);
    outletServiceSpy.getCompany.nextWith(getOutletMock());

    await TestBed.configureTestingModule({
      imports: [MatTableModule, RouterTestingModule],
      declarations: [SummaryTableComponent, TestComponent, TranslatePipeMock],
      providers: [
        { provide: TranslateService, useValue: translateService },
        { provide: OutletService, useValue: outletServiceSpy },
        { provide: FeatureToggleService, useValue: { isFeatureEnabled: jest.fn() } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    featureToggleService = TestBed.inject<any>(FeatureToggleService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    it('first load component', done => {
      spyOn(component.serviceVariantConfigureTable, 'initDefaultConstraintTypes');
      spyOn(component.serviceVariantConfigureTable, 'createTableDataForPreconditions');
      component.serviceVariantConfigureTable.ngOnChanges();

      expect(component.serviceVariantConfigureTable.initDefaultConstraintTypes).toHaveBeenCalled();
      expect(
        component.serviceVariantConfigureTable.createTableDataForPreconditions
      ).toHaveBeenCalled();
      done();
    });
  });

  describe('createTableDataForPreconditions()', () => {
    it('create link for precondition', done => {
      spyOn(component.serviceVariantConfigureTable, 'mapPreconditionToTableItem');

      component.serviceVariantConfigureTable.createTableDataForPreconditions(preconditionsMock);

      expect(component.serviceVariantConfigureTable.mapPreconditionToTableItem).toHaveBeenCalled();
      done();
    });
  });

  describe('mapPreconditionToTableData()', () => {
    it('map precondition to table data', done => {
      spyOn(component.serviceVariantConfigureTable, 'translateDescription');

      preconditionsMock.forEach(precondition => {
        const result =
          component.serviceVariantConfigureTable.mapPreconditionToTableItem(precondition);

        expect(result.type).toEqual(precondition.type);
        expect(result.messages).toEqual(precondition.messages);
        expect(component.serviceVariantConfigureTable.translateDescription).toHaveBeenCalled();
      });
      done();
    });
  });

  describe('goTo()', () => {
    it('link with id when type is TASK', done => {
      const windowSpy = spyOn(window, 'open');

      component.serviceVariantConfigureTable.goTo(ConstraintType.TASK, '1');
      expect(windowSpy).toHaveBeenCalledWith(expect.stringContaining('/tasks/1'), '_blank');
      done();
    });

    it('link with id when type is DEALERGROUP', done => {
      const windowSpy = spyOn(window, 'open');
      component.serviceVariantConfigureTable.goTo(ConstraintType.DEALERGROUP, '1');
      expect(windowSpy).toHaveBeenCalledWith(
        expect.stringContaining('/structures/dealer-groups/1/edit'),
        '_blank'
      );
      done();
    });

    it('link with id when type is REGIONALCENTER', done => {
      const windowSpy = spyOn(window, 'open');
      component.serviceVariantConfigureTable.goTo(ConstraintType.REGIONALCENTER, '1');
      expect(windowSpy).toHaveBeenCalledWith(
        expect.stringContaining('/structures/regional-center'),
        '_blank'
      );
      done();
    });

    it('link with id when type is MARKETAREA', done => {
      const windowSpy = spyOn(window, 'open');
      component.serviceVariantConfigureTable.goTo(ConstraintType.MARKETAREA, '1');
      expect(windowSpy).toHaveBeenCalledWith(
        expect.stringContaining('/structures/market-area'),
        '_blank'
      );
      done();
    });

    it('link with id when type is OUTLETSTRUCTURE', done => {
      const windowSpy = spyOn(window, 'open');
      component.serviceVariantConfigureTable.goTo(ConstraintType.OUTLETSTRUCTURE, 'GS01');
      expect(windowSpy).toHaveBeenCalledWith(expect.stringContaining('/outlet/GS01'), '_blank');
      done();
    });

    it('link with id when type is BUSINESSSITEINACTIVE', done => {
      const windowSpy = spyOn(window, 'open');
      component.serviceVariantConfigureTable.goTo(ConstraintType.BUSINESSSITEINACTIVE, 'GS01');
      expect(windowSpy).toHaveBeenCalledWith(expect.stringContaining('/outlet/GS01'), '_blank');
      done();
    });

    it('link with id when type is OTHER', done => {
      const windowSpy = spyOn(window, 'open');
      component.serviceVariantConfigureTable.goTo(ConstraintType.OTHER, '');
      expect(windowSpy).not.toHaveBeenCalled();
      done();
    });

    it('link with id when type is COMPANYINACTIVE', done => {
      const windowSpy = spyOn(window, 'open');
      spyOn(component.serviceVariantConfigureTable, 'getRegisteredOfficeId').and.returnValue(
        of('GS01')
      );
      component.serviceVariantConfigureTable.goTo(ConstraintType.COMPANYINACTIVE, 'GC01');
      expect(component.serviceVariantConfigureTable.getRegisteredOfficeId).toHaveBeenCalled();
      expect(windowSpy).toHaveBeenCalledWith(expect.stringContaining('/outlet/GS01'), '_blank');
      done();
    });

    it('link with id when type is CONTRACTEE and CONTRACT_PARTNER features disabled', done => {
      const windowSpy = spyOn(window, 'open');
      spyOn(component.serviceVariantConfigureTable, 'getRegisteredOfficeId').and.returnValue(
        of('GS01')
      );
      spyOn(featureToggleService, 'isFeatureEnabled').and.returnValue(of(false));
      component.serviceVariantConfigureTable.goTo(ConstraintType.CONTRACTEE, 'GC01');
      expect(component.serviceVariantConfigureTable.getRegisteredOfficeId).toHaveBeenCalled();
      expect(windowSpy).toHaveBeenCalledWith(expect.stringContaining('/outlet/GS01'), '_blank');
      done();
    });

    it('link with id when type is CONTRACTEE and CONTRACT_PARTNER features enabled', done => {
      const windowSpy = spyOn(window, 'open');
      spyOn(featureToggleService, 'isFeatureEnabled').and.returnValue(of(true));
      component.serviceVariantConfigureTable.goTo(ConstraintType.CONTRACTEE, 'GS01');
      expect(windowSpy).toHaveBeenCalledWith(expect.stringContaining('/outlet/GS01'), '_blank');
      done();
    });
  });

  describe('translateForMoveOutlet()', () => {
    it('type same to value OTHER', done => {
      translateService.instant.mockReturnValue('Others');

      const result = component.serviceVariantConfigureTable.translateForMoveOutlet(
        ConstraintType.OTHER
      );
      expect(result).toEqual('Others');
      done();
    });

    it('type NOT same to value OTHER', done => {
      const result = component.serviceVariantConfigureTable.translateForMoveOutlet(
        ConstraintType.MARKETAREA
      );
      expect(result).not.toEqual('Others');
      done();
    });
  });

  describe('translateForSwitchRegisteredOffice()', () => {
    it('type same to value OTHER', done => {
      translateService.instant.mockReturnValue('Others');

      const result = component.serviceVariantConfigureTable.translateForSwitchRegisteredOffice(
        ConstraintType.OTHER
      );
      expect(result).toEqual('Others');
      done();
    });

    it('type NOT same to value OTHER', done => {
      const result = component.serviceVariantConfigureTable.translateForSwitchRegisteredOffice(
        ConstraintType.MARKETAREA
      );
      expect(result).not.toEqual('Others');
      done();
    });
  });

  describe('initDefaultConstraintTypes()', () => {
    it('move outlet', done => {
      const result = component.serviceVariantConfigureTable.initDefaultConstraintTypes(
        AdminType.moveOutlet
      );

      expect(result).toEqual([
        ConstraintType.COMPANYINACTIVE,
        ConstraintType.BUSINESSSITEINACTIVE,
        ConstraintType.MOVEREGISTEREDOFFICE,
        ConstraintType.OUTLETSTRUCTURE,
        ConstraintType.CONTRACTEE,
        ConstraintType.TASK,
        ConstraintType.OTHER
      ]);
      done();
    });
    it('switch registered office', done => {
      const result = component.serviceVariantConfigureTable.initDefaultConstraintTypes(
        AdminType.switchRegisteredOffice
      );

      expect(result).toEqual([
        ConstraintType.BUSINESSSITEINACTIVE,
        ConstraintType.CONTRACTEE,
        ConstraintType.DEALERGROUP,
        ConstraintType.MARKETAREA,
        ConstraintType.REGIONALCENTER,
        ConstraintType.TASK,
        ConstraintType.OTHER
      ]);
      done();
    });
  });

  describe('navigateToLocation', () => {
    it('should navigate to a specific location', () => {
      const windowSpy = spyOn(window, 'open');
      const url = `outlet/GS01`;
      component.serviceVariantConfigureTable.navigateToLocation(url);
      expect(windowSpy).toHaveBeenCalledWith(expect.stringContaining(url), '_blank');
    });
  });
});
