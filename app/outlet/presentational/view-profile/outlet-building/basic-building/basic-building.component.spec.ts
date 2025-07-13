import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasicBuildingComponent } from './basic-building.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BasicBuildingComponent', () => {
  let component: BasicBuildingComponent;
  let fixture: ComponentFixture<BasicBuildingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BasicBuildingComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicBuildingComponent]
    });
    fixture = TestBed.createComponent(BasicBuildingComponent);
    component = fixture.componentInstance;
  });

  test('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  test('place door directly after the product if there is only one product groups', () => {
    component.productGroupIds = ['0'];
    fixture.detectChanges();

    expect(component.calculateDoorIndex()).toBe(0);
  });

  test('place door in the middle if even number of product groups', () => {
    component.productGroupIds = ['0', '1', '2', '3'];
    fixture.detectChanges();

    expect(component.calculateDoorIndex()).toBe(1);
  });

  test('place door before the product group which represents the middle if odd number of product groups', () => {
    component.productGroupIds = ['0', '1', '2', '3', '4'];
    fixture.detectChanges();

    expect(component.calculateDoorIndex()).toBe(1);
  });
});
