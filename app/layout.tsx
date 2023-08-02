import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

import Providers from '@/components/Providers'

import './globals.css'

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
      </body>
    </html>
  )
}
