import Categories from '@/components/dashboard/category/Categories';
import { CategoryColumn } from '@/components/dashboard/category/columns';
import { db } from '@/db';
import { category } from '@/db/schema/category';
import { store } from '@/db/schema/store';
import { format } from 'date-fns';
import { desc, eq } from 'drizzle-orm';
import React, { FC } from 'react'

interface CategoriesPageProps {
  params: {
    storeId: number
  }
}

const CategoriesPage: FC<CategoriesPageProps> = async ({ params }) => {
  const categories = await db.query.category.findMany({
    where: eq(store.id, params.storeId),
    orderBy: [desc(category.createdAt)],
    with: {
      billboard: true
    }
  });
  const formattedColumns: CategoryColumn[] = categories.map(category => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Categories categoryColumns={formattedColumns} />
      </div>
    </div>
  )


}

export default CategoriesPage