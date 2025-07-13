import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CanDeactivateComponent } from 'app/shared/guards/can-deactivate-guard.model';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { paramOutletId } from '../../../legal-structure/legal-structure-routing-paths';
import { Outlet } from '../../../legal-structure/shared/models/outlet.model';
import { DistributionLevelsService } from '../../distribution-levels/distribution-levels.service';
import { AssignedBrandLabelTableComponent } from '../assigned-brand-labels/assigned-brand-label-table/assigned-brand-label-table.component';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';

@Component({
  selector: 'gp-edit-labels',
  templateUrl: './edit-labels.component.html',
  styleUrls: ['./edit-labels.component.scss']
})
export class EditLabelsComponent
  implements OnInit, OnDestroy, AfterViewInit, CanDeactivateComponent {
  countryId: Observable<string>;
  distributionLevels: Observable<string[]>;
  registeredOfficeId: string;
  outletId: string;
  isAuthorized: Observable<boolean>;
  saveButtonDisabled = true;
  cancelButtonDisabled = true;
  assignedBrandLabelTableComponent: AssignedBrandLabelTableComponent;
  @ViewChild(AssignedBrandLabelTableComponent) set component(
    brandLabelTableComponent: AssignedBrandLabelTableComponent
  ) {
    this.assignedBrandLabelTableComponent = brandLabelTableComponent;
  }

  private outlet: Observable<Outlet>;
  private fragment: string;
  private unsubscribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private outletService: OutletService,
    private changeDetector: ChangeDetectorRef,
    private userAuthorizationService: UserAuthorizationService,
    private distributionLevelsService: DistributionLevelsService
  ) {}

  ngOnInit(): void {
    if (this.route.fragment) {
      this.route.fragment.pipe(takeUntil(this.unsubscribe)).subscribe(fragment => {
        if (fragment) {
          this.fragment = fragment;
        }
      });
    }

    this.getOutletIdByRouteParams()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.distributionLevels = this.distributionLevelsService.get(this.outletId);

        this.outlet = this.outletService.getOrLoadBusinessSite(this.outletId);
        this.outlet.pipe(takeUntil(this.unsubscribe)).subscribe(outlet => {
          this.registeredOfficeId = outlet.companysRegisteredOfficeId ?? '';
        });
        this.countryId = this.outlet.pipe(map(outlet => outlet.countryId));

        this.evaluateAuthorization();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.changeDetector.detectChanges();

    setTimeout(() => {
      const element = document.getElementById(this.fragment);
      if (element) {
        element.scrollIntoView();
      }
    }, 250);
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.assignedBrandLabelTableComponent
      ? this.assignedBrandLabelTableComponent.assignedBrandLabelsForm.pristine
      : true;
  }

  private getOutletIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        this.outletId = params.get(paramOutletId) || '';
        return this.outletId;
      })
    );
  }

  private evaluateAuthorization(): void {
    this.isAuthorized = this.userAuthorizationService.isAuthorizedFor
      .permissions(['traits.assignedbrandlabel.create', 'traits.assignedbrandlabel.delete'])
      .businessSite(this.outletId)
      .observableCountry(this.countryId)
      .observableDistributionLevels(this.distributionLevels)
      .verify();
  }
}
