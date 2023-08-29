import { db } from '@/db'
import { desc, eq } from 'drizzle-orm'
import React, { FC } from 'react'
import { format } from 'date-fns'

import { order } from '@/db/schema/order'
import { formatter } from '@/lib/utils'


interface OrdersPageProps {
  params: {
    storeId: string
  }
}
const OrdersPage: FC<OrdersPageProps> = async ({ params }) => {
  const orders = await db.query.order.findMany({
    where: eq(order.storeId, params.storeId),
    orderBy: [desc(order.createdAt)],
    with: {
      orderItems: {
        with: {
          product: true,
        },
      },
    }
    // with: {
    //   orderItems: {
    //     columns: {
    //       orderId: false,
    //       productId: false,
    //     },
    //     with: {
    //       product: {
    //         columns: {
    //           id: true,
    //           name: true,
    //           price: true
    //         },
    //       },
    //     },
    //   }
    // }
  });

  const formattedColumns = orders.map(order => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map((orderItem) => orderItem.product.name).join(", "),
    totalPrice: formatter.format(order.orderItems.reduce((total, item) => {
      return total + item.product.price;
    }, 0)),
    createdAt: format(order.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        Orders
      </div>
    </div>
  )
}

export default OrdersPage