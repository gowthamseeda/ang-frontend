import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IAMManagementComponent } from './iam-management.component';
import { TestingModule } from '../../testing/testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('IAMManagementComponent', () => {
  let component: IAMManagementComponent;
  let fixture: ComponentFixture<IAMManagementComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [IAMManagementComponent],
        imports: [TestingModule, RouterTestingModule.withRoutes([])],
        providers: [UntypedFormBuilder],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IAMManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
