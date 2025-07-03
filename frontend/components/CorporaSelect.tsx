import useAppState from "@frontend/hooks/useAppState";
import { Select, MenuItem } from "@mui/material";
import { useCallback } from "react";

export default function CorporaSelect({ corporas }: { corporas: string[] }) {
  const { corpora, setCorpora } = useAppState();

  const onCorporaChange = useCallback(
    (event) => {
      setCorpora(event.target.value);
    },
    [setCorpora],
  );

  return (
    <Select value={corpora} label="Corpora" onChange={onCorporaChange}>
      {corporas.sort().map((c) => (
        <MenuItem value={c}>{c}</MenuItem>
      ))}
    </Select>
  );
}
