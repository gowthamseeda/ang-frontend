import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrandPyloneLoaderComponent } from './brand-pylone-loader.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BrandPyloneLoaderComponent', () => {
  let component: BrandPyloneLoaderComponent;
  let fixture: ComponentFixture<BrandPyloneLoaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BrandPyloneLoaderComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandPyloneLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
