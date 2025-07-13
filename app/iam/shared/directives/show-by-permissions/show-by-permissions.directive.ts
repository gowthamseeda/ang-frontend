import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../user/user-authorization.service';

@Directive({
  selector: '[gpShowByPermissions]'
})
export class ShowByPermissionsDirective implements OnInit, OnDestroy {
  permissions: string[];

  private unsubscribe = new Subject<void>();

  @Input()
  set gpShowByPermissions(permissions: string[]) {
    this.permissions = permissions;
  }

  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userAuthorizationService: UserAuthorizationService
  ) {}

  ngOnInit(): void {
    this.userAuthorizationService.isAuthorizedFor
      .permissions(this.permissions)
      .verify()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(isAuthorized => {
        if (isAuthorized) {
          this.viewContainer.createEmbeddedView(this.template);
          return;
        }
        this.viewContainer.clear();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
