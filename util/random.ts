export function randomIndex(input: Array<any>) {
    return randomInt(0, input.length - 1)
}

export function randomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}