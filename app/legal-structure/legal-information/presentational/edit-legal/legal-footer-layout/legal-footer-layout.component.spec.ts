import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestingModule } from '../../../../../testing/testing.module';
import { LegalFooterLayoutComponent } from './legal-footer-layout.component';
import { TaskDataService } from "../../../../../tasks/task/store/task-data.service";
import { getTaskData } from "../../../model/legal-information.mock";
import { createSpyFromClass, provideAutoSpy, Spy } from "jest-auto-spies";
import { MatDialog } from "@angular/material/dialog";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { EditLegalComponentViewState } from '../../../container/edit-legal/edit-legal-component-view-state';
import { FeatureToggleService } from '../../../../../shared/directives/feature-toggle/feature-toggle.service';

describe('LegalFooterLayoutComponent', () => {
  let component: LegalFooterLayoutComponent;
  let fixture: ComponentFixture<LegalFooterLayoutComponent>;
  let taskDataService: Spy<TaskDataService>;
  let matDialogSpy: Spy<MatDialog>;
  let formBuilder: UntypedFormBuilder;
  let featureToggleService: Spy<FeatureToggleService>;
  beforeEach(
    waitForAsync(() => {
      matDialogSpy = createSpyFromClass(MatDialog);
      TestBed.configureTestingModule({
        declarations: [LegalFooterLayoutComponent],
        providers: [
          provideAutoSpy(TaskDataService),
          { provide: MatDialog, useValue: matDialogSpy },
          UntypedFormBuilder
        ],
        imports: [TestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
}).compileComponents();

      taskDataService = TestBed.inject<any>(TaskDataService);
      taskDataService.getById.nextWith(getTaskData());
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalFooterLayoutComponent);
    component = fixture.componentInstance;
    featureToggleService = createSpyFromClass(FeatureToggleService);
    featureToggleService.isFocusFeatureEnabled.nextWith(true);
    featureToggleService.isFeatureEnabled.nextWith(true);
    formBuilder = TestBed.inject(UntypedFormBuilder);
    component.viewState = new EditLegalComponentViewState(formBuilder, featureToggleService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
