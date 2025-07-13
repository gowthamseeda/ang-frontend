import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { Observable } from 'rxjs';

import { LeaveComponent } from './leave-component.component';

describe('LeaveComponent', () => {
  let component: LeaveComponent;
  let fixture: ComponentFixture<LeaveComponent>;
  let translateServiceSpy: Spy<TranslateService>;

  beforeEach(
    waitForAsync(() => {
      translateServiceSpy = createSpyFromClass(TranslateService);

      TestBed.configureTestingModule({
        declarations: [LeaveComponent],
        providers: [{ provide: TranslateService, useValue: translateServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true', () => {
    const messageObservable = new Observable<any>(observer => {
      observer.next('DISCARD_CHANGES_QUESTION');
      observer.complete();
    });
    translateServiceSpy.get.mockReturnValue(messageObservable);

    expect(component.canDeactivate()).toBe(true);
  });

  it('should set unloadNotification message', () => {
    const messageObservable = new Observable<any>(observer => {
      observer.next('DISCARD_CHANGES_QUESTION');
      observer.complete();
    });
    translateServiceSpy.get.mockReturnValue(messageObservable);

    const mockEvent = { returnValue: 'DISCARD_CHANGES_QUESTION' };
    component.unloadNotification(mockEvent);
    expect(mockEvent.returnValue).toBe(component.message);
  });
});
