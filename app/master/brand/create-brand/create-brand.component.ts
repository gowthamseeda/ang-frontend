import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterBrand } from '../master-brand/master-brand.model';
import { MasterBrandService } from '../master-brand/master-brand.service';

@Component({
  selector: 'gp-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss']
})
export class CreateBrandComponent implements OnInit {
  brandForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private brandService: MasterBrandService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initBrandForm();
  }

  submit(brand: MasterBrand): void {
    this.brandService.create(brand).subscribe(
      () => {
        this.brandService.clearCacheAndFetchAll();
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('CREATE_BRAND_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  private initBrandForm(): void {
    this.brandForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[A-Z]*')]],
      name: ['', [Validators.required]]
    });
  }
}
