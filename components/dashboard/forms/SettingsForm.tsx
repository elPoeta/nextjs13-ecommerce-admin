'use client'

import { Store } from '@/db/schema/store'
import React, { FC, useState } from 'react'
import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { FormModalStoreSchema, FormModalStoreSchemaValidator } from '@/lib/validators/formValidator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import AlertModal from '../../modals/AlertModal'
import ApiAlert from '../../common/ApiAlert'
import { useOrigin } from '@/hooks/use-origin'

interface SettingsFormProps {
  store: Store
}

const SettingsForm: FC<SettingsFormProps> = ({ store }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<FormModalStoreSchema>({
    resolver: zodResolver(FormModalStoreSchemaValidator),
    defaultValues: store
  })

  const router = useRouter();
  const origin = useOrigin();

  const { mutate: updateStoreName, isLoading } = useMutation({
    mutationFn: async (payload: FormModalStoreSchema) => {
      const { data } = await axios.patch(`/api/stores/${store.id}`, payload)
      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: 'Store name already taken.',
            description: 'Please choose a different store name.',
            variant: 'destructive',
          })
        }
      }
      return toast({
        title: 'There was an error.',
        description: 'Could not update store.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        description: 'Your store has been updated'
      })
      router.refresh()
    },
  })


  const { mutate: deleteStore, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/stores/${store.id}`)
      return data
    },
    onError: () => {
      return toast({
        title: 'There was an error.',
        description: 'Could not delete store.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      setIsOpen(false)
      router.refresh()
      router.push('/')
      toast({
        description: 'Your store has been deleted',
        variant: 'destructive'
      })
    },
  })

  const onSubmit = (e: FormModalStoreSchema) => {
    updateStoreName(e)
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        loading={isLoadingDelete}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          deleteStore()
        }}
      />
      <div className='flex items-center justify-between'>
        <Heading title='Settings' description='Manage store preferences' />
        <Button variant='destructive' size='icon' onClick={() => { setIsOpen(true) }}>
          <Trash className='h-4 w-4' />
        </Button>
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
                      placeholder='Store name'
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
          >Save changes</Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert title='NEXT_PUBLIC_API_URL' description={`${origin}/api/${store.id}`} variant='public' />
    </>
  )
}

export default SettingsForm