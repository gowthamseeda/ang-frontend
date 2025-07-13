import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FocusDirective } from './focus.directive';

@Component({
  template: ` <input gpFocus /> `
})
class TestFocusContainerComponent {}

describe('FocusDirective', () => {
  let component: TestFocusContainerComponent;
  let fixture: ComponentFixture<TestFocusContainerComponent>;
  let input: DebugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FocusDirective, TestFocusContainerComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFocusContainerComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create an instance', () => {
    const directive = new FocusDirective(input);
    expect(directive).toBeTruthy();
  });

  it('should focus the element', () => {
    const focusedElement = fixture.debugElement.query(By.css('input:focus'));
    expect(focusedElement).toBeDefined();
  });
});
