'use client'

import { UseStoreModal, useStoreModal } from "@/hooks/use-store-modal"
import { useEffect } from "react"


const HomePage = () => {

  const isOpen = useStoreModal((state: UseStoreModal) => state.isOpen);
  const onOpen = useStoreModal((state: UseStoreModal) => state.onOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])

  return null;
}

export default HomePage
