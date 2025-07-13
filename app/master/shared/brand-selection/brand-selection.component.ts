import { Component, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BrandService } from '../../../services/brand/brand.service';

export interface Brand {
  id: string;
  name: string;
}
@Component({
  selector: 'gp-brand-selection',
  templateUrl: './brand-selection.component.html',
  styleUrls: ['./brand-selection.component.scss']
})
export class BrandSelectionComponent {
  @Input()
  fControl: UntypedFormControl;
  @Input()
  placeholder: string;
  @Input()
  required = true;
  @Input()
  floatLabel: string;

  allBrands: Brand[] = []

  private unsubscribe = new Subject<void>();

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
   this.brandService.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(allBrands => {
        this.allBrands = allBrands;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  change(): void {
    this.fControl.markAsDirty();
    this.fControl.markAsTouched();
  }
}
