import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { TranslatePipeMock } from './../../../testing/pipe-mocks/translate';
import { DefaultEditActionsComponent } from './default-edit-actions.component';

describe('ActionsFooterComponent', () => {
  let component: DefaultEditActionsComponent;
  let fixture: ComponentFixture<DefaultEditActionsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          DefaultEditActionsComponent,
          NgxPermissionsAllowStubDirective,
          TranslatePipeMock
        ],
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

  it('should show the checkbox and the icon if showDoNotShowAgainCheckBox is true', () => {
    component.showDoNotShowAgainCheckBox = true;
    fixture.detectChanges();
    const checkbox = fixture.nativeElement.querySelector('mat-checkbox');
    const icon = fixture.nativeElement.querySelector('gp-icon');
    expect(checkbox).toBeTruthy();
    expect(icon).toBeTruthy();
  });

  it('should not show the checkbox and the icon if showDoNotShowAgainCheckBox is false', () => {
    component.showDoNotShowAgainCheckBox = false;
    fixture.detectChanges();
    const checkbox = fixture.nativeElement.querySelector('mat-checkbox');
    const icon = fixture.nativeElement.querySelector('gp-icon');
    expect(checkbox).toBeFalsy();
    expect(icon).toBeFalsy();
  });
});
