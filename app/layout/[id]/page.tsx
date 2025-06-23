import { Stack } from "@mui/material"
import CminiController from "../../../cmini/controller"

export const dynamicParams = false

export async function generateStaticParams() {
  const ids = CminiController.getLayoutHashes()
  return ids.map(id => ({ id }))
}

export default async function Page({ params } : {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = CminiController.getOneByLayoutHash(id as string)

  return (
      <Stack>
          {data!.layout.boardHash}
          {data!.layout.layoutHash}
      </Stack>
  )
}