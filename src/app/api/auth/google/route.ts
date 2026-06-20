import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json(
        { error: "Missing required Google credential token" },
        { status: 400 }
      );
    }

    // Verify token using Google's official OAuth2 tokeninfo endpoint
    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`;
    const tokenInfoRes = await fetch(googleVerifyUrl);

    if (!tokenInfoRes.ok) {
      return NextResponse.json(
        { error: "Invalid Google credential token" },
        { status: 400 }
      );
    }

    const payload = await tokenInfoRes.json();
    const { email, name, email_verified } = payload;

    if (!email_verified || !email) {
      return NextResponse.json(
        { error: "Google account email is not verified" },
        { status: 400 }
      );
    }

    const targetRole = (email.toLowerCase().includes("admin") || email.toLowerCase() === "it@zerothi.com") ? "ADMIN" : "CUSTOMER";

    // Check if user already exists
    let user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user && user.role !== targetRole) {
      user = await db.user.update({
        where: { id: user.id },
        data: { role: targetRole }
      });
    }

    // If user does not exist, automatically register them
    if (!user) {
      // Generate a highly secure random password for DB schema compatibility
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await hashPassword(randomPassword);

      user = await db.user.create({
        data: {
          name: name || "Google User",
          email: email.toLowerCase(),
          password: hashedPassword,
          role: targetRole,
        },
      });
    }

    // Create app JWT session token
    const token = signToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Create standard response
    const response = NextResponse.json({
      message: "Google login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set cookie (same settings as regular password login)
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
    console.error("Google Authentication Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
