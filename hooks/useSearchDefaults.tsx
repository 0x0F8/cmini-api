import { useSearchParams } from "next/navigation";
import { SearchConstraints, SearchState } from "../components/LayoutForm";

export function useSearchDefaults(constraints: SearchConstraints): SearchState {
    const searchParams = useSearchParams()

}