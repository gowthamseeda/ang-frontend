import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutletIdBlockComponent } from './outlet-id-block.component';

describe('OutletIdBlockComponent', () => {
  let component: OutletIdBlockComponent;
  let fixture: ComponentFixture<OutletIdBlockComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletIdBlockComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletIdBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
