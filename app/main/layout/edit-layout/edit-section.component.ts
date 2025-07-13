import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EditLayoutService } from './edit-layout.service';

@Component({
  selector: 'gp-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrls: ['./edit-section.component.scss']
})
export class EditSectionComponent implements OnInit, OnDestroy {
  private isMarginalVisible = false;
  private unsubscribe = new Subject<void>();
  private gpFlexValue: String;

  constructor(
    public editLayoutService: EditLayoutService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isMarginalVisible = this.editLayoutService.marginalColumnVisible();
    this.gpFlexValue = this.marginalColumnVisible ? '70%' : '100%'
    this.editLayoutService.marginVisible
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(marginVisible => {
        this.isMarginalVisible = marginVisible;
        this.changeDetectorRef.detectChanges();
        this.gpFlexValue = this.marginalColumnVisible ? '70%' : '100%'
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get marginalColumnVisible(): boolean {
    return this.isMarginalVisible;
  }

  get getGpFlexValue(): String {
    return this.gpFlexValue
  }
}
