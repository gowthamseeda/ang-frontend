import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestingModule } from '../../../../../testing/testing.module';
import { ChipsComponent } from './chips.component';

@Component({
  template: '<gp-chips></gp-chips>'
})
class ChipsTestComponent {
  @ViewChild(ChipsComponent)
  public chipsComponent: ChipsComponent;
}

describe('ChipsComponent', () => {
  let component: ChipsTestComponent;
  let fixture: ComponentFixture<ChipsTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChipsTestComponent],
        imports: [ReactiveFormsModule, TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
