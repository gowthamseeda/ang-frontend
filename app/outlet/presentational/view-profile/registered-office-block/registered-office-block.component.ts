import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-registered-office-block',
  templateUrl: './registered-office-block.component.html',
  styleUrls: ['./registered-office-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisteredOfficeBlockComponent implements OnInit {
  @Input()
  registeredOffice: boolean;

  constructor() {}

  ngOnInit(): void {}
}
