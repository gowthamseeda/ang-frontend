import { TestBed } from '@angular/core/testing';

import { CustomEventBusService } from './custom-event-bus.service';

describe('CustomEventBusService', () => {
  let service: CustomEventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomEventBusService]
    });

    service = TestBed.inject(CustomEventBusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('data', () => {
    it('should deliver all types of custom events to observers', () => {
      let countEvents = 0;
      service.data().subscribe(() => {
        countEvents++;
      });
      service.dispatchEvent('myCustomEvent:type1');
      service.dispatchEvent('myCustomEvent:type2');

      expect(countEvents).toBe(2);
    });

    it('should deliver specified type of custom events to observers', () => {
      let countEvents = 0;
      service.data('myCustomEvent:type1').subscribe(() => {
        countEvents++;
      });
      service.dispatchEvent('myCustomEvent:type1');
      service.dispatchEvent('myCustomEvent:type2');

      expect(countEvents).toBe(1);
    });
  });

  describe('dispatchEvent', () => {
    it('should inform the Subject Observable about the new incoming event', done => {
      service.data().subscribe(event => {
        expect(event).toEqual('myCustomEvent');
        done();
      });
      service.dispatchEvent('myCustomEvent');
    });
  });
});
