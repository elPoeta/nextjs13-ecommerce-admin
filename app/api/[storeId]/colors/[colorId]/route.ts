import { db } from "@/db";
import { color } from "@/db/schema/color";
import { store } from "@/db/schema/store";
import { getAuthSession } from "@/lib/auth/auth-options";
import { FormColorSchemaValidator } from "@/lib/validators/formValidator";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (
  req: Request,
  { params }: { params: { colorId: string } }
) => {
  try {
    const colorDb = await db.query.color.findFirst({
      where: eq(color.id, params.colorId),
    });

    return NextResponse.json(colorDb);
  } catch (error) {
    console.log("[COLOR-GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) => {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.colorId) {
      return new NextResponse("color id is required", { status: 400 });
    }

    const storeByUser = await db.query.store.findFirst({
      where: and(
        eq(store.id, params.storeId),
        eq(store.userId, session.user.id)
      ),
    });

    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name, value } = FormColorSchemaValidator.parse(body);

    const colorUpdated = await db
      .update(color)
      .set({
        name,
        value,
      })
      .where(eq(color.id, params.colorId));

    return NextResponse.json(colorUpdated);
  } catch (error) {
    console.log("[COLOR-PATCH]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) => {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.colorId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeByUser = await db.query.store.findFirst({
      where: and(
        eq(store.id, params.storeId),
        eq(store.userId, session.user.id)
      ),
    });

    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    await db.delete(color).where(eq(color.id, params.colorId));
    return new NextResponse("Size deleted.");
  } catch (error) {
    console.log("[COLOR-DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
