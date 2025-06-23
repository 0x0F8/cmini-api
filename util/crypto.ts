export function isHash(hash:string) {
    const regex = new RegExp(/[a-zA-Z0-9]{32}/g)
    const result = regex.exec(hash) || []
    return result.length > 0
}