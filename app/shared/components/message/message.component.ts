import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'gp-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input()
  type = 'info';
  @Input()
  typeIconVisible = true;
  @Input()
  showAction = false;
  @Input()
  actionText = 'OK';
  @Output()
  messageClose: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  actionClick: EventEmitter<void> = new EventEmitter<void>();
  @Input()
  showAction2 = false;
  @Input()
  actionText2 = 'More Info';
  @Output()
  actionClick2: EventEmitter<void> = new EventEmitter<void>();

  showClose = false;

  constructor() {}

  ngOnInit(): void {
    this.showClose = this.messageClose.observers.length > 0;
  }
}
