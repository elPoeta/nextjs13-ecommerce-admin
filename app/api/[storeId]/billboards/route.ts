import { db } from "@/db";
import { billboard } from "@/db/schema/billboard";
import { store } from "@/db/schema/store";
import { users } from "@/db/schema/users";
import { getAuthSession } from "@/lib/auth/auth-options";
import { FormBillboardSchemaValidator } from "@/lib/validators/formValidator";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUser = await db.query.store.findFirst({
      where: and(eq(store.id, params.storeId), eq(users.id, session.user.id)),
    });

    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { label, imageUrl } = FormBillboardSchemaValidator.parse(body);

    const newBillboard = await db.insert(billboard).values({
      label,
      imageUrl,
      storeId: params.storeId,
    });

    return NextResponse.json(newBillboard);
  } catch (error) {
    console.log("[BILLBOARDS-POST]", error);
    if (error instanceof ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const billboards = await db.query.billboard.findMany({
      where: eq(store.id, params.storeId),
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS-GET]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
};
