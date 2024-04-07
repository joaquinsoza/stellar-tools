"use client";

import MySorobanReactProvider from "@/components/SorobanContextProvider";
import theme from "@/theme";
import { ChakraProvider } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MySorobanReactProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </MySorobanReactProvider>
  );
}
