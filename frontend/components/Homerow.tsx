import { Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { CminiFinger, CminiLayout } from "@/backend/cmini/types";
import { homerow } from "@/util/layout";

export default function Homerow({ layout }: { layout: CminiLayout }) {
  const keys = useMemo(() => homerow(layout), [layout]);
  return (
    <Stack flexDirection="row" justifyContent="space-around">
      {keys.map((k) =>
        k ? (
          <Box key={k.key}>
            <Typography textAlign="center">
              {String.fromCharCode(k.key)}
            </Typography>
          </Box>
        ) : (
          <Box>&nbsp;</Box>
        ),
      )}
    </Stack>
  );
}
