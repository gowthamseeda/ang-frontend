import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import { TranslateService} from '@ngx-translate/core';
import { Observable} from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import {BrandService} from "../../../services/brand/brand.service";
import {Brand} from "../../../master/shared/brand-selection/brand-selection.component";

@Component({
  selector: 'gp-single-brand-selection',
  templateUrl: './single-brand-selection.component.html'
})
export class SingleBrandSelectionComponent implements OnInit {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  uppercaseLabel = false;
  @Input()
  placeholderTranslation = 'BRAND';
  @Input()
  allowEmptyOption = false;
  @Input()
  required = true;
  @Input()
  brand: string | null;
  @Output()
  selectionChange: EventEmitter<string> = new EventEmitter<string>();

  allBrands: Observable<Brand[]>;
  currentSelectedLanguage = this.translateService.currentLang;

  constructor(private brandService: BrandService, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.initBrandFormControl();
    this.initBrand();
  }

  private initBrandFormControl(): void {
    this.parentForm.addControl(
      'brand',
      new UntypedFormControl(
        { value: this.brand, disabled: this.parentForm.disabled },
        Validators.required
      )
    );
  }

  emitChange(changeEvent: MatSelectChange): void {
    this.selectionChange.emit(changeEvent.value);
  }


  private initBrand(): void {
    this.allBrands = this.brandService.getAll();
  }
}
