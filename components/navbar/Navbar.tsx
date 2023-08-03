import React from 'react'
import { ModeToggle } from '@/components/ui/modeToggle'
import { getAuthSession } from '@/lib/auth/auth-options'
import UserAccount from '@/components/user/UserAccount'

const Navbar = async () => {
  const session = await getAuthSession()
  return (
    <nav className='py-2 mb-2 border-b-2 w-full flex gap-5 items-center justify-end shadow-sm'>
      <ModeToggle />
      <UserAccount user={session!.user} />
    </nav>
  )
}

export default Navbar