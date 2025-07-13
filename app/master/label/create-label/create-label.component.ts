import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { AssignableType } from '../../../traits/label/label.model';
import { MasterBrand } from '../../brand/master-brand/master-brand.model';
import { MasterBrandService } from '../../brand/master-brand/master-brand.service';
import { MasterLabel } from '../../services/master-label/master-label.model';
import { MasterLabelService } from '../../services/master-label/master-label.service';

@Component({
  selector: 'gp-create-label',
  templateUrl: './create-label.component.html',
  styleUrls: ['./create-label.component.scss']
})
export class CreateLabelComponent implements OnInit {
  labelForm: UntypedFormGroup;
  assignableType = AssignableType;
  brands: MasterBrand[];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private brandService: MasterBrandService,
    private sortingService: SortingService,
    private router: Router,
    private snackBarService: SnackBarService,
    private labelService: MasterLabelService
  ) {}

  ngOnInit(): void {
    this.initLabelForm();
    this.initBrands();
  }

  submit(label: MasterLabel): void {
    this.labelService.create(label).subscribe(
      () => {
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('CREATE_LABEL_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  private initLabelForm(): void {
    this.labelForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      assignableTo: ['', [Validators.required]],
      restrictedToBrandIds: ['']
    });
  }

  private initBrands(): void {
    this.brandService
      .getAll()
      .pipe(map((brands: MasterBrand[]) => brands.sort(this.sortingService.sortByName)))
      .subscribe((brands: MasterBrand[]) => {
        this.brands = brands;
      });
  }
}
