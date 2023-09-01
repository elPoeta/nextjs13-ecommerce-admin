import { db } from "@/db";
import { category } from "@/db/schema/category";
import { store } from "@/db/schema/store";
import { getAuthSession } from "@/lib/auth/auth-options";
import { FormCategorySchemaValidator } from "@/lib/validators/formValidator";
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
      where: and(
        eq(store.id, params.storeId),
        eq(store.userId, session.user.id)
      ),
    });

    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name, billboardId } = FormCategorySchemaValidator.parse(body);

    const newCategory = await db.insert(category).values({
      name,
      billboardId,
      storeId: params.storeId,
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.log("[CATEGORY-POST]", error);
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

    const categories = await db.query.category.findMany({
      where: eq(category.storeId, params.storeId),
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORY-GET]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
};
