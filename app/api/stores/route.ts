import { db } from "@/db";
import { store } from "@/db/schema/store";
import { getAuthSession } from "@/lib/auth/auth-options";
import { FormModalStoreSchemaValidator } from "@/lib/validators/formValidator";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = FormModalStoreSchemaValidator.parse(body);

    const storeExists = await db
      .select()
      .from(store)
      .where(eq(store.name, name));

    if (storeExists.length > 0) {
      return new NextResponse("Store name alreay taken", { status: 409 });
    }

    const newStore = await db.insert(store).values({
      name,
      userId: parseInt(session.user.id),
    });
    return new NextResponse(JSON.stringify(newStore));
  } catch (error) {
    console.log("[STORES-POST]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
};
