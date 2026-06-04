"use client";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "react-hot-toast";
import ChatBot from "@/components/ChatBot";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px", fontSize: "14px" },
        }}
      />
      <ChatBot />
    </CartProvider>
  );
}