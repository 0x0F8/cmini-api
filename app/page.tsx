import { Stack } from '@mui/material';
import LayoutTable from '../components/LayoutTable';
import CminiApi from '../cmini/api';
import { convertQuery } from '../util/url';
import { SearchSchema } from '../cmini/validators';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page({ searchParams }: {
  searchParams: SearchParams
}) {
  const queryObj = convertQuery(await searchParams)
  const validation = SearchSchema.safeParse(queryObj)
  if (validation.error) {
    return (
      <Stack>That's an error</Stack>
    )
  }

  let data = CminiApi.search(queryObj as any)
  const { page = 1, limit = 25 } = queryObj
  const { totalPages, hasMore, cursor } = CminiApi.meta(data.length, page as number, limit as number)
  data = data.slice(cursor, limit as number)

  return (
    <Stack>
      <LayoutTable data={data} hasMore={hasMore} />
    </Stack>
  )
}