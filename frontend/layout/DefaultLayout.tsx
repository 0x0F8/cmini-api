"use client";

import Header from "@frontend/components/Header";
import { Container, Stack } from "@mui/material";

export default function DefaultLayout({ children }) {
  return (
    <Container maxWidth="xl">
      <Header />
      <Stack mx={8}>{children}</Stack>
    </Container>
  );
}
