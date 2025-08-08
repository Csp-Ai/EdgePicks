const ORIGINAL_RANDOM = Math.random;
let seed = 1;

export function freezeRandom(startSeed: number = 1) {
  seed = startSeed;
  Math.random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return resetRandom;
}

export function resetRandom() {
  Math.random = ORIGINAL_RANDOM;
}
