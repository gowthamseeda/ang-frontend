import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LinkButtonDirective } from './link-button.directive';

@Component({
  template: `
    <button gpLinkButton>
      Test button
    </button>
  `
})
class TestContentContainerComponent {}

describe('LinkButtonDirective', () => {
  let component: TestContentContainerComponent;
  let fixture: ComponentFixture<TestContentContainerComponent>;
  let button: DebugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LinkButtonDirective, TestContentContainerComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestContentContainerComponent);
    component = fixture.componentInstance;
    button = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create an instance', () => {
    const directive = new LinkButtonDirective(button);
    expect(directive).toBeTruthy();
  });

  it('should apply style', () => {
    expect(button.nativeElement.style.borderWidth).toEqual('0px');
    expect(button.nativeElement.style.cursor).toEqual('pointer');
  });
});
