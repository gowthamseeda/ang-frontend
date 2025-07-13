import { Component, Input, OnInit } from '@angular/core';

import { Company } from '../../model/company.model';

@Component({
  selector: 'gp-company-header',
  templateUrl: './company-header.component.html',
  styleUrls: ['./company-header.component.scss']
})
export class CompanyHeaderComponent implements OnInit {
  @Input()
  company: Company;

  constructor() {}

  ngOnInit(): void {}
}
