import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { phone, name } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Missing required phone number" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();

    // Check if user with this phone already exists
    let user = await db.user.findFirst({
      where: { phone: cleanPhone },
    });

    if (!user) {
      // Create new user (automatically sign up if new)
      const placeholderName = name || `Nimar Guest (${cleanPhone.slice(-4)})`;
      const placeholderEmail = `${cleanPhone}@zerothi.com`;
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await hashPassword(randomPassword);

      user = await db.user.create({
        data: {
          name: placeholderName,
          email: placeholderEmail.toLowerCase(),
          phone: cleanPhone,
          password: hashedPassword,
          role: "CUSTOMER",
        },
      });
    }

    // Determine role (in case it is admin)
    const userEmail = user.email.toLowerCase();
    const targetRole = (userEmail.includes("admin") || userEmail === "it@zerothi.com" || cleanPhone === "9999999999") ? "ADMIN" : "CUSTOMER";
    if (user.role !== targetRole) {
      user = await db.user.update({
        where: { id: user.id },
        data: { role: targetRole }
      });
    }

    // Create JWT
    const token = signToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

    // Set cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Phone Login Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
