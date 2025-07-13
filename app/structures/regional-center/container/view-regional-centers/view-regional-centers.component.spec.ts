import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewRegionalCentersComponent } from './view-regional-centers.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { TestingModule } from '../../../../testing/testing.module';
import { CountryService } from '../../../../geography/country/country.service';
import { ViewRegionalCentersComponentService } from './view-regional-centers.service';
import { mockedServiceResponse } from './view-regional-centers.service.mock';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';

describe('ViewRegionalCentersComponent', () => {
  let component: ViewRegionalCentersComponent;
  let fixture: ComponentFixture<ViewRegionalCentersComponent>;
  let componentService: ViewRegionalCentersComponentService;
  let userSettingsService: UserSettingsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ViewRegionalCentersComponent],
        imports: [TestingModule],
        providers: [
          {
            provide: ViewRegionalCentersComponentService,
            useValue: {
              getAll: jest.fn()
            }
          },
          {
            provide: CountryService,
            useValue: {
              getAll: jest.fn()
            }
          },
          {
            provide: UserSettingsService,
            useValue: {
              get: jest.fn()
            }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      componentService = TestBed.inject(ViewRegionalCentersComponentService);
      userSettingsService = TestBed.inject(UserSettingsService);
      jest.spyOn(componentService, 'getAll').mockReturnValue(of(mockedServiceResponse()));
      jest.spyOn(userSettingsService, 'get').mockReturnValue(of({}));
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRegionalCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit should', () => {
    test('load regional centers', () => {
      const spy = jest.spyOn(componentService, 'getAll');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
    test('load user settings', () => {
      const spy = jest.spyOn(userSettingsService, 'get');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });
});
