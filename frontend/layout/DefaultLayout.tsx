"use client";

import Header from "@frontend/components/Header";
import { Stack } from "@mui/material";

export default function DefaultLayout({ children }) {
  return (
    <Stack>
      <Header />
      <Stack>{children}</Stack>
    </Stack>
  );
}
