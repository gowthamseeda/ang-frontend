import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';

import { LinkOutToOutletComponent } from './link-out-to-outlet.component';

describe('LinkOutToOutletComponent', () => {
  let component: LinkOutToOutletComponent;
  let fixture: ComponentFixture<LinkOutToOutletComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LinkOutToOutletComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    environment.settings.baseUrl = '';

    fixture = TestBed.createComponent(LinkOutToOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('linkOut', () => {
    const origin = window.location.origin;
    it('should return linkout url to a non productive environment', () => {
      environment.settings.baseUrl = '/test/';
      component.outletId = 'GS00000001';
      expect(component.linkOut).toEqual(`${origin}/test/app/outlet/GS00000001`);
    });

    it('should return linkout url to a productive environment', () => {
      component.outletId = 'GS00000001';
      expect(component.linkOut).toEqual(`${origin}/app/outlet/GS00000001`);
    });
  });
});
