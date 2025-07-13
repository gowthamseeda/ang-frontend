import { TestBed } from '@angular/core/testing';

import { ServiceTableSettingService } from './service-table-setting.service';

describe('ServiceTableStatusService', () => {
  let service: ServiceTableSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceTableSettingService]
    });
    service = TestBed.inject(ServiceTableSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showUnmaintainedToggle', () => {
    it('should change _showUnmaintainedToggle to true', done => {
      service.toggleUnmaintainedInfo(true);

      service.unmaintainedInfo.subscribe(showUnmaintainedToggle =>
        expect(showUnmaintainedToggle).toBeTruthy()
      );
      done();
    });
  });
});
