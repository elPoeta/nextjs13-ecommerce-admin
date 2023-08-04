'use client'

import React, { FC, useEffect } from 'react'
import Navbar from '@/components/navbar/Navbar'
import { UseStoreModal, useStoreModal } from '@/hooks/use-store-modal'
import { User } from 'next-auth'

interface SetupProps {
  user: Pick<User, 'name' | 'image' | 'email'>
}

const Setup: FC<SetupProps> = ({ user }) => {
  const isOpen = useStoreModal((state: UseStoreModal) => state.isOpen);
  const onOpen = useStoreModal((state: UseStoreModal) => state.onOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])

  return (
    <div>
      <Navbar user={user} />
      Admin Dashboard
    </div>
  )
}

export default Setup