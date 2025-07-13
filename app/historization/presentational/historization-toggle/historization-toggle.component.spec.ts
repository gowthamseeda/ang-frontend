import { HistorizationToggleComponent } from './historization-toggle.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestingModule } from '../../../testing/testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HistorizationToggleComponent', () => {
  let component: HistorizationToggleComponent;
  let fixture: ComponentFixture<HistorizationToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HistorizationToggleComponent],
      imports: [TestingModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorizationToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateDisplayChangesToggle and emit event on slide toggle change', () => {
    const slider = fixture.debugElement.queryAll(By.css('mat-slide-toggle'))[0];
    const spy = spyOn(component, 'updateDisplayChangesToggle');
    spyOn(component.displayChangesToggle, 'emit');
    slider.triggerEventHandler('change', null);
    expect(component.updateDisplayChangesToggle).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });
});
