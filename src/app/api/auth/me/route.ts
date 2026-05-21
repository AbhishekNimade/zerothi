import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 200 } // Keep 200 but user null for easy client handling
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    // Fetch user from DB to get the latest info
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Auth Me Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
