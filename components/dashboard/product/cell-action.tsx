'use client'

import React, { FC, useState } from 'react'
import { ProductColumn } from './columns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import AlertModal from '@/components/modals/AlertModal'

interface CellActionProps {
  data: ProductColumn
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onCopy = async (id: string) => {
    await navigator.clipboard.writeText(id)
    toast({
      title: 'ID copied to the clipboard.',
      variant: 'default'
    })
  }

  const router = useRouter();
  const params = useParams();

  const { mutate: deleteProduct, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/${params.storeId}/products/${id}`)
      return data
    },
    onError: () => {
      return toast({
        title: 'There was an error.',
        description: 'Could not delete product. Remove Categories first.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      setIsOpen(false)
      router.refresh()
      toast({
        description: 'Your product has been deleted',
        variant: 'destructive'
      })
    },
  })

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        loading={isLoadingDelete}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          deleteProduct(data.id)
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id.toString())}>
            <Copy className='mr-2 h-4 w-4' />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>
            <Edit className='mr-2 h-4 w-4' />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Trash className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CellAction