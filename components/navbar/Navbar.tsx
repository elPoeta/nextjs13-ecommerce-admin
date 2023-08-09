'use client'

import React, { FC } from 'react'
import { ModeToggle } from '@/components/ui/modeToggle'
import UserAccount from '@/components/user/UserAccount'
import { User } from 'next-auth'
import { UserRole } from '@/types/next-auth'

interface NavbarProps {
  user?: Pick<User, 'name' | 'image' | 'email'>
  role: UserRole
}

const Navbar: FC<NavbarProps> = ({ user, role }) => {
  if (!user || role === 'user') {
    return null
  }

  return (
    <div className='flex items-center justify-between py-2 px-5 mb-2 border-b-2 w-full'>
      <h1 className='font-bold text-2xl'>Admin Dashboard</h1>
      <nav className='flex gap-5 items-center justify-end shadow-sm'>
        <ModeToggle />
        <UserAccount user={user} />
      </nav>
    </div>
  )
}

export default Navbar