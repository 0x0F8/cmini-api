import { Corpus } from "./types";
import { Corpora } from "./types";
import CorporaStore from "./store";
import MonkeyTypeTranslator from "./translators/MonkeyTypeTranslator";
import PassthroughTranslator from "./translators/PassthroughTranslator";

const corpusPaths: Record<string, Record<string, string>> = {
    [String(Corpora.Local)]: {
        [Corpus.LocalAffirmations]: 'backend/corpus/local/affirmations.json'
    },
    [String(Corpora.MonkeyType)]: {
        [Corpus.MonkeyType1k]: '../monkeytype/frontend/static/languages/english_1k.json'
    }
}

class CorporaController {
    protected stores: Map<Corpora, CorporaStore> = new Map()
    protected corpusToCorpora: Map<Corpus, Corpora> = new Map()

    protected getTranslator(corpora: Corpora) {
        switch(corpora) {
            case Corpora.MonkeyType:
                return MonkeyTypeTranslator
            default:
                return PassthroughTranslator
        }
    }

    async initialize() {
        for (const [corporaStr, values] of Object.entries(corpusPaths)) {
            const corpora = corporaStr as Corpora
            const translator = this.getTranslator(corpora)
            const store = new CorporaStore(corpora, translator)
            this.stores.set(corpora, store)
            
            for (const [corpus, path] of Object.entries(values)) {
                store.add(corpus as Corpus, path)
                this.corpusToCorpora.set(corpus as Corpus, corpora)
            }
            await store.load()
        }
    }

    getRandomString(corpus: Corpus, seed?: string) {
        const corpora = this.corpusToCorpora.get(corpus)!
        return this.stores.get(corpora)?.getRandom(corpus, seed)
    }

    getRandomStrings(corpus: Corpus, count: number, seed?: string) {
        const corpora = this.corpusToCorpora.get(corpus)!
        return this.stores.get(corpora)?.getRandoms(corpus, count, seed)
    }

    getCorpus(corpus: Corpus) {
        const corpora = this.corpusToCorpora.get(corpus)!
        return this.stores.get(corpora)?.getAll(corpus)
    }
}

const instance = new CorporaController();
await instance.initialize();
export default instance;