import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { AssignableType } from '../../../traits/label/label.model';
import { MasterBrand } from '../../brand/master-brand/master-brand.model';
import { MasterBrandService } from '../../brand/master-brand/master-brand.service';
import { MasterLabel } from '../../services/master-label/master-label.model';
import { MasterLabelService } from '../../services/master-label/master-label.service';

@Component({
  selector: 'gp-update-label',
  templateUrl: './update-label.component.html',
  styleUrls: ['./update-label.component.scss']
})
export class UpdateLabelComponent implements OnInit, OnDestroy {
  labelForm: UntypedFormGroup;
  assignableType = AssignableType;
  brands: MasterBrand[];
  id: string;
  labelName: string;

  private unsubscribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
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
    this.getIdByRouteParams()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.initLabel();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  submit(label: MasterLabel): void {
    label.id = +this.id;
    this.labelService
      .update(label)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.router.navigateByUrl('/master');
          this.snackBarService.showInfo('UPDATE_LABEL_SUCCESS');
        },
        error => {
          this.snackBarService.showError(error);
        }
      );
  }

  initLabelForm(): void {
    this.labelForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      assignableTo: ['', [Validators.required]],
      restrictedToBrandIds: [''],
      restrictedToCountryIds: [''],
      restrictedToDistributionLevels: [''],
      translations: [{ value: {} }]
    });
  }

  private initBrands(): void {
    this.brandService
      .getAll()
      .pipe(
        takeUntil(this.unsubscribe),
        map((brands: MasterBrand[]) => brands.sort(this.sortingService.sortByName))
      )
      .subscribe((brands: MasterBrand[]) => {
        this.brands = brands;
      });
  }

  private getIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        const id = params.get('id');
        return (this.id = id ? id : '');
      })
    );
  }

  private initLabel(): void {
    this.labelService
      .get(this.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((label: MasterLabel) => {
        this.labelName = label.name;
        this.labelForm.patchValue({
          id: this.id,
          name: label.name,
          assignableTo: label.assignableTo,
          restrictedToBrandIds: label.restrictedToBrandIds,
          restrictedToCountryIds: label.restrictedToCountryIds,
          restrictedToDistributionLevels: label.restrictedToDistributionLevels,
          translations: label.translations
        });
      });
  }
}
