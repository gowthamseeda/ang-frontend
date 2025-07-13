import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../user/user-authorization.service';
import { RetailRolloutService } from '../../services/retail-rollout/retail-rollout.service';

/**
 * Directive to render elements only for retail users.
 * Also checks if retail has been rolled out for the country of the given business site ID (if provided).
 *
 * - For all: *gpOnlyForRetail
 * - Only for those restricted to a certain business site ID: *gpOnlyForRetail="outletId"
 * - Overwrite default permissions: *gpOnlyForRetail="outletId; permissions: ['some.custom.permission']"
 */
@Directive({
  selector: '[gpOnlyForRetail]'
})
export class OnlyForRetailDirective implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  private businessSiteIdSubject = new BehaviorSubject<string>('');
  private permissionsSubject = new BehaviorSubject<string[]>([]);

  @Input()
  set gpOnlyForRetail(businessSiteId: string) {
    this.businessSiteIdSubject.next(businessSiteId ?? '');
  }

  @Input()
  set gpOnlyForRetailPermissions(permissions: string[]) {
    this.permissionsSubject.next(permissions ?? []);
  }

  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userAuthorizationService: UserAuthorizationService,
    private retailRolloutService: RetailRolloutService
  ) {}

  ngOnInit(): void {
    const businessSiteIdSource = this.businessSiteIdSubject.asObservable();
    const permissionsSource = this.permissionsSubject.asObservable();

    combineLatest([
      businessSiteIdSource.pipe(distinctUntilChanged()),
      permissionsSource.pipe(distinctUntilChanged())
    ])
      .pipe(
        mergeMap(data => this.authorizedFor(data)),
        tap(() => this.viewContainer.clear()),
        filter(authorized => authorized),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => this.viewContainer.createEmbeddedView(this.template));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private authorizedFor(data: [string, string[]]): Observable<boolean> {
    const [businessSiteId, permissions] = data;
    const authorizationFor = this.userAuthorizationService.isAuthorizedFor;
    const userAuthorization = authorizationFor.permissions(
      permissions.length > 0 ? permissions : ['app.retail.show']
    ) as UserAuthorizationService;

    if (businessSiteId) {
      userAuthorization.businessSite(businessSiteId);
      const isRollout = () => this.retailRolloutService.isRolledOutFor(businessSiteId);
      return userAuthorization
        .verify()
        .pipe(mergeMap(authorized => (authorized ? isRollout() : of(false))));
    }

    return userAuthorization.verify().pipe(map(authorized => authorized));
  }
}
