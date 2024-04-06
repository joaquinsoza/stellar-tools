"use client";

import MySorobanReactProvider from "@/components/SorobanContextProvider";
import { ChakraProvider } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MySorobanReactProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </MySorobanReactProvider>
  );
}
