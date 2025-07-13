import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';

import { TaskExpandableTableComponent } from './task-expandable-table.component';

describe('TaskExpandableTableComponent', () => {
  let component: TaskExpandableTableComponent;
  let fixture: ComponentFixture<TaskExpandableTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatTableModule],
        declarations: [TaskExpandableTableComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskExpandableTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update row show and emit click event', () => {
    const row = {
      row: {
        businessSite: {
          businessSiteId: 'GS0000001'
        }
      },
      show: false
    };

    const expected = {
      row: {
        businessSite: {
          businessSiteId: 'GS0000001'
        }
      },
      show: true
    };

    const spy = jest.spyOn(component.saveExpandedStatus, 'emit');

    component.click(row);

    expect(row.show).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(expected);
  });
});
