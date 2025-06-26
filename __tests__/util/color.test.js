import { rgbToHex, hexToRgb, gradientValue } from '@util/color'

describe('rgbToHex()', () => {
    test('it should convert rgb to hex', () => {
        expect(rgbToHex([255, 255, 255])).toBe('#FFFFFF');
        expect(rgbToHex([255, 0, 255])).toBe('#FF00FF');
    });
})

describe('hexToRgb()', () => {
    test('it should convert hex to rgb', () => {
        expect(hexToRgb('#FFFFFF')).toStrictEqual([255, 255, 255]);
        expect(hexToRgb('#FF00FF')).toStrictEqual([255, 0, 255]);
    });
})

describe('gradientValue()', () => {
    test('it should return with progress of 1', () => {
        expect(gradientValue(1, '#000000', '#FFFFFF')).toBe('#FFFFFF');
    });

    test('it should return with progress of 0', () => {
        expect(gradientValue(0, '#000000', '#FFFFFF')).toBe('#000000');
    });

    test('it should return with progress of 0.5', () => {
        expect(gradientValue(0.5, '#000000', '#FFFFFF')).toBe('#808080');
    });
})