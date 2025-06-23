import * as z from "zod/v4"; 
import CminiController from '../../../cmini/controller'
import { parseQuery } from '../../../util/url';

const schema = z.object({
    author: z.string().min(1).max(32)
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

    const { author } = queryObj
    let row = CminiController.getOneByName(author as string)

    if (!row) {
        return Response.json({
            success: false
        })
    }

    return Response.json({
        data: {
            layout: row.layout,
            meta: row.meta[0],
            stats: Array.from(row?.stats.entries()).map(([,v]) => v)
        },
        success: true
    })
}