import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateGiftCardCode } from "@/lib/utils";
import { sendGiftCardEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount, recipient_name, recipient_email,
      sender_name, message,
      purchased_by_user_id, purchased_by_name, purchased_by_email,
    } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const code = generateGiftCardCode();

    const { data: giftCard, error } = await supabase
      .from("gift_cards")
      .insert({
        code,
        amount,
        is_used: false,
        purchased_by_user_id,
        purchased_by_name,
        purchased_by_email,
        recipient_name,
        recipient_email,
        sender_name,
        message,
        payment_status: "paid",
      })
      .select()
      .single();

    if (error) throw error;

    // Send gift card email to recipient
    await sendGiftCardEmail({
      code,
      amount,
      recipient_name,
      recipient_email,
      sender_name,
      message,
    });

    return NextResponse.json({ success: true, code, giftCard });
  } catch (error: any) {
    console.error("Gift card purchase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}