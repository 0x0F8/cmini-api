import * as z from "zod/v4"; 
import CminiController from '../../../cmini/controller'
import { parseQuery } from '../../../util/url';

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
    let row: any
    if (id) {
        row = CminiController.getLayoutByBoardHash(id as string)
    } else if (name) {
        row = CminiController.getLayoutByName(name as string)
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