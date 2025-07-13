import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Subject } from 'rxjs';

import { MasterBrand } from '../../../../../brand/master-brand/master-brand.model';
import { MasterBrandService } from '../../../../../brand/master-brand/master-brand.service';

@Component({
  selector: 'gp-brand-selector',
  templateUrl: './brand-selector.component.html',
  styleUrls: ['./brand-selector.component.scss']
})
export class BrandSelectorComponent implements OnInit, OnDestroy {
  @Input() control: UntypedFormControl;
  @Output()
  selectionChange = new EventEmitter<string>();

  brands: MasterBrand[] = [];

  private unsubscribe = new Subject<void>();

  constructor(private brandService: MasterBrandService) {}

  ngOnInit(): void {
    this.brandService.getAll().subscribe(brands => {
      this.brands = brands;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onChange(changeEvent: MatSelectChange): void {
    this.selectionChange.emit(changeEvent.value);
  }

  getControlValue(): string {
    return this.control.value;
  }
}
