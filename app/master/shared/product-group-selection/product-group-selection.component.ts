import { Component, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductGroupService } from '../../../services/product-group/product-group.service';
import { ProductGroup } from "../../../services/product-group/product-group.model";

@Component({
  selector: 'gp-product-group-selection',
  templateUrl: './product-group-selection.component.html',
  styleUrls: ['./product-group-selection.component.scss']
})
export class ProductGroupSelectionComponent {
  @Input()
  fControl: UntypedFormControl;
  @Input()
  placeholder: string;
  @Input()
  required = true;
  @Input()
  floatLabel: string;

  allProductGroups: ProductGroup[] = []

  private unsubscribe = new Subject<void>();

  constructor(private ProductGroupService: ProductGroupService) {}

  ngOnInit(): void {
   this.ProductGroupService.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(allProductGroups => {
        this.allProductGroups = allProductGroups;
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
