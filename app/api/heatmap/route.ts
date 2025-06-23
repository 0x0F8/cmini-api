import * as z from "zod/v4"; 
import CminiController from '../../../cmini/controller'
import { parseQuery } from '../../../util/url';

const schema = z.object({
    corpora: z.enum(CminiController.getCorpora()).optional(),
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

    const { corpora } = queryObj
    const row = CminiController.getHeatmap(corpora as string)

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