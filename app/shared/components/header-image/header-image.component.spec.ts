import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderImageComponent } from './header-image.component';

describe('TileLogoComponent', () => {
  let component: HeaderImageComponent;
  let fixture: ComponentFixture<HeaderImageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HeaderImageComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderImageComponent);
    component = fixture.componentInstance;
    component.name = 'business';
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should set src', () => {
    expect(component.src).toBe('assets/logos/tile-avatars/business.svg');
  });
});
