import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { PropsWithChildren, useState } from "react";
import { theme } from "./theme";

export const Providers = ({ children }: PropsWithChildren) => {
  const [client] = useState(() => new QueryClient());
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
};
