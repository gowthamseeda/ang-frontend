export function replaceAll(value: string, search: string, replace: string): string {
  return value.split(search).join(replace);
}

export function getNormalizedString(value: string): string {
  return value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function convertStringToUpperCaseAndUnderscore(strToConvert: string): string {
  return strToConvert.match(/([A-Z]?[^A-Z]*)/g)!!.slice(0,-1).join("_").toUpperCase();
}
