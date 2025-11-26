// src/components/admin/OrderDetailsDialog.tsx
import { useState } from "react";
import { useOrders, type Order } from "@/contexts/OrdersContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Props = {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OrderDetailsDialog({ order, open, onOpenChange }: Props) {
  const { updateOrderStatus } = useOrders();
  const [deliveryDate, setDeliveryDate] = useState("");

  const handleStatusChange = (newStatus: "shipped" | "delivered") => {
    updateOrderStatus(order.id, newStatus, deliveryDate || undefined);
    toast.success(`Order marked as ${newStatus}!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order #{order.id.slice(-6).toUpperCase()}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Placed on {format(new Date(order.date), "PPP 'at' p")}
          </p>
        </DialogHeader>

        <div className="space-y-8 py-6">
          <div className="bg-muted/30 p-5 rounded-lg">
            <h4 className="font-bold text-lg mb-3">Customer</h4>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{order.customer.name}</p>
              <p className="text-muted-foreground">{order.customer.email}</p>
              <p className="text-muted-foreground">{order.customer.address}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Items</h4>
            {order.items.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-card p-4 rounded-lg border mb-3">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × {formatNaira(item.price)}
                  </p>
                </div>
                <p className="font-bold text-price">
                  {formatNaira(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t-2 pt-6 text-2xl font-bold flex justify-between">
            <span>Total</span>
            <span className="text-price">{formatNaira(order.total)}</span>
          </div>

          {["pending", "paid", "processing"].includes(order.status) && (
            <div className="border-t-2 pt-8 space-y-6">
              <div>
                <Label>Estimated Delivery (Optional)</Label>
                <Input type="datetime-local" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="mt-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button size="lg" variant="outline" onClick={() => handleStatusChange("shipped")}>
                  Mark as Shipped
                </Button>
                <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange("delivered")}>
                  Mark as Delivered
                </Button>
              </div>
            </div>
          )}

          <div className="border-t-2 pt-6">
            <Badge variant={order.status === "delivered" || order.status === "paid" ? "default" : "outline"} className="text-lg px-6 py-3">
              Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}