import { Box, Stack, Typography } from "@mui/material";
import { gradientValueFromArray } from "@util/color";
import React, { ReactElement, useRef } from "react";

const ELEMENT_HEIGHT = 24;

export default function ColoredProgressChip({
  colors,
  progress,
  children,
  reverseColors = false,
  textOnly = false,
  adorn = "none",
}: {
  colors: string[];
  progress: number;
  children: React.ReactElement | string | string[];
  reverseColors?: boolean;
  textOnly?: boolean;
  adorn?: "left" | "right" | "none";
}) {
  const ref = useRef(null);
  const color = reverseColors
    ? gradientValueFromArray(progress, colors.slice().reverse())
    : gradientValueFromArray(progress, colors);

  let adornmentLeft: ReactElement<any, any> | null = null;
  let adornmentRight: ReactElement<any, any> | null = null;

  if (adorn === "left") {
    adornmentLeft = (
      <Box
        sx={{
          width: 0,
          height: 0,
          borderTop: `${ELEMENT_HEIGHT / 2}px solid transparent`,
          borderRight: `10px solid ${color}`,
          borderBottom: `${ELEMENT_HEIGHT / 2}px solid transparent`,
        }}
      />
    );
    adornmentRight = (
      <Box
        sx={{
          width: 0,
          height: 0,
          borderTop: `${ELEMENT_HEIGHT / 2}px solid ${color}`,
          borderRight: `10px solid transparent`,
          borderBottom: `${ELEMENT_HEIGHT / 2}px solid ${color}`,
        }}
      />
    );
  } else if (adorn === `right`) {
    adornmentRight = (
      <Box
        sx={{
          width: 0,
          height: 0,
          borderTop: `${ELEMENT_HEIGHT / 2}px solid transparent`,
          borderLeft: `10px solid ${color}`,
          borderBottom: `${ELEMENT_HEIGHT / 2}px solid transparent`,
        }}
      />
    );
    adornmentLeft = (
      <Box
        sx={{
          width: 0,
          height: 0,
          borderTop: `${ELEMENT_HEIGHT / 2}px solid ${color}`,
          borderLeft: `10px solid transparent`,
          borderBottom: `${ELEMENT_HEIGHT / 2}px solid ${color}`,
        }}
      />
    );
  }

  return (
    <Stack flexDirection="row" ref={ref}>
      {adornmentLeft}
      <Stack
        alignContent="center"
        sx={{ background: textOnly ? "none" : color }}
        flex={1}
      >
        <Typography
          sx={{ color: textOnly ? color : "#fff" }}
          fontWeight="bold"
          textAlign="center"
          px={1}
        >
          {children}
        </Typography>
      </Stack>
      {adornmentRight}
    </Stack>
  );
}
