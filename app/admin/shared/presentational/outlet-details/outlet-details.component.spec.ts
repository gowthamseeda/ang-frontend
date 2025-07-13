import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TestingModule } from '../../../../testing/testing.module';
import { OutletStatus } from '../../models/outlet.model';

import { OutletDetailsComponent, OutletDetailsDescription } from './outlet-details.component';

@Component({
  template:
    '<gp-outlet-details [selectedOutlet]="selectedOutlet" [description]="outletDescription"></gp-outlet-details>'
})
class TestComponent {
  @ViewChild(OutletDetailsComponent)
  public outletDetailsComponent: OutletDetailsComponent;
  selectedOutlet: OutletStatus = outletStatusMock;
  outletDescription: OutletDetailsDescription = outletDescriptionMock;
}

const outletStatusMock: OutletStatus = {
  current: null,
  isAddCurrentSelected: false,
  isAddPreviousSelected: true,
  previous: null
};

const outletDescriptionMock: OutletDetailsDescription = {
  previousHeader: 'Previous outlet',
  previousAddIconTooltip: 'Add outlet',
  previousRemoveIconTooltip: 'Remove outlet',
  currentHeader: 'Current Company',
  currentAddIconTooltip: 'Add outlet',
  currentRemoveIconTooltip: 'Remove outlet'
};

describe('OutletDetailsComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletDetailsComponent, TestComponent],
        imports: [MatTooltipModule, TestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit outlet details', done => {
    jest.spyOn(component.outletDetailsComponent.outletDetailsChanged, 'emit');
    component.outletDetailsComponent.plusPreviousOutlet();
    component.outletDetailsComponent.minusPreviousOutlet();
    component.outletDetailsComponent.plusCurrentOutlet();
    component.outletDetailsComponent.minusPreviousOutlet();

    expect(component.outletDetailsComponent.outletDetailsChanged.emit).toHaveBeenCalled();
    done();
  });

  describe('validate status', () => {
    it('plusPreviousOutlet', done => {
      component.outletDetailsComponent.plusPreviousOutlet();

      expect(component.selectedOutlet.isAddPreviousSelected).toBeTruthy();
      expect(component.selectedOutlet.isAddCurrentSelected).toBeFalsy();
      done();
    });

    it('minusPreviousOutlet', done => {
      component.outletDetailsComponent.minusPreviousOutlet();

      expect(component.selectedOutlet.isAddPreviousSelected).toBeFalsy();
      expect(component.selectedOutlet.isAddCurrentSelected).toBeFalsy();
      expect(component.selectedOutlet.previous).toBeNull();
      done();
    });

    it('plusCurrentOutlet', done => {
      component.outletDetailsComponent.plusCurrentOutlet();

      expect(component.selectedOutlet.isAddPreviousSelected).toBeFalsy();
      expect(component.selectedOutlet.isAddCurrentSelected).toBeTruthy();
      done();
    });

    it('minusCurrentOutlet', done => {
      component.outletDetailsComponent.minusCurrentOutlet();

      expect(component.selectedOutlet.isAddPreviousSelected).toBeFalsy();
      expect(component.selectedOutlet.isAddCurrentSelected).toBeFalsy();
      expect(component.selectedOutlet.previous).toBeNull();
      done();
    });
  });
});
