import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterProductGroup } from '../master-product-group/master-product-group.model';
import { MasterProductGroupService } from '../master-product-group/master-product-group.service';

@Component({
  selector: 'gp-create-product-group',
  templateUrl: './create-product-group.component.html',
  styleUrls: ['./create-product-group.component.scss']
})
export class CreateProductGroupComponent implements OnInit {
  productGroupForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private productGroupService: MasterProductGroupService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initProductGroupForm();
  }

  submit(productGroup: MasterProductGroup): void {
    this.productGroupService.create(productGroup).subscribe(
      () => {
        this.productGroupService.clearCacheAndFetchAll();
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('CREATE_PRODUCT_GROUP_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  private initProductGroupForm(): void {
    this.productGroupForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[A-Z]*')]],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      shortName: ['', [Validators.required, Validators.maxLength(256)]]
    });
  }
}
