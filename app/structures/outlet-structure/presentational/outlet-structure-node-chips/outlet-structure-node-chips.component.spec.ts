import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestingModule } from '../../../../testing/testing.module';
import { OutletStructureNodeChipsComponent } from './outlet-structure-node-chips.component';

@Component({
  template: '<gp-outlet-structure-node-chips></gp-outlet-structure-node-chips>'
})
class OutletStructureNodeChipsTestComponent {
  @ViewChild(OutletStructureNodeChipsComponent, { static: false })
  public chipsComponent: OutletStructureNodeChipsComponent;
}

describe('OutletStructureNodeChipsComponent', () => {
  let component: OutletStructureNodeChipsTestComponent;
  let fixture: ComponentFixture<OutletStructureNodeChipsTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletStructureNodeChipsTestComponent],
        imports: [ReactiveFormsModule, TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletStructureNodeChipsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
