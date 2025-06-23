import * as z from "zod/v4"; 
import CminiController from '../../../cmini/controller'
import { parseQuery } from '../../../util/url';

const schema = z.object({
    id: z.string().length(32)
})

export async function GET(req) {
    const queryObj = parseQuery(req.url!)
    const validation = schema.safeParse(queryObj)
    if (validation.error) {
        return Response.json({
            error: validation.error!.issues,
            success: false
        })
    }

    const { id } = queryObj
    const row = CminiController.getOneByLayoutHash(id as string)

    if (!row) {
        return Response.json({
            success: false
        })
    }

    return Response.json({
        data: {
            layout: row.layout,
            meta: row.meta,
            stats: Array.from(row?.stats.entries()).map(([,v]) => v)
        },
        success: true
    })
}