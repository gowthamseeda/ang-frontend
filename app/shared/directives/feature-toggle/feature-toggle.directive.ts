import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FeatureToggleService } from './feature-toggle.service';

@Directive({ selector: '[gpFeatureToggle]' })
export class FeatureToggleDirective implements OnInit, OnDestroy {
  private featureName: string;
  private reverse = false;
  private unsubscribe = new Subject<void>();

  @Input()
  set gpFeatureToggle(featureName: string) {
    this.featureName = featureName;
  }
  @Input()
  set gpFeatureToggleReverse(reverse: boolean) {
    this.reverse = reverse;
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit(): void {
    this.featureToggleService
      .isFeatureEnabled(this.featureName)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (featureEnabled: boolean) => this.toggleView(featureEnabled),
        () => this.toggleView(false)
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private toggleView(featureEnabled: boolean): void {
    if (this.reverse) {
      if (this.featureName && featureEnabled) {
        this.viewContainer.clear();
      } else {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      if (this.featureName && featureEnabled) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    }
  }
}
