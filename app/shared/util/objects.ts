export function patchValue(
  target: { [key: string]: any },
  source: { [key: string]: any }
): { [key: string]: any } {
  const targetCopy = Object.assign({}, target);
  Object.keys(source).forEach(key => {
    if (undefined === source[key] || null === source[key]) {
      delete targetCopy[key];
    } else if ('object' === typeof source[key] && !Array.isArray(source[key])) {
      targetCopy[key] = patchValue(targetCopy[key], source[key]);
    } else if (Array.isArray(source[key]) && 'object' !== typeof source[key]) {
      source[key].forEach((index: number) => {
        if (targetCopy[key].at(index)) {
          targetCopy[key][index] = patchValue(targetCopy[key][index], source[key][index]);
        } else {
          targetCopy[key].push(patchValue(targetCopy[key][index], source[key][index]));
        }
      });
    } else {
      targetCopy[key] = source[key];
    }
  });
  return targetCopy;
}
