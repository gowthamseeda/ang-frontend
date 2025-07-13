import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { AppConfigProvider } from '../../../app-config.service';

@Component({
  selector: 'gp-overlay-layout',
  templateUrl: './overlay-layout.component.html',
  styleUrls: ['./overlay-layout.component.scss']
})
export class OverlayLayoutComponent implements OnDestroy {
  @Input()
  toolTipText: string;

  @Input()
  enableCompanyNavigation = true;

  isOpen = false;
  overlayRef: OverlayRef;

  configs = new OverlayConfig({
    panelClass: ['overlay'],
    positionStrategy: this.getOverlayPositionStrategy()
  });

  @ViewChild('overlay') overlayTemplate: TemplateRef<any>;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private appConfigProvider: AppConfigProvider
  ) {}

  ngOnDestroy(): void {
    this.close();
  }

  openWithTemplate(): void {
    this.overlayRef = this.overlay.create(this.configs);
    this.overlayRef.attach(new TemplatePortal(this.overlayTemplate, this.viewContainerRef));
    this.isOpen = true;
  }

  close(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
    this.isOpen = false;
  }

  getOverlayPositionStrategy(): PositionStrategy {
    return this.overlay.position().global().right().top();
  }

  getEnableHideableCompanyNavigationConfig(): boolean {
    return this.appConfigProvider.getAppConfig().enableHideableCompanyNavigation;
  }

  getGpFlexValue(): String{
    return this.enableCompanyNavigation && !this.appConfigProvider.getAppConfig().enableHideableCompanyNavigation ? "60%" : "100%"
  }
}
