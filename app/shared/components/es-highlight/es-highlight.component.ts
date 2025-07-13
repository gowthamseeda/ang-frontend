import { Component, Input, OnChanges } from '@angular/core';
import { replaceAll } from '../../util/strings';

export class TextPart {
  value: string;
  highlighted: boolean;

  constructor(value: string, highlighted: boolean) {
    this.value = value;
    this.highlighted = highlighted;
  }
}

const HIGHLIGHT_MARKER = '***';

@Component({
  selector: 'gp-es-highlight',
  templateUrl: './es-highlight.component.html',
  styleUrls: ['./es-highlight.component.scss']
})
export class EsHighlightComponent implements OnChanges {
  @Input()
  text: string | number;
  @Input()
  invertedStyle = false;
  @Input()
  manualHighlightText?: string | undefined = undefined;

  textParts: TextPart[];

  constructor() {}

  ngOnChanges(): void {
    if (!this.text) {
      return;
    }

    this.textParts = [];

    let text = String(this.text);

    if (this.manualHighlightText) {
      text = replaceAll(text, HIGHLIGHT_MARKER, '');

      this.manualHighlightText
        .split(' ')
        .filter(value => value.length > 0)
        .forEach(value => {
          text = replaceAll(text, value, HIGHLIGHT_MARKER + value + HIGHLIGHT_MARKER);
        });
    }

    text.split(HIGHLIGHT_MARKER).forEach((token: string, idx: number) => {
      if (token.length !== 0) {
        this.textParts.push(new TextPart(token, idx % 2 !== 0));
      }
    });
  }
}
