import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TestingModule } from '../../../../../../testing/testing.module';
import { MasterBrandMock } from '../../../../../brand/master-brand/master-brand.mock';
import { MasterBrandService } from '../../../../../brand/master-brand/master-brand.service';

import { BrandSelectorComponent } from './brand-selector.component';

@Component({
  template: '<gp-brand-selector [control]="control">' + '</gp-brand-selector>'
})
class TestComponent {
  @ViewChild(BrandSelectorComponent)
  public brandSelector: BrandSelectorComponent;
  control = new FormControl([]);
}

describe('BrandSelectorComponent', () => {
  const masterBrandMock = MasterBrandMock.asList();

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let brandServiceSpy: Spy<MasterBrandService>;

  beforeEach(
    waitForAsync(() => {
      brandServiceSpy = createSpyFromClass(MasterBrandService);
      brandServiceSpy.getAll.nextWith(masterBrandMock);

      TestBed.configureTestingModule({
        declarations: [BrandSelectorComponent, TestComponent],
        imports: [MatSelectModule, ReactiveFormsModule, NoopAnimationsModule, TestingModule],
        providers: [{ provide: MasterBrandService, useValue: brandServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
