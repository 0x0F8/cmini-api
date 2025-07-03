"use client";

import { Box, Stack, Typography } from "@mui/material";
import KeySearchHand from "./KeySearchHand";
import { KeySearchHandConstraint } from "./types";
import useKeySearchState from "@frontend/hooks/useKeySearchState";
import { useCallback } from "react";

export default function KeySearchForm() {
  const { left, right, either, query, valid, editing, deselectKey } =
    useKeySearchState();
  const onBackgroundClick = useCallback(() => deselectKey, []);
  return (
    <Stack sx={{ position: "relative" }}>
      <Stack sx={{ zIndex: 2 }}>
        <Stack flexDirection="row" justifyContent="space-evenly">
          <KeySearchHand
            hand={KeySearchHandConstraint.Left}
            groups={left}
            flex={0.4}
          />
          <KeySearchHand
            hand={KeySearchHandConstraint.Either}
            groups={either}
            flex={0.2}
          />
          <KeySearchHand
            hand={KeySearchHandConstraint.Right}
            groups={right}
            flex={0.4}
          />
        </Stack>
        <Typography>
          {query} {valid.toString()} {editing.toString()}
        </Typography>
      </Stack>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          zIndex: 1,
        }}
        onClick={onBackgroundClick}
      />
    </Stack>
  );
}
