import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from './safe-html.pipe';
import { TestBed } from '@angular/core/testing';

describe('SafeHtmlPipe', () => {
  let sanitized: DomSanitizer
  let pipe: SafeHtmlPipe

  beforeEach(() => {
    sanitized = TestBed.inject(DomSanitizer);
    pipe = new SafeHtmlPipe(sanitized);
  });

  it('create an instance', () => {
    const pipe = new SafeHtmlPipe(sanitized);
    expect(pipe).toBeTruthy();
  });

  it('return trusted html string', () => {
    const htmlStr = "<p>test string</p><p><strong>test bold</strong></p>"
    expect(pipe.transform(htmlStr)).toEqual({ changingThisBreaksApplicationSecurity: htmlStr });
  });
});
