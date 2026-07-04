import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("gift_cards")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .single();

    if (error || !data) return NextResponse.json({ valid: false, message: "Gift card not found" });
    if (data.is_used) return NextResponse.json({ valid: false, message: "Gift card has already been used" });
    if (data.payment_status !== "paid") return NextResponse.json({ valid: false, message: "Gift card payment not completed" });

    return NextResponse.json({ valid: true, amount: data.amount, giftCard: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}