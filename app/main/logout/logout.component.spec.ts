import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutComponent } from './logout.component';
import { TestingModule } from '../../testing/testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SessionInvalidatorService } from '../session-manager/session-invalidator/session-invalidator.service';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

describe('LogoutComponent', () => {
  let sessionInvalidatorServiceSpy: Spy<SessionInvalidatorService>;
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(async () => {
    sessionInvalidatorServiceSpy = createSpyFromClass(SessionInvalidatorService);

    await TestBed.configureTestingModule({
      imports: [TestingModule, TranslateModule.forRoot({})],
      declarations: [LogoutComponent, NgxPermissionsAllowStubDirective],
      providers: [
        { provide: SessionInvalidatorService, useValue: sessionInvalidatorServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
