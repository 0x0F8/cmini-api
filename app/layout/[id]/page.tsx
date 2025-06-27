import { Stack, Typography } from "@mui/material"
import CminiController from "@backend/cmini/controller"
import CorpusController from "@backend/corpus/controller"
import Keyboard from "@frontend/components/Keyboard"
import { LayoutRow } from "@frontend/components/LayoutTable"
import { CminiBoardType } from "@backend/cmini/types"
import { Corpus } from "@backend/corpus/types"
import TypingInput from "@frontend/components/TypingInput"

export const dynamicParams = false

export async function generateStaticParams() {
  const ids = CminiController.getLayoutHashes()
  return ids.map(id => ({ id }))
}

export default async function Page({ params }: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = CminiController.getLayoutByHash(id as string)
  const heatmap = CminiController.getHeatmap('monkeyracer')
  const boardLayouts = data!.boardLayouts.map(b => CminiController.getBoardLayoutDetails(b))
  const stats = boardLayouts[0].stats.get('monkeyracer')
  const affirmation = CorpusController.getRandomString(Corpus.LocalAffirmations)
  return (
    <Stack>
      <TypingInput keys={data?.layout.keys!} defaultValue={boardLayouts[0].meta[0].name} />
      <Typography>
        {boardLayouts[0].meta[0].author}
      </Typography>
      <LayoutRow stats={stats} meta={boardLayouts[0].meta} />
      <Keyboard keys={data?.layout.keys!} heatmap={heatmap!} config={{ display: 'heatmap', showDisplay: false, type: CminiBoardType.Staggered }} />
    </Stack>
  )
}