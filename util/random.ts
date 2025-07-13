export function randomString(
  length: number,
  charset = "abcdefghijklmnopqrstuvwxyz",
  randomizer: () => number = Math.random,
) {
  return randomValues(charset.split(""), length, randomizer).join("");
}

export function randomValue(
  input: Array<any>,
  randomizer: () => number = Math.random,
) {
  return input[randomIndex(input, randomizer)];
}

export function randomIndex(
  input: Array<any>,
  randomizer: () => number = Math.random,
) {
  return randomInt(0, input.length - 1, randomizer);
}

export function randomInt(
  min: number,
  max: number,
  randomizer: () => number = Math.random,
) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(randomizer() * (max - min + 1)) + min;
}

export function randomValues<T>(
  input: Array<T>,
  count: number = input.length,
  randomizer: () => number = Math.random,
): T[] {
  const result: number[] = [];
  let indexes: number[] = [];

  for (let i = 0; i < count; i++) {
    if (indexes.length === 0) {
      indexes = new Array(input.length).fill(0).map((_, i) => i);
    }
    const index = randomIndex(indexes, randomizer);
    const value = indexes[index];
    indexes.splice(index, 1);
    result.push(value);
  }
  return result.map((i) => input[i]);
}

export function prng(seed: string) {
  let iv: number = parseInt(
    String(seed)
      .split("")
      .map((c) => c.charCodeAt(0))
      .join(""),
  );
  return function () {
    iv |= 0;
    iv = (iv + 0x9e3779b9) | 0;
    let t = iv ^ (iv >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    iv += 1;
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}
