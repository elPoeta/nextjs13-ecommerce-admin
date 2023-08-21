'use client'

import React, { FC, useState } from 'react'
import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { FormColorSchema, FormColorSchemaValidator } from '@/lib/validators/formValidator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { toast } from '@/hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '../../modals/AlertModal'

import axios from 'axios'
import { Color } from '@/db/schema/color'


interface ColorFormProps {
  color: Color | undefined;
}

const ColorForm: FC<ColorFormProps> = ({ color }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<FormColorSchema>({
    resolver: zodResolver(FormColorSchemaValidator),
    defaultValues: color || {
      name: "",
      value: ""
    }
  })

  const params = useParams();
  const router = useRouter();

  const title = color ? 'Edit color' : 'Create color'
  const description = color ? 'Edit a color.' : 'Add a new color.'
  const toastMessage = color ? 'Color edited.' : 'Size created.'
  const toastErrorMessage = color ? 'Could not update color.' : 'Could not create color.'
  const action = color ? 'Save changes' : 'Create'

  const { mutate: createOrUpdateColor, isLoading } = useMutation({
    mutationFn: async (payload: FormColorSchema) => {
      const { data } = color ? await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, payload) : await axios.post(`/api/${params.storeId}/colors`, payload)
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
      router.push(`/${params.storeId}/colors`)
    },
  })


  const { mutate: deleteColor, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
      return data
    },
    onError: () => {
      return toast({
        title: 'There was an error.',
        description: 'Could not delete color. Remove Products first.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      setIsOpen(false)
      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast({
        description: 'Your color has been deleted',
        variant: 'destructive'
      })
    },
  })

  const onSubmit = (e: FormColorSchema) => {
    createOrUpdateColor(e)
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        loading={isLoadingDelete}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          deleteColor()
        }}
      />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {color &&
          <Button variant='destructive' color='icon' onClick={() => { setIsOpen(true) }}>
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
                      placeholder='Color Name'
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
                    {/* <div className='flex items-center gap-x-4'> */}
                    <div className="h-10 w-20 rounded-full border flex items-center">

                      <Input
                        type="color"
                        disabled={isLoading}
                        placeholder='Color Value'
                        {...field}
                      />
                    </div>
                    {/* <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: field.value }} /> */}
                    {/* </div> */}
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

export default ColorForm