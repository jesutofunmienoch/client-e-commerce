// src/components/admin/ActivityFeed.tsx
import { useOrders } from "@/contexts/OrdersContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Package, Truck, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ActivityFeed() {
  const { orders } = useOrders();

  const recentActivities = orders
    .slice()
    .reverse()
    .slice(0, 8)
    .map((order) => ({
      id: order.id,
      type: "order",
      message: `New order #${order.id.slice(-6)} by ${order.customer.name}`,
      time: formatDistanceToNow(new Date(order.date), { addSuffix: true }),
      icon: ShoppingCart,
      color: "text-primary",
      status: order.status,
    }));

  const statusIcons = {
    pending: ShoppingCart,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No activity yet</p>
            ) : (
              recentActivities.map((activity) => {
                const Icon = statusIcons[activity.status as keyof typeof statusIcons] || ShoppingCart;
                return (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}