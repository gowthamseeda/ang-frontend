import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterServiceService } from '../../../../master/service/master-service/master-service.service';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ContentChange, QuillModules } from 'ngx-quill';
import { UserService } from 'app/iam/user/user.service';
import { MasterService } from 'app/master/service/master-service/master-service.model';
import { SnackBarService } from 'app/shared/services/snack-bar/snack-bar.service';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'gp-service-detail-dialog',
  templateUrl: './service-detail-dialog.component.html',
  styleUrls: ['./service-detail-dialog.component.scss']
})
export class ServiceDetailDialogComponent implements OnInit, OnDestroy {
  serviceForm: UntypedFormGroup;
  quillForm: UntypedFormGroup = new UntypedFormGroup({
    content: new UntypedFormControl('')
  });
  quillModules: QuillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ header: [] }],
      [{ font: [] }]
    ]
  };
  service: MasterService;
  showDetailDescription = false;
  private unsubscribe = new Subject<void>();
  ableToEdit = false
  displayDetailedDescription = false

  constructor(
    public dialogRef: MatDialogRef<ServiceDetailDialogComponent>,
    private formBuilder: UntypedFormBuilder,
    private masterServiceService: MasterServiceService,
    private userService: UserService,
    private snackBarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA)
    public serviceId: number,
    private serviceService:ServiceService
  ) {
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.initServiceForm();
    this.initService();
    this.initPermission()
    this.shouldDisplayDetailedDescription()
  }

  save(): void {
    this.masterServiceService.update(this.serviceForm.getRawValue())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.serviceService.fetchAll()
          this.snackBarService.showInfo('UPDATE_SERVICE_SUCCESS');
          this.dialogRef.close()
        },
        error: error => {
          this.snackBarService.showError(error);
        }
      })
  }

  cancel(): void {
    this.initService()
    this.quillForm.patchValue({ content: this.service.detailDescription })
    this.quillForm.markAsPristine();
  }

  private initServiceForm(): void {
    this.serviceForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: false }],
      active: new UntypedFormControl(false),
      openingHoursSupport: new UntypedFormControl(false),
      retailerVisibility: new UntypedFormControl(false),
      allowedDistributionLevels: [{ value: [], disabled: false }, [Validators.required]],
      translations: [{ value: {} }],
      position: [{ value: '' }],
      detailDescription: ['']
    });
  }

  private initService(): void {
    this.masterServiceService.fetchBy(this.serviceId.toString()).subscribe(service => {
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

  openDetailDescription(): void {
    this.showDetailDescription = true
    this.quillForm.patchValue({ content: this.serviceForm.get("detailDescription")?.value })
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

  private initPermission() {
    this.userService
      .getPermissions()
      .subscribe(permissions => {
        this.ableToEdit = permissions.includes('services.service.detaildescription.update')
      });
  }

  private shouldDisplayDetailedDescription(): void {
    this.userService
      .getPermissions()
      .subscribe(permissions => {
        this.displayDetailedDescription = this.ableToEdit || (permissions.includes('services.service.detaildescription.read') && !!this.service.detailDescription)
      });
  }
}
