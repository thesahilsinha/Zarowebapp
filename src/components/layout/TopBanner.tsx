"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function TopBanner() {
  const [visible, setVisible] = useState(true);
  const [text, setText] = useState("Free delivery on orders above ₹499 in Bandra");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("value")
      .eq("key", "top_banner_text")
      .single()
      .then(({ data }) => {
        if (data?.value) setText(JSON.parse(JSON.stringify(data.value)));
      });
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-brand-600 text-white text-sm py-2.5 px-4 text-center relative">
      <p className="font-medium tracking-wide">{text}</p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
}