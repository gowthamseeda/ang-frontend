import { Component, Input, OnInit } from '@angular/core';

import { Contact } from '../../help.model';

@Component({
  selector: 'gp-help-contact',
  templateUrl: './help-contact.component.html',
  styleUrls: ['./help-contact.component.scss']
})
export class HelpContactComponent implements OnInit {
  @Input()
  contact: Contact;

  constructor() {}

  ngOnInit(): void {}
}
