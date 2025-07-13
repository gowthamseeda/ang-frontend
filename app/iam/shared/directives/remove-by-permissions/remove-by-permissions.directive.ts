import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../user/user-authorization.service';

@Directive({
  selector: '[gpRemoveByPermission]'
})
export class RemoveByPermissionsDirective implements OnInit, OnDestroy {
  permissions: string[];
  isEmpty: Observable<boolean>;

  private unsubscribe = new Subject<void>();

  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userAuthorizationService: UserAuthorizationService
  ) {}

  @Input()
  set gpRemoveByPermission(permissions: string[]) {
    this.permissions = permissions;
  }

  @Input()
  set gpRemoveByPermissionIsEmpty(isEmpty: Observable<boolean>) {
    this.isEmpty = isEmpty;
  }

  ngOnInit(): void {
    this.userAuthorizationService.isAuthorizedFor
      .permissions(this.permissions)
      .verify()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(hasPermission => {
        this.isEmpty
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(isEmpty => {
            if (!hasPermission && isEmpty) {
              this.viewContainer.clear();
            } else {
              this.viewContainer.createEmbeddedView(this.template);
            }
          });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
