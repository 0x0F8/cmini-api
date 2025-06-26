import MonkeyTypeTranslator from "./translators/MonkeyTypeTranslator"
import PassthroughTranslator from "./translators/PassthroughTranslator"

export type Translator = typeof MonkeyTypeTranslator | typeof PassthroughTranslator

export enum Corpora {
    Local = 'local',
    MonkeyType = 'monkeytype'
}

export enum Corpus {
    LocalAffirmations = 'affirmations',

    MonkeyType1k = 'english-1k'
}

