import { randomIndex } from "../../util/random";

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

    getRandom() {
        const index = randomIndex(this.data)
        return this.data[index]
    }

    getRandoms(count: number) {
        if (count >= this.data.length) {
            return this.data
        }
        const result: number[] = []
        const indexes = new Array(this.data.length).map((_,i) => (i))
        
        for (let i = 0; i < count; i++) {
            const index = randomIndex(indexes)
            indexes.splice(indexes.indexOf(index), 1)
            result.push(index)
        }
        return result.map(i => this.data[i])
    }
}