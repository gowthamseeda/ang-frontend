import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TestingModule } from '../../../../../testing/testing.module';
import { ServiceVariantFilterService } from '../../services/service-variant-filter.service';

import { ServiceVariantTableComponent } from './service-variant-table.component';

describe('ServiceVariantTableComponent', () => {
  let component: ServiceVariantTableComponent;
  let fixture: ComponentFixture<ServiceVariantTableComponent>;

  let serviceVariantFilterServiceSpy: Spy<ServiceVariantFilterService>;

  beforeEach(() => {
    serviceVariantFilterServiceSpy = createSpyFromClass(ServiceVariantFilterService);

    TestBed.configureTestingModule({
      declarations: [ServiceVariantTableComponent],
      imports: [ReactiveFormsModule, MatCheckboxModule, MatSlideToggleModule, TestingModule],
      providers: [
        FormBuilder,
        {
          provide: ServiceVariantFilterService,
          useValue: serviceVariantFilterServiceSpy
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceVariantTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
