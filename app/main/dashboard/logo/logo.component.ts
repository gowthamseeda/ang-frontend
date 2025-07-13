import { Component, OnInit } from '@angular/core';

import { ProgressBarService } from '../../../shared/services/progress-bar/progress-bar.service';

@Component({
  selector: 'gp-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  isLoading = false;

  constructor(private progressBarService: ProgressBarService) {}

  ngOnInit(): void {
    this.progressBarService.progressChanges.subscribe(progress => {
      progress > 0 ? (this.isLoading = true) : (this.isLoading = false);
    });
  }
}
