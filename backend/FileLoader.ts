import fs from 'fs/promises'
import path from 'path'

export enum FileType {
    Json,
    Csv
}

type FileLoader<T> = {
    load(): Promise<T | undefined>
    get(): T
    type(): FileType
}

class StringLoader implements FileLoader<string> {
    protected data: string;
    protected path: string;
    protected filetype: FileType

    constructor(path: string, filetype: FileType) {
        this.path = path;
        this.filetype = filetype;
    }

    async load() {
        const fullPath = path.resolve(process.cwd(), this.path)
        const buffer = await fs.readFile(fullPath)
        this.data = buffer.toString('utf-8')
        return this.data
    }

    get() {
        return this.data
    }

    type() {
        return this.filetype
    }
}

export class CsvLoader implements FileLoader<string[]> {
    protected loader: StringLoader
    protected data: string[]

    constructor(path: string) {
        this.loader = new StringLoader(path, FileType.Csv)
    }

    async load() {
        try {
            const data = await this.loader.load()
            this.data = data.split('\n')
            return this.data
        } catch {
            return undefined
        }
    }

    get() {
        return this.data
    }

    type() {
        return this.loader.type()
    }
}

export class JsonLoader<T> implements FileLoader<T> {
    protected loader: StringLoader
    protected data: T

    constructor(path: string) {
        this.loader = new StringLoader(path, FileType.Json)
    }

    async load() {
        try {
            const data = await this.loader.load()
            this.data = JSON.parse(data) as T
            return this.data
        } catch {
            return undefined
        }
    }

    get() {
        return this.data
    }

    type() {
        return this.loader.type()
    }
}