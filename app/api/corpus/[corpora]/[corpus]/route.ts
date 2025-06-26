import * as z from "zod/v4"; 
import { parseQuery } from "@util/url";
import CorpusController from "@backend/corpus/controller";
import { Corpus } from "@backend/corpus/types";
import { Corpora } from "@backend/corpus/types";

const querySchema = z.object({
    limit: z.number().lte(10000).gt(0).optional()
})

const paramsSchema = z.object({
    corpora: z.enum(Corpora),
    corpus: z.enum(Corpus)
})

export async function GET(req, { params }: { params: Promise<{ corpora: Corpora; corpus: Corpus }> }) {
    const paramsObj = await params
    const paramsValidation = paramsSchema.safeParse(paramsObj)
    if (paramsValidation.error) {
        return Response.json({
            error: paramsValidation.error!.issues,
            success: false
        })
    }

    const queryObj = parseQuery(req.url!)
    const queryValidation = querySchema.safeParse(queryObj)
    if (queryValidation.error) {
        return Response.json({
            error: queryValidation.error!.issues,
            success: false
        })
    }

    const { corpus } = paramsObj
    let rows: string[] | undefined

    const { limit } = queryObj
    if (typeof limit === 'number') {
        rows = CorpusController.getRandomStrings(corpus, limit)
    } else {
        rows = CorpusController.getCorpus(corpus)
    }

    return Response.json({
        data: rows || [],
        success: true
    })
}