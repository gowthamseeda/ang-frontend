import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ServicesTileComponent } from './services-tile.component';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';

@Component({
  template: '<gp-services-tile></gp-services-tile>'
})
class ServicesTileTestComponent {
  @ViewChild(ServicesTileComponent)
  public servicesTileComponent: ServicesTileComponent;
}

describe('ServicesTileComponent', () => {
  let component: ServicesTileTestComponent;
  let fixture: ComponentFixture<ServicesTileTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ServicesTileTestComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesTileTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
