import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderTileContentComponent } from './header-tile-content.component';

describe('HeaderTileContentComponents', () => {
  let component: HeaderTileContentComponent;
  let fixture: ComponentFixture<HeaderTileContentComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HeaderTileContentComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderTileContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
