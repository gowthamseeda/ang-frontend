import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NgPipesModule } from 'ngx-pipes';
import { of } from 'rxjs';

import { BrandService } from '../../../../services/brand/brand.service';
import { BrandComponent } from '../../../../services/shared/components/brand-icon/brand.component';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { CommunicationDataDiffData, GeneralCommunicationDataDiff } from '../../../task.model';
import { TaskDiffItemComponent } from '../task-diff-item/task-diff-item.component';

import { TaskDiffGeneralCommunicationComponent } from './task-diff-general-communication.component';
import { EmptyValuePipe } from '../../../../shared/pipes/empty-value/empty-value.pipe';

const taskDiffMock: GeneralCommunicationDataDiff = {
  generalCommunicationDataDiff: [
    {
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
  let component: TaskDiffGeneralCommunicationComponent;
  let fixture: ComponentFixture<TaskDiffGeneralCommunicationComponent>;

  const brandServiceStub = {
    getAll: () => of([])
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgPipesModule, MatTooltipModule],
      declarations: [
        TaskDiffGeneralCommunicationComponent,
        TranslatePipeMock,
        TaskDiffItemComponent,
        BrandComponent,
        EmptyValuePipe
      ],
      providers: [{ provide: BrandService, useValue: brandServiceStub }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDiffGeneralCommunicationComponent);
    component = fixture.componentInstance;
    component.taskDiff = taskDiffMock;
    component.languageId = 'en-EN';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show brand icon component with BRANDLESS and MB icon', () => {
    const brandIconComponents = fixture.debugElement.queryAll(By.directive(BrandComponent));
    const brandlessIcon = 'brandless.svg';
    const mbIcon = 'mb.svg';
    expect(brandIconComponents.length).toBe(4);

    brandIconComponents.forEach((brandIconComponent, index) => {
      index === 0 || index % 2 === 0
        ? expect(brandIconComponent.nativeElement.innerHTML).toContain(brandlessIcon)
        : expect(brandIconComponent.nativeElement.innerHTML).toContain(mbIcon);
    });
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
});
