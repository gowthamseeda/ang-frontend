import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractPartnerInfoComponent } from './contract-partner-info.component';

describe('ContractPartnerInfoComponent', () => {
  let component: ContractPartnerInfoComponent;
  let fixture: ComponentFixture<ContractPartnerInfoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContractPartnerInfoComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractPartnerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
