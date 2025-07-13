import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../api/api.service';

const url = '/app/assets/legal/licenses.txt';

export class LicenseComponent {
  name: string;
  version: string;

  constructor(name: string, version: string) {
    this.name = name;
    this.version = version;
  }
}

export class LicenseEntry {
  licenseName: string;
  licenseText: string;
  component: LicenseComponent;

  constructor(licenseName: string, licenseText: string, component: LicenseComponent) {
    this.licenseName = licenseName;
    this.licenseText = licenseText;
    this.component = component;
  }
}

@Injectable()
export class LegalService {
  constructor(private apiService: ApiService) {}

  getLicenses(): Observable<LicenseEntry[]> {
    return this.apiService
      .get<string>(url, undefined, 'text')
      .pipe(map((licenses: string) => this.parse(licenses)));
  }

  private parse(payload: string): LicenseEntry[] {
    const lines = payload.split(/\r?\n|\r/);

    const licenseEntries: LicenseEntry[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/^\(.*\)$/g.test(line) && lines[i - 1] !== '') {
        const licenseName = lines[i - 1];
        const components = this.removeBrackets(line);
        const licenseText = this.getLicenseText(lines.slice(i + 2));

        licenseEntries.push(
          ...this.splitComponentsLine(components)
            .map((component: string) => this.parseComponent(component))
            .map(component => new LicenseEntry(licenseName, licenseText, component))
        );
      }
    }

    return licenseEntries.sort(this.sortByComponentName);
  }

  private sortByComponentName(a: LicenseEntry, b: LicenseEntry): number {
    return a.component.name.localeCompare(b.component.name);
  }

  private getLicenseText(lines: string[]): string {
    return lines.slice(0, lines.indexOf('---')).join('\n');
  }

  private removeBrackets(line: string): string {
    return line.replace(/^\(|\)$/g, '');
  }

  private splitComponentsLine(components: string): string[] {
    return components.split(',').map((component: string) => component.trim());
  }

  private parseComponent(component: string): LicenseComponent {
    const splited = component.split(' ');
    return new LicenseComponent(splited.slice(0, -1).join(' '), splited[splited.length - 1]);
  }
}
