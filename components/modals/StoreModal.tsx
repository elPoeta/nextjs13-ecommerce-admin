'use client'

import React from 'react'
import Modal from '@/components/modals/Modal'
import { useStoreModal } from '@/hooks/use-store-modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

import { FormModalStoreSchema, FormModalStoreSchemaValidator } from '@/lib/validators/formValidator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { toast } from '@/hooks/use-toast'
import { Store } from '@/db/schema/store'

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  const form = useForm<FormModalStoreSchema>({
    resolver: zodResolver(FormModalStoreSchemaValidator),
    defaultValues: {
      name: ""
    }
  })

  const { mutate: addNewStore, isLoading } = useMutation({
    mutationFn: async ({ name }: FormModalStoreSchema) => {
      const payload: FormModalStoreSchema = { name }
      const { data } = await axios.post('/api/stores', payload)
      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: 'Store already taken.',
            description: 'Please choose a different name.',
            variant: 'destructive',
          })
        }
      }
      if (error instanceof z.ZodError) {
        return toast({
          title: 'There was an error.',
          description: error.message,
          variant: 'destructive',
        })
      }
      return toast({
        title: 'There was an error.',
        description: 'Could not add new store',
        variant: 'destructive',
      })
    },
    onSuccess: ({ id }: Store) => {
      console.log('data ', id)
      window.location.assign(`/${id}`)
    },
  })

  const onSubmit = async (values: FormModalStoreSchema) => {
    addNewStore(values)
  }

  return (
    <Modal
      title='Create Store'
      description='Add new store to manage products and categories'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className='space-y-4 py-2 pb-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} placeholder='E-Commerce' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                <Button disabled={isLoading} variant='outline' onClick={onClose}>Cancel</Button>
                <Button disabled={isLoading} type='submit'>Continue</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}

export default StoreModal