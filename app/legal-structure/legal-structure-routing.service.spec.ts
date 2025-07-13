import { TestBed } from '@angular/core/testing';
import { ActivationEnd, Params, Router } from '@angular/router';

import { LegalStructureRoutingService } from './legal-structure-routing.service';
import { getActivatedRouteSnapshotMock } from './activated-route-snapshot.mock';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject } from 'rxjs';

describe('LegalStructureRoutingService', () => {
  let service: LegalStructureRoutingService;
  let params: Params;
  let routerSpy: Spy<Router>

  let routerEventsSubject = new BehaviorSubject<any>('');

  beforeEach(() => {
    routerSpy = createSpyFromClass(Router)
    Object.defineProperty(routerSpy, 'events', { get: () => routerEventsSubject.asObservable() });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: routerSpy
        }
      ]
    });
    service = TestBed.inject(LegalStructureRoutingService);

    params = { outletId: 'GS0000001' };
    routerEventsSubject.next(new ActivationEnd(getActivatedRouteSnapshotMock(params, ':outletId')));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor()', () => {
    it('should listen to the router for outlet id changes', () => {
      expect(service.outletIdChanges.getValue()).toEqual('GS0000001');
    });
  });
});
