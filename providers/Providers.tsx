'use client'

import { FC } from "react";
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { ClientOnlyProvider } from "@/providers/ClientOnlyProvider";
import StoreModal from "@/components/modals/StoreModal";

const Providers: FC<ThemeProviderProps> = ({ children, ...props }) => {
  return (
    <ClientOnlyProvider>
      <NextThemesProvider {...props}>
        <SessionProvider>
          <StoreModal />
          {children}
        </SessionProvider>
      </NextThemesProvider>
    </ClientOnlyProvider>
  )
}

export default Providers
