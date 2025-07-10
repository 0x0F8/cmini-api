import {
  Autocomplete,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AutocompleteApiData } from "app/api/search/autocomplete/route";
import { useCallback, useEffect, useState, useTransition } from "react";

export default function LayoutAutoComplete({
  data,
  inputValue,
  setInputValue,
  onSubmit,
}: {
  data: AutocompleteApiData[];
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (value: AutocompleteApiData) => void;
}) {
  const [done, startTransition] = useTransition();
  const [value, setValue] = useState<AutocompleteApiData | undefined>(
    undefined,
  );
  const onSetInputValue = useCallback(
    (e, v) => setInputValue(v),
    [setInputValue],
  );
  const onSetValue = useCallback(
    (e, v) => {
      onSubmit(v);
    },
    [onSubmit, setValue, startTransition],
  );
  const onClose = useCallback(() => {
    startTransition(() => {
      setValue(undefined);
      setInputValue("");
    });
  }, [setValue]);

  useEffect(() => console.log(value), [value]);
  return (
    <Autocomplete
      freeSolo
      filterOptions={(x) => x}
      blurOnSelect
      clearOnEscape
      value={value}
      inputValue={inputValue}
      getOptionLabel={(l) => l?.meta[0].name}
      options={data}
      onChange={onSetValue}
      onClose={onClose}
      onInputChange={onSetInputValue}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          slotProps={{
            input: {
              ...params.InputProps,
              type: "search",
            },
            inputLabel: {
              ...params.InputLabelProps,
              disableAnimation: true,
            },
          }}
        />
      )}
      renderOption={(params, value) => (
        <li {...params} key={value.meta[0].boardId}>
          <Stack>
            <Typography>
              <strong>{value.meta[0].name}</strong>
            </Typography>
            <Typography>{value.meta[0].author}</Typography>
          </Stack>
        </li>
      )}
    />
  );
}
