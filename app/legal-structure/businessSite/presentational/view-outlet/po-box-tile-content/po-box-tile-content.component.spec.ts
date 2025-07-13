import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';
import { PoBoxTileContentComponent } from './po-box-tile-content.component';

describe('PoBoxTileContentComponent', () => {
  let component: PoBoxTileContentComponent;
  let fixture: ComponentFixture<PoBoxTileContentComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PoBoxTileContentComponent, TranslatePipeMock],
        imports: [RouterTestingModule.withRoutes([])]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoBoxTileContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
