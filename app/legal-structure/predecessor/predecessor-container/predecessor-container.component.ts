import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of, Subject, throwError } from 'rxjs';
import { map, mergeMap, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { Outlet } from '../../shared/models/outlet.model';
import { OutletService } from '../../shared/services/outlet.service';
import { Predecessor, PredecessorItem } from '../predecessor/predecessor.model';
import { PredecessorService } from '../predecessor/predecessor.service';

@Component({
  selector: 'gp-predecessor-container',
  templateUrl: './predecessor-container.component.html',
  styleUrls: ['./predecessor-container.component.scss']
})
export class PredecessorContainerComponent implements OnInit, OnDestroy {
  @Input() parentForm: UntypedFormGroup;
  predecessor = new BehaviorSubject<Predecessor | undefined>(undefined);
  predecessorItems: Observable<ReadonlyArray<PredecessorItem>>;
  successorItems: Observable<ReadonlyArray<PredecessorItem>>;
  outlet: Observable<Outlet>;
  isLoaded: Observable<boolean>;
  isEmptySuccessor: Observable<boolean>;
  userHasPermissions = false;

  private outletId: string;
  private unsubscribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private outletService: OutletService,
    private predecessorService: PredecessorService,
    private snackBarService: SnackBarService,
    private userAuthorizationService: UserAuthorizationService
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.evaluateUserPermission();

    this.outlet = this.route.params.pipe(
      switchMap(({ outletId }) => this.outletService.getOrLoadBusinessSite(outletId)),
      tap(outlet => this.predecessorService.fetchForOutlet(outlet.id)),
      tap(outlet => (this.outletId = outlet.id)),
      tap(outlet =>
        this.predecessorService
          .isChanged(outlet.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(isChanged => {
            if (isChanged) {
              this.parentForm.markAsDirty();
            }
          })
      ),
      takeUntil(this.unsubscribe)
    );

    this.outlet
      .pipe(
        mergeMap(outlet => this.predecessorService.getBy(outlet.id)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(this.predecessor);
    this.predecessorItems = this.predecessor.pipe(
      map(predecessor => this.getPredecessorFrom(predecessor)),
      takeUntil(this.unsubscribe)
    );
    this.successorItems = this.predecessor.pipe(
      map(successor => this.getSuccessorFrom(successor)),
      takeUntil(this.unsubscribe)
    );
    this.successorItems.pipe(takeUntil(this.unsubscribe)).subscribe(item => {
      if (item.length > 0) {
        this.isEmptySuccessor = of(true);
      }
    });
    this.isLoaded = this.predecessorService.isLoaded();
  }

  addPredecessorItem(predecessorItem: PredecessorItem): void {
    combineLatest([
      this.predecessor,
      this.outletService.getOrLoadBusinessSite(predecessorItem.businessSiteId)
    ])
      .pipe(
        take(1),
        mergeMap(([predecessor, outlet]) =>
          this.getUniquePredecessorsFor(
            this.createPredecessorItem(predecessorItem.businessSiteId, outlet),
            predecessor
          )
        )
      )
      .subscribe(
        predecessorItems =>
          this.predecessorService.update({ id: this.outletId, predecessors: predecessorItems }),
        error => this.snackBarService.showError(error)
      );
  }

  removePredecessorItem(deletedOutletId: string): void {
    this.predecessor
      .pipe(
        take(1),
        map(predecessor =>
          predecessor?.predecessors?.filter(
            predecessorItem => predecessorItem.businessSiteId !== deletedOutletId
          )
        )
      )
      .subscribe(predecessorItems =>
        this.predecessorService.update({ id: this.outletId, predecessors: predecessorItems })
      );
  }

  private getPredecessorFrom(predecessor?: Predecessor): PredecessorItem[] {
    return predecessor?.predecessors || [];
  }

  private getSuccessorFrom(predecessor?: Predecessor): PredecessorItem[] {
    return predecessor?.successors || [];
  }

  private getUniquePredecessorsFor(
    newPredecessor: PredecessorItem,
    predecessor?: Predecessor
  ): Observable<PredecessorItem[]> {
    const existingPredecessors = this.getPredecessorFrom(predecessor);
    return existingPredecessors.find(
      predecessorItem => predecessorItem.businessSiteId === newPredecessor.businessSiteId
    )
      ? throwError(new Error('UPDATE_PREDECESSOR_DUPLICATE'))
      : predecessor?.id === newPredecessor.businessSiteId
      ? throwError(new Error('UPDATE_PREDECESSOR_OWN_OUTLET'))
      : of([...existingPredecessors, newPredecessor]);
  }

  private createPredecessorItem(businessSiteId: string, outlet: Outlet): PredecessorItem {
    const {
      legalName,
      address: { street, addressAddition, streetNumber, zipCode, city },
      countryId,
      countryName
    } = outlet;
    return {
      businessSiteId: businessSiteId,
      legalName,
      addressAddition,
      street,
      streetNumber,
      zipCode,
      city,
      countryId,
      countryName
    };
  }

  private evaluateUserPermission(): void {
    this.userAuthorizationService.isAuthorizedFor
      .permissions(['legalstructure.predecessor.create'])
      .permissions(['legalstructure.predecessor.delete'])
      .verify()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(isAuthorized => {
        if (isAuthorized) {
          this.userHasPermissions = true;
        }
      });
  }
}
