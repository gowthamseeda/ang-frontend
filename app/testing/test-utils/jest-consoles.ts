console.error = function (message) {
  throw message instanceof Error ? message : new Error(message);
};

console.warn = function (message) {
  throw message instanceof Error ? message : new Error(message);
};
