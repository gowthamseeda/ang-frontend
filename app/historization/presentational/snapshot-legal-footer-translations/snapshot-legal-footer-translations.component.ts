import { Component, Input, OnInit } from '@angular/core';
import { LegalFooterTranslation } from '../../models/outlet-history-snapshot.model';

@Component({
  selector: 'gp-snapshot-legal-footer-translations',
  templateUrl: './snapshot-legal-footer-translations.component.html',
  styleUrls: ['./snapshot-legal-footer-translations.component.scss']
})
export class SnapshotLegalFooterTranslationsComponent implements OnInit {
  @Input()
  legalFooterTranslations: LegalFooterTranslation[];

  @Input()
  isChanged: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
