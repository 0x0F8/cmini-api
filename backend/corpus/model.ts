import { prng, randomValue, randomValues } from "../../util/random";

export default class CorpusModel {
    protected data: string[]

    name: string
    path: string

    constructor(name: string, path: string) {
        this.name = name
        this.path = path
    }

    setData(data: string[]) {
        this.data = data
    }

    isEmpty() {
        return !this.data || this.data.length === 0
    }

    getAll() {
        return this.data
    }

    getRandom(seed?: string) {
        const randomizer = typeof seed === 'string' ? prng(seed) : Math.random
        return randomValue(this.data, randomizer)
    }

    getRandoms(count: number, seed?: string) {
        const randomizer = typeof seed === 'string' ? prng(seed) : Math.random
        return randomValues(this.data, count, randomizer)
    }
}