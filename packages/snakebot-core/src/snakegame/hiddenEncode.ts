/*
var zwcChars []rune = []rune{
	'⁡', // function application
	'⁢', // invisible times
	'⁣', // invisible separator
	'⁤', // invisible plus
}

var zwcIndices map[rune]byte = map[rune]byte{
	'⁡': 0,
	'⁢': 1,
	'⁣': 2,
	'⁤': 3,
}
*/

const hiddenChars = [
    '⁡', // function application
    '⁢', // invisible times
    '⁣', // invisible separator
    '⁤', // invisible plus
]

export function hiddenDecode(hidden: string): string {
    let result = ''
    let currentByte = 0
    for (let i = 0; i < hidden.length; i++) {
        const char = hidden[i]
        const charValue = hiddenChars.indexOf(char)
        if (charValue === -1) {
            throw new Error(`invalid hidden string - unexpected char [${char}] (at position ${i})`)
        }

        currentByte <<= 2
        currentByte |= charValue

        if ((i + 1) % 4 == 0) {
            result += String.fromCharCode(currentByte)
            currentByte = 0
        }
    }

    return result
}

export function hiddenEncode(text: string): string {
    let result = ''
    for (let i = 0; i < text.length; i++) {
        const char = text[i]
        const value = char.charCodeAt(0)

        result += hiddenChars[(value >> 6) % 0b100]
        result += hiddenChars[(value >> 4) % 0b100]
        result += hiddenChars[(value >> 2) % 0b100]
        result += hiddenChars[value % 0b100]

        if (value > 255) {
            throw new Error(`can't encode char ${char} (at position ${i})`)
        }
    }

    return result
}
