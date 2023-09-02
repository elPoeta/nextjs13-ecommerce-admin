import { db } from "@/db";
import { Image, image } from "@/db/schema/image";
import { product } from "@/db/schema/product";
import { store } from "@/db/schema/store";
import { getAuthSession } from "@/lib/auth/auth-options";
import { FormProductSchemaValidator } from "@/lib/validators/formValidator";
import { and, desc, eq } from "drizzle-orm";
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
    const {
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      images,
      isFeatured,
      isArchived,
    } = FormProductSchemaValidator.parse(body);
    let result: { productId: string }[] = [];
    const tx = await db.transaction(async (tx) => {
      result = await db
        .insert(product)
        .values({
          name,
          price,
          storeId: params.storeId,
          categoryId,
          sizeId,
          colorId,
          isArchived,
          isFeatured,
        })
        .returning({ productId: product.id });
      const imagesToInsert: Pick<Image, "url" | "productId">[] = images.map(
        (imageUrl) => ({
          url: imageUrl.url,
          productId: result[0].productId,
        })
      );
      await db.insert(image).values(imagesToInsert);
    });

    return NextResponse.json(result[0]);
  } catch (error) {
    console.log("[PRODUCTS-POST]", error);
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
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeaturedPresent = searchParams.get("isFeatured") || undefined;
    const isFeatured = isFeaturedPresent === "true" ? true : undefined;

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const where = and(
      eq(product.storeId, params.storeId),
      isFeatured ? eq(product.isFeatured, isFeatured) : undefined,
      eq(product.isArchived, false),
      categoryId ? eq(product.categoryId, categoryId) : undefined,
      colorId ? eq(product.colorId, colorId) : undefined,
      sizeId ? eq(product.sizeId, sizeId) : undefined
    );

    const products = await db.query.product.findMany({
      where,
      with: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
      orderBy: [desc(product.createdAt)],
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS-GET]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
};
