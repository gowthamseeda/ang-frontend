import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OutletTileComponent } from './outlet-tile.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

@Component({
  template: '<gp-outlet-tile></gp-outlet-tile>'
})
class OutletTileTestComponent {
  @ViewChild(OutletTileComponent)
  public outletTileComponent: OutletTileComponent;
}

describe('OutletTileComponent', () => {
  let component: OutletTileTestComponent;
  let fixture: ComponentFixture<OutletTileTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletTileTestComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletTileTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
