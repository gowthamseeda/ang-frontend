import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { TestingModule } from '../../../testing/testing.module';
import { EditLayoutComponent } from './edit-layout.component';
import { EditLayoutService } from './edit-layout.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  template:
    '<gp-edit-layout logo="myLogo.jpg" title="myTitle">' +
    '<ng-container subTitle>My Fancy subtitle</ng-container>' +
    '</gp-edit-layout>'
})
class TestComponent {
  @ViewChild(EditLayoutComponent)
  public editLineComponent: EditLayoutComponent;
}

describe('EditLayoutComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let editOutletService: Spy<EditLayoutService>;
  let translateService: Spy<TranslateService>;

  beforeEach(
    waitForAsync(() => {
      editOutletService = createSpyFromClass(EditLayoutService);
      translateService = createSpyFromClass(TranslateService);
      TestBed.configureTestingModule({
        declarations: [EditLayoutComponent, TestComponent],
        imports: [NoopAnimationsModule, TestingModule],
        providers: [ { provide: TranslateService, useValue: translateService },
          { provide: EditLayoutService, useValue: editOutletService }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleMarginalColumn', () => {
    it('should call toggleMarginalColumn of layout service', () => {
      component.editLineComponent.toggleMarginalColumn();
      expect(editOutletService.toggleMarginalColumn).toHaveBeenCalled();
    });
  });
  
});
