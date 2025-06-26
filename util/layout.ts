import { CminiKey } from "../backend/cmini/types"

export function decodeKeys(input: string) {
    const keys: CminiKey[] = []
    for (let i = 0; i < input.length; i += 7) {
        const line = input.substring(i, i + 8)
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
    }
    return keys
}

export function encodeKeys(keys: CminiKey[]) {
    let output: string = ''
    for (const data of keys) {
        const ch = data.key.toString(16).padStart(2, "0")
        const c = data.column.toString(16).padStart(2, "0")
        const r = data.row.toString(16).padStart(2, "0")
        const f = data.finger
        const line = `${ch}${c}${r}${f}`
        output += line
    }
    return output
}