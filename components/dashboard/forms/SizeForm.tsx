'use client'

import React, { FC, useState } from 'react'
import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { FormSizeSchema, FormSizeSchemaValidator } from '@/lib/validators/formValidator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { toast } from '@/hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '../../modals/AlertModal'

import axios from 'axios'
import { Size } from '@/db/schema/size'


interface SizeFormProps {
  size: Size | undefined;
}

const SizeForm: FC<SizeFormProps> = ({ size }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<FormSizeSchema>({
    resolver: zodResolver(FormSizeSchemaValidator),
    defaultValues: size || {
      name: "",
      value: ""
    }
  })

  const params = useParams();
  const router = useRouter();

  const title = size ? 'Edit size' : 'Create size'
  const description = size ? 'Edit a size.' : 'Add a new size.'
  const toastMessage = size ? 'Billboard edited.' : 'Billboard created.'
  const toastErrorMessage = size ? 'Could not update size.' : 'Could not create size.'
  const action = size ? 'Save changes' : 'Create'

  const { mutate: createOrUpdateSize, isLoading } = useMutation({
    mutationFn: async (payload: FormSizeSchema) => {
      const { data } = size ? await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, payload) : await axios.post(`/api/${params.storeId}/sizes`, payload)
      return data
    },
    onError: (error) => {
      return toast({
        title: 'There was an error.',
        description: toastErrorMessage,
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        description: toastMessage
      })
      router.refresh()
      router.push(`/${params.storeId}/sizes`)
    },
  })


  const { mutate: deleteSize, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/${params.storeId}/billboards/${params.sizeId}`)
      return data
    },
    onError: () => {
      return toast({
        title: 'There was an error.',
        description: 'Could not delete size. Remove Products first.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      setIsOpen(false)
      router.refresh()
      router.push(`/${params.storeId}/sizes`)
      toast({
        description: 'Your size has been deleted',
        variant: 'destructive'
      })
    },
  })

  const onSubmit = (e: FormSizeSchema) => {
    createOrUpdateSize(e)
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        loading={isLoadingDelete}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          deleteSize()
        }}
      />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {size &&
          <Button variant='destructive' size='icon' onClick={() => { setIsOpen(true) }}>
            <Trash className='h-4 w-4' />
          </Button>}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>

          <div className='grid grid-cols-3 gap-8'>
            <FormField
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='Size Name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='value'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='Size Value'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isLoading}
            className='ml-auto'
            type='submit'
          >{action}</Button>
        </form>
      </Form>
      <Separator />

    </>
  )
}

export default SizeForm