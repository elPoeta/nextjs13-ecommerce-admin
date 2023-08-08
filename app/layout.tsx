import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

import Providers from '@/providers/Providers'

import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { getAuthSession } from '@/lib/auth/auth-options'
import Navbar from '@/components/navbar/Navbar'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard Admin Store',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuthSession();
  return (
    <html lang="en">
      <body className={nunito.className}>
        <Providers attribute="class" defaultTheme="system" enableSystem >
          <Navbar user={session?.user} role={session?.user ? session.user.role : 'user'} />
          <main className='container'>
            {children}
          </main>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
