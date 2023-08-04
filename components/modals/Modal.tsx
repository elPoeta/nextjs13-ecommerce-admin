'use client'

import { FC, ReactNode } from "react"

interface ModalProps {
  title: string
  description: string
  isOpen: boolean
  onClose: () => void
  children?: ReactNode
}

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const Modal: FC<ModalProps> = ({ title, description, isOpen, onClose, children }) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Modal