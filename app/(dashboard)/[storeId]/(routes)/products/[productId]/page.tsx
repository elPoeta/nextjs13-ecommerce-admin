import ProductForm from '@/components/dashboard/forms/ProductForm'
import { db } from '@/db'
import { category } from '@/db/schema/category'
import { color } from '@/db/schema/color'
import { product } from '@/db/schema/product'
import { size } from '@/db/schema/size'
import { eq } from 'drizzle-orm'
import React, { FC } from 'react'

interface ProductPageProps {
  params: {
    productId: string
    storeId: string
  }
}

const ProductPage: FC<ProductPageProps> = async ({ params: { productId, storeId } }) => {
  const productDb = productId !== 'new' ? await db.query.product.findFirst({
    where: eq(product.id, productId),
    with: {
      images: true
    }
  }) : undefined

  const categories = await db.query.category.findMany({
    where: eq(category.storeId, storeId)
  })

  const colors = await db.query.color.findMany({
    where: eq(color.storeId, storeId)
  })

  const sizes = await db.query.size.findMany({
    where: eq(size.storeId, storeId)
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductForm product={productDb} categories={categories} sizes={sizes} colors={colors} />
      </div>
    </div>
  )
}

export default ProductPage