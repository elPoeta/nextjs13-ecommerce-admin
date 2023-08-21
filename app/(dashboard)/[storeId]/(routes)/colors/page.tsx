
import { db } from '@/db'
import { desc, eq } from 'drizzle-orm'
import React, { FC } from 'react'
import { format } from 'date-fns'
import { SizeColumn } from '@/components/dashboard/size/columns'
import { size } from '@/db/schema/size'
import { color } from '@/db/schema/color'
import { ColorColumn } from '@/components/dashboard/color/columns'
import Color from '@/components/dashboard/color/Color'

interface ColorsPageProps {
  params: {
    storeId: string
  }
}
const ColorsPage: FC<ColorsPageProps> = async ({ params }) => {
  const colors = await db.query.color.findMany({
    where: eq(color.storeId, params.storeId),
    orderBy: [desc(size.createdAt)],
  });
  const formattedColumns: ColorColumn[] = colors.map(color => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Color colorColumns={formattedColumns} />
      </div>
    </div>
  )
}

export default ColorsPage