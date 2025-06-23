import { Stack } from "@mui/material"
import CminiController from "../../../cmini/controller"
import { isHash } from "../../../util/crypto"
import { CminiGlobalWithCorpora } from "../../../cmini/types"

export const dynamicParams = false

export async function generateStaticParams() {
    const ids = CminiController.getBoardHashes()
    const names = CminiController.getNames()
    const props = ids.map(id => ({ id })).concat(names.map(id => ({ id })))
    return props
}

export default async function Page({ params } : {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const propIsHash = isHash(id)
    let data: CminiGlobalWithCorpora | undefined
    if (propIsHash) {
        data = CminiController.getOneByBoardHash(id as string)
    } else {
        data = CminiController.getOneByName(decodeURIComponent(id as string))
    }

    return (
        <Stack>
            {data!.layout.boardHash}
            {data!.layout.layoutHash}
        </Stack>
    )
}