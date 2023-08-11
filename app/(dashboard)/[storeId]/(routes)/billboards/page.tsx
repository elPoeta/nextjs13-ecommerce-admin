import Billboard from '@/components/dashboard/Billboard'
import React from 'react'

const BillboardsPage = () => {
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Billboard />
      </div>
    </div>
  )
}

export default BillboardsPage