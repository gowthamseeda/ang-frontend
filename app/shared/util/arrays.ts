export interface ArrayDiff<T> {
  readonly intersection: T[];
  readonly added: T[];
  readonly removed: T[];
}

export function diff<T>(initialValues: T[], currentValues: T[]): ArrayDiff<T> {
  return {
    intersection: currentValues.filter(intersectFilter(initialValues)),
    added: currentValues.filter(minusFilter(initialValues)),
    removed: initialValues.filter(minusFilter(currentValues))
  };
}

export function intersectFilter<T>(otherValues: T[]): (value: T) => boolean {
  return (value: T) => otherValues.indexOf(value) >= 0;
}

export function minusFilter<T>(otherValues: T[]): (value: T) => boolean {
  return (value: T) => otherValues.indexOf(value) === -1;
}

export function flatten<T>(combined: T[], current: T[]): T[] {
  return (combined || []).concat(current);
}

export function sortByReference<T, P>(list: T[], ref: P[], sortProperty: (elem: T) => P): T[] {
  return list
    .filter(elem => ref.indexOf(sortProperty(elem)) > -1)
    .sort((elem1, elem2) => ref.indexOf(sortProperty(elem1)) - ref.indexOf(sortProperty(elem2)))
    .concat(
      list
        .filter(elem => ref.indexOf(sortProperty(elem)) === -1)
        .sort((elem1, elem2) =>
          sortProperty(elem1) < sortProperty(elem2)
            ? -1
            : sortProperty(elem1) > sortProperty(elem2)
            ? 1
            : 0
        )
    );
}

export function isEqual(a: any[], b: any[]): boolean {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}
