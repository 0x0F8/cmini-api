import { Stack, Typography } from "@mui/material"
import CminiController from "../../../cmini/controller"
import Keyboard from "../../../components/Keyboard"
import {LayoutRow} from "../../../components/LayoutTable"

export const dynamicParams = false

export async function generateStaticParams() {
  const ids = CminiController.getLayoutHashes()
  return ids.map(id => ({ id }))
}

export default async function Page({ params } : {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = CminiController.getLayoutByHash(id as string)
  const heatmap = CminiController.getHeatmap('monkeyracer')
  const boardLayouts = data!.boardLayouts.map(CminiController.getBoardLayoutDetails)
  const stats = boardLayouts[0].stats.get('monkeyracer')
  return (
      <Stack>
          <Typography variant="h3">
            {boardLayouts[0].meta[0].name}
          </Typography>
          <Typography>
            {boardLayouts[0].meta[0].author}
          </Typography>
          <LayoutRow stats={stats} meta={boardLayouts[0].meta} />
          <Keyboard keys={data?.layout.keys!} heatmap={heatmap!} config={{display:'heatmap',showDisplay: true}} />
      </Stack>
  )
}