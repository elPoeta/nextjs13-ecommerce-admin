import { db } from "@/db";
import { Image, image } from "@/db/schema/image";
import { product } from "@/db/schema/product";
import { store } from "@/db/schema/store";
import { getAuthSession } from "@/lib/auth/auth-options";
import { FormProductSchemaValidator } from "@/lib/validators/formValidator";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (
  req: Request,
  { params }: { params: { productId: string } }
) => {
  try {
    const productDb = await db.query.product.findFirst({
      where: eq(product.id, params.productId),
      with: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(productDb);
  } catch (error) {
    console.log("[PRODUCT-GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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
    const {
      name,
      price,
      categoryId,
      isArchived,
      isFeatured,
      colorId,
      sizeId,
      images,
    } = FormProductSchemaValidator.parse(body);
    const productId = params.productId;
    let result: { productId: string }[] = [];
    const imagesToInsert: Pick<Image, "url" | "productId">[] = images.map(
      (imageUrl) => ({
        url: imageUrl.url,
        productId,
      })
    );
    const tx = await db.transaction(async (tx) => {
      await db.delete(image).where(eq(image.productId, productId));
      result = await db
        .update(product)
        .set({
          name,
          price,
          categoryId,
          sizeId,
          colorId,
          isFeatured,
          isArchived,
        })
        .where(eq(product.id, productId))
        .returning({ productId: product.id });
      await db.insert(image).values(imagesToInsert);
    });

    return NextResponse.json(result[0]);
  } catch (error) {
    console.log("[PRODUCTS-PATCH]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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
    await db.delete(product).where(eq(product.id, params.productId));
    return new NextResponse("Product deleted.");
  } catch (error) {
    console.log("[PRODUCTS-DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
