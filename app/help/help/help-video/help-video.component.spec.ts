import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { Video } from '../../help.model';

import { HelpVideoComponent } from './help-video.component';

describe('HelpVideoComponent', () => {
  let component: HelpVideoComponent;
  let fixture: ComponentFixture<HelpVideoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HelpVideoComponent, TranslatePipeMock],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit play event', () => {
    const spy = jest.spyOn(component.playEvent, 'emit');
    component.playVideo({} as Video);
    expect(spy).toHaveBeenCalled();
  });
});
