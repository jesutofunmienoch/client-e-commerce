// src/components/admin/OrdersTable.tsx
import { useState } from "react";
import { useOrders, type Order } from "@/contexts/OrdersContext";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { format } from "date-fns";

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const statusColors: Record<Order["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function OrdersTable() {
  const { orders } = useOrders();
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);

  const sorted = [...orders].sort((a, b) =>
    sortDir === "asc" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
  );

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No orders yet</p>
        <p className="text-sm">Customer orders will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")} className="h-auto p-0 font-medium">
                  Date <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(order => (
              <TableRow
                key={order.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setSelectedOrder(order);
                  setOpen(true);
                }}
              >
                <TableCell className="font-medium">#{order.id.slice(-6).toUpperCase()}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell className="text-muted-foreground">{order.customer.email}</TableCell>
                <TableCell>{format(new Date(order.date), "MMM d, yyyy")}</TableCell>
                <TableCell className="font-semibold text-price">
                  {formatNaira(order.total)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[order.status]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <OrderDetailsDialog order={selectedOrder} open={open} onOpenChange={setOpen} />
      )}
    </>
  );
}