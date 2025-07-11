import useSearchState from "@frontend/hooks/useSearchState";
import { SortOrder } from "types";
import { useCallback } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Stack, Typography } from "@mui/material";
import { SearchSortField } from "./types";

function SortHeader({
  children,
  setSort,
  sort,
  sortBy,
  sorted,
}: {
  children: React.ReactElement | string;
  setSort: (
    sort: SortOrder | undefined,
    sortBy: SearchSortField | undefined,
  ) => void;
  sort: SortOrder | undefined;
  sortBy: SearchSortField | undefined;
  sorted: boolean;
}) {
  const onClick = useCallback(() => {
    const list = [SortOrder.Ascending, SortOrder.Descending, undefined];
    let index = 0;
    if (sorted) {
      index = list.indexOf(sort) + 1;
    }
    if (index > list.length - 1) {
      index = 0;
    }
    setSort(list[index], sortBy);
  }, [sort, sortBy, sorted]);

  let symbol: React.ReactElement | null = null;
  if (sorted) {
    if (sort === SortOrder.Ascending) {
      symbol = <ArrowUpwardIcon fontSize="small" />;
    } else if (sort === SortOrder.Descending) {
      symbol = <ArrowDownwardIcon fontSize="small" />;
    }
  }
  return (
    <td>
      <Stack justifyItems="center" onClick={onClick} sx={{ cursor: "pointer" }}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Typography>{children}</Typography>
          <Typography>{symbol}</Typography>
        </Stack>
      </Stack>
    </td>
  );
}

export default function SearchResulsTableHeader() {
  const { setSort, sort, sortBy } = useSearchState();
  return (
    <tr>
      <td>
        <Typography>Name</Typography>
      </td>
      <td>
        <Typography>Author</Typography>
      </td>
      <SortHeader
        setSort={setSort}
        sort={sort}
        sortBy={SearchSortField.Sfb}
        sorted={sortBy === SearchSortField.Sfb}
      >
        SFB
      </SortHeader>
      <SortHeader
        setSort={setSort}
        sort={sort}
        sortBy={SearchSortField.Sfs}
        sorted={sortBy === SearchSortField.Sfs}
      >
        SFS
      </SortHeader>
      <td>
        <Typography>Scissors</Typography>
      </td>
      <td>
        <Typography>Alternate</Typography>
      </td>
      <td>
        <Typography>Roll</Typography>
      </td>
      <td>
        <Typography>Redir</Typography>
      </td>
      <td>
        <Typography>In:out-roll</Typography>
      </td>
      <td>
        <Typography>Pinky off</Typography>
      </td>
      <td>
        <Typography>Hand use</Typography>
      </td>
    </tr>
  );
}
