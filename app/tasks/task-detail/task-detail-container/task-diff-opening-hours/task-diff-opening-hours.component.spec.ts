import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NgPipesModule } from 'ngx-pipes';
import { of } from 'rxjs';

import { BrandService } from '../../../../services/brand/brand.service';
import { BrandComponent } from '../../../../services/shared/components/brand-icon/brand.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { EmptyValuePipe } from '../../../../shared/pipes/empty-value/empty-value.pipe';
import { LocaleService } from '../../../../shared/services/locale/locale.service';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { OpeningHoursDiff } from '../../../task.model';
import { TaskDiffItemComponent } from '../task-diff-item/task-diff-item.component';

import { TaskDiffOpeningHoursComponent } from './task-diff-opening-hours.component';

const mockDiffData: OpeningHoursDiff = {
  openingHoursDiff: [
    {
      id: 1,
      productCategoryId: 1,
      serviceId: 210,
      productGroupId: 'PC',
      brandId: 'MB',
      day: 'SU',
      diff: {
        old: {
          times: [
            {
              begin: '09:00',
              end: '18:00'
            }
          ],
          closed: false
        },
        new: {
          times: [
            {
              begin: '07:00',
              end: '18:00'
            }
          ],
          closed: false
        }
      }
    }
  ]
};

const unGroupMockDiffData: OpeningHoursDiff = {
  openingHoursDiff: [
    {
      id: 1,
      productCategoryId: 1,
      serviceId: 210,
      serviceName: 'Electric Drive Service 1',
      productGroupId: 'PC',
      brandId: 'MB',
      day: 'SU',
      diff: {
        old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
        new: { times: [{ begin: '07:00', end: '18:00' }], closed: false }
      }
    },
    {
      id: 2,
      productCategoryId: 1,
      serviceId: 210,
      serviceName: 'Electric Drive Service 1',
      productGroupId: 'PC',
      brandId: 'MB',
      day: 'SA',
      diff: {
        old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
        new: { times: [{ begin: '07:00', end: '18:00' }], closed: false }
      }
    },
    {
      id: 3,
      productCategoryId: 1,
      serviceId: 210,
      serviceName: 'Electric Drive Service 1',
      productGroupId: 'PC',
      brandId: 'MB',
      day: 'TH',
      diff: {
        old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
        new: { times: [{ begin: '07:00', end: '18:00' }], closed: false }
      }
    },
    {
      id: 4,
      productCategoryId: 1,
      serviceId: 7,
      serviceName: 'Electric Drive Service 2',
      productGroupId: 'PC',
      brandId: 'MB',
      day: 'SU',
      diff: {
        old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
        new: { times: [], closed: true }
      }
    },
    {
      id: 5,
      productCategoryId: 1,
      serviceId: 7,
      serviceName: 'Electric Drive Service 2',
      productGroupId: 'PC',
      brandId: 'MB',
      day: 'SA',
      diff: {
        old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
        new: { times: [], closed: true }
      }
    },
    {
      id: 6,
      productCategoryId: 1,
      serviceId: 7,
      serviceName: 'Electric Drive Service 2',
      productGroupId: 'BUS',
      brandId: 'MB',
      day: 'SA',
      diff: {
        old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
        new: { times: [], closed: true }
      }
    },
    {
      id: 7,
      productCategoryId: 1,
      serviceId: 7,
      serviceName: 'Electric Drive Service 2',
      productGroupId: 'BUS',
      brandId: 'MB',
      day: 'SU',
      diff: {
        old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
        new: { times: [], closed: true }
      }
    },
    {
      id: 7,
      productCategoryId: 1,
      serviceId: 7,
      serviceName: 'Electric Drive Service 2',
      productGroupId: 'PC',
      brandId: 'SMT',
      day: 'SU',
      diff: {
        old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
        new: { times: [], closed: true }
      }
    },
    {
      id: 8,
      productCategoryId: 1,
      serviceId: 7,
      serviceName: 'Electric Drive Service 2',
      productGroupId: 'PC',
      brandId: 'SMT',
      startDate: '2021-01-24',
      endDate: '2021-01-24',
      day: 'SU',
      diff: {
        old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
        new: { times: [], closed: true }
      }
    },
    {
      id: 8,
      productCategoryId: 1,
      serviceId: 7,
      serviceName: 'Electric Drive Service 2',
      productGroupId: 'PC',
      brandId: 'SMT',
      startDate: '2021-02-10',
      endDate: '2021-02-12',
      day: 'WE',
      diff: {
        old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
        new: { times: [], closed: true }
      }
    },
    {
      id: 9,
      productCategoryId: 1,
      serviceId: 7,
      serviceName: 'Electric Drive Service 2',
      productGroupId: 'PC',
      brandId: 'SMT',
      startDate: '2021-02-10',
      endDate: '2021-02-12',
      day: 'TH',
      diff: {
        old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
        new: { times: [], closed: true }
      }
    },
    {
      id: 10,
      productCategoryId: 1,
      serviceId: 7,
      serviceName: 'Electric Drive Service 2',
      productGroupId: 'PC',
      brandId: 'SMT',
      startDate: '2021-02-10',
      endDate: '2021-02-12',
      day: 'FR',
      diff: {
        old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
        new: { times: [], closed: true }
      }
    }
  ]
};

