'use client'

import { FC } from "react";
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { ClientOnlyProvider } from "@/providers/ClientOnlyProvider";
import StoreModal from "@/components/modals/StoreModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Providers: FC<ThemeProviderProps> = ({ children, ...props }) => {
  const queryClient = new QueryClient();
  return (
    <ClientOnlyProvider>
      <NextThemesProvider {...props}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <StoreModal />
            {children}
          </SessionProvider>
        </QueryClientProvider>
      </NextThemesProvider>
    </ClientOnlyProvider>
  )
}

export default Providers
