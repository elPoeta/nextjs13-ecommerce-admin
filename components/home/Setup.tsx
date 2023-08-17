'use client'

import { useEffect } from 'react'

import { UseStoreModal, useStoreModal } from '@/hooks/use-store-modal'
import { User } from 'next-auth'

interface SetupProps {
  user: Pick<User, 'name' | 'image' | 'email'>
}

const Setup = () => {
  const isOpen = useStoreModal((state: UseStoreModal) => state.isOpen);
  const onOpen = useStoreModal((state: UseStoreModal) => state.onOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])

  return null;
}

export default Setup