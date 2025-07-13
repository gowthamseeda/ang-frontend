import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChipsContentLoaderComponent } from './chips-content-loader.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ChipsContentLoaderComponent', () => {
  let component: ChipsContentLoaderComponent;
  let fixture: ComponentFixture<ChipsContentLoaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChipsContentLoaderComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsContentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
