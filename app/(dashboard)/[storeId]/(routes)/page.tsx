import { db } from "@/db";
import { store } from "@/db/schema/store";
import { eq } from "drizzle-orm";
import { FC } from "react"

interface DashboardPageProps {
  params: {
    storeId: number
  }
}

const DashboardPage: FC<DashboardPageProps> = async ({ params }) => {
  const { storeId } = params;
  const storeDb = await db.query.store.findFirst({
    where: eq(store.id, storeId)
  })

  return (
    <div>
      Active store: {storeDb?.name}
    </div>
  )
}

export default DashboardPage