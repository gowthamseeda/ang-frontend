import { LicenseComponent, LicenseEntry } from './legal.service';

export function getLicensesMock(): LicenseEntry[] {
  return [
    new LicenseEntry(
      'XYZ License 2.0',
      `Some other license
text with even more
bla bla
`,
      new LicenseComponent('component with space', '0.0.1')
    ),
    new LicenseEntry(
      'ABC License 1.0',
      `Some license
text with a lot
of bla bla
`,
      new LicenseComponent('component-1', '1.2.3')
    ),
    new LicenseEntry(
      'ABC License 1.0',
      `Some license
text with a lot
of bla bla
`,
      new LicenseComponent('component-2', '2.0')
    )
  ];
}

export function getResponse(): string {
  return `
Copyright 2019

[gssnplus-frontend : master]

Phase: DEVELOPMENT
Distribution: EXTERNAL

Components:

component-1 1.2.3 : ABC License
component-2 2.0 : ABC License
component with space 0.0.1: XYZ License


Licenses:

ABC License 1.0
(component-1 1.2.3, component-2 2.0)

Some license
text with a lot
of bla bla

---

XYZ License 2.0
(component with space 0.0.1)

Some other license
text with even more
bla bla

`;
}
