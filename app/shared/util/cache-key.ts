// Use this function for memoized functions, see: https://ramdajs.com/docs/#memoizeWith
export function cacheKey(...args): string {
  return args.reduce((key, arg) => {
    if (Array.isArray(arg)) {
      key += arg.length;
    } else if (typeof arg === 'object') {
      key += cacheKey(...Object.keys(arg).map(k => arg[k]));
    } else {
      key += arg;
    }
    return key;
  }, '');
}
