import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CompModule } from '../../../shared/components/components.module';
import { TestingModule } from '../../../testing/testing.module';
import { DistributionSelectionComponent } from './distribution-selection.component';

describe('DistributionSelectionComponent', () => {
  let component: DistributionSelectionComponent;
  let fixture: ComponentFixture<DistributionSelectionComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          CompModule,
          TestingModule,
          MatSelectModule,
          MatChipsModule,
          ReactiveFormsModule,
          NoopAnimationsModule
        ],
        declarations: [DistributionSelectionComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionSelectionComponent);
    component = fixture.componentInstance;
    component.placeholder = 'DISTRIBUTION_LEVEL_SELECT';
    component.fControl = new FormControl({ value: ['APPLICANT', 'RETAILER'], disabled: false }, [
      Validators.required
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
