import { parseQuery } from '../../../util/url';
import CminiApi from "../../../cmini/api";
import { SearchSchema } from '../../../cmini/validators';

export async function GET(req) {
    const queryObj = parseQuery(req.url!)
    const validation = SearchSchema.safeParse(queryObj)
    if (validation.error) {
        return Response.json({
            error: validation.error!.issues,
            success: false
        })
    }

    let rows = CminiApi.search(queryObj as any)
    const { page, limit, corpora } = queryObj
    const { totalPages, hasMore, cursor } = CminiApi.meta(rows.length, page as number, limit as number)
    rows = rows.slice(cursor, queryObj?.limit as number)

    return Response.json({
        data: rows,
        success: true,
        meta: {
            hasMore,
            page,
            totalPages,
        }
    })
}