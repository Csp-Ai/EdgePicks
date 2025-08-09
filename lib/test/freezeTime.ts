let originalDateNow: () => number;
let originalRandom: () => number;

function seededRandom(seed = 42) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return function () {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function freezeTime(frozen: number = Date.UTC(2023, 0, 1)) {
  originalDateNow = Date.now;
  originalRandom = Math.random;
  Date.now = () => frozen;
  Math.random = seededRandom();
}

export function resetTime() {
  if (originalDateNow) Date.now = originalDateNow;
  if (originalRandom) Math.random = originalRandom;
}
