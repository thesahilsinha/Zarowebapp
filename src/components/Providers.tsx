"use client";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1a1a1a",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 20px",
            fontSize: "14px",
          },
        }}
      />
    </CartProvider>
  );
}