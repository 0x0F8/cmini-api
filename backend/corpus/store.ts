import { Corpus } from "./types";
import { Corpora } from "./types";
import CorpusModel from "./model";
import { JsonLoader } from "../FileLoader";
import { Translator } from "./types";

export default class CorporaStore {
    protected models: Map<Corpus, CorpusModel> = new Map()
    protected corpora: Corpora
    protected translator: Translator

    constructor(corpora: Corpora, translator: Translator) {
        this.corpora = corpora
        this.translator = translator
    }

    add(corpus: Corpus, path: string) {
        const model = new CorpusModel(corpus, path)
        this.models.set(corpus, model)
    }

    async load() {
        for (const model of this.models.values()) {
            if (model.isEmpty()) {
                const loader = new JsonLoader<any>(model.path)
                const data = (await loader.load()) || []
                if (data.length === 0) {
                    throw new Error('failed to load data')
                }
                const words = this.translator(data)
                model.setData(words)
            }
        }
    }

    getRandom(corpus: Corpus, seed?: string) {
        return this.models.get(corpus)?.getRandom(seed)
    }

    getRandoms(corpus: Corpus, count: number, seed?: string) {
        return this.models.get(corpus)?.getRandoms(count, seed)
    }

    getAll(corpus: Corpus) {
        return this.models.get(corpus)?.getAll()
    }
}