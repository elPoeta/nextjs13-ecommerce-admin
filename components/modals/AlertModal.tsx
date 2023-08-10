'use client'

import React, { FC } from 'react'
import Modal from './Modal';
import { Button } from '../ui/button';

interface AlertModalProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertModal: FC<AlertModalProps> = ({ isOpen, loading, onConfirm, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      title='Are you sure ?'
      description='This action can not be undone.'
      onClose={onClose}
    >
      <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
        <Button disabled={loading} variant='outline' onClick={onClose}>Cancel</Button>
        <Button disabled={loading} variant='destructive' onClick={onConfirm}>Confirm</Button>
      </div>
    </Modal>
  )
}

export default AlertModal