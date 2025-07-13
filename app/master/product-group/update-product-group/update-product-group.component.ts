import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterProductGroup } from '../master-product-group/master-product-group.model';
import { MasterProductGroupService } from '../master-product-group/master-product-group.service';

@Component({
  selector: 'gp-update-product-group',
  templateUrl: './update-product-group.component.html',
  styleUrls: ['./update-product-group.component.scss']
})
export class UpdateProductGroupComponent implements OnInit {
  productGroupForm: UntypedFormGroup;
  id: string;
  productGroupName: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private productGroupService: MasterProductGroupService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initProductGroupForm();
    this.getProductGroupIdByRouteParams().subscribe(() => {
      this.initProductGroup();
    });
  }

  submit(productGroup: MasterProductGroup): void {
    productGroup.id = this.id;

    this.productGroupService.update(productGroup).subscribe(
      () => {
        this.productGroupService.clearCacheAndFetchAll();
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('UPDATE_PRODUCT_GROUP_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  initProductGroupForm(): void {
    this.productGroupForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      shortName: ['', [Validators.required, Validators.maxLength(256)]],
      position: [{ value: {} }],
      translations: [{ value: {} }]
    });
  }

  private getProductGroupIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        const id = params.get('id');
        return (this.id = id ? id : '');
      })
    );
  }

  private initProductGroup(): void {
    this.productGroupService.fetchBy(this.id).subscribe((productGroup: MasterProductGroup) => {
      this.productGroupName = productGroup.name;
      this.productGroupForm.patchValue({
        id: productGroup.id,
        name: productGroup.name,
        shortName: productGroup.shortName,
        position: productGroup.position,
        translations: productGroup.translations
      });
    });
  }
}
