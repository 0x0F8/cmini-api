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
    const list = [SortOrder.Ascending, SortOrder.Descending];
    let index = 0;
    if (sorted && typeof sort !== undefined) {
      index = list.indexOf(sort!) + 1;
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
    <Stack justifyItems="center" onClick={onClick} sx={{ cursor: "pointer" }}>
      <Stack flexDirection="row" justifyContent="space-between">
        <Typography
          textAlign={sorted ? "left" : "center"}
          flex={sorted ? "" : 1}
        >
          {children}
        </Typography>
        {sorted && <Typography>{symbol}</Typography>}
      </Stack>
    </Stack>
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
      <td>
        <SortHeader
          setSort={setSort}
          sort={sort}
          sortBy={SearchSortField.Sfb}
          sorted={sortBy === SearchSortField.Sfb}
        >
          SFB
        </SortHeader>
      </td>
      <td>
        <SortHeader
          setSort={setSort}
          sort={sort}
          sortBy={SearchSortField.Sfs}
          sorted={sortBy === SearchSortField.Sfs}
        >
          SFS
        </SortHeader>
      </td>
      <td>
        <SortHeader
          setSort={setSort}
          sort={sort}
          sortBy={SearchSortField.Fsb}
          sorted={sortBy === SearchSortField.Fsb}
        >
          FSB
        </SortHeader>
      </td>
      <td>
        <SortHeader
          setSort={setSort}
          sort={sort}
          sortBy={SearchSortField.Redirect}
          sorted={sortBy === SearchSortField.Redirect}
        >
          Redirects
        </SortHeader>
      </td>
      <td>
        <SortHeader
          setSort={setSort}
          sort={sort}
          sortBy={SearchSortField.PinkyOff}
          sorted={sortBy === SearchSortField.PinkyOff}
        >
          Pinky Off
        </SortHeader>
      </td>
      <td>&nbsp;</td>
      <td>
        <SortHeader
          setSort={setSort}
          sort={sort}
          sortBy={SearchSortField.Alternate}
          sorted={sortBy === SearchSortField.Alternate}
        >
          Alternation
        </SortHeader>
      </td>
      <td>
        <SortHeader
          setSort={setSort}
          sort={sort}
          sortBy={SearchSortField.Roll}
          sorted={sortBy === SearchSortField.Roll}
        >
          Roll
        </SortHeader>
      </td>
      <td>
        <SortHeader
          setSort={setSort}
          sort={sort}
          sortBy={SearchSortField.RollRatio}
          sorted={sortBy === SearchSortField.RollRatio}
        >
          Roll Ratio
        </SortHeader>
      </td>
      <td>
        <Typography textAlign="center">Hand Use</Typography>
      </td>
    </tr>
  );
}
