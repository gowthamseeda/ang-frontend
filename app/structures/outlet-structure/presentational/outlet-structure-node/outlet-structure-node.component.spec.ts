import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OutletStructureNodeComponent } from './outlet-structure-node.component';

describe('OutletStructureNodeComponent', () => {
  let component: OutletStructureNodeComponent;
  let fixture: ComponentFixture<OutletStructureNodeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletStructureNodeComponent],
        imports: [RouterTestingModule.withRoutes([])]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletStructureNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
