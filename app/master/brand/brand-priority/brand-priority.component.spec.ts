import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterBrandService } from '../master-brand/master-brand.service';

import { BrandPriorityComponent } from './brand-priority.component';

describe('BrandPriorityComponent', () => {
  let component: BrandPriorityComponent;
  let fixture: ComponentFixture<BrandPriorityComponent>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let brandServiceSpy: Spy<MasterBrandService>;

  beforeEach(
    waitForAsync(() => {
      brandServiceSpy = createSpyFromClass(MasterBrandService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [BrandPriorityComponent],
        imports: [MatTableModule, TestingModule],
        providers: [
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: MasterBrandService, useValue: brandServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
