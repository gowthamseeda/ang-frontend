import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterBrand } from '../master-brand/master-brand.model';
import { MasterBrandService } from '../master-brand/master-brand.service';

@Component({
  selector: 'gp-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.scss']
})
export class UpdateBrandComponent implements OnInit {
  brandForm: UntypedFormGroup;
  id: string;
  brandName: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private brandService: MasterBrandService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initBrandForm();
    this.getBrandIdByRouteParams().subscribe(() => {
      this.initBrand();
    });
  }

  submit(brand: MasterBrand): void {
    brand.id = this.id;

    this.brandService.update(brand).subscribe(
      () => {
        this.brandService.clearCacheAndFetchAll();
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('UPDATE_BRAND_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  initBrandForm(): void {
    this.brandForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required]],
      position: [{ value: {} }]
    });
  }

  private initBrand(): void {
    this.brandService.fetchBy(this.id).subscribe((brand: MasterBrand) => {
      this.brandName = brand.name;
      this.brandForm.patchValue({
        id: this.id,
        name: brand.name,
        position: brand.position
      });
    });
  }

  private getBrandIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        const id = params.get('id');
        return (this.id = id ? id : '');
      })
    );
  }
}
