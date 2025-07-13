import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { TaskWebSocketService } from './task-websocket.service';
import { UserService } from 'app/iam/user/user.service';
import { TestBed } from '@angular/core/testing';

describe('TaskWebsocketService', () => {
  let service: TaskWebSocketService;
  let userServiceSpy: Spy<UserService>;

  beforeEach(() => {
    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getBusinessSiteRestrictions.nextWith([]);
    userServiceSpy.getCountryRestrictions.nextWith([]);
    userServiceSpy.getProductGroupRestrictions.nextWith([]);

    TestBed.configureTestingModule({
      providers: [
        TaskWebSocketService,
        {
          provide: UserService,
          useValue: userServiceSpy
        }
      ]
    });
    service = TestBed.inject(TaskWebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
