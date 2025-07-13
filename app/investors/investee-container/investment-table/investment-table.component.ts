import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Investment } from 'app/investors/investee/investee.model';
import { UniversalValidators } from 'ngx-validators';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { InvestorDialogComponent } from '../investor-dialog/investor-dialog.component';

@Component({
  selector: 'gp-investment-table',
  templateUrl: './investment-table.component.html',
  styleUrls: ['./investment-table.component.scss']
})
export class InvestmentTableComponent implements OnInit, OnDestroy {
  @Input() shareCapitalCurrency: string;
  @Input() investments: Observable<ReadonlyArray<Investment>>;
  @Input() isLoaded: Observable<boolean>;
  @Output() removeInvestment = new EventEmitter<number>();
  @Output() addInvestment = new EventEmitter<Partial<Investment>>();
  @Output() updateInvestment = new EventEmitter<Partial<Investment>>();

  columnsToDisplay: Observable<string[]>;
  investmentsFormGroup: UntypedFormGroup;
  private unsubscribe = new Subject<void>();

  constructor(private dialog: MatDialog, private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initInvestmentsFormGroup();
    this.columnsToDisplay = this.investments.pipe(
      map(investments =>
        investments.length > 0
          ? ['legalName', 'address', 'brands', 'share', 'value', 'actions']
          : ['legalName', 'address', 'brands']
      )
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  openInvestorDialog(): void {
    this.dialog
      .open<InvestorDialogComponent, undefined, Investment>(InvestorDialogComponent, {
        height: '80vh'
      })
      .afterClosed()
      .subscribe(investment => {
        if (investment) {
          this.addInvestment.emit({
            issuedShareCapitalCurrency: this.shareCapitalCurrency,
            ...investment
          });
        }
      });
  }

  updateInvestmentIssuedShareCapitalValue(
    investment: Investment,
    issuedShareCapitalValue: number
  ): void {
    if (this.investmentsFormGroup.valid) {
      this.updateInvestment.emit({
        investorId: investment.investorId,
        issuedShareCapitalCurrency: this.shareCapitalCurrency,
        issuedShareCapitalValue
      });
    }
  }

  updateInvestmentIssuedShare(investment: Investment, issuedShare: number): void {
    if (this.investmentsFormGroup.valid) {
      this.updateInvestment.emit({
        investorId: investment.investorId,
        issuedShareCapitalCurrency: this.shareCapitalCurrency,
        issuedShare
      });
    }
  }

  private initInvestmentsFormGroup(): void {
    this.investments.pipe(takeUntil(this.unsubscribe)).subscribe(investments => {
      this.investmentsFormGroup = this.formBuilder.group({
        investments: this.formBuilder.array(
          investments.reduce(
            (accumulator, investment) => [
              ...accumulator,
              this.createInvestmentFormGroup(investment)
            ],
            []
          )
        )
      });
    });
  }

  private createInvestmentFormGroup(investment: Investment): UntypedFormGroup {
    return this.formBuilder.group({
      issuedShareCapitalValue: new UntypedFormControl(
        investment.issuedShareCapitalValue,
        Validators.compose([UniversalValidators.isNumber, UniversalValidators.min(0)])
      ),
      issuedShare: new UntypedFormControl(
        investment.issuedShare,
        Validators.compose([
          UniversalValidators.max(100),
          UniversalValidators.isNumber,
          UniversalValidators.min(0)
        ])
      )
    });
  }
}
