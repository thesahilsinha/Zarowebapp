import { NextRequest, NextResponse } from "next/server";
import { sendOrderPlaced, sendOrderStatusUpdate } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { type, order } = await req.json();
    if (type === "placed") await sendOrderPlaced(order);
    if (type === "status") await sendOrderStatusUpdate(order);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}