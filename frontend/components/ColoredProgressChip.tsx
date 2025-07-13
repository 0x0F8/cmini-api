import { Box, Stack, Typography } from "@mui/material";
import { gradientValueFromArray } from "@util/color";
import React from "react";

export default function ColoredProgressChip({
  colors,
  progress,
  children,
  reverse = false,
  invert = false,
}: {
  colors: string[];
  progress: number;
  children: React.ReactElement | string | string[];
  reverse?: boolean;
  invert?: boolean;
}) {
  const color = reverse
    ? gradientValueFromArray(progress, colors.slice().reverse())
    : gradientValueFromArray(progress, colors);
  return (
    <Box sx={{ background: invert ? "none" : color }}>
      <Stack alignContent="center">
        <Typography
          sx={{ color: invert ? color : "#fff" }}
          fontWeight="bold"
          textAlign="center"
        >
          {children}
        </Typography>
      </Stack>
    </Box>
  );
}
