import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestingModule } from '../../../../../testing/testing.module';
import { BrandsPillarContentLoaderComponent } from './brands-pillar-content-loader.component';

@Component({
  template:
    '<gp-brands-pillar-content-loader [isLoading]="isLoading"></gp-brands-pillar-content-loader>'
})
class BrandsPillarContentLoaderTestComponent {
  @ViewChild(BrandsPillarContentLoaderComponent)
  public outletIdAndStatusComponent: BrandsPillarContentLoaderComponent;
  isLoading: Boolean = true;
}

describe('BrandsPillarContentLoaderComponent', () => {
  let component: BrandsPillarContentLoaderTestComponent;
  let fixture: ComponentFixture<BrandsPillarContentLoaderTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BrandsPillarContentLoaderTestComponent],
        imports: [ReactiveFormsModule, TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsPillarContentLoaderTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get isLoading state form parent', () => {
    expect(component.isLoading).toBeTruthy();
  });
});
