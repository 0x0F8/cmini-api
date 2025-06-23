'use server'

import CminiController from "../cmini/controller";
import { SearchConstraints, SearchState } from "../components/SearchForm";

const DEFAULT_RANGE = [0, 100]

function getSearchConstraint(searchField: string): number[] {
    switch (searchField) {
        case 'sfb': {
            const metric = CminiController.getMetric('sfb')
            return [metric!.min, metric!.max]
        }
        case 'sfs': {
            const metric1 = CminiController.getMetric('dsfb-red')
            const metric2 = CminiController.getMetric('dsfb-alt')
            return [metric1!.min + metric2!.min, metric1!.max + metric2!.max]
        }
        default:
            return DEFAULT_RANGE
    }
}

function parseDefaults(store): SearchDefaultResult {
    const query = store.get('query') ?? ''
    const board = !Number.isNaN(Number(store.get('board'))) ? Number(store.get('board')) : undefined

    const sfbConstraint = getSearchConstraint('sfb')
    const [sfbMinStr, sfbMaxStr] = (store.get('sfb') ?? '').split(',')
    let sfbMin = !Number.isNaN(Number(sfbMinStr)) ? Number(sfbMinStr) : DEFAULT_RANGE[0]
    let sfbMax = !Number.isNaN(Number(sfbMaxStr)) ? Number(sfbMaxStr) : DEFAULT_RANGE[1]
    if (sfbMin < sfbConstraint[0]) sfbMin = sfbConstraint[0]
    if (sfbMax > sfbConstraint[1]) sfbMax = sfbConstraint[1]

    return {
        isEmpty: query === '' && typeof board === 'undefined' && sfbMin === DEFAULT_RANGE[0] && sfbMax === DEFAULT_RANGE[1],
        defaultState: {
            query, board, sfb: [sfbMin, sfbMax]
        },
        constraints: {
            sfb: sfbConstraint
        }
    }
}

type SearchDefaultResult = { defaultState: SearchState; constraints: SearchConstraints; isEmpty: boolean }

export default async function useSearchDefaults(stores): Promise<SearchDefaultResult> {
    let result: SearchDefaultResult & { isEmpty: boolean } | undefined = undefined
    for (const store of stores) {
        result = parseDefaults(store)
        if (!result.isEmpty) break;
    }
    return result!
}