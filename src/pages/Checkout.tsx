// src/pages/Checkout.tsx – FINAL FIXED & CORRECTED
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useOrders, OrderStatus } from "@/contexts/OrdersContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePaystackPayment } from "react-paystack";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string;

const formatNaira = (amountInNaira: number): string => {
  return `₦${amountInNaira.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

type PaystackResponse = {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
};

const Checkout = () => {
  const { items, total, clearCart } = useCart(); // total is in Naira
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const shippingCost = total >= 50000 ? 0 : 3000;
  const finalTotalInNaira = total + shippingCost;

  // Convert to kobo ONLY for Paystack
  const amountInKobo = Math.round(finalTotalInNaira * 100);

  const config = {
    reference: `ref-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    email: formData.email || "customer@example.com",
    amount: amountInKobo, // Paystack expects kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    firstname: formData.firstName,
    lastname: formData.lastName,
    currency: "NGN" as const,
    metadata: {
      custom_fields: [
        { display_name: "Phone", variable_name: "phone", value: formData.phone },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (response: PaystackResponse) => {
    const order = {
      customer: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      },
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.salePrice || item.price, // Store in Naira
        quantity: item.quantity,
        image: item.image,
      })),
      total: finalTotalInNaira, // Save in Naira (not kobo!)
      status: "paid" as OrderStatus,
      paymentReference: response.reference,
      date: new Date().toISOString(),
    };

    addOrder(order);
    clearCart();
    toast.success("Payment successful! Order confirmed.");
    navigate("/checkout/success");
  };

  const onClose = () => {
    toast.error("Payment was cancelled.");
  };

  const handlePay = () => {
    if (!formData.firstName || !formData.email || !formData.phone) {
      toast.error("Please fill in your name, email, and phone.");
      return;
    }
    initializePayment({ onSuccess, onClose });
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-10">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-8">Shipping Information</h2>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div><Label>First Name *</Label><Input name="firstName" value={formData.firstName} onChange={handleChange} /></div>
                  <div><Label>Last Name</Label><Input name="lastName" value={formData.lastName} onChange={handleChange} /></div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div><Label>Email Address *</Label><Input type="email" name="email" value={formData.email} onChange={handleChange} /></div>
                  <div><Label>Phone Number *</Label><Input name="phone" value={formData.phone} onChange={handleChange} /></div>
                </div>

                <div><Label>Street Address *</Label><Input name="address" value={formData.address} onChange={handleChange} /></div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div><Label>City *</Label><Input name="city" value={formData.city} onChange={handleChange} /></div>
                  <div><Label>State *</Label><Input name="state" value={formData.state} onChange={handleChange} /></div>
                  <div><Label>ZIP Code</Label><Input name="zipCode" value={formData.zipCode} onChange={handleChange} /></div>
                </div>

                <div className="pt-8">
                  <Button
                    onClick={handlePay}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-7 text-xl rounded-xl shadow-lg"
                  >
                    Pay {formatNaira(finalTotalInNaira)} with Paystack
                  </Button>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Test Card (Sandbox)</p>
                    <p>408 408 408 408 408 1 • Any future date • CVV: 123 • OTP: 123456</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-8 sticky top-24">
              <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

              <div className="space-y-4 mb-8">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatNaira((item.salePrice || item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 pt-6 space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatNaira(total)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-success font-bold" : "font-medium"}>
                    {shippingCost === 0 ? "Free" : formatNaira(shippingCost)}
                  </span>
                </div>
                <div className="border-t-2 pt-6 text-2xl font-bold flex justify-between">
                  <span>Total</span>
                  <span className="text-price">{formatNaira(finalTotalInNaira)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;