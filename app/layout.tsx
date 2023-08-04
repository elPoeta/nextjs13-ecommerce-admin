import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

import Providers from '@/providers/Providers'

import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard Admin Store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <Providers attribute="class" defaultTheme="system" enableSystem >
          <main className='container'>
            {children}
          </main>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
