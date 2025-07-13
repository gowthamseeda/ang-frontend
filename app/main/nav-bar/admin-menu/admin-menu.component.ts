import { Component, OnInit } from '@angular/core';

import { environment } from '../../../../environments/environment';

interface microservicesData {
  translationName: string;
  service: string;
}

@Component({
  selector: 'gp-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  microservices: microservicesData[] = [
    {
      translationName: 'COMMUNICATIONS',
      service: 'communications'
    },
    {
      translationName: 'CONTRACTS',
      service: 'contracts'
    },
    {
      translationName: 'GEOGRAPHY',
      service: 'geography'
    },
    {
      translationName: 'GSSNPLUS_API_COMPLETE_OUTLET',
      service: 'gssnplus-api-complete-outlet'
    },
    {
      translationName: 'GSSNPLUS_API_OUTLET',
      service: 'gssnplus-api-outlet'
    },
    {
      translationName: 'HISTORIZATION',
      service: 'historization'
    },
    {
      translationName: 'IAM',
      service: 'iam'
    },
    {
      translationName: 'INVESTORS',
      service: 'investors'
    },
    {
      translationName: 'LEGAL_STRUCTURE',
      service: 'legal-structure'
    },
    {
      translationName: 'NOTIFICATIONS',
      service: 'notifications'
    },
    {
      translationName: 'OPENING_HOURS',
      service: 'opening-hours'
    },
    {
      translationName: 'REPLAY_SERVICE',
      service: 'replay-service'
    },
    {
      translationName: 'SEARCH',
      service: 'search'
    },
    {
      translationName: 'SERVICES',
      service: 'services'
    },
    {
      translationName: 'STORAGE',
      service: 'storage'
    },
    {
      translationName: 'STRUCTURES',
      service: 'structures'
    },
    {
      translationName: 'TASKS',
      service: 'tasks'
    },
    {
      translationName: 'TEST_OUTLET_RESTORE',
      service: 'test-outlet-restore'
    },
    {
      translationName: 'TRAITS',
      service: 'traits'
    },
    {
      translationName: 'USER_SETTINGS',
      service: 'user-settings'
    }
  ];

  navigateToStatusApp(): void {
    const origin = window.location.origin;
    const baseUrl = environment.settings.baseUrl || '/';
    window.open(`${origin}${baseUrl}status/`, '_blank');
  }

  openSwaggerLink(microservice: string): void {
    const url = this.getEnvOriginBaseUrl();
    window.open(`${url}${microservice}/swagger-ui/index.html`, '_blank');
  }

  navigateToDocumentation(): void {
    const url = this.getEnvOriginBaseUrl();
    window.open(`${url}doc/`, '_blank');
  }

  navigateToFeatureToggles(): void {
    const url = this.getEnvOriginBaseUrl();
    window.open(`${url}feature-toggle/togglz/index`, '_blank');
  }

  getEnvOriginBaseUrl(): string {
    const origin = window.location.origin;
    let baseUrl = environment.settings.baseUrl || '/';
    if (environment.settings.baseUrl === '/local/') {
      baseUrl = '/';
    }
    return `${origin}${baseUrl}`;
  }
}
