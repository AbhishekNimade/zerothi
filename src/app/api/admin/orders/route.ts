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

// GET all orders for admin panel
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
  }

  try {
    const orders = await db.order.findMany({
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
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Admin failed to load orders:", error);
    return NextResponse.json({ error: "Failed to load orders." }, { status: 500 });
  }
}

// PUT to update order shipping status or payment status
export async function PUT(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { orderId, status, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: updateData
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Admin failed to update order:", error);
    return NextResponse.json({ error: "Failed to update order status." }, { status: 500 });
  }
}
