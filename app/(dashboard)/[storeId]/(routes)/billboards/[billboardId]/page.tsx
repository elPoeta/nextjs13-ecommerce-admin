import BillboardForm from '@/components/dashboard/forms/BillboardForm'
import { db } from '@/db'
import { Billboard, billboard } from '@/db/schema/billboard'
import { eq } from 'drizzle-orm'
import React, { FC } from 'react'

interface BillboardPageProps {
  params: {
    billboardId: number
  }
}

const BillboardPage: FC<BillboardPageProps> = async ({ params: { billboardId } }) => {
  const billboardDb = await db.query.billboard.findFirst({
    where: eq(billboard.id, billboardId)
  })


  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardForm billboard={billboardDb} />
      </div>
    </div>
  )
}

export default BillboardPage