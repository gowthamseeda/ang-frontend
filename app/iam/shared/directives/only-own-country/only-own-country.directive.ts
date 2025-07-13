import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../user/user-authorization.service';

/**
 * Directive to render elements only for users that are authorized for the given country.
 *
 * - Example: *gpOnlyOwnCountry="countryId"
 * - To also check for permissions: *gpOnlyOwnCountry="countryId; permissions: ['some.custom.permission']"
 */
@Directive({
  selector: '[gpOnlyOwnCountry]'
})
export class OnlyOwnCountryDirective implements OnInit, OnDestroy {
  countryId = new ReplaySubject<string>(1);
  permissions: string[] = [];
  private unsubscribe = new Subject<void>();

  @Input()
  set gpOnlyOwnCountry(countryId: string) {
    this.countryId.next(countryId);
  }

  @Input()
  set gpOnlyOwnCountryPermissions(permissions: string[]) {
    if (permissions) {
      this.permissions = permissions;
    }
  }

  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userAuthorizationService: UserAuthorizationService
  ) {}

  ngOnInit(): void {
    this.countryId
      .asObservable()
      .pipe(
        mergeMap(countryId => this.isAuthorizedFor(countryId)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(isAuthorized => {
        this.viewContainer.clear();

        if (isAuthorized) {
          this.viewContainer.createEmbeddedView(this.template);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private isAuthorizedFor(countryId: string): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor
      .country(countryId)
      .permissions(this.permissions)
      .verify();
  }
}
