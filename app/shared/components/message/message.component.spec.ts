import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';

import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MessageComponent, TranslatePipeMock],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should init showClose with false when there is no close output set', () => {
      fixture.detectChanges();

      expect(component.showClose).toBeFalsy();
    });

    it('should init showClose with true when there is a close output set', () => {
      component.messageClose.subscribe();
      fixture.detectChanges();

      expect(component.showClose).toBeTruthy();
    });
  });
});
