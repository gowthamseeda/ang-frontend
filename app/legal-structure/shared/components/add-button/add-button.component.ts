import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'gp-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  disabled = false;
  @Output()
  clicked = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  buttonClick(): void {
    this.clicked.emit();
  }
}
