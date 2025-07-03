import { Stack } from "@mui/material";
import CorporaSelect from "./CorporaSelect";
import useAppState from "@frontend/hooks/useAppState";

export default function Header() {
  const { corporas } = useAppState();
  return (
    <Stack>
      <Stack>Logo</Stack>
      <Stack>Search</Stack>
      <Stack>
        <CorporaSelect corporas={corporas} />
      </Stack>
    </Stack>
  );
}
