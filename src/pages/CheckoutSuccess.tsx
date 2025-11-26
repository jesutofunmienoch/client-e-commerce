// src/pages/CheckoutSuccess.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CheckoutSuccess = () => {
  // Get last order from localStorage (simple way)
  const orders = JSON.parse(localStorage.getItem("admin-orders") || "[]");
  const lastOrder = orders[orders.length - 1];
  const orderNumber = lastOrder ? `#${lastOrder.id.slice(-6)}` : "ORD-000000";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase
          </p>
        </div>

        <div className="bg-muted p-6 rounded-lg mb-6">
          <p className="text-sm text-muted-foreground mb-2">Order Number</p>
          <p className="text-2xl font-bold text-foreground">{orderNumber}</p>
        </div>

        <p className="text-foreground mb-8">
          We've sent a confirmation email to your inbox with order details and tracking info.
        </p>

        <div className="space-y-3">
          <Link to="/products">
            <Button className="w-full" size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;