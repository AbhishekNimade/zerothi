import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired session. Please log in again." }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, address, city, postalCode, items } = body;

    if (!name || !phone || !address || !city || !postalCode || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Please provide all shipping details and items." }, { status: 400 });
    }

    // Begin database check & transaction
    const order = await db.$transaction(async (tx) => {
      let subtotal = 0;

      // 1. Verify stock and calculate exact pricing
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id }
        });

        if (!product) {
          throw new Error(`Product not found: ${item.name}`);
        }

        if (product.category === "FUTURE") {
          throw new Error(`Cannot purchase future product: ${product.name}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        }

        subtotal += product.price * item.quantity;
      }

      // Add a mock flat delivery charge of ₹50 or free if subtotal > ₹500
      const shippingCharge = subtotal > 500 ? 0 : 50;
      const totalAmount = subtotal + shippingCharge;

      // 2. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId: payload.userId,
          shippingName: name,
          shippingAddress: `${address}, ${city} - ${postalCode}`,
          phone,
          email: payload.email,
          totalAmount: totalAmount,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod: "COD", // Cash on Delivery default
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: true
        }
      });

      // 3. Decrement Product stocks
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: error.message || "Failed to process order." }, { status: 500 });
  }
}

// GET all orders for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { userId: payload.userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Failed to load user orders:", error);
    return NextResponse.json({ error: "Failed to load orders." }, { status: 500 });
  }
}
