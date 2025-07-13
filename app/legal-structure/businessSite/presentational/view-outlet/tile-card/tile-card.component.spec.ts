import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TileCardComponent } from './tile-card.component';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';

@Component({
  template: '<gp-tile-card></gp-tile-card>'
})
class TileCardTestComponent {
  @ViewChild(TileCardComponent)
  public tileCardComponent: TileCardComponent;
}

describe('TileCardComponent', () => {
  let component: TileCardTestComponent;
  let fixture: ComponentFixture<TileCardTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TileCardTestComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TileCardTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
