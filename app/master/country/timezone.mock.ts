import { Timezone } from './timezone.model';

export function getTimezoneMock(): Timezone[] {
  return [
    {
      utcOffset: 'UTC-12:00',
      names: ['International Date Line West']
    },
    {
      utcOffset: 'UTC-11:00',
      names: ['Coordinated Universal Time-11']
    }
  ];
}

export function getTimezoneTxt(): string {
  return `
(UTC-12:00) International Date Line West
Dateline Standard Time

(UTC-11:00) Coordinated Universal Time-11
UTC-11
  `;
}
