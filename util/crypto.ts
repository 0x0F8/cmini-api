import { createHash } from "crypto"

export function isHash(hash:string) {
    const regex = new RegExp(/[a-zA-Z0-9]{32}/g)
    const result = regex.exec(hash) || []
    return result.length > 0
}

export function md5(input: string) {
    return createHash('md5').update(input).digest('hex')
}