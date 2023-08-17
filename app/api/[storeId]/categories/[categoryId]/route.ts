import { db } from "@/db";
import { category } from "@/db/schema/category";
import { store } from "@/db/schema/store";
import { users } from "@/db/schema/users";
import { getAuthSession } from "@/lib/auth/auth-options";
import { FormCategorySchemaValidator } from "@/lib/validators/formValidator";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (
  req: Request,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const categoryDb = await db.query.category.findFirst({
      where: eq(category.id, params.categoryId),
    });

    return NextResponse.json(categoryDb);
  } catch (error) {
    console.log("[CATEGORY-GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) => {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const storeByUser = await db.query.store.findFirst({
      where: and(eq(store.id, params.storeId), eq(users.id, session.user.id)),
    });

    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name, billboardId } = FormCategorySchemaValidator.parse(body);

    const categoryUpdated = await db
      .update(category)
      .set({
        name,
        billboardId: billboardId,
      })
      .where(eq(category.id, params.categoryId));
    return NextResponse.json(categoryUpdated);
  } catch (error) {
    console.log("[CATEGORY-PATCH]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) => {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const storeByUser = await db.query.store.findFirst({
      where: and(eq(store.id, params.storeId), eq(users.id, session.user.id)),
    });

    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    await db.delete(category).where(eq(category.id, params.categoryId));
    return new NextResponse("Category deleted.");
  } catch (error) {
    console.log("[CATEGORY-DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
