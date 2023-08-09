'use client'

import { Store } from '@/db/schema/store'
import React, { FC } from 'react'
import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { FormModalStoreSchema, FormModalStoreSchemaValidator } from '@/lib/validators/formValidator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface SettingsFormProps {
  store: Store
}

const SettingsForm: FC<SettingsFormProps> = ({ store }) => {
  const form = useForm<FormModalStoreSchema>({
    resolver: zodResolver(FormModalStoreSchemaValidator),
    defaultValues: store
  })

  const router = useRouter();

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

  const onSubmit = (e: FormModalStoreSchema) => {
    updateStoreName(e)
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title='Settings' description='Manage store preferences' />
        <Button variant='destructive' size='icon' onClick={() => { }}>
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

    </>
  )
}

export default SettingsForm