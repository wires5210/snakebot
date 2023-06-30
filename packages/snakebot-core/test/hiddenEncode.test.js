const hidden = require('../src/snakegame/hiddenEncode')

// each case contains:
// 1. the initial string
// 2. the resulting invisible string

const cases = [
    ['hellow', '⁢⁣⁣⁡⁢⁣⁢⁢⁢⁣⁤⁡⁢⁣⁤⁡⁢⁣⁤⁤⁢⁤⁢⁤'],
    ['1/0/asdfghj', '⁡⁤⁡⁢⁡⁣⁤⁤⁡⁤⁡⁡⁡⁣⁤⁤⁢⁣⁡⁢⁢⁤⁡⁤⁢⁣⁢⁡⁢⁣⁢⁣⁢⁣⁢⁤⁢⁣⁣⁡⁢⁣⁣⁣'],
    ['12/2/!@#$%^YHNBVFGTR', '⁡⁤⁡⁢⁡⁤⁡⁣⁡⁣⁤⁤⁡⁤⁡⁣⁡⁣⁤⁤⁡⁣⁡⁢⁢⁡⁡⁡⁡⁣⁡⁤⁡⁣⁢⁡⁡⁣⁢⁢⁢⁢⁤⁣⁢⁢⁣⁢⁢⁡⁣⁡⁢⁡⁤⁣⁢⁡⁡⁣⁢⁢⁢⁣⁢⁡⁢⁣⁢⁡⁢⁤⁢⁢⁢⁡⁢⁢⁡⁣'],
    [
        '99/0/zxcvbnm,asdfghjkqwertyui12345678ZXCVBNM<ASDFGHJKQWERTYUI!@#$%^&*',
        '⁡⁤⁣⁢⁡⁤⁣⁢⁡⁣⁤⁤⁡⁤⁡⁡⁡⁣⁤⁤⁢⁤⁣⁣⁢⁤⁣⁡⁢⁣⁡⁤⁢⁤⁢⁣⁢⁣⁡⁣⁢⁣⁤⁣⁢⁣⁤⁢⁡⁣⁤⁡⁢⁣⁡⁢⁢⁤⁡⁤⁢⁣⁢⁡⁢⁣⁢⁣⁢⁣⁢⁤⁢⁣⁣⁡⁢⁣⁣⁣⁢⁣⁣⁤⁢⁤⁡⁢⁢⁤⁢⁤⁢⁣⁢⁢⁢⁤⁡⁣⁢⁤⁢⁡⁢⁤⁣⁢⁢⁤⁢⁢⁢⁣⁣⁢⁡⁤⁡⁢⁡⁤⁡⁣⁡⁤⁡⁤⁡⁤⁢⁡⁡⁤⁢⁢⁡⁤⁢⁣⁡⁤⁢⁤⁡⁤⁣⁡⁢⁢⁣⁣⁢⁢⁣⁡⁢⁡⁡⁤⁢⁢⁢⁣⁢⁡⁡⁣⁢⁡⁤⁣⁢⁡⁤⁢⁡⁤⁤⁡⁢⁡⁡⁢⁢⁢⁡⁤⁢⁡⁢⁡⁢⁡⁢⁣⁢⁡⁢⁤⁢⁡⁣⁡⁢⁡⁣⁣⁢⁡⁣⁤⁢⁢⁡⁢⁢⁢⁢⁤⁢⁡⁢⁢⁢⁢⁡⁣⁢⁢⁢⁡⁢⁢⁣⁢⁢⁢⁢⁢⁢⁡⁣⁢⁡⁣⁡⁢⁢⁡⁡⁡⁡⁣⁡⁤⁡⁣⁢⁡⁡⁣⁢⁢⁢⁢⁤⁣⁡⁣⁢⁣⁡⁣⁣⁣',
    ],
]

describe('encoding', () => {
    test.each(cases)('successfully encodes %p', (initial, encoded) => {
        const result = hidden.hiddenEncode(initial)
        expect(result).toBe(encoded)
    })
})

describe('decoding', () => {
    test.each(cases)('successfully decodes %p', (initial, encoded) => {
        const result = hidden.hiddenDecode(encoded)
        expect(result).toBe(initial)
    })
})
