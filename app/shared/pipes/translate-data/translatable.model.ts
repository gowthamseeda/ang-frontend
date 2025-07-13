export interface Translatable {
  id?: any;
  name: string;
  translations?: { [key: string]: any };
  description?: string;
}

export namespace Translatable {
  export function sortByLang(langKey: string): (a: Translatable, b: Translatable) => number {
    return function (a: Translatable, b: Translatable): number {
      return Translatable.sort(a, b, langKey);
    };
  }

  export function sort(a: Translatable, b: Translatable, langKey: string): number {
    let firstElement: string;
    if (a.translations && a.translations[langKey]) {
      firstElement = a.translations[langKey];
    } else {
      firstElement = a.name;
    }

    let secondElement: string;
    if (b.translations && b.translations[langKey]) {
      secondElement = b.translations[langKey];
    } else {
      secondElement = b.name;
    }

    if (firstElement < secondElement) {
      return -1;
    }
    if (firstElement > secondElement) {
      return 1;
    }
    return 0;
  }
}
