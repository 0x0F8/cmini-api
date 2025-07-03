import { KeySearchContext } from "@frontend/state/KeySearchStateProvider";
import { useContext } from "react";

export default function useKeySearchState() {
    return useContext(KeySearchContext);
  }