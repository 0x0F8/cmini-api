import * as z from "zod/v4"; 
import CminiController from '@backend/cmini/controller'
import { parseQuery } from '@util/url';

const schema = z.object({
    hash: z.string().length(32).optional(),
    id: z.number().gt(-1).lt(100000).optional(),
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

    const { id, hash } = queryObj
    let row: any = undefined

    if (typeof hash !== 'undefined'){
        row = CminiController.getLayoutByHash(hash as string)
    } else if (typeof id !== 'undefined') {
        row = CminiController.getLayoutById(String(id))
    }

    if (!row) {
        return Response.json({
            success: false
        })
    }

    return Response.json({
        data: row,
        success: true
    })
}