import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../user/user-authorization.service';

@Directive({
  selector: '[gpDisableByPermission]'
})
export class DisableByPermissionsDirective implements OnInit, OnDestroy {
  permissions: string[];

  private unsubscribe = new Subject<void>();

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private userAuthorizationService: UserAuthorizationService
  ) {}

  @Input()
  set gpDisableByPermission(permissions: string[]) {
    this.permissions = permissions;
  }

  ngOnInit(): void {
    this.userAuthorizationService.isAuthorizedFor
      .permissions(this.permissions)
      .verify()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(hasPermission => {
        if (!hasPermission) {
          this.renderer.setAttribute(this.element.nativeElement, 'disabled', 'true');
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
