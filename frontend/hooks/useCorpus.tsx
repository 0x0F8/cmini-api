import { Corpora, Corpus } from "@backend/corpus/types";
import useSWR from "swr";
import { ApiData } from "types";

const corpusMap = {
    [Corpus.LocalAffirmations]: `${Corpora.Local}/${Corpus.LocalAffirmations}`,
    [Corpus.MonkeyType1k]: `${Corpora.MonkeyType}/${Corpus.MonkeyType1k}`
}

const fetcher = (args) => fetch(args).then(res => res.json())

export default function useCorpus(corpus: Corpus, limit?: number, seed?: string) {
    const { data, error, isLoading } = useSWR<ApiData<string[]>>(`/api/corpus/${corpusMap[corpus]}?limit=${limit}&seed=${seed}`, fetcher)
    return { corpus: data, error, isLoading }
}