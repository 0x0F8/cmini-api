import { CminiKey } from "../backend/cmini/types"

export function decodeKeys(input: string) {
    const keys: CminiKey[] = []
    for (let i = 0; i < input.length; i += 7) {
        const line = input.substring(i, i + 7)
        // 76 00 00 4
        const charCode = parseInt(line.substring(0, 2), 16)
        const column = parseInt(line.substring(2, 4), 16)
        const row = parseInt(line.substring(4, 6), 16)
        const finger = Number(line.substring(6, 7))
        const key: CminiKey = {
            column,
            row,
            key: charCode,
            finger
        }
        keys.push(key)

        const nextChar = input[i + 7]
        if (nextChar === '-') {
            i += 1
        }
    }
    return keys
}

export function encodePaddedHex(input: number) {
    return input.toString(16).padStart(2, "0")
}

export function encodeKeys(keys: CminiKey[]) {
    let output: string = ''
    let lastRow: number | undefined = undefined
    for (const data of keys) {
        const delimiter = typeof lastRow !== 'undefined' && data.row !== lastRow ? '-' : ''
        lastRow = data.row
        const ch = encodePaddedHex(data.key)
        const c = encodePaddedHex(data.column)
        const r = encodePaddedHex(data.row)
        const f = data.finger
        const line = `${delimiter}${ch}${c}${r}${f}`
        output += line
    }
    return output
}