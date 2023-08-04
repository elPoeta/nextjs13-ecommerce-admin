'use client'

import React from 'react'
import Modal from '@/components/modals/Modal'
import { useStoreModal } from '@/hooks/use-store-modal'

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  return (
    <Modal
      title='Create Store'
      description='Add new store to manage products and categories'
      isOpen={isOpen}
      onClose={onClose}
    >
      Form here...
    </Modal>
  )
}

export default StoreModal