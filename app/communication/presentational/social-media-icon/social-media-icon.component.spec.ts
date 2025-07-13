import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgPipesModule } from 'ngx-pipes';

import { SocialMediaIconComponent } from './social-media-icon.component';

@Component({
  template: '<gp-social-media-icon socialMediaChannelId="AnySocialMedia"></gp-social-media-icon>'
})
class TestComponent {
  @ViewChild(SocialMediaIconComponent)
  public socialMediaIconComponent: SocialMediaIconComponent;
}

describe('SocialMediaIconComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SocialMediaIconComponent, TestComponent],
        imports: [NgPipesModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.socialMediaIconComponent).toBeTruthy();
  });

  it('should build icon name', () => {
    expect(component.socialMediaIconComponent.iconName).toEqual('social-anysocialmedia');
  });
});
