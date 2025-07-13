import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';
import { sisterOutletMock } from '../../../models/sister-outlet.mock';
import { OutletOptionComponent } from './outlet-option.component';

describe('OutletOptionComponent', () => {
  let component: OutletOptionComponent;
  let fixture: ComponentFixture<OutletOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutletOptionComponent, TranslatePipeMock],
      imports: [MatCheckboxModule, MatChipsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(OutletOptionComponent);
    component = fixture.componentInstance;
    component.outlet = sisterOutletMock.sisterOutlets[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('OnInit', () => {
    const getLabelsSpy = spyOn(component, 'getLabels');
    const getInactiveSpy = spyOn(component, 'getInactive');

    component.ngOnInit();

    expect(getLabelsSpy).toHaveBeenCalled();
    expect(getInactiveSpy).toHaveBeenCalled();
    expect(component.outletLabels).toContain('DISTRIBUTION_LEVEL_RETAILER_LABEL');
    expect(component.outletInactive).toBeFalsy();
  });

  it('should return inactive = true if outlet is inactive', () => {
    component.outlet.active = false;
    component.getInactive();

    expect(component.outletInactive).toBeTruthy();
  });

  it('should emit if outlet result is clicked', () => {
    jest.spyOn(component.outletSelected, 'emit');
    component.selectOutlet();
    expect(component.outletSelected.emit).toHaveBeenCalledWith('GS01');
  });
});
