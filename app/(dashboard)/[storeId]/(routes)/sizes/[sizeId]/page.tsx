import { db } from '@/db'
import { size } from '@/db/schema/size'
import { eq } from 'drizzle-orm'
import React, { FC } from 'react'
import SizeForm from '@/components/dashboard/forms/SizeForm'

interface SizePageProps {
  params: {
    sizeId: string
  }
}

const SizePage: FC<SizePageProps> = async ({ params: { sizeId } }) => {
  const sizeDb = sizeId !== 'new' ? await db.query.size.findFirst({
    where: eq(size.id, sizeId)
  }) : undefined


  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeForm size={sizeDb} />
      </div>
    </div>
  )
}

export default SizePage