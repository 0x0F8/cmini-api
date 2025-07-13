import useSearchInfiniteApi from "@frontend/hooks/useSearchApiInfinite";
import { useIntersectionObserver } from "usehooks-ts";
import { SearchApiArgs } from "./types";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LayoutTable from "@frontend/components/LayoutTable";
import SearchResulsTableHeader from "./SearchResultsTableHeader";
import { PAGE_LIMIT } from "@/constants";

export default function ScrolledSearchResults({
  args,
}: {
  args: SearchApiArgs | undefined;
}) {
  const [{ isLoadingMore, isEmpty, hasReachedEnd, isRefreshing }, setState] =
    useState<{
      isLoadingMore: boolean;
      isEmpty: boolean;
      hasReachedEnd: boolean;
      isRefreshing: boolean;
    }>({
      isLoadingMore: false,
      isEmpty: true,
      hasReachedEnd: false,
      isRefreshing: false,
    });
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.5 });
  const { data, mutate, size, setSize, isValidating, isLoading, error } =
    useSearchInfiniteApi(args, { limit: PAGE_LIMIT });

  useEffect(() => {
    const isLoadingMore = Boolean(
      isLoading || (size > 0 && data && typeof data[size - 1] === "undefined"),
    );
    const isEmpty =
      !data || data.length === 0 || data[0].meta?.currentRows === 0;
    const hasReachedEnd = Boolean(
      data && data.length > 0 && !data[data.length - 1].meta?.hasMore,
    );
    const isRefreshing = Boolean(isValidating && data && data.length === size);
    setState((state) => ({
      ...state,
      isLoadingMore,
      isEmpty,
      hasReachedEnd,
      isRefreshing,
    }));
  }, [data, data?.length, isValidating]);

  useEffect(() => {
    if (isIntersecting && !isRefreshing && !hasReachedEnd) {
      setSize((prevSize) => {
        return prevSize + 1;
      });
    }
  }, [isIntersecting, isRefreshing, setSize, hasReachedEnd]);

  if (error) {
    return (
      <Stack>
        <Stack
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Typography textAlign="center">
            I don't know how, but you broke it
          </Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack>
      {!isEmpty && !isLoading && (
        <Stack>
          <LayoutTable
            data={data?.map((d) => d.data).flat() || []}
            Header={SearchResulsTableHeader}
          />
          <div ref={ref}></div>
        </Stack>
      )}
      <Stack m={8} justifyContent="center" alignItems="center">
        {isEmpty && !isLoading && (
          <Stack justifyContent="center" alignItems="center">
            <Typography textAlign="center">Nothing to see here</Typography>
          </Stack>
        )}
        {!hasReachedEnd && (!isEmpty || isLoading) && (
          <Stack justifyContent="center" alignItems="center" gap={2}>
            <CircularProgress size={20} />
            <Typography textAlign="center">Loading...</Typography>
          </Stack>
        )}
        {!isEmpty && hasReachedEnd && (
          <Stack
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Typography textAlign="center">You've reached the end</Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
