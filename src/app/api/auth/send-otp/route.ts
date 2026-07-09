import { NextRequest, NextResponse } from "next/server";
import { otpCache } from "@/lib/otpCache";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Missing required phone number" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Cache the OTP code (valid for 5 minutes)
    otpCache.set(cleanPhone, {
      code,
      expires: Date.now() + 5 * 60 * 1000,
    });

    console.log(`\n--- [SMS GATEWAY MOCK] ---`);
    console.log(`To: +91 ${cleanPhone}`);
    console.log(`Message: Your Zerothi verification code is ${code}. It is valid for 5 minutes.`);
    console.log(`-------------------------\n`);

    // Optional: Real SMS Gateway Integrations (Twilio / Fast2SMS)
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_FROM;

    if (twilioSid && twilioAuthToken && twilioFrom) {
      try {
        const basicAuth = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString("base64");
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: `+91${cleanPhone}`,
            From: twilioFrom,
            Body: `Your Zerothi verification code is ${code}. Please do not share this code.`,
          }),
        });
        console.log(`[SMS Gateway] Twilio dispatch success for +91${cleanPhone}`);
      } catch (err) {
        console.error("Twilio SMS dispatch failed:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your number",
    });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
