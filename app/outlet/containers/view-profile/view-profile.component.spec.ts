import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewProfileComponent } from './view-profile.component';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';

@Component({
  template: '<gp-view-profile></gp-view-profile>'
})
class ViewProfileTestComponent {
  @ViewChild(ViewProfileComponent)
  public viewProfileComponent: ViewProfileComponent;
}

describe('ViewProfileComponent', () => {
  let component: ViewProfileTestComponent;
  let fixture: ComponentFixture<ViewProfileTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ViewProfileTestComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProfileTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
