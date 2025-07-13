import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../user/user-authorization.service';

/**
 * Directive to remove elements for retail users.
 */
@Directive({
  selector: '[gpNotForRetail]'
})
export class NotForRetailDirective implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();

  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userAuthorizationService: UserAuthorizationService
  ) {}

  ngOnInit(): void {
    this.userAuthorizationService.isAuthorizedFor
      .permissions(['app.retail.hide'])
      .verify()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(isAuthorized => {
        if (isAuthorized) {
          this.viewContainer.clear();
          return;
        }
        this.viewContainer.createEmbeddedView(this.template);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
