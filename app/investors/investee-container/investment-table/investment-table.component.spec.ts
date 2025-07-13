import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { InvesteeMock } from '../../investee/investee.mock';
import { Investment } from '../../investee/investee.model';

import { InvestmentTableComponent } from './investment-table.component';

describe('InvestmentTableComponent', () => {
  const investmentsMock = InvesteeMock.asList()[0].investments;

  let component: InvestmentTableComponent;
  let fixture: ComponentFixture<InvestmentTableComponent>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(
    waitForAsync(() => {
      matDialogSpy = createSpyFromClass(MatDialog);

      TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          ReactiveFormsModule,
          MatTableModule,
          MatFormFieldModule,
          MatInputModule
        ],
        declarations: [InvestmentTableComponent, TranslatePipeMock],
        providers: [{ provide: MatDialog, useValue: matDialogSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentTableComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit()', () => {
    it('should init all columns if there are investments', done => {
      component.investments = of(investmentsMock);
      fixture.detectChanges();

      component.columnsToDisplay.subscribe(columnsToDisplay => {
        expect(columnsToDisplay).toEqual([
          'legalName',
          'address',
          'brands',
          'share',
          'value',
          'actions'
        ]);
        done();
      });
    });

    it('should init just a few columns if there are no investments', done => {
      component.investments = of([]);
      fixture.detectChanges();

      component.columnsToDisplay.subscribe(columnsToDisplay => {
        expect(columnsToDisplay).toEqual(['legalName', 'address', 'brands']);
        done();
      });
    });

    describe('openInvestorDialog', () => {
      beforeEach(() => {
        component.investments = of([]);
        jest.spyOn(component.addInvestment, 'emit');
      });

      it('should emit the investment returned when closing the dialog', () => {
        matDialogSpy.open.mockReturnValue({ afterClosed: () => of(investmentsMock[0]) });
        component.openInvestorDialog();
        fixture.detectChanges();

        expect(component.addInvestment.emit).toHaveBeenCalledWith(investmentsMock[0]);
      });

      it('should emit nothing if no investment is returned when closing the dialog', () => {
        matDialogSpy.open.mockReturnValue({ afterClosed: () => of(undefined) });
        component.openInvestorDialog();
        fixture.detectChanges();

        expect(component.addInvestment.emit).not.toHaveBeenCalled();
      });
    });

    describe('updateInvestmentIssuedShareCapitalValue()', () => {
      beforeEach(() => {
        component.investments = of(investmentsMock);
        fixture.detectChanges();
        jest.spyOn(component.updateInvestment, 'emit');
      });

      it('should emit update investment when issued share capital changes', () => {
        const issuedShareCapitalValue = 5000;
        const investment: Investment = investmentsMock[0];
        const expected = {
          investorId: investment.investorId,
          issuedShareCapitalValue
        };
        component.updateInvestmentIssuedShareCapitalValue(investment, issuedShareCapitalValue);
        expect(component.updateInvestment.emit).toHaveBeenCalledWith(expected);
      });

      it('should not emit update investment when form control is invalid', () => {
        component.investmentsFormGroup
          .get(['investments', 0, 'issuedShareCapitalValue'])
          ?.setValue('100$');
        fixture.detectChanges();
        expect(component.updateInvestment.emit).not.toHaveBeenCalled();
      });
    });

    describe('updateInvestmentIssuedShare()', () => {
      beforeEach(() => {
        component.investments = of(investmentsMock);
        fixture.detectChanges();
        jest.spyOn(component.updateInvestment, 'emit');
      });

      it('should emit update investment when issued share changes', () => {
        const issuedShare = 100;
        const investment: Investment = investmentsMock[0];
        const expected = {
          investorId: investment.investorId,
          issuedShare
        };
        component.updateInvestmentIssuedShare(investment, issuedShare);
        expect(component.updateInvestment.emit).toHaveBeenCalledWith(expected);
      });

      it('should not emit update investment when form control is invalid', () => {
        component.investmentsFormGroup.get(['investments', 0, 'issuedShare'])?.setValue('1000');
        fixture.detectChanges();
        expect(component.updateInvestment.emit).not.toHaveBeenCalled();
      });
    });
  });
});
