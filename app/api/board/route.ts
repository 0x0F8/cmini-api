import * as z from "zod/v4"; 
import CminiController from '../../../cmini/controller'
import { parseQuery } from '../../../util/url';
import { CminiGlobalWithCorpora } from "../../../cmini/types";

const schema = z.object({
    id: z.string().length(32).optional(),
    name: z.string().min(1).max(255).optional(),
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

    const { id, name } = queryObj
    let row: CminiGlobalWithCorpora | undefined
    if (id) {
        row = CminiController.getOneByBoardHash(id as string)
    } else if (name) {
        row = CminiController.getOneByName(name as string)
    }

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