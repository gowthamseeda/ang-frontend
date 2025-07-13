import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MasterRetailCountryService } from '../../services/master-retail-country/master-retail-country.service';
import { MasterRetailCountry } from '../../services/master-retail-country/master-retail-country.model';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';

@Component({
  selector: 'gp-create-retail-country',
  templateUrl: './create-retail-country.component.html',
  styleUrls: ['./create-retail-country.component.scss']
})
export class CreateRetailCountryComponent implements OnInit {
  retailCountryForm: UntypedFormGroup;

  constructor(
    private retailCountryService: MasterRetailCountryService,
    private router: Router,
    private snackBarService: SnackBarService,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.initRetailCountryForm();
  }

  private initRetailCountryForm(): void {
    this.retailCountryForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.maxLength(256)]],
      name: ['', [Validators.required, Validators.maxLength(256)]]
    });
  }

  submit(retailCountry: MasterRetailCountry): void {
    this.retailCountryService.create(retailCountry).subscribe(
      () => {
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('CREATE_RETAIL_COUNTRY_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }
}
