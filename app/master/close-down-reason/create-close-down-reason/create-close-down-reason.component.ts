import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  MasterCloseDownReason,
  ValidityEnum
} from '../../services/master-close-down-reasons/master-close-down-reason.model';
import { MasterCloseDownReasonsService } from '../../services/master-close-down-reasons/master-close-down-reasons.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';

@Component({
  selector: 'gp-create-close-down-reason',
  templateUrl: './create-close-down-reason.component.html',
  styleUrls: ['./create-close-down-reason.component.scss']
})
export class CreateCloseDownReasonComponent implements OnInit {
  closeDownReasonForm: UntypedFormGroup;
  validities = ValidityEnum;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private closeDownReasonsService: MasterCloseDownReasonsService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initCloseDownReasonForm();
  }

  submit(closeDownReason: MasterCloseDownReason): void {
    this.closeDownReasonsService.create(closeDownReason).subscribe(
      () => {
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('CREATE_CLOSE_DOWN_REASON_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  private initCloseDownReasonForm(): void {
    this.closeDownReasonForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      validity: ['', [Validators.required]]
    });
  }
}
