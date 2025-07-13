import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WeekdayColumnComponent } from './weekday-column.component';
import { TestingModule } from '../../../../testing/testing.module';

describe('WeekdayColumnComponent', () => {
  let component: WeekdayColumnComponent;
  let fixture: ComponentFixture<WeekdayColumnComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WeekdayColumnComponent],
        imports: [TestingModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekdayColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should calculate the correct height for cells', () => {
    component.weekDays = [1, 2];
    component.weekDaysOpeningHours = [
      {
        weekDay: 1,
        openingHours: [
          {
            groupId: '1',
            times: [{begin: '09:00', end: '11:00'}, {begin: '13:00', end: '15:00'}],
            closed: false,
            dataChangeTask: {
              new: {
                times: [
                  {begin: '09:00', end: '11:00'}, {begin: '13:00', end: '15:00'}, {begin: '16:00', end: '17:00'}
                ], closed: false
              }, old: {
                times: [
                  {begin: '09:00', end: '11:00'}, {begin: '13:00', end: '15:00'}
                ], closed: false
              }
            }
          }
        ]
      },
      {
        weekDay: 2,
        openingHours: [
          {
            groupId: '2',
            times: [{begin: '09:00', end: '11:00'}, {begin: '13:00', end: '15:00'}],
            closed: false,
            dataChangeTask: {
              new: {
                times: [
                  {begin: '09:00', end: '11:00'}, {begin: '13:00', end: '15:00'}
                ], closed: false
              }, old: {
                times: [
                  {begin: '09:00', end: '11:00'}, {begin: '13:00', end: '15:00'}, {begin: '16:00', end: '17:00'}
                ], closed: false
              }
            }
          }
        ]
      }
    ];

    component.calculateHeightForCell();

    expect(component.cellNumberOfDataLineMapping[1]).toBe(6);
    expect(component.cellNumberOfDataLineMapping[2]).toBe(6);
  });

  it('should return the correct cell height', () => {
    component.showDataChangeNotification = true;
    component.cellNumberOfDataLineMapping = { 'Monday': 6, 'Tuesday': 3 };

    expect(component.getCellHeight('Monday')).toBe('197px');
    expect(component.getCellHeight('Tuesday')).toBe('155px');
  });

  it('should return the default cell height if show Data Change Notification is false', () => {
    component.showDataChangeNotification = false;
    component.cellNumberOfDataLineMapping = { 'Monday': 6, 'Tuesday': 3 };

    expect(component.getCellHeight('Monday')).toBe('126px');
    expect(component.getCellHeight('Tuesday')).toBe('126px');
  });
});
