import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  BASE_DOCUMENT_API_PATH,
  BASE_PDF_EXTENSION,
  FILE_NAME_QUERY_PARAM,
  FILE_TYPE_QUERY_PARAM,
  LANGUAGE_QUERY_PARAM,
  SIZE_UNIT
} from 'app/help/help.constants';

import { Pdf } from '../../help.model';

@Component({
  selector: 'gp-help-pdf',
  templateUrl: './help-pdf.component.html',
  styleUrls: ['./help-pdf.component.scss']
})
export class HelpPdfComponent implements OnInit, OnChanges {
  @Input()
  pdf: Pdf;

  @Input()
  language: string;

  @Input()
  visibleSize = false;

  @Input()
  SIZE_UNIT = SIZE_UNIT;

  pdfSource: string;

  host = `${window.location.protocol}//${window.location.host}/`;
  path = window.location.pathname.split('/')[1];

  constructor() {}

  ngOnInit(): void {
    this.pdfSource = this.getPdfSource(this.pdf.name);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.pdfSource = this.getPdfSource(this.pdf.name);
  }

  getPdfSource(pdfName: string): string {
    const languageQueryParam = `${LANGUAGE_QUERY_PARAM}${this.language}`;
    const fileNameQueryParam = `${FILE_NAME_QUERY_PARAM}${pdfName}`;
    const fileTypeQueryParam = `${FILE_TYPE_QUERY_PARAM}${BASE_PDF_EXTENSION}`;
    const queryParams = [languageQueryParam, fileNameQueryParam, fileTypeQueryParam].join('&');

    if (this.path === 'app' || this.path === 'local') {
      return `${this.host}${BASE_DOCUMENT_API_PATH}?${queryParams}`;
    }
    return `${this.host}${this.path}/${BASE_DOCUMENT_API_PATH}?${queryParams}`;
  }
}
