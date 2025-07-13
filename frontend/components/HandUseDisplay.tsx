import { Box, Stack, Typography } from "@mui/material";
import { format } from "@util/string";

export default function HandUseDisplay({
  left,
  right,
  width = 50,
}: {
  left: number;
  right: number;
  width?: number;
}) {
  const ratio = right - left;
  return (
    <Stack flexDirection="row" alignItems="center">
      <Typography>{format(left, 0)}</Typography>
      <Box
        sx={{
          position: "relative",
          width,
          height: 10,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            background: "#000",
            height: "100%",
            width: `${Math.abs(ratio)}%`,
            top: 0,
            left: ratio < 0 ? `calc(${50 - Math.abs(ratio)}%)` : "50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            background: "#000",
            height: `calc(100% + 10px)`,
            left: "50%",
            top: "-5px",
            width: "1px",
          }}
        ></Box>
      </Box>
      <Typography>{format(right, 0)}</Typography>
    </Stack>
  );
}
