"use client"

import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"

export const OrderColumnSchema = z.object({
  id: z.string(),
  address: z.string(),
  phone: z.string(),
  isPaid: z.boolean(),
  totalPrice: z.string(),
  products: z.string(),
  createdAt: z.string()

})

export type OrderColumn = z.infer<typeof OrderColumnSchema>

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "Address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  }
]
