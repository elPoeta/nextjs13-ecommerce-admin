'use client'

import React, { FC } from 'react'
import { Plus } from 'lucide-react'

import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRouter, useParams } from 'next/navigation'
import { BillboardColumn, columns } from '@/components/dashboard/billboard/columns'
import { DataTable } from './data-table'
import ApiList from '@/components/common/ApiList'

interface BillboardProps {
  billboardColumns: BillboardColumn[];
}

const Billboard: FC<BillboardProps> = ({ billboardColumns }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Billboards (${billboardColumns.length})`}
          description='Manage Billboards for your store.'
        />
        <Button onClick={() => { router.push(`/${params.storeId}/billboards/new`) }}>
          <Plus className='h-4 w-4 mr-2' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={billboardColumns} searchKey='label' />
      <Heading title='API' description='API calls from billboards' />
      <Separator />
      <ApiList entityName='billboards' entityIdName='billboardId' />
    </>
  )
}

export default Billboard