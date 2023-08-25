import { db } from '@/db'
import { desc, eq } from 'drizzle-orm'
import React, { FC } from 'react'
import { format } from 'date-fns'
import { ProductColumn } from '@/components/dashboard/product/columns'
import { product } from '@/db/schema/product'
import Product from '@/components/dashboard/product/Product'
import { formatter } from '@/lib/utils'

interface ProductsPageProps {
  params: {
    storeId: string
  }
}
const ProductsPage: FC<ProductsPageProps> = async ({ params }) => {
  const products = await db.query.product.findMany({
    where: eq(product.storeId, params.storeId),
    with: {
      category: true,
      size: true,
      color: true
    },
    orderBy: [desc(product.createdAt)],
  });
  const formattedColumns: ProductColumn[] = products.map(product => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format(product.price),
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    createdAt: format(product.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Product productColumns={formattedColumns} />
      </div>
    </div>
  )
}

export default ProductsPage