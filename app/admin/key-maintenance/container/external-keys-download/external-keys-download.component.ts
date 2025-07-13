import { Component, OnInit } from '@angular/core';
import { ExternalKeysTableRow } from '../../model/external-keys.model';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ExternalKeysService } from '../../../../gssnplus-api-outlet/external-keys/external-keys';

@Component({
  selector: 'gp-external-keys-download',
  templateUrl: './external-keys-download.component.html',
  styleUrls: ['./external-keys-download.component.scss']
})
export class ExternalKeysDownloadComponent implements OnInit {
  keyTypes: string[] = ['vehicle-destination-key', 'wholesale-logistic-number'];
  isDisabled: boolean = false;
  externalKeys: Observable<ExternalKeysTableRow[]>;
  parentForm: UntypedFormGroup;
  displayedColumns: string[] = [
    'keyType',
    'brand',
    'productGroup',
    'country',
    'moreOption',
    'action'
  ]
  dataSource = [
    {
      keyType: 'Key Type',
      brand: 'Brand',
      productGroup: 'Product Group',
      country: 'Country',
      moreOption: 'More Option',
      action: 'Action'
    }
  ];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private externalKeyService: ExternalKeysService
  ) {}

  ngOnInit(): void {
    this.initExternalKeysType();
    this.initFormControl();
  }

  downloadKeys(): void {
    this.isDisabled = true

    const keyType = this.parentForm.get('externalKeyType')?.value
    const brand = this.parentForm.get('brand')?.value
    const productGroup = this.parentForm.get('productGroup')?.value
    const countryId = this.parentForm.get('countryId')?.value == 'All' ? '' : this.parentForm.get('countryId')?.value
    const showAddress = this.parentForm.get('showAddress')?.value
    const showCity = this.parentForm.get('showCity')?.value
    const showCountry = this.parentForm.get('showCountry')?.value
    const excludeNonExistExternalKey = this.parentForm.get('excludeNonExistExternalKey')?.value

    const fileUrl = this.externalKeyService.getExternalKeys(
      keyType, brand, productGroup, countryId, showAddress, showCity, showCountry, excludeNonExistExternalKey
    );

    fileUrl.pipe(take(1)).subscribe(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = keyType + ".xlsx"
        a.click()
        URL.revokeObjectURL(objectUrl)
        this.isDisabled = false
      }
    )
  }

  initExternalKeysType(): void {
    this.externalKeys = of(this.keyTypes).pipe(
      map(keyTypes => keyTypes.map(key => this.mapToExternalKeysTable(key)))
    );
  }

  initFormControl(): void {
    this.parentForm = this.formBuilder.group({
      externalKeyType: ['', Validators.required],
      brand: [''],
      productGroup: [''],
      countryId: [''],
      showAddress: [false],
      showCity: [false],
      showCountry: [false],
      excludeNonExistExternalKey: [false]
    });
  }

  mapToExternalKeysTable(key: string): ExternalKeysTableRow {
    return {
      keyType: key
    };
  }
}
