import { Link, Stack, Typography } from "@mui/material";
import CminiController from "@backend/cmini/controller";
import CorpusController from "@backend/corpus/controller";
import Keyboard from "@frontend/components/Keyboard";
import { CminiBoardType } from "@backend/cmini/types";
import { Corpus } from "@backend/corpus/types";
import TypingTest from "@frontend/components/TypingTest";

export const dynamicParams = false;

export async function generateStaticParams() {
  const hashes = CminiController.getLayoutHashes();
  return hashes.map((hash) => ({ hash }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const data = CminiController.getLayoutByHash(hash as string);
  const heatmap = CminiController.getHeatmap("monkeyracer");
  const boardLayouts = data!.boardLayouts.map((b) =>
    CminiController.getBoardLayoutDetails(b),
  );
  const stats = boardLayouts[0].stats.get("monkeyracer");
  const affirmation = CorpusController.getRandomString(
    Corpus.LocalAffirmations,
  );
  const words = CorpusController.getRandomStrings(
    Corpus.MonkeyType1k,
    50,
    "default",
  )!;
  return (
    <Stack>
      <TypingTest
        keys={data?.layout.keys!}
        defaultUserValue={`${boardLayouts[0].meta[0].name} `}
        defaultTestValue={`${boardLayouts[0].meta[0].name} is ${affirmation}!`}
        defaultWords={words}
      />
      <Typography>
        by{" "}
        <Link href={`/author/${boardLayouts[0].meta[0].authorId}`}>
          {boardLayouts[0].meta[0].author}
        </Link>
      </Typography>
      <Keyboard
        keys={data?.layout.keys!}
        heatmap={heatmap!}
        config={{
          display: "heatmap",
          showDisplay: false,
          type: CminiBoardType.Staggered,
        }}
      />
    </Stack>
  );
}
