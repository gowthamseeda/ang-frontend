import { Component, OnInit} from '@angular/core';
import { ContentChange, QuillModules } from 'ngx-quill';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { KeyValue } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MasterTranslation } from 'app/master/shared/translation/master-translation.model';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TranslationDialogComponent } from '../../shared/translation/translation-dialog/translation-dialog.component';
import { MasterService } from '../master-service/master-service.model';
import { MasterServiceService } from '../master-service/master-service.service';

@Component({
  selector: 'gp-update-service',
  templateUrl: './update-service.component.html',
  styleUrls: ['./update-service.component.scss']
})
export class UpdateServiceComponent implements OnInit {
  serviceForm: UntypedFormGroup;
  id: string;
  serviceName: string;
  saveDisabled = false;
  currentTranslations: any;
  service: MasterService;
  quillModules: QuillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ header: [] }],
      [{ font: [] }]
    ]
  };
  showDetailDescription = false;
  formGroup: UntypedFormGroup = new UntypedFormGroup({
    content: new UntypedFormControl('')
  });

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private serviceService: MasterServiceService,
    private router: Router,
    private snackBarService: SnackBarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initServiceForm();
    this.getServiceIdByRouteParams().subscribe(() => {
      this.initService();
    });
  }

  submit(service: MasterService): void {
    service.id = Number(this.id);
    this.removeEmptyDescription(service);

    this.disableSaveButton();
    this.serviceService
      .update(service)
      .subscribe({
        next: () => {
          this.serviceService.clearCacheAndFetchAll();
          this.router.navigateByUrl('/master');
          this.snackBarService.showInfo('UPDATE_SERVICE_SUCCESS');
        },
        error: error => {
          this.snackBarService.showError(error);
        }
      })
      .add(() => this.enableSaveButton());
  }

  initServiceForm(): void {
    this.serviceForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      active: new UntypedFormControl(false),
      openingHoursSupport: new UntypedFormControl(false),
      retailerVisibility: new UntypedFormControl(false),
      allowedDistributionLevels: [{ value: [], disabled: false }, [Validators.required]],
      translations: [{ value: {} }],
      position: [{ value: '' }],
      description: ['', [Validators.maxLength(256)]],
      detailDescription: ['']
    });
  }

  private removeEmptyDescription(service: MasterService): void {
    for (const key in service.translations) {
      if (service.translations.hasOwnProperty(key)) {
        const value = service.translations[key];
        if (value.serviceDescription?.trim() === '') {
          delete value.serviceDescription;
        }
      }
    }
    service.detailDescription = service.detailDescription?.trim()
  }

  private disableSaveButton(): void {
    this.saveDisabled = true;
  }

  private enableSaveButton(): void {
    this.saveDisabled = false;
  }

  private getServiceIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        const id = params.get('id');
        return (this.id = id ? id : '');
      })
    );
  }

  private initService(): void {
    this.serviceService.fetchBy(this.id).subscribe((service: MasterService) => {
      this.currentTranslations = service.translations;
      this.serviceName = service.name;
      this.service = service;
      this.serviceForm.patchValue({
        id: service.id,
        name: service.name,
        description: service.description,
        active: service.active,
        openingHoursSupport: service.openingHoursSupport,
        retailerVisibility: service.retailerVisibility,
        allowedDistributionLevels: service.allowedDistributionLevels,
        translations: service.translations,
        position: service.position,
        detailDescription: service.detailDescription
      });
      this.serviceForm.markAsPristine();
    });
  }

  removeSingleTranslation(translationLanguages: string): void {
    if (this.currentTranslations) {
      let translation = this.currentTranslations;
      let filteredTranslations = Object.keys(translation).reduce((obj, key) => {
        if (key !== translationLanguages) {
          obj[key] = translation[key];
        }
        return obj;
      }, {});
      this.serviceForm.patchValue({ translations: filteredTranslations });
      this.currentTranslations = filteredTranslations;
    }
    this.serviceForm.markAsDirty();
  }

  addNewTranslation(event: Event): void {
    event.preventDefault();
    const dialogRef = this.dialog.open(TranslationDialogComponent, {
      width: '650px',
      data: {
        serviceId: this.serviceForm.get('id')?.value
      }
    });
    dialogRef.afterClosed().subscribe((translation: KeyValue<string, any>) => {
      if (translation) {
        const translations = this.currentTranslations;
        const newTranslations = { ...translations, ...translation };
        this.currentTranslations = newTranslations;
        this.serviceForm.get('translations')?.setValue(newTranslations);
        this.serviceForm.markAsDirty();
      }
    });
  }

  editTranslation(currentTranslation: KeyValue<string, MasterTranslation>) {
    const dialogRef = this.dialog.open(TranslationDialogComponent, {
      width: '650px',
      data: {
        serviceId: this.serviceForm.get('id')?.value,
        translation: currentTranslation
      }
    });

    dialogRef.afterClosed().subscribe((translation: KeyValue<string, any>) => {
      if (translation) {
        if (!translation[currentTranslation.key]) {
          this.removeSingleTranslation(currentTranslation.key);
        }
        const translations = this.currentTranslations;
        const newTranslations = { ...translations, ...translation };
        this.currentTranslations = newTranslations;

        this.serviceForm.get('translations')?.setValue(newTranslations);
        this.serviceForm.markAsDirty();
      }
    });
  }

  openDetailDescription(): void {
    this.showDetailDescription = true
    this.formGroup.patchValue({content: this.serviceForm.get("detailDescription")?.value})
  }

  closeDetailDescription(): void {
    this.showDetailDescription = false
  }

  contentChanged(event: ContentChange): void {
    this.serviceForm.get("detailDescription")?.setValue(event.html)
    this.serviceForm.markAsDirty()
  }

  getDetailDescription(): string {
    return this.serviceForm.get("detailDescription")?.value
  }

  detailDescriptionEmpty(): boolean {
    return (this.serviceForm.get("detailDescription")?.value === undefined
    || this.serviceForm.get("detailDescription")?.value === null
    || this.serviceForm.get("detailDescription")?.value.trim() === "")
  }
}
