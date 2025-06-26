import { md5 } from '../../util/crypto'
import { keysStr, keysHash } from '../data'

describe('md5()', () => {
    test('it should calculate a hash', () => {
        expect(md5(keysStr)).toBe(keysHash);
    });
})
