import { db } from "@/db";
import { billboard } from "@/db/schema/billboard";
import { store } from "@/db/schema/store";
import { users } from "@/db/schema/users";
import { getAuthSession } from "@/lib/auth/auth-options";
import { FormBillboardSchemaValidator } from "@/lib/validators/formValidator";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (
  req: Request,
  { params }: { params: { billboardId: number } }
) => {
  try {
    const billboardDb = await db.query.billboard.findFirst({
      where: eq(billboard.id, params.billboardId),
    });

    return NextResponse.json(billboardDb);
  } catch (error) {
    console.log("[BILLBOARD-GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: number; billboardId: number } }
) => {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const storeByUser = await db.query.store.findFirst({
      where: and(
        eq(store.id, params.storeId),
        eq(users.id, Number(session.user.id))
      ),
    });

    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { label, imageUrl } = FormBillboardSchemaValidator.parse(body);

    const billboardUpdated = await db
      .update(billboard)
      .set({
        label,
        imageUrl,
      })
      .where(eq(billboard.id, params.billboardId));
    return NextResponse.json(billboardUpdated);
  } catch (error) {
    console.log("[BILLBOARDS-PATCH]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: number; billboardId: number } }
) => {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const storeByUser = await db.query.store.findFirst({
      where: and(
        eq(store.id, params.storeId),
        eq(users.id, Number(session.user.id))
      ),
    });

    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    await db.delete(billboard).where(eq(billboard.id, params.billboardId));
    return new NextResponse("Billboard deleted.");
  } catch (error) {
    console.log("[BILLBOARDS-DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
