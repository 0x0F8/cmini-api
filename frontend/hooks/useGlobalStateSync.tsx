import { useEffect } from "react";
import useAppState from "./useAppState";
import useSearchState from "./useSearchState";

export default function useGlobalStateSync() {
  const { setConstraints } = useSearchState();
  const { metrics } = useAppState();

  useEffect(() => {
    setConstraints(metrics);
  }, [metrics]);
}
