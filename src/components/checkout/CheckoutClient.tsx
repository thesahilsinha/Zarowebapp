"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, generateOrderNumber } from "@/lib/utils";
import { MapPin, CreditCard, Truck, CheckCircle, ChevronRight, Tag, X } from "lucide-react";
import toast from "react-hot-toast";

type Step = "address" | "delivery" | "payment" | "confirm";

interface AddressForm {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
}

interface PincodeData {
  pincode: string;
  area: string;
  delivery_type: string;
  delivery_charge: number;
  is_bandra: boolean;
  delivery_time_hours: number;
}

const STEPS: { key: Step; label: string }[] = [
  { key: "address", label: "Address" },
  { key: "delivery", label: "Delivery" },
  { key: "payment", label: "Payment" },
  { key: "confirm", label: "Confirm" },
];

export default function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, refreshCart } = useCart();
  const [step, setStep] = useState<Step>("address");
  const [user, setUser] = useState<any>(null);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [pincodeData, setPincodeData] = useState<PincodeData | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState<AddressForm>({
    full_name: "", phone: "", address_line1: "",
    address_line2: "", landmark: "", pincode: "",
    city: "Mumbai", state: "Maharashtra",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUser(user);
      // Load saved addresses
      supabase.from("addresses").select("*").eq("user_id", user.id).then(({ data }) => {
        setSavedAddresses(data || []);
        const def = data?.find((a) => a.is_default);
        if (def) { setSelectedAddressId(def.id); populateFormFromAddress(def); }
      });
    });
    // Check razorpay enabled
    supabase.from("settings").select("value").eq("key", "razorpay_enabled").single().then(({ data }) => {
      setRazorpayEnabled(data?.value === true || data?.value === "true");
    });
  }, [router]);

  const populateFormFromAddress = (addr: any) => {
    setForm({
      full_name: addr.full_name, phone: addr.phone,
      address_line1: addr.address_line1, address_line2: addr.address_line2 || "",
      landmark: addr.landmark || "", pincode: addr.pincode,
      city: addr.city, state: addr.state,
    });
  };

  const handlePincodeCheck = async (pincode: string) => {
    if (pincode.length !== 6) return;
    setPincodeLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("pincodes").select("*").eq("pincode", pincode).single();
    setPincodeData(data);
    setPincodeLoading(false);
  };

  const deliveryCharge = (() => {
    if (!pincodeData) return 0;
    if (pincodeData.delivery_type === "not_available") return -1;
    if (pincodeData.is_bandra && subtotal >= 499) return 0;
    return pincodeData.delivery_charge;
  })();

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const supabase = createClient();
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (!coupon) { toast.error("Invalid coupon code"); setCouponLoading(false); return; }
    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      toast.error("Coupon has expired"); setCouponLoading(false); return;
    }
    if (subtotal < coupon.min_order_value) {
      toast.error(`Minimum order value ₹${coupon.min_order_value} required`);
      setCouponLoading(false); return;
    }
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      toast.error("Coupon usage limit reached"); setCouponLoading(false); return;
    }

    setCouponData(coupon);
    toast.success("Coupon applied!");
    setCouponLoading(false);
  };

  const discount = (() => {
    if (!couponData) return 0;
    if (couponData.discount_type === "percentage") {
      const d = (subtotal * couponData.discount_value) / 100;
      return couponData.max_discount ? Math.min(d, couponData.max_discount) : d;
    }
    return couponData.discount_value;
  })();

  const total = subtotal + Math.max(0, deliveryCharge) - discount;

  const placeOrder = async () => {
    if (!user) return;
    setPlacing(true);
    const supabase = createClient();

    const orderNumber = generateOrderNumber();
    const deliveryAddress = {
      full_name: form.full_name, phone: form.phone,
      address_line1: form.address_line1, address_line2: form.address_line2,
      landmark: form.landmark, city: form.city,
      state: form.state, pincode: form.pincode,
    };

    const orderItems = items.map((item) => ({
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.discount_price || item.product.price,
      quantity: item.quantity,
      image: item.product.images?.[0] || "",
    }));

    const { data: order, error } = await supabase.from("orders").insert({
      order_number: orderNumber,
      user_id: user.id,
      items: orderItems,
      subtotal,
      delivery_charge: Math.max(0, deliveryCharge),
      discount,
      total,
      status: "pending",
      payment_method: paymentMethod,
      payment_status: paymentMethod === "cod" ? "pending" : "pending",
      delivery_address: deliveryAddress,
      pincode: form.pincode,
      coupon_code: couponData?.code || null,
    }).select().single();

    if (error || !order) {
      toast.error("Failed to place order. Please try again.");
      setPlacing(false); return;
    }

    // Clear cart
    await supabase.from("carts").delete().eq("user_id", user.id);
    await refreshCart();

    // Update coupon usage
    if (couponData) {
      await supabase.from("coupons").update({ used_count: couponData.used_count + 1 }).eq("id", couponData.id);
    }

    toast.success("Order placed successfully!");
    
    router.push(`/dashboard/orders?success=${order.order_number}`);
    setPlacing(false);
  };

  if (items.length === 0 && !placing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-playfair text-2xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
        <button onClick={() => router.push("/shop")} className="bg-brand-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-600 transition-colors">
          Browse Shop
        </button>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-playfair text-3xl font-bold mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto scrollbar-hide">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2 flex-shrink-0">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              s.key === step ? "bg-brand-500 text-white" :
              i < stepIndex ? "bg-green-100 text-green-700" : "bg-accent text-muted-foreground"
            }`}>
              {i < stepIndex ? <CheckCircle size={14} /> : <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs">{i + 1}</span>}
              {s.label}
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-muted-foreground" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: steps */}
        <div className="lg:col-span-2 space-y-6">

          {/* STEP: Address */}
          {step === "address" && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-playfair text-xl font-bold mb-5 flex items-center gap-2">
                <MapPin size={20} className="text-brand-500" />
                Delivery Address
              </h2>

              {/* Saved addresses */}
              {savedAddresses.length > 0 && (
                <div className="mb-5 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Saved addresses</p>
                  {savedAddresses.map((addr) => (
                    <label key={addr.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                      selectedAddressId === addr.id ? "border-brand-500 bg-brand-50" : "border-border hover:border-brand-200"
                    }`}>
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => { setSelectedAddressId(addr.id); populateFormFromAddress(addr); }}
                        className="mt-1 accent-brand-500"
                      />
                      <div className="text-sm">
                        <p className="font-semibold">{addr.full_name}</p>
                        <p className="text-muted-foreground">{addr.address_line1}, {addr.city} {addr.pincode}</p>
                        <p className="text-muted-foreground">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                  <p className="text-sm text-brand-600 font-medium cursor-pointer mt-1" onClick={() => setSelectedAddressId(null)}>
                    + Use a different address
                  </p>
                </div>
              )}

              {/* Address form */}
              {(!selectedAddressId || savedAddresses.length === 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "full_name", label: "Full Name", col: 1 },
                    { key: "phone", label: "Phone Number", col: 1 },
                    { key: "address_line1", label: "Address Line 1", col: 2 },
                    { key: "address_line2", label: "Address Line 2 (Optional)", col: 2 },
                    { key: "landmark", label: "Landmark (Optional)", col: 2 },
                    { key: "pincode", label: "Pincode", col: 1 },
                    { key: "city", label: "City", col: 1 },
                  ].map(({ key, label, col }) => (
                    <div key={key} className={col === 2 ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={form[key as keyof AddressForm]}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, [key]: e.target.value }));
                          if (key === "pincode") handlePincodeCheck(e.target.value);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Pincode validation result */}
              {form.pincode.length === 6 && (
                <div className={`mt-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
                  pincodeLoading ? "bg-accent text-muted-foreground" :
                  !pincodeData ? "bg-red-50 text-red-600" :
                  pincodeData.delivery_type === "not_available" ? "bg-red-50 text-red-600" :
                  "bg-green-50 text-green-700"
                }`}>
                  <Truck size={15} />
                  {pincodeLoading ? "Checking delivery availability..." :
                   !pincodeData ? "Sorry, we don't deliver to this pincode yet." :
                   pincodeData.delivery_type === "not_available" ? "Delivery not available for this pincode." :
                   `Delivery available to ${pincodeData.area}. ${pincodeData.is_bandra && subtotal >= 499 ? "Free delivery!" : `Charge: ₹${pincodeData.delivery_charge}`}`
                  }
                </div>
              )}

              <button
                onClick={() => {
                  if (!form.full_name || !form.phone || !form.address_line1 || !form.pincode) {
                    toast.error("Please fill all required fields"); return;
                  }
                  if (pincodeData?.delivery_type === "not_available") {
                    toast.error("Delivery not available for this pincode"); return;
                  }
                  setStep("payment");
                }}
                className="mt-6 w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Continue to Payment <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* STEP: Payment */}
          {step === "payment" && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-playfair text-xl font-bold mb-5 flex items-center gap-2">
                <CreditCard size={20} className="text-brand-500" />
                Payment Method
              </h2>

              <div className="space-y-3 mb-6">
                {/* COD */}
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === "cod" ? "border-brand-500 bg-brand-50" : "border-border hover:border-brand-200"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-brand-500"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Cash on Delivery</p>
                    <p className="text-muted-foreground text-xs mt-0.5">Pay when your order arrives</p>
                  </div>
                  <Truck size={20} className="text-muted-foreground" />
                </label>

                {/* Razorpay */}
                <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                  razorpayEnabled
                    ? paymentMethod === "razorpay" ? "border-brand-500 bg-brand-50 cursor-pointer" : "border-border hover:border-brand-200 cursor-pointer"
                    : "border-border bg-accent opacity-60 cursor-not-allowed"
                }`}>
                  {razorpayEnabled ? (
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-brand-500"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      Online Payment
                      {!razorpayEnabled && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {razorpayEnabled ? "UPI, Cards, Net Banking via Razorpay" : "Currently under review"}
                    </p>
                  </div>
                  <CreditCard size={20} className="text-muted-foreground" />
                </div>
              </div>

              {/* Coupon */}
              <div className="border-t border-border pt-5 mb-6">
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Tag size={15} className="text-brand-500" />
                  Apply Coupon
                </p>
                {couponData ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-green-700 font-semibold text-sm">{couponData.code}</p>
                      <p className="text-green-600 text-xs">
                        {couponData.discount_type === "percentage"
                          ? `${couponData.discount_value}% off`
                          : `₹${couponData.discount_value} off`}
                        {" applied"}
                      </p>
                    </div>
                    <button onClick={() => { setCouponData(null); setCouponCode(""); }}>
                      <X size={16} className="text-green-600 hover:text-green-800" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("address")}
                  className="flex-1 py-3.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Review Order <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP: Confirm */}
          {step === "confirm" && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-playfair text-xl font-bold mb-5 flex items-center gap-2">
                <CheckCircle size={20} className="text-brand-500" />
                Review Your Order
              </h2>

              {/* Delivery address summary */}
              <div className="bg-accent rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Delivering to</p>
                <p className="font-semibold text-sm">{form.full_name}</p>
                <p className="text-sm text-muted-foreground">{form.address_line1}{form.address_line2 ? `, ${form.address_line2}` : ""}</p>
                <p className="text-sm text-muted-foreground">{form.city} — {form.pincode}</p>
                <p className="text-sm text-muted-foreground">{form.phone}</p>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                      <img src={item.product.images?.[0] || "/placeholder.jpg"} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold flex-shrink-0">
                      {formatPrice((item.product.discount_price || item.product.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("payment")} className="flex-1 py-3.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors">
                  Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-70"
                >
                  {placing ? "Placing Order..." : `Place Order · ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
            <h3 className="font-playfair font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const price = item.product.discount_price || item.product.price;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                      <img src={item.product.images?.[0] || "/placeholder.jpg"} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold flex-shrink-0">{formatPrice(price * item.quantity)}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : "font-medium"}>
                  {deliveryCharge === 0 ? "Free" : deliveryCharge > 0 ? formatPrice(deliveryCharge) : "—"}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}