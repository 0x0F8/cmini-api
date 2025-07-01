import { Corpora, Corpus } from "@backend/corpus/types";
import { CorpusApiResult } from "app/api/corpus/[corpora]/[corpus]/route";
import useSWR from "swr";

const corpusMap = {
    [Corpus.LocalAffirmations]: `${Corpora.Local}/${Corpus.LocalAffirmations}`,
    [Corpus.MonkeyType1k]: `${Corpora.MonkeyType}/${Corpus.MonkeyType1k}`
}

const fetcher = (args) => fetch(args).then(res => res.json())

export type CorpusArgs = {corpus: Corpus, limit?: number, seed?: string}

export default function useCorpus({corpus,limit,seed}:CorpusArgs, shouldSubmit: boolean) {
    const path = shouldSubmit ? `/api/corpus/${corpusMap[corpus]}?limit=${limit}&seed=${seed}` : null
    const { data, error, isLoading } = useSWR<CorpusApiResult>(path, fetcher)
    return { corpus: data, error, isLoading }
}