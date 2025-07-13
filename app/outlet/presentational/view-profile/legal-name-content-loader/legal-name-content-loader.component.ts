import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-legal-name-content-loader',
  templateUrl: './legal-name-content-loader.component.html',
  styleUrls: ['./legal-name-content-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegalNameContentLoaderComponent implements OnInit {
  @Input()
  isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
