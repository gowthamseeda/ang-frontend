import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DefaultEditActionsComponent } from '../../../../../shared/components/default-edit-actions/default-edit-actions.component';
import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';

describe('ActionsFooterComponent', () => {
  let component: DefaultEditActionsComponent;
  let fixture: ComponentFixture<DefaultEditActionsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DefaultEditActionsComponent, TranslatePipeMock],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultEditActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
