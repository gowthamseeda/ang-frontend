import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkOutButtonComponent } from './link-out-button.component';

describe('LinkOutButtonComponent', () => {
  let component: LinkOutButtonComponent;
  let fixture: ComponentFixture<LinkOutButtonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LinkOutButtonComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkOutButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
