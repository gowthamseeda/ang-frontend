import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Investee } from 'app/investors/investee/investee.model';
import { ObservableInput } from 'ngx-observable-input';
import { UniversalValidators } from 'ngx-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gp-capital-form',
  templateUrl: './capital-form.component.html',
  styleUrls: ['./capital-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CapitalFormComponent implements OnInit, OnDestroy {
  @Input() isLoaded: Observable<boolean>;
  @Input()
  @ObservableInput()
  investee: Observable<Investee>;
  @Input() currencies: string[];
  @Output() update = new EventEmitter<Partial<Investee>>();
  @Output() changeValid = new EventEmitter<boolean>();

  // Int max = 2.147.483.647 ~ 2 Mrd.
  maxCapitalValue = 2000000000;
  shareCapitalCurrency: string;
  shareCapitalValue = new UntypedFormControl(
    0,
    Validators.compose([
      UniversalValidators.max(this.maxCapitalValue),
      UniversalValidators.isNumber,
      UniversalValidators.min(0)
    ])
  );

  private unsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.investee.pipe(takeUntil(this.unsubscribe)).subscribe(investee => {
      this.shareCapitalCurrency = investee?.shareCapitalCurrency;
      this.shareCapitalValue.setValue(investee?.shareCapitalValue);
    });

    this.shareCapitalValue.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(value => {
      this.changeValid.emit(this.shareCapitalValue.valid);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  updateShareCapitalCurrency(shareCapitalCurrency: string): void {
    this.update.emit({ shareCapitalCurrency });
  }

  updateShareCapitalValue(shareCapitalValue: string): void {
    this.update.emit({ shareCapitalValue: Number(shareCapitalValue) });
  }
}