@Component({
  template: '{{productGroupId}}',
  selector: 'gp-product-group'
})
class TestProductGroupComponent {
  @Input()
  productGroupId: string;
}

describe('TaskDiffOpeningHoursComponent', () => {
  let component: TaskDiffOpeningHoursComponent;
  let fixture: ComponentFixture<TaskDiffOpeningHoursComponent>;

  const localeServiceStub = {
    currentBrowserLocale: () => of('en-US')
  };

  const brandServiceStub = {
    getAll: () => of([])
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgPipesModule, MatTooltipModule],
        declarations: [
          TaskDiffOpeningHoursComponent,
          TaskDiffItemComponent,
          TranslatePipeMock,
          BrandComponent,
          IconComponent,
          TestProductGroupComponent,
          EmptyValuePipe
        ],
        providers: [
          { provide: LocaleService, useValue: localeServiceStub },
          { provide: BrandService, useValue: brandServiceStub }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDiffOpeningHoursComponent);
    component = fixture.componentInstance;
    component.taskDiff = mockDiffData;
    component.languageId = 'en-EN';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show brand icon component with MB icon', () => {
    const brandIcon = fixture.debugElement.query(By.css('gp-brand-icon')).nativeElement;
    const expectedIcon = 'mb.svg';
    expect(brandIcon.innerHTML).toContain(expectedIcon);
  });

  it('should show icon component with PC icon', () => {
    const icon = fixture.debugElement.query(By.css('gp-product-group')).nativeElement;
    const expectedIcon = 'PC';
    expect(icon.innerHTML).toContain(expectedIcon);
  });

  describe('highlighted()', () => {
    it('should return true if old and new are different', () => {
      const result = component.highlighted(component.taskDiff.openingHoursDiff[0].diff);
      expect(result).toBeTruthy();
    });

    it('should return false if old and new are equal', () => {
      component.taskDiff.openingHoursDiff[0].diff = {
        old: {
          times: [
            {
              begin: '09:00',
              end: '18:00'
            }
          ],
          closed: false
        },
        new: {
          times: [
            {
              begin: '09:00',
              end: '18:00'
            }
          ],
          closed: false
        }
      };
      const result = component.highlighted(component.taskDiff.openingHoursDiff[0].diff);
      expect(result).toBeFalsy();
    });
  });

  describe('translatedServiceNameBy()', () => {
    it('should return translated service name', () => {
      const current = {
        id: 1,
        productCategoryId: 1,
        serviceId: 7,
        serviceName: 'SM',
        serviceNameTranslations: [
          {
            languageId: 'en-EN',
            name: 'Service and Maintenance'
          }
        ],
        productGroupId: 'PC',
        brandId: 'MB',
        day: 'MO',
        diff: {
          old: {
            times: [
              {
                begin: '09:00',
                end: '18:00'
              }
            ],
            closed: false
          },
          new: {
            times: [
              {
                begin: '07:00',
                end: '18:00'
              }
            ],
            closed: false
          }
        }
      };
      const result = component.translatedServiceNameBy(current);

      expect(result).toEqual('Service and Maintenance');
    });

    it('should return service name instead of missing translation', () => {
      const current = {
        id: 1,
        productCategoryId: 1,
        serviceId: 7,
        serviceName: 'SM',
        productGroupId: 'PC',
        brandId: 'MB',
        day: 'MO',
        diff: {
          old: {
            times: [
              {
                begin: '09:00',
                end: '18:00'
              }
            ],
            closed: false
          },
          new: {
            times: [
              {
                begin: '07:00',
                end: '18:00'
              }
            ],
            closed: false
          }
        }
      };
      const result = component.translatedServiceNameBy(current);

      expect(result).toEqual('SM');
    });

    it('should return offeredServiceId', () => {
      const current = {
        id: 1,
        productCategoryId: 1,
        serviceId: 7,
        productGroupId: 'PC',
        brandId: 'MB',
        day: 'MO',
        diff: {
          old: {
            times: [
              {
                begin: '09:00',
                end: '18:00'
              }
            ],
            closed: false
          },
          new: {
            times: [
              {
                begin: '07:00',
                end: '18:00'
              }
            ],
            closed: false
          }
        }
      };
      const result = component.translatedServiceNameBy(current);

      expect(result).toEqual('7');
    });
  });

  describe('groupOpeningHours()', () => {
    it('should group and sort opening hours diff when on init', () => {
      component.taskDiff = unGroupMockDiffData;

      const expectedData = [
        {
          serviceId: 7,
          serviceName: 'Electric Drive Service 2',
          diff: {
            old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
            new: { times: [], closed: true }
          },
          days: ['SU', 'SA'],
          startDate: undefined,
          endDate: undefined,
          brandProductGroupMap: new Map([['MB', new Set(['PC', 'BUS'])]])
        },
        {
          serviceId: 7,
          serviceName: 'Electric Drive Service 2',
          diff: {
            old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
            new: { times: [], closed: true }
          },
          days: ['SU'],
          startDate: undefined,
          endDate: undefined,
          brandProductGroupMap: new Map([['SMT', new Set(['PC'])]])
        },
        {
          serviceId: 7,
          serviceName: 'Electric Drive Service 2',
          diff: {
            old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
            new: { times: [], closed: true }
          },
          days: ['WE', 'TH', 'FR'],
          startDate: '2021-02-10',
          endDate: '2021-02-12',
          brandProductGroupMap: new Map([['SMT', new Set(['PC'])]])
        },
        {
          serviceId: 7,
          serviceName: 'Electric Drive Service 2',
          diff: {
            old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
            new: { times: [], closed: true }
          },
          days: ['SU'],
          startDate: '2021-01-24',
          endDate: '2021-01-24',
          brandProductGroupMap: new Map([['SMT', new Set(['PC'])]])
        },
        {
          serviceId: 210,
          serviceName: 'Electric Drive Service 1',
          diff: {
            old: { times: [{ begin: '09:00', end: '18:00' }], closed: false },
            new: { times: [{ begin: '07:00', end: '18:00' }], closed: false }
          },
          days: ['SU', 'TH', 'SA'],
          startDate: undefined,
          endDate: undefined,
          brandProductGroupMap: new Map([['MB', new Set(['PC'])]])
        }
      ];

      component.ngOnInit();
      expect(component.groupedAndSortedOpeningHours).toEqual(expectedData);
    });
  });
});
