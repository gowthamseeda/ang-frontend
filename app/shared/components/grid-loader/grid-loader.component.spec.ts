import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GridLoaderComponent } from './grid-loader.component';

describe('GridLoaderComponent', () => {
  let component: GridLoaderComponent;
  let fixture: ComponentFixture<GridLoaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GridLoaderComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GridLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
