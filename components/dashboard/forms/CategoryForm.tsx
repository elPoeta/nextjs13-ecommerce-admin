'use client'

import React, { FC, useState } from 'react'
import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { FormCategorySchema, FormCategorySchemaValidator } from '@/lib/validators/formValidator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { toast } from '@/hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '../../modals/AlertModal'

import { Category } from '@/db/schema/category'
import axios from 'axios'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Billboard } from '@/db/schema/billboard'


interface BillboardOverride extends Omit<Billboard, 'id'> {
  id: string
}

interface CategoryOverride extends Omit<Category, 'billboardId'> {
  billboardId: string
}

interface CategoFormProps {
  category: CategoryOverride | undefined;
  billboards: BillboardOverride[]
}

const CategoryForm: FC<CategoFormProps> = ({ category, billboards }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<FormCategorySchema>({
    resolver: zodResolver(FormCategorySchemaValidator),
    defaultValues: category || {
      name: "",
      billboardId: ""
    }
  })

  const params = useParams();
  const router = useRouter();

  const title = category ? 'Edit category' : 'Create category'
  const description = category ? 'Edit a category.' : 'Add a new category.'
  const toastMessage = category ? 'Billboard edited.' : 'Billboard created.'
  const toastErrorMessage = category ? 'Could not update category.' : 'Could not create category.'
  const action = category ? 'Save changes' : 'Create'

  const { mutate: createOrUpdateCategory, isLoading } = useMutation({
    mutationFn: async (payload: FormCategorySchema) => {
      console.log('PAYLOAD ', payload)
      const { data } = category ? await axios.patch(`/api/${params.storeId}/categories`, payload) : await axios.post(`/api/${params.storeId}/categories`, payload)
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
      router.push(`/${params.storeId}/categories`)
    },
  })


  const { mutate: deleteCategpry, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
      return data
    },
    onError: () => {
      return toast({
        title: 'There was an error.',
        description: 'Could not delete category. Remove Products first.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      setIsOpen(false)
      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast({
        description: 'Your category has been deleted',
        variant: 'destructive'
      })
    },
  })

  const onSubmit = (e: FormCategorySchema) => {
    // const payload: FormCategorySchema = { name: e.name, billboardId: Number(e.billboardId) }
    createOrUpdateCategory(e)
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        loading={isLoadingDelete}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          deleteCategpry()
        }}
      />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {category &&
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
                      placeholder='Category name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='billboardId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a billboard' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem
                          key={billboard.id}
                          value={billboard.id}
                        >
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm