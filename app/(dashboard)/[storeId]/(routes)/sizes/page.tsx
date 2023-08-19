
import { db } from '@/db'
import { desc, eq } from 'drizzle-orm'
import React, { FC } from 'react'
import { format } from 'date-fns'
import { SizeColumn } from '@/components/dashboard/size/columns'
import { size } from '@/db/schema/size'
import Size from '@/components/dashboard/size/Size'

interface SizesPageProps {
  params: {
    storeId: string
  }
}
const SizesPage: FC<SizesPageProps> = async ({ params }) => {
  const sizes = await db.query.size.findMany({
    where: eq(size.storeId, params.storeId),
    orderBy: [desc(size.createdAt)],
  });
  const formattedColumns: SizeColumn[] = sizes.map(size => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Size sizeColumns={formattedColumns} />
      </div>
    </div>
  )
}

export default SizesPage