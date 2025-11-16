import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CheckoutSuccess = () => {
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-20 w-20 text-accent mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg mb-6">
          <p className="text-sm text-muted-foreground mb-1">Order Number</p>
          <p className="text-lg font-bold text-foreground">{orderNumber}</p>
        </div>

        <p className="text-foreground mb-6">
          We've sent a confirmation email with your order details and tracking information.
        </p>

        <div className="space-y-3">
          <Link to="/products">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
