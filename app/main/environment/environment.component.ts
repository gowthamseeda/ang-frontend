import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'gp-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss']
})
export class EnvironmentComponent {
  constructor() {}

  getEnvironment(): string {
    if (environment.settings.environment === 'PROD') {
      return '';
    }
    return environment.settings.environment;
  }
}
