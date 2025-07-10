import { Stack } from "@mui/material";
import CorporaSelect from "./CorporaSelect";
import useAppState from "@frontend/hooks/useAppState";
import useLayoutAutocompleteApi from "@frontend/hooks/useLayoutAutocompleteApi";
import LayoutAutoComplete from "@frontend/feature/search/LayoutAutoComplete";
import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AutocompleteApiData } from "app/api/search/autocomplete/route";

export default function Header() {
  const [done, startTransition] = useTransition();
  const router = useRouter();
  const [autocomplete, setAutocomplete] = useState<string>("");
  const { corporas, corpora } = useAppState();
  const { search } = useLayoutAutocompleteApi({ query: autocomplete, corpora });

  const onSubmit = useCallback(
    (value: AutocompleteApiData) => {
      router.push(`/layout/${value.meta[0].layoutHash}`);
    },
    [setAutocomplete, startTransition],
  );

  return (
    <Stack>
      <Stack>Logo</Stack>
      <Stack>Search</Stack>
      <Stack>
        <CorporaSelect corporas={corporas} />
        <LayoutAutoComplete
          data={search?.data || []}
          inputValue={autocomplete}
          setInputValue={setAutocomplete}
          onSubmit={onSubmit}
        />
      </Stack>
    </Stack>
  );
}
