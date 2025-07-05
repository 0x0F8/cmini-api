import { SearchContext } from "@frontend/state/SearchStateProvider";
import { useContext } from "react";

export default function useSearchState() {
  return useContext(SearchContext);
}
