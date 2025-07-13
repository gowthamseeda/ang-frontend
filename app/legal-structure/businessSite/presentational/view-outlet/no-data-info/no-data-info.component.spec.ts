import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';
import { NoDataInfoComponent } from './no-data-info.component';

describe('NoDataInfoComponent', () => {
  let component: NoDataInfoComponent;
  let fixture: ComponentFixture<NoDataInfoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NoDataInfoComponent, TranslatePipeMock],
        imports: [RouterTestingModule.withRoutes([])]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDataInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
