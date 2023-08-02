'use client'

import { FC } from "react";
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import ClientOnly from "./ClientOnly";

const Providers: FC<ThemeProviderProps> = ({ children, ...props }) => {
  return (
    <ClientOnly>
      <NextThemesProvider {...props}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </NextThemesProvider>
    </ClientOnly>
  )
}

export default Providers
