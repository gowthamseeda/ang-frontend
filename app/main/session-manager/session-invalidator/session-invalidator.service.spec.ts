import { TestBed } from '@angular/core/testing';

import { SessionInvalidatorService } from './session-invalidator.service';
import { MatDialog } from "@angular/material/dialog";
import { createSpyFromClass, Spy } from "jest-auto-spies";
import { UserIdleService } from "angular-user-idle";
import {TestingModule} from "../../../testing/testing.module";

describe('SessionInvalidatorService', () => {
  let service: SessionInvalidatorService;
  let matDialogSpy: Spy<MatDialog>;
  let userIdleServiceSpy: Spy<UserIdleService>

  beforeEach(async () => {
    matDialogSpy = createSpyFromClass(MatDialog);
    TestBed.configureTestingModule({
      imports: [ TestingModule ],
      providers: [ SessionInvalidatorService,
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: UserIdleService, useValue: userIdleServiceSpy }
      ]
    });
    service = TestBed.inject(SessionInvalidatorService)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
