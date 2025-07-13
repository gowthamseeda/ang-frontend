import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-contract-state-layout',
  templateUrl: './contract-state-layout.component.html',
  styleUrls: ['./contract-state-layout.component.scss']
})
export class ContractStateLayoutComponent implements OnInit {
  @Input()
  title: string;

  constructor() {}

  ngOnInit(): void {}
}
