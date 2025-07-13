import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutletBuildingComponent } from './outlet-building.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('OutletBuildingComponent', () => {
  let component: OutletBuildingComponent;
  let fixture: ComponentFixture<OutletBuildingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletBuildingComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
