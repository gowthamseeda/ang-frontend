import { HistorizationShowChangeOnlyToggleComponent } from './historization-show-change-only-toggle.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestingModule } from '../../../testing/testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HistorizationShowChangeOnlyToggleComponent', () => {
  let component: HistorizationShowChangeOnlyToggleComponent;
  let fixture: ComponentFixture<HistorizationShowChangeOnlyToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HistorizationShowChangeOnlyToggleComponent],
      imports: [TestingModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorizationShowChangeOnlyToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateShowChangeOnlyToggle and emit event on slide toggle change', () => {
    const slider = fixture.debugElement.queryAll(By.css('mat-slide-toggle'))[0];
    const spy = spyOn(component, 'updateShowChangeOnlyToggle');
    spyOn(component.showChangeOnlyToggle, 'emit');
    slider.triggerEventHandler('change', null);
    expect(component.updateShowChangeOnlyToggle).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });
});
