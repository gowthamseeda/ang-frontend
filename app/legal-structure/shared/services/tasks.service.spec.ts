import { TestBed } from '@angular/core/testing';

import { TasksService } from './tasks.service';
import { Status, Task, Type } from '../../../tasks/task.model';
import { take } from 'rxjs';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit tasks when nextOpenDataChangeTask is called', done => {
    const tasks: Task[] = [
      {
        taskId: 1,
        businessSiteId: 'GS00001',
        status: Status.OPEN,
        type: Type.DATA_CHANGE,
        creationDate: '2024-01-01'
      }
    ];

    service.getDataChangeTasks().subscribe(emittedTasks => {
      expect(emittedTasks).toEqual(tasks);
      done();
    });

    service.nextOpenDataChangeTask(tasks);
  });

  it('should emit an empty array when resetDataChangeTasks is called', done => {
    service
      .getDataChangeTasks()
      .pipe(take(1))
      .subscribe(emittedTasks => {
        expect(emittedTasks).toEqual([]);
        done();
      });

    service.resetDataChangeTasks();
  });

  it('should emit the latest tasks when getDataChangeTasks is called', done => {
    const tasks: Task[] = [
      {
        taskId: 1,
        businessSiteId: 'GS00001',
        status: Status.OPEN,
        type: Type.DATA_CHANGE,
        creationDate: '2024-01-01'
      }
    ];

    service.nextOpenDataChangeTask(tasks);

    service
      .getDataChangeTasks()
      .pipe(take(1))
      .subscribe(emittedTasks => {
        expect(emittedTasks).toEqual(tasks);
        done();
      });
  });
});
