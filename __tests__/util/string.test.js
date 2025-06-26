import { format } from '@util/string'

describe('format()', () => {
    test('it should output 3 decimals', () => {
        expect(format(1.1, 3)).toBe("1.100");
        expect(format(1.100, 3)).toBe("1.100");
        expect(format(1, 3)).toBe("1.000");
        expect(format(214.99012, 3)).toBe("214.990");
        expect(format(0.0004, 3)).toBe("0.000");
        expect(format(-4, 3)).toBe("-4.000");
        expect(format(-4.12, 3)).toBe("-4.120");
        expect(format(4e3, 3)).toBe("4000.000");
    });

    test('it should output 0 decimals', () => {
        expect(format(1.1, 0)).toBe("1");
        expect(format(1.100, 0)).toBe("1");
        expect(format(1, 0)).toBe("1");
        expect(format(214.99012, 0)).toBe("214");
        expect(format(0.0004, 0)).toBe("0");
    });
})
