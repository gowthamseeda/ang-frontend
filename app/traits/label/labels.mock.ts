import { AssignableType, Label } from './label.model';

export function getLabels(): Label[] {
  return [
    new Label(
      1,
      'First label',
      { 'en-UK': 'First translated label' },
      [AssignableType.BRAND],
      ['DE'],
      ['MB', 'SMT', 'MYB']
    ),
    new Label(2, 'Second label', { 'en-UK': 'Second translated label' }, [AssignableType.BRAND]),
    new Label(3, 'Third label', undefined, [AssignableType.BRAND]),
    new Label(4, 'Fourth label', {}, ['Not brand'])
  ];
}
