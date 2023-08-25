'use client'

import React, { FC } from 'react'
import { Plus } from 'lucide-react'

import Heading from '@/components/common/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRouter, useParams } from 'next/navigation'
import { DataTable } from './data-table'
import ApiList from '@/components/common/ApiList'
import { ProductColumn, columns } from './columns'

interface ProductProps {
  productColumns: ProductColumn[];
}

const Product: FC<ProductProps> = ({ productColumns }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Products (${productColumns.length})`}
          description='Manage Products for your store.'
        />
        <Button onClick={() => { router.push(`/${params.storeId}/products/new`) }}>
          <Plus className='h-4 w-4 mr-2' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={productColumns} searchKey='label' />
      <Heading title='API' description='API calls from products' />
      <Separator />
      <ApiList entityName='products' entityIdName='productId' />
    </>
  )
}

export default Product