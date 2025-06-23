export function format(num: number, decimals = 3) {
    let base = 1
    for (let i = 0; i < decimals; i++) {
        base *= 10
    }
    let result = String(Math.floor(num * base) / base)
    if (decimals > 0 && !result.includes('.')) {
        result += '.'
    }
    const end = result.substring(result.indexOf('.') + 1)
    for (let i = 0; i < decimals - end.length; i++) {
        result += '0'
    }
    return result
}