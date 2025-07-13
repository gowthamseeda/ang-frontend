import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestingModule } from '../../../../../testing/testing.module';

import { OutletIdAndStatusComponent } from './outlet-id-and-status.component';

@Component({
  template:
    '<gp-outlet-id-and-status [outletId]="outletId" [active]="active"></gp-outlet-id-and-status>'
})
class OutletIdAndStatusTestComponent {
  @ViewChild(OutletIdAndStatusComponent)
  public outletIdAndStatusComponent: OutletIdAndStatusComponent;
  outletId: string = 'GS0000001';
  active: Boolean = true;
}

describe('OutletIdAndStatusComponent', () => {
  let component: OutletIdAndStatusTestComponent;
  let fixture: ComponentFixture<OutletIdAndStatusTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletIdAndStatusTestComponent],
        imports: [ReactiveFormsModule, TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletIdAndStatusTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get outlet id form parent', () => {
    expect(component.outletId).toBe('GS0000001');
  });
  it('should get active state form parent', () => {
    expect(component.active).toBeTruthy();
  });
});
