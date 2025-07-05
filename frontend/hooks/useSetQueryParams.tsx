import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function useSetQueryParams(merge = true) {
  const [nextQuery, setNextQuery] = useState<Record<string, any>>({});
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setQuery = useCallback((args: Record<string, any>) => {
    setNextQuery(args);
  }, []);

  useEffect(() => {
    if (Object.values(nextQuery).length === 0) return;
    const nextSearchParams = new URLSearchParams(
      !merge ? {} : searchParams.toString(),
    );
    for (const [key, value] of Object.entries(nextQuery)) {
      nextSearchParams[key] = value;
    }
    router.replace(`${pathname}?${nextSearchParams}`);
  }, [nextQuery, merge]);

  return setQuery;
}
