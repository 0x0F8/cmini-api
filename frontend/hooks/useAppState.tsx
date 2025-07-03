import { AppContext } from "@frontend/state/AppStateProvider";
import { useContext } from "react";

export default function useAppState() {
    return useContext(AppContext);
  }