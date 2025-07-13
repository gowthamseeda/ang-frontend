import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContentDirective } from './content.directive';

@Component({
  template: ` <div gpContent></div> `
})
class TestContentContainerComponent {}

describe('ContentContainerDirective', () => {
  let component: TestContentContainerComponent;
  let fixture: ComponentFixture<TestContentContainerComponent>;
  let inputEl: DebugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContentDirective, TestContentContainerComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestContentContainerComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('div'));
    fixture.detectChanges();
  });

  it('should create', () => {
    const directive = new ContentDirective(inputEl);
    expect(directive).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should apply background', () => {
    expect(inputEl.nativeElement.style.backgroundColor).toBe('white');
  });

  it('should apply padding', () => {
    expect(inputEl.nativeElement.style.padding).toBe('30px 30px 50px');
  });
});
