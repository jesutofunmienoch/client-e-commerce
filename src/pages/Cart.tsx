// src/pages/Cart.tsx – Naira + Commas Version
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Naira formatter with commas and 2 decimal places
const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  // Convert total to Naira (assuming your product prices are in Naira already)
  const subtotal = total;
  const shippingCost = subtotal >= 50000 ? 0 : 2500; // Free shipping over ₦50,000
  const finalTotal = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some products to get started!
          </p>
          <Link to="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart ({items.length} items)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => {
              const itemPrice = item.salePrice || item.price;
              const lineTotal = itemPrice * item.quantity;

              return (
                <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-6">
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-28 h-28 object-cover rounded-lg border"
                      />
                    </Link>

                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/product/${item.id}`}>
                            <h3 className="text-lg font-semibold text-foreground hover:text-accent transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatNaira(itemPrice)} each
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-16 text-center font-bold text-lg">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-price">
                            {formatNaira(lineTotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border-2 border-accent/20">
              <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span className="text-foreground">Subtotal</span>
                  <span className="font-semibold">{formatNaira(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-foreground">Shipping</span>
                  <span className={`font-semibold ${shippingCost === 0 ? "text-success" : "text-foreground"}`}>
                    {shippingCost === 0 ? "Free" : formatNaira(shippingCost)}
                  </span>
                </div>

                {shippingCost === 0 && (
                  <p className="text-sm text-success flex items-center gap-2">
                    Congratulations! You qualify for free shipping
                  </p>
                )}

                <div className="border-t-2 border-border pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-price text-2xl">
                      {formatNaira(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-accent hover:bg-accent/90 text-white"
                size="lg"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>

              <Link to="/products" className="block mt-3">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;