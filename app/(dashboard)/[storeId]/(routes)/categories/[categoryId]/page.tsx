
import CategoryForm from '@/components/dashboard/forms/CategoryForm'
import { db } from '@/db'
import { billboard } from '@/db/schema/billboard'
import { category } from '@/db/schema/category'
import { store } from '@/db/schema/store'

import { eq } from 'drizzle-orm'
import React, { FC } from 'react'

interface CategoryPageProps {
  params: {
    categoryId: number
    storeId: number
  }
}

const CategoryPage: FC<CategoryPageProps> = async ({ params: { categoryId, storeId } }) => {
  const categoryDb = await db.query.category.findFirst({
    where: eq(category.id, categoryId)
  })

  const billboards = await db.query.billboard.findMany({
    where: eq(store.id, storeId)
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryForm category={categoryDb} billboards={billboards} />
      </div>
    </div>
  )
}

export default CategoryPage