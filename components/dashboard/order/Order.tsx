import React, { FC } from 'react'
import { OrderColumn, columns } from './columns'
import Heading from '@/components/common/Heading';
import { Separator } from '@/components/ui/separator';

import { DataTable } from './data-table';

interface OrderProps {
  orderColumns: OrderColumn[]
}

const Order: FC<OrderProps> = ({ orderColumns }) => {
  return (
    <>
      <Heading
        title={`Orders (${orderColumns.length})`}
        description='Manage Orders for your store.'
      />
      <Separator />
      <DataTable columns={columns} data={orderColumns} searchKey='product' />
    </>
  )
}

export default Order;