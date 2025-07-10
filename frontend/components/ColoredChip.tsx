import { Box, Stack, Typography, useTheme } from "@mui/material";
import { gradientValueFromArray } from "@util/color";
import React from "react";

export default function ColoredChip({
  colors,
  progress,
  children,
  reverse = false,
}: {
  colors: string[];
  progress: number;
  children: React.ReactElement | string | string[];
  reverse?: boolean;
}) {
  const color = reverse
    ? gradientValueFromArray(progress, colors.reverse())
    : gradientValueFromArray(progress, colors);
  const theme = useTheme();
  return (
    <Box sx={{ background: color }}>
      <Stack alignContent="center">
        <Typography sx={{ color: "#fff" }} fontWeight="bold" textAlign="center">
          {children}
        </Typography>
      </Stack>
    </Box>
  );
}
