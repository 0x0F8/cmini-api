import Fuse from "fuse.js"
import CminiController from "./controller"
import { SortOrder } from "../../types"
import { CminiBoardType } from "./types"

export default class CminiApi {
    public static search(args: {
        corpora: string, query?: string, board?: CminiBoardType, sort?: SortOrder, sortBy?: string, minSfb?: number, maxSfb?: number, author?: string, authorId?: string, name?: string
    }) {
        const { corpora = 'monkeyracer', query, board, sort = SortOrder.Ascending, sortBy = 'sfb', minSfb, maxSfb, author, name, authorId } = args
        let rows = CminiController.getBoardLayoutsByCorpora(corpora)

        const hasSfb = typeof minSfb !== 'undefined' && typeof maxSfb !== 'undefined'
        const hasBoard = typeof board !== 'undefined'
        const hasAuthorId = typeof board !== 'undefined'
        const hasFilter = hasBoard || hasSfb || hasAuthorId
        if (hasFilter) {
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i]
                if (hasAuthorId) {
                    const authorIdExists = row.meta.some(meta => meta.authorId === authorId)
                    if (authorIdExists) {
                        rows.splice(i, 1)
                        i--
                    }
                } if (hasBoard && row.board !== board) {
                    rows.splice(i, 1)
                    i--
                } else if (hasSfb && row.stats.sfb >= (minSfb) && row.stats.sfb <= (maxSfb)) {
                    rows.splice(i, 1)
                    i--
                }
            }
        }

        const hasQuery = typeof query !== 'undefined' || typeof name !== 'undefined' || typeof author !== 'undefined'
        if (hasQuery) {
            let keys: string[] = []
            if (typeof query !== 'undefined') {
                keys = ['meta.name', 'meta.author']
            } else if (typeof name !== 'undefined') {
                keys = ['meta.name']
            } else if (typeof author !== 'undefined') {
                keys = ['meta.author']
            }
            const fuse = new Fuse(rows, {
                minMatchCharLength: 1,
                keys
            })
            rows = fuse.search(query as string).map(o => o.item)
        }

        const hasSort = !hasQuery && typeof sort !== 'undefined' && typeof sortBy !== 'undefined'
        if (hasSort) {
            rows = rows.sort((a, b) => {
                const first = sort === 'asc' ? a : b
                const second = sort === 'asc' ? b : a
                switch (sortBy) {
                    case 'sfb':
                        return first.stats.sfb - second.stats.sfb
                    default:
                        return 0
                }
            })
        }

        return rows
    }

    public static meta(rowCount: number, page = 1, limit = 25) {
        const quotient = Math.floor(rowCount / (limit) * ((page - 1)))
        const remainder = rowCount % ((limit) * ((page - 1)))
        const cursor = (limit) * (page - 1)
        const totalPages = remainder === 0 ? quotient : quotient + 1
        const hasMore = page + 1 <= totalPages

        return {
            totalPages, hasMore, page, cursor
        }
    }
}