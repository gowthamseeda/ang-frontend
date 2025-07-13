import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SnackBarService} from "../../../shared/services/snack-bar/snack-bar.service";
import {
  MasterOutletRelationshipService
} from "../../services/master-outlet-relationship/master-outlet-relationship.service";
import {MasterOutletRelationship} from "../../services/master-outlet-relationship/master-outlet-relationship.model";

@Component({
  selector: 'gp-create-outlet-relationship',
  templateUrl: './create-outlet-relationship.component.html',
  styleUrls: ['./create-outlet-relationship.component.scss']
})
export class CreateOutletRelationshipComponent implements OnInit {

  outletRelationshipForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private snackBarService: SnackBarService,
    private outletRelationshipService: MasterOutletRelationshipService
  ) {}

  ngOnInit(): void {
    this.initOutletRelationshipForm()
  }

  private initOutletRelationshipForm(): void {
    this.outletRelationshipForm = this.formBuilder.group({
      id: ['',[Validators.required, Validators.maxLength(256)]],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      description: ['', [Validators.maxLength(256)]],
    });
  }

  submit(outletRelationship: MasterOutletRelationship): void {
    this.outletRelationshipService.create(outletRelationship).subscribe(
      () => {
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('CREATE_OUTLET_RELATIONSHIP_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

}
