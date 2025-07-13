import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NgPipesModule } from 'ngx-pipes';

import { BrandService } from '../../../../services/brand/brand.service';
import { BrandComponent } from '../../../../services/shared/components/brand-icon/brand.component';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import {
  CommunicationData,
  CommunicationDataDiff,
  CommunicationDataDiffData
} from '../../../task.model';
import { TaskDiffItemComponent } from '../task-diff-item/task-diff-item.component';

import { TaskDiffCommunicationComponent } from './task-diff-communication.component';
import { EmptyValuePipe } from '../../../../shared/pipes/empty-value/empty-value.pipe';

const taskDiffMock: CommunicationDataDiff = {
  communicationDataDiff: [
    {
      offeredServiceId: 'GS0000001-1',
      communicationFieldId: 'TEL',
      diff: {
        old: '123',
        new: '456'
      }
    },
    {
      brandId: 'MB',
      communicationFieldId: 'TEL',
      diff: {
        old: '',
        new: '123456'
      }
    }
  ]
};

describe('TaskDiffCommunicationComponent', () => {
  let component: TaskDiffCommunicationComponent;
  let fixture: ComponentFixture<TaskDiffCommunicationComponent>;

  const brandServiceStub = {
    getAll: () => of([])
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgPipesModule, MatTooltipModule],
      declarations: [
        TaskDiffCommunicationComponent,
        TranslatePipeMock,
        TaskDiffItemComponent,
        BrandComponent,
        EmptyValuePipe
      ],
      providers: [{ provide: BrandService, useValue: brandServiceStub }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDiffCommunicationComponent);
    component = fixture.componentInstance;
    component.taskDiff = taskDiffMock;
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

  describe('valueChanged()', () => {
    it('should return true if value was changed', () => {
      const diff: CommunicationDataDiffData = {
        new: 'old value',
        old: 'new value'
      };
      const result = component.valueChanged(diff);
      expect(result).toBeTruthy();
    });
    it('should return false if value was not changed', () => {
      const diff: CommunicationDataDiffData = {
        new: 'old value',
        old: 'old value'
      };
      const result = component.valueChanged(diff);
      expect(result).toBeFalsy();
    });
  });

  describe('getTranslatedServiceName()', () => {
    it('should return translated service name', () => {
      const current: CommunicationData = {
        offeredServiceId: 'GS0000001-7',
        brandId: 'MB',
        communicationFieldId: 'serviceName',
        serviceName: 'SM',
        serviceNameTranslations: [
          {
            languageId: 'en-EN',
            name: 'Service and Maintenance'
          }
        ],
        diff: {
          new: 'new',
          old: 'old'
        }
      };
      const result = component.getTranslatedServiceName(current);

      expect(result).toEqual('Service and Maintenance');
    });

    it('should return service name instead of missing translation', () => {
      const current: CommunicationData = {
        offeredServiceId: 'GS0000001-7',
        brandId: 'MB',
        communicationFieldId: 'serviceName',
        serviceName: 'SM',
        diff: {
          new: 'new',
          old: 'old'
        }
      };
      const result = component.getTranslatedServiceName(current);

      expect(result).toEqual('SM');
    });

    it('should return offeredServiceId', () => {
      const current: CommunicationData = {
        offeredServiceId: 'GS0000001-7',
        brandId: 'MB',
        communicationFieldId: 'serviceName',
        diff: {
          new: 'new',
          old: 'old'
        }
      };
      const result = component.getTranslatedServiceName(current);

      expect(result).toEqual('GS0000001-7');
    });
  });
});
