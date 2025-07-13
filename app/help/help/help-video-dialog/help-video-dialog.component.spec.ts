import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { FALLBACK_LANGUAGE, VIDEOS } from '../../help.constants';

import { HelpVideoDialogComponent } from './help-video-dialog.component';

const MOCK_MAT_DIALOG_DATA = {
  video: VIDEOS[0],
  language: FALLBACK_LANGUAGE
};

describe('HelpVideoDialogComponent', () => {
  let component: HelpVideoDialogComponent;
  let fixture: ComponentFixture<HelpVideoDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HelpVideoDialogComponent, TranslatePipeMock],
        providers: [
          { provide: MAT_DIALOG_DATA, useValue: MOCK_MAT_DIALOG_DATA },
          { provide: MatDialogRef, useValue: {} }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpVideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should handle path', () => {
    const path = 'local';

    it('should not append path to URL', () => {
      component.path = path;
      const videoSource = component.getVideoSource('test');
      expect(videoSource).not.toContain("local/");
    });

    it('should append path to URL', () => {
      component.path = path + 'test';
      const videoSource = component.getVideoSource('test');
      expect(videoSource).toContain(path);
    });
  });
});
