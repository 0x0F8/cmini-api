import { prng, randomValues } from '@util/random'

describe('prng()', () => {
    test('it should produce the same result given the same seed', () => {
        let randomizer1 = prng("test")
        let randomizer2 = prng("test")
        expect(randomizer1()).toBe(randomizer2());
        expect(randomizer1()).toBe(randomizer2());
        expect(randomizer1()).toBe(randomizer2());
    });

    test('it should produce the a different result given different seeds', () => {
        let randomizer1 = prng("test")
        let randomizer2 = prng("test1")
        expect(randomizer1()).not.toBe(randomizer2());
        expect(randomizer1()).not.toBe(randomizer2());
        expect(randomizer1()).not.toBe(randomizer2());
    });
})

describe('randomValues()', () => {
    test('it should return a single value present in the input array', () => {
        const arr = ["a", "b", "c"]
        const randomizer = prng("test")
        const result = randomValues(arr, 1, randomizer)
        expect(result.length).toBe(1);
        expect(arr.includes(result[0])).toBeTruthy()
    });

    test('it should return multiple values present in the input array', () => {
        const arr = ["a", "b", "c"]
        const randomizer = prng("test")
        const result = randomValues(arr, 2, randomizer)
        expect(result.length).toBe(2);
        expect(result.every(v => arr.includes(v))).toBeTruthy()
    });

    test('it should return multiple values present in the input array, greater than the input length', () => {
        const arr = ["a", "b", "c"]
        const randomizer = prng("test")
        const result = randomValues(arr, 9, randomizer)
        expect(result.length).toBe(9);
        expect(result.every(v => arr.includes(v))).toBeTruthy()
    });
})