import { db } from "@/db";
import { size } from "@/db/schema/size";
import { store } from "@/db/schema/store";
import { getAuthSession } from "@/lib/auth/auth-options";
import { FormSizeSchemaValidator } from "@/lib/validators/formValidator";
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
    const { name, value } = FormSizeSchemaValidator.parse(body);

    const newSize = await db.insert(size).values({
      name,
      value,
      storeId: params.storeId,
    });

    return NextResponse.json(newSize);
  } catch (error) {
    console.log("[SIZE-POST]", error);
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

    const sizes = await db.query.size.findMany({
      where: eq(size.storeId, params.storeId),
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZE-GET]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
};
