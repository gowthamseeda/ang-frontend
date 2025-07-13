import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  MasterCloseDownReason,
  ValidityEnum
} from '../../services/master-close-down-reasons/master-close-down-reason.model';
import { MasterCloseDownReasonsService } from '../../services/master-close-down-reasons/master-close-down-reasons.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';

@Component({
  selector: 'gp-update-close-down-reason',
  templateUrl: './update-close-down-reason.component.html',
  styleUrls: ['./update-close-down-reason.component.scss']
})
export class UpdateCloseDownReasonComponent implements OnInit {
  closeDownReasonForm: UntypedFormGroup;
  id: string;
  closeDownReasonName: string;
  validities = ValidityEnum;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private closeDownReasonsService: MasterCloseDownReasonsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initCloseDownReasonForm();
    this.getCloseDownReasonIdByRouteParams().subscribe(() => {
      this.initCloseDownReason();
    });
  }

  submit(closeDownReason: MasterCloseDownReason): void {
    this.closeDownReasonsService.update(this.id, closeDownReason).subscribe(
      () => {
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('UPDATE_CLOSE_DOWN_REASON_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  initCloseDownReasonForm(): void {
    this.closeDownReasonForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      validity: ['', [Validators.required]],
      translations: [{ value: {} }]
    });
  }

  private initCloseDownReason(): void {
    this.closeDownReasonsService
      .get(this.id)
      .subscribe((closeDownReason: MasterCloseDownReason) => {
        this.closeDownReasonName = closeDownReason.name;
        this.closeDownReasonForm.patchValue({
          id: closeDownReason.id,
          name: closeDownReason.name,
          validity: closeDownReason.validity,
          translations: closeDownReason.translations
        });
      });
  }

  private getCloseDownReasonIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        const id = params.get('id');
        return (this.id = id ? id : '');
      })
    );
  }
}
