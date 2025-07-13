import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ObservableInput } from 'ngx-observable-input';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ContentLoaderService } from './content-loader.service';

export interface ContentLoader {
  isLoading: boolean;
}

@Component({
  selector: 'gp-content-loader',
  templateUrl: './content-loader.component.html',
  styleUrls: ['./content-loader.component.scss'],
  providers: [ContentLoaderService]
})
export class ContentLoaderComponent implements OnInit, OnDestroy {
  @Input()
  @ObservableInput()
  isLoading: Observable<boolean>;
  loaderVisible: Observable<boolean>;

  private unsubscribe = new Subject<void>();

  constructor(private contentLoader: ContentLoaderService) {}

  ngOnInit(): void {
    this.loaderVisible = this.contentLoader.visibleChanges;

    this.isLoading
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((loading: boolean) => {
        loading ? this.contentLoader.start() : this.contentLoader.stop();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
