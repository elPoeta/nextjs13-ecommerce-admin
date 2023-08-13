import { db } from "@/db";
import { store } from "@/db/schema/store";
import { getAuthSession } from "@/lib/auth/auth-options";
import { FormModalStoreSchemaValidator } from "@/lib/validators/formValidator";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: number } }
) => {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    const body = await req.json();
    const { name } = FormModalStoreSchemaValidator.parse(body);

    await db
      .update(store)
      .set({
        name,
      })
      .where(eq(store.id, params.storeId));

    return new NextResponse("Store updated");
  } catch (error) {
    console.log("[STORE-PATCH]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  _req: Request,
  { params }: { params: { storeId: number } }
) => {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    await db.delete(store).where(eq(store.id, params.storeId));

    return new NextResponse("Store deleted");
  } catch (error) {
    console.log("[STORE-DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
