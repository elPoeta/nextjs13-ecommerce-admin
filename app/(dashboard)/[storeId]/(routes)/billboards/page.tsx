import Billboard from '@/components/dashboard/billboard/Billboard'
import { db } from '@/db'
import { desc, eq } from 'drizzle-orm'
import React, { FC } from 'react'
import { format } from 'date-fns'
import { BillboardColumn } from '@/components/dashboard/billboard/columns'
import { billboard } from '@/db/schema/billboard'

interface billboardsPageProps {
  params: {
    storeId: string
  }
}
const BillboardsPage: FC<billboardsPageProps> = async ({ params }) => {
  const billboars = await db.query.billboard.findMany({
    where: eq(billboard.storeId, params.storeId),
    orderBy: [desc(billboard.createdAt)],
  });
  const formattedColumns: BillboardColumn[] = billboars.map(billboard => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Billboard billboardColumns={formattedColumns} />
      </div>
    </div>
  )
}

export default BillboardsPage