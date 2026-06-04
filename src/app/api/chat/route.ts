import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionProducts } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: products } = await supabase
      .from("products")
      .select("name, price, discount_price, description, type, is_best_seller, slug")
      .eq("is_active", true)
      .limit(20);

    const productList = products
      ?.map((p) => `- ${p.name} (₹${p.discount_price || p.price})${p.is_best_seller ? " [Bestseller]" : ""}${p.type === "freshly_bakes" ? " [Freshly Baked]" : ""}: ${p.description || ""}`)
      .join("\n") || "";

    const systemPrompt = `You are a friendly assistant for Zaro Bakehouse, a boutique artisan bakery in Bandra West, Mumbai.

Our products:
${productList}

Guidelines:
- Be warm, polite, and concise. Keep replies short — 2-3 sentences max.
- You can suggest products naturally when relevant but never more than once per conversation unless asked.
- If asked about delivery, say we deliver in Bandra (free above ₹499) and nearby areas.
- If asked about hours, say we're open 8 AM – 8 PM daily.
- If asked about location, say Shop No 10, Shiv Darshan, 33rd Road, Bandra West.
- For orders, direct them to browse the shop or add items to cart.
- Never be pushy or repeat suggestions. If someone says no, move on gracefully.
- If you don't know something, say "I'm not sure, please contact us at zarobakerhouse@gmail.com"
- Don't make up products or prices not listed above.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b", // ✅ actual model ID, not the display name
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Groq API error:", err);
      return NextResponse.json({ error: "Model request failed" }, { status: 500 });
    }

    const data = await response.json();

    return NextResponse.json({
      message: data.choices[0]?.message?.content || "Sorry, I couldn't understand that.",
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}