import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { MasterRetailCountryService } from '../../services/master-retail-country/master-retail-country.service';
import { MasterRetailCountry } from '../../services/master-retail-country/master-retail-country.model';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';

@Component({
  selector: 'gp-update-retail-country',
  templateUrl: './update-retail-country.component.html',
  styleUrls: ['./update-retail-country.component.scss']
})
export class UpdateRetailCountryComponent implements OnInit {
  retailCountryForm: UntypedFormGroup;
  id: string;
  retailCountryName: string;
  saveDisabled: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private masterRetailCountryService: MasterRetailCountryService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initRetailCountryForm();
    this.getRetailCountryIdByRouteParams().subscribe(() => this.initRetailCountry());
  }

  private initRetailCountryForm(): void {
    this.retailCountryForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(256)]]
    });
  }

  private getRetailCountryIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map(params => {
        const id = params.get('id');
        return (this.id = id ? id : '');
      })
    );
  }

  private initRetailCountry(): void {
    this.masterRetailCountryService.get(this.id).subscribe(retailCountry => {
      this.retailCountryName = retailCountry.name;
      this.retailCountryForm.patchValue({
        id: retailCountry.id,
        name: retailCountry.name
      });
      this.retailCountryForm.markAsPristine();
    });
  }

  submit(retailCountry: MasterRetailCountry): void {
    retailCountry.id = this.id;

    this.disableSaveButton();
    this.masterRetailCountryService
      .update(retailCountry)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/master');
          this.snackBarService.showInfo('UPDATE_RETAIL_COUNTRY_SUCCESS');
        },
        error: error => {
          this.snackBarService.showError(error);
        }
      })
      .add(() => this.enableSaveButton());
  }

  private disableSaveButton(): void {
    this.saveDisabled = true;
  }

  private enableSaveButton(): void {
    this.saveDisabled = false;
  }
}
