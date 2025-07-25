import { Stack } from "@mui/material";
import LayoutTable, {
  LayoutTableHeader,
} from "@frontend/components/LayoutTable";
import CminiApi from "@backend/cmini/api";
import { convertQuery } from "@util/url";
import { SearchSchema } from "@backend/cmini/validators";
import { meta } from "@util/api";
import { PAGE_LIMIT } from "@/constants";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const queryObj = convertQuery(await searchParams);
  const validation = SearchSchema.safeParse(queryObj);
  if (validation.error) {
    return <Stack>That's an error</Stack>;
  }

  let data = CminiApi.search(queryObj as any);
  const { page = 1, limit = PAGE_LIMIT } = queryObj;
  const { totalPages, rows, hasMore, cursor } = meta(
    data,
    page as number,
    limit as number,
  );

  return (
    <Stack>
      <LayoutTable data={rows} Header={LayoutTableHeader} />
    </Stack>
  );
}
