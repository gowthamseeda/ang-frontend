import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';

import { HelpTrainingSupportComponent } from './help-training-support.component';

describe('HelpTrainingSupportComponent', () => {
  let component: HelpTrainingSupportComponent;
  let fixture: ComponentFixture<HelpTrainingSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpTrainingSupportComponent, TranslatePipeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpTrainingSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
