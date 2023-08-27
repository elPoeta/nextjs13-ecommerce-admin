'use client'

import React, { FC, useState } from 'react'
import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { FormProductSchema, FormProductSchemaValidator } from '@/lib/validators/formValidator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { toast } from '@/hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '../../modals/AlertModal'

import { Product } from '@/db/schema/product'
import axios from 'axios'
import { Image } from '@/db/schema/image'
import ImageUpload from '@/components/common/ImageUpload'
import { Category } from '@/db/schema/category'
import { Color } from '@/db/schema/color'
import { Size } from '@/db/schema/size'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'



interface ProductFormProps {
  product: Product & { images: Image[] } | undefined;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

const ProductForm: FC<ProductFormProps> = ({ product, categories, colors, sizes }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<FormProductSchema>({
    resolver: zodResolver(FormProductSchemaValidator),
    defaultValues: product || {
      name: "",
      price: 0.0,
      categoryId: "",
      sizeId: "",
      colorId: "",
      isFeatured: false,
      isArchived: false,
      images: []
    }
  })

  const params = useParams();
  const router = useRouter();

  const title = product ? 'Edit product' : 'Create product'
  const description = product ? 'Edit a product.' : 'Add a new product.'
  const toastMessage = product ? 'Product edited.' : 'Product created.'
  const toastErrorMessage = product ? 'Could not update product.' : 'Could not create product.'
  const action = product ? 'Save changes' : 'Create'

  const { mutate: createOrUpdateProduct, isLoading } = useMutation({
    mutationFn: async (payload: FormProductSchema) => {
      const { data } = product ? await axios.patch(`/api/${params.storeId}/products/${params.productId}`, payload) : await axios.post(`/api/${params.storeId}/products`, payload)
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
      router.push(`/${params.storeId}/products`)
    },
  })


  const { mutate: deleteProduct, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      return data
    },
    onError: () => {
      return toast({
        title: 'There was an error.',
        description: 'Could not delete product. Something went wrong.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      setIsOpen(false)
      router.refresh()
      router.push(`/${params.storeId}/products`)
      toast({
        description: 'Your product has been deleted',
        variant: 'destructive'
      })
    },
  })

  const onSubmit = (e: FormProductSchema) => {
    createOrUpdateProduct(e)
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        loading={isLoadingDelete}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          deleteProduct()
        }}
      />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {product &&
          <Button variant='destructive' size='icon' onClick={() => { setIsOpen(true) }}>
            <Trash className='h-4 w-4' />
          </Button>}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <FormField
            name='images'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    values={field.value.map(image => image.url)}
                    disabled={isLoading}
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) => field.onChange([...field.value.filter(image => image.url !== url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      placeholder='Product Name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='price'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      disabled={isLoading}
                      placeholder='9.99'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='categoryId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='sizeId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a size' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem
                          key={size.id}
                          value={size.id}
                        >
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='colorId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a color' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem
                          key={color.id}
                          value={color.id}
                        >
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='isFeatured'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y1 leading-none'>
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name='isArchived'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y1 leading-none'>
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store
                    </FormDescription>
                  </div>
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

export default ProductForm