import { stringifyQuery } from "@util/url";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function useSetQueryParams(merge = true) {
  const [nextQuery, setNextQuery] = useState<Record<string, any>>({});
  const router = useRouter();
  const pathname = usePathname();

  const setQuery = useCallback((args: Record<string, any>) => {
    setNextQuery(args);
  }, []);

  useEffect(() => {
    if (Object.values(nextQuery).length === 0) return;
    router.replace(`${pathname}?${stringifyQuery(nextQuery)}`);
  }, [nextQuery, merge, router, pathname]);

  return setQuery;
}
