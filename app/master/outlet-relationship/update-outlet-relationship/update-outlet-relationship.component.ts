import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterOutletRelationshipService } from "../../services/master-outlet-relationship/master-outlet-relationship.service";
import { MasterOutletRelationship } from "../../services/master-outlet-relationship/master-outlet-relationship.model";

@Component({
  selector: 'gp-update-outlet-relationship',
  templateUrl: './update-outlet-relationship.component.html',
  styleUrls: ['./update-outlet-relationship.component.scss']
})
export class UpdateOutletRelationshipComponent implements OnInit {
  outletRelationshipForm: UntypedFormGroup;
  id: string;
  outletRelationshipName: string;
  saveDisabled = false;
  outletRelationship: MasterOutletRelationship;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private outletRelationshipService: MasterOutletRelationshipService,
    private router: Router,
    private snackBarService: SnackBarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initOutletRelationshipForm();
    this.getServiceIdByRouteParams().subscribe(() => {
      this.initOutletRelationship();
    });
  }

  submit(outletRelationship: MasterOutletRelationship): void {
    outletRelationship.id = this.id;
    if (this.outletRelationshipForm.controls.description.value.trim() === '') {
      delete outletRelationship.description;
    }

    this.disableSaveButton();
    this.outletRelationshipService.update(outletRelationship).subscribe({
      next: () => {
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('UPDATE_OUTLET_RELATIONSHIP_SUCCESS')
      },
      error: error => {
        this.snackBarService.showError(error);
      }
    }).add(() => this.enableSaveButton());
  }

  initOutletRelationshipForm(): void {
    this.outletRelationshipForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      description: ['', [Validators.maxLength(256)]]
    });
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

  private initOutletRelationship(): void {
    this.outletRelationshipService.get(this.id).subscribe((
      outletRelationship: MasterOutletRelationship
    ) => {
      this.outletRelationshipName = outletRelationship.name;
      this.outletRelationship = outletRelationship;
      this.outletRelationshipForm.patchValue({
        id: outletRelationship.id,
        name: outletRelationship.name,
        description: outletRelationship.description
      });
      this.outletRelationshipForm.markAsPristine();
    });
  }
}
