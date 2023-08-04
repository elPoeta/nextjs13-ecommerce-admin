'use client'

import React, { FC } from 'react'
import { ModeToggle } from '@/components/ui/modeToggle'
import UserAccount from '@/components/user/UserAccount'
import { User } from 'next-auth'

interface NavbarProps {
  user: Pick<User, 'name' | 'image' | 'email'>
}

const Navbar: FC<NavbarProps> = ({ user }) => {
  return (
    <nav className='py-2 mb-2 border-b-2 w-full flex gap-5 items-center justify-end shadow-sm'>
      <ModeToggle />
      <UserAccount user={user} />
    </nav>
  )
}

export default Navbar