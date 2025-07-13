import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';
import { PropertyValueCellComponent } from './property-value-cell.component';

describe('PropertyValueCellComponent', () => {
  let component: PropertyValueCellComponent;
  let fixture: ComponentFixture<PropertyValueCellComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PropertyValueCellComponent, TranslatePipeMock],
        imports: [RouterTestingModule.withRoutes([])]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyValueCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
