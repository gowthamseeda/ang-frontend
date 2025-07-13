import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutletBuildingLoaderComponent } from './outlet-building-loader.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OutletBuildingLoaderComponent', () => {
  let component: OutletBuildingLoaderComponent;
  let fixture: ComponentFixture<OutletBuildingLoaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletBuildingLoaderComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletBuildingLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
