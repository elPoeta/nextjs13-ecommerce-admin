"use client"

import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"

export const BillboardColumnSchema = z.object({
  id: z.number(),
  label: z.string(),
  createdAt: z.string()

})

export type BillboardColumn = z.infer<typeof BillboardColumnSchema>

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },

]
