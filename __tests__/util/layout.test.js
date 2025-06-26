import { decodeKeys, encodeKeys } from '@util/layout'
import { keysStr, keysArray } from '../data'

describe('decodeKeys()', () => {
    test('it should decode keys', () => {
        expect(JSON.stringify(decodeKeys(keysStr))).toBe(JSON.stringify(keysArray));
    });
})

describe('encodeKeys()', () => {
    test('it should encode keys', () => {
        expect(encodeKeys(keysArray)).toBe(keysStr);
    });
})
