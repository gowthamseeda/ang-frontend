import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TaxNumberInputComponent } from './tax-number-input.component';
import { TestingModule } from '../../../../../testing/testing.module';
import { VerificationTaskFormStatus } from "../../../../../tasks/task.model";
import { createSpyFromClass, provideAutoSpy, Spy } from 'jest-auto-spies';
import { FeatureToggleService } from 'app/shared/directives/feature-toggle/feature-toggle.service';
import { MatDialog } from "@angular/material/dialog";
import { TaskDataService } from "../../../../../tasks/task/store/task-data.service";
import { getTaskData } from "../../../model/legal-information.mock";

describe('TaxNumberInputComponent', () => {
  let component: TaxNumberInputComponent;
  let fixture: ComponentFixture<TaxNumberInputComponent>;

  let featureToggleServiceSpy: Spy<FeatureToggleService>
  let taskDataService: Spy<TaskDataService>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(
    waitForAsync(() => {
      matDialogSpy = createSpyFromClass(MatDialog);
      featureToggleServiceSpy = createSpyFromClass(FeatureToggleService)
      featureToggleServiceSpy.isFeatureEnabled.nextWith(true)

      TestBed.configureTestingModule({
        declarations: [TaxNumberInputComponent],
        imports: [TestingModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
          provideAutoSpy(TaskDataService),
          { provide: MatDialog, useValue: matDialogSpy }
        ]
      }).compileComponents();

      taskDataService = TestBed.inject<any>(TaskDataService);
      taskDataService.getById.nextWith(getTaskData());
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxNumberInputComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create in readonly mode as default', () => {
    expect(component.readonly).toBe(true);
  });

  describe('ngOnChanges should', () => {
    beforeEach(() => {
      component.readonly = false;
      fixture.detectChanges();
    });

    it('set readonly', () => {
      expect(component.readonly).toBe(false);
    });
  });

  describe('onKeyUp should', () => {
    beforeEach(() => {
      const controlName = 'taxNumber';
      const mockValue = 'test';
      const mockControl = new FormControl(mockValue);

      spyOn(component.formGroup, 'get').and.callFake((name: string) => {
        return name === controlName ? mockControl : null;
      });
      component.isBSR = true;
      component.verificationTaskStatus = VerificationTaskFormStatus.PENDING;
      fixture.detectChanges();
    });
    test(`should set verificationTaskStatus to REMAIN when the field value is the same`, () => {
      component.fieldInitialValue = 'test';
      fixture.detectChanges();
      component.onKeyUp('');
      expect(component.verificationTaskStatus).toStrictEqual(VerificationTaskFormStatus.REMAIN);
    });
    test(`should set verificationTaskStatus to CHANGED when the field value is not the same`, () => {
      component.fieldInitialValue = 'test1';
      fixture.detectChanges();
      component.onKeyUp('');
      expect(component.verificationTaskStatus).toStrictEqual(VerificationTaskFormStatus.CHANGED);
    });
  });

  describe('onKeyUp when isMTR should', () => {
    let mockControl: FormControl;

    beforeEach(() => {
      const controlName = 'taxNumber';
      const mockValue = 'test';
      mockControl = new FormControl(mockValue);
      component.controlName = controlName;

      spyOn(component.formGroup, 'get').and.callFake((name: string) => {
        return name === controlName ? mockControl : null;
      });
      component.formGroup.controls[controlName] = mockControl;
      spyOn(component.formGroup.controls[controlName], 'setValue');
      component.isMTR = true;
      //component.isForRetailEnabled = true;
      component.taskForDisplay.shouldDisplayFutureValue = true,
        fixture.detectChanges();
    });

    it('should test value to', () => {
      component.onKeyUp('');
      expect(component.formGroup.get('taxNumber')?.value).toBe('test');
      expect(matDialogSpy.open).toHaveBeenCalled();
    });
  });
});
