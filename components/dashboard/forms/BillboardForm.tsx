'use client'

import React, { FC, useState } from 'react'
import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { FormBillboardSchema, FormBillboardSchemaValidator } from '@/lib/validators/formValidator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { toast } from '@/hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '../../modals/AlertModal'

import { Billboard } from '@/db/schema/billboard'
import axios from 'axios'
import ImageUpload from '@/components/common/ImageUpload'


interface BillboardFormProps {
  billboard: Billboard | undefined;
}

const BillboardForm: FC<BillboardFormProps> = ({ billboard }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<FormBillboardSchema>({
    resolver: zodResolver(FormBillboardSchemaValidator),
    defaultValues: billboard || {
      label: "",
      imageUrl: ""
    }
  })

  const params = useParams();
  const router = useRouter();

  const title = billboard ? 'Edit billboard' : 'Create billboard'
  const description = billboard ? 'Edit a billboard.' : 'Add a new billboard.'
  const toastMessage = billboard ? 'Billboard edited.' : 'Billboard created.'
  const toastErrorMessage = billboard ? 'Could not update billboard.' : 'Could not create billboard.'
  const action = billboard ? 'Save changes' : 'Create'

  const { mutate: createOrUpdateBillboard, isLoading } = useMutation({
    mutationFn: async (payload: FormBillboardSchema) => {
      const { data } = billboard ? await axios.patch(`/api/${params.storeId}/billboards`, payload) : await axios.post(`/api/${params.storeId}/billboards`, payload)
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
      router.push(`/${params.storeId}/billboards`)
    },
  })


  const { mutate: deleteBillboard, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
      return data
    },
    onError: () => {
      return toast({
        title: 'There was an error.',
        description: 'Could not delete billboard. Remove Categories first.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      setIsOpen(false)
      router.refresh()
      router.push('/')
      toast({
        description: 'Your billboard has been deleted',
        variant: 'destructive'
      })
    },
  })

  const onSubmit = (e: FormBillboardSchema) => {
    createOrUpdateBillboard(e)
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        loading={isLoadingDelete}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          deleteBillboard()
        }}
      />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {billboard &&
          <Button variant='destructive' size='icon' onClick={() => { setIsOpen(true) }}>
            <Trash className='h-4 w-4' />
          </Button>}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <FormField
            name='imageUrl'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    values={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              name='label'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='Billboard Label'
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

export default BillboardForm