import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterCountry } from '../../country/master-country/master-country.model';
import { MasterCountryService } from '../../country/master-country/master-country.service';
import { MasterCountryGroup } from '../../services/master-country-group/master-country-group.model';
import { MasterCountryGroupService } from '../../services/master-country-group/master-country-group.service';

@Component({
  selector: 'gp-update-country-group',
  templateUrl: './update-country-group.component.html',
  styleUrls: ['./update-country-group.component.scss']
})
export class UpdateCountryGroupComponent implements OnInit {
  countryGroupForm: UntypedFormGroup;
  countries: MasterCountry[];
  id: string;
  countryGroupName: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private countryGroupService: MasterCountryGroupService,
    private router: Router,
    private snackBarService: SnackBarService,
    private countryService: MasterCountryService
  ) {}

  ngOnInit(): void {
    this.initCountries();
    this.initCountryGroupForm();
    this.getServiceIdByRouteParams().subscribe(() => {
      this.initCountryGroup();
    });
  }

  submit(countryGroup: MasterCountryGroup): void {
    this.countryGroupService.update(this.id, countryGroup).subscribe(
      () => {
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('UPDATE_COUNTRY_GROUP_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  initCountryGroupForm(): void {
    this.countryGroupForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      countryIds: [''],
      translations: [{ value: {} }]
    });
  }

  private initCountries(): void {
    this.countryService.getAll().subscribe((countries: MasterCountry[]) => {
      this.countries = countries;
    });
  }

  private getServiceIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        const id = params.get('id');
        return (this.id = id ? id : '');
      })
    );
  }

  private initCountryGroup(): void {
    this.countryGroupService.get(this.id).subscribe((countryGroup: MasterCountryGroup) => {
      this.countryGroupName = countryGroup.name;
      this.countryGroupForm.patchValue({
        id: countryGroup.id,
        name: countryGroup.name,
        countryIds: countryGroup.countryIds,
        translations: countryGroup.translations
      });
    });
  }
}
