import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { Angulartics2, Angulartics2Module, RouterlessTracking } from 'angulartics2';

import { MatomoEventTracker, SearchProperties } from './event-tracker.model';
import { TestingModule } from '../../testing/testing.module';

describe('MatomoSearchTracker', () => {
  let matomoEventTracker: MatomoEventTracker;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, Angulartics2Module.forRoot()],
      providers: [MatomoEventTracker, Angulartics2, RouterlessTracking]
    });

    matomoEventTracker = TestBed.inject(MatomoEventTracker);
  });

  describe('trackSiteSearch', () => {
    let eventSpy: any;

    it('should call angulartics2 library with correct paramter', fakeAsync(
      inject([Angulartics2], (angulartics2: Angulartics2) => {
        eventSpy = jasmine.createSpy('eventSpy');

        angulartics2.eventTrack.subscribe(x => eventSpy(x));

        matomoEventTracker.trackSiteSearch(
          new SearchProperties('SearchKeyword', 'SearchCategory', 42)
        );

        expect(eventSpy).toHaveBeenCalledWith({
          action: 'trackSiteSearch',
          properties: {
            keyword: 'SearchKeyword',
            category: 'SearchCategory',
            searchCount: 42
          }
        });
      })
    ));
  });
});
