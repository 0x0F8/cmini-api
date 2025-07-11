import { Stack } from "@mui/material";
import CorporaSelect from "./CorporaSelect";
import useAppState from "@frontend/hooks/useAppState";
import useLayoutAutocompleteApi from "@frontend/hooks/useLayoutAutocompleteApi";
import LayoutAutoComplete from "@frontend/components/LayoutAutoComplete";
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
    <Stack flexDirection="row" justifyContent="space-between">
      <Stack>Logo</Stack>
      <Stack flexDirection="row" flex={0.4} gap={2}>
        <CorporaSelect corporas={corporas} />
        <Stack flex={1}>
          <LayoutAutoComplete
            data={search?.data || []}
            inputValue={autocomplete}
            setInputValue={setAutocomplete}
            onSubmit={onSubmit}
          />
        </Stack>
      </Stack>
      <Stack></Stack>
    </Stack>
  );
}
