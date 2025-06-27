import { Stack } from "@mui/material"
import CminiController from "@backend/cmini/controller"
import { isHash } from "@util/crypto"
import { CminiMeta, CminiLayout, CminiBoardLayout, CminiStatsByCorpora, CminiBoardType } from "@backend/cmini/types"

export const dynamicParams = false

export async function generateStaticParams() {
    const ids = CminiController.getBoardHashes()
    const names = CminiController.getLayoutNames()
    const props = ids.map(id => ({ id })).concat(names.map(id => ({ id })))
    return props
}

export default async function Page({ params } : {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const propIsHash = isHash(id)
    let data: {
        stats: CminiStatsByCorpora;
        meta: CminiMeta[];
        layoutHash: string;
        boardHash: string;
        board: CminiBoardType;
    }
    if (propIsHash) {
        data = CminiController.getBoardLayoutByBoardHash(id as string)!
    } else {
        data = CminiController.getBoardLayoutByName(decodeURIComponent(id as string))!
    }

    return (
        <Stack>
            {data!.boardHash}
            {data!.layoutHash}
        </Stack>
    )
}