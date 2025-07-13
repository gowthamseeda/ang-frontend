import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { EnableIfMarkedForHighlightingDirective } from './enable-if-marked-for-highlighting.directive';

@Component({
  selector: 'gp-test-component',
  template: '<div id="test-id" *gpEnableIfMarkedForHighlighting="fieldValue">Content</div>'
})
class TestEnableIfMarkedForHighlightingComponent {
  fieldValue: string;
}

describe('EnableIfMarkedForHighlighting', () => {
  let fixture: ComponentFixture<TestEnableIfMarkedForHighlightingComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          EnableIfMarkedForHighlightingDirective,
          TestEnableIfMarkedForHighlightingComponent
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
      fixture = TestBed.createComponent(TestEnableIfMarkedForHighlightingComponent);
    })
  );

  describe('string marked ', () => {
    it('div should be included in DOM', () => {
      fixture.componentInstance.fieldValue = '***Marked text***';
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('#test-id')).length).toEqual(1);
    });
  });

  describe('array marked ', () => {
    it('div should be included in DOM', () => {
      fixture.componentInstance.fieldValue = '***Marked text***';
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('#test-id')).length).toEqual(1);
    });
  });

  describe('not marked', () => {
    it('div should not be included in DOM', () => {
      fixture.componentInstance.fieldValue = 'Marked text';
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('#test-id')).length).toEqual(0);
    });
  });
});
