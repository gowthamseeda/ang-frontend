import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ButtonVariant } from '../../shared/components/link-out-button/link-out-button.component';

@Component({
  selector: 'gp-link-out-tpro',
  templateUrl: './link-out-tpro.component.html',
  styleUrls: ['./link-out-tpro.component.scss']
})
export class LinkOutTproComponent implements OnInit {
  linkOut: string;
  buttonVariant = ButtonVariant;

  constructor() {}

  ngOnInit(): void {
    const origin = window.location.origin;
    const baseUrl = environment.settings.baseUrl ? environment.settings.baseUrl : '/';
    this.linkOut = `${origin}${baseUrl}tpro-app/gssnplus/`;
  }
}
