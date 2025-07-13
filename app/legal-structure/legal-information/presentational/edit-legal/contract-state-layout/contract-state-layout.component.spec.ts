import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContractStateLayoutComponent } from './contract-state-layout.component';
import { TestingModule } from '../../../../../testing/testing.module';

describe('ContractStatusLayoutComponent', () => {
  let component: ContractStateLayoutComponent;
  let fixture: ComponentFixture<ContractStateLayoutComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContractStateLayoutComponent],
        imports: [TestingModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractStateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
