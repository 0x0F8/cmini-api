import useSearchInfiniteApi from "@frontend/hooks/useSearchApiInfinite";
import { useIntersectionObserver } from "usehooks-ts";
import { SearchApiArgs } from "./types";
import { Stack } from "@mui/material";
import LayoutTable from "@frontend/components/LayoutTable";
import { useEffect, useState } from "react";

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
  const { data, mutate, size, setSize, isValidating, isLoading } =
    useSearchInfiniteApi(args, { limit: 25 });

  useEffect(() => {
    const isLoadingMore = Boolean(
      isLoading || (size > 0 && data && typeof data[size - 1] === "undefined"),
    );
    const isEmpty =
      !data || data.length === 0 || data[0].meta.currentRows === 0;
    const hasReachedEnd = Boolean(
      data && data.length > 0 && !data[data.length - 1].meta.hasMore,
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
        console.log(prevSize + 1);
        return prevSize + 1;
      });
    }
  }, [isIntersecting, isRefreshing, setSize, hasReachedEnd]);

  return (
    !isEmpty && (
      <Stack>
        <LayoutTable data={data?.map((d) => d.data).flat() || []} />
        <div ref={ref}></div>
      </Stack>
    )
  );
}
