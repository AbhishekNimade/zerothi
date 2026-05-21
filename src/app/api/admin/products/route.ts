import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// Check if user is Admin
async function isAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return false;
  
  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") return false;
  
  return true;
}

// PUT to update product stock or price
export async function PUT(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { productId, stock, price } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const updateData: any = {};
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (price !== undefined) updateData.price = parseFloat(price);

    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: updateData
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Admin failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product details." }, { status: 500 });
  }
}
