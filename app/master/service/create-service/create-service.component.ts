import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterService } from '../master-service/master-service.model';
import { MasterServiceService } from '../master-service/master-service.service';

@Component({
  selector: 'gp-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})
export class CreateServiceComponent implements OnInit {
  serviceForm: UntypedFormGroup;
  saveDisabled = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private serviceService: MasterServiceService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initServiceForm();
  }

  submit(service: MasterService): void {
    if (this.serviceForm.controls.description.value.trim() === '') {
      delete service.description;
    }

    this.saveDisabled = true;
    this.serviceService
      .create(service)
      .subscribe({
        next: () => {
          this.serviceService.clearCacheAndFetchAll();
          this.router.navigateByUrl('/master');
          this.snackBarService.showInfo('CREATE_SERVICE_SUCCESS');
        },
        error: error => {
          this.snackBarService.showError(error);
        }
      })
      .add(() => {
        this.saveDisabled = false;
      });
  }

  private initServiceForm(): void {
    this.serviceForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      active: new UntypedFormControl(false),
      openingHoursSupport: new UntypedFormControl(false),
      retailerVisibility: new UntypedFormControl(false),
      allowedDistributionLevels: [[], [Validators.required]],
      description: ['', [Validators.maxLength(256)]]
    });
  }
}
