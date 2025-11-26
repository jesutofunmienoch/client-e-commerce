// src/components/admin/QuickStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useOrders } from "@/contexts/OrdersContext";
import { format } from "date-fns";

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Helper: Get start of current and last month
const getCurrentMonthStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const getLastMonthStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - 1, 1);
};

const getLastMonthEnd = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month
};

export function QuickStats() {
  const { orders } = useOrders();

  const paidOrders = orders.filter(o => o.status === "paid" || o.status === "delivered");

  // This Month Sales
  const thisMonthStart = getCurrentMonthStart();
  const thisMonthSales = paidOrders
    .filter(order => {
      const orderDate = new Date(order.date || order.createdAt || new Date());
      return orderDate >= thisMonthStart;
    })
    .reduce((sum, order) => sum + (order.total || 0), 0);

  // Last Month Sales
  const lastMonthStart = getLastMonthStart();
  const lastMonthEnd = getLastMonthEnd();
  const lastMonthSales = paidOrders
    .filter(order => {
      const orderDate = new Date(order.date || order.createdAt || new Date());
      return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
    })
    .reduce((sum, order) => sum + (order.total || 0), 0);

  // Percentage Change
  const percentageChange = lastMonthSales === 0
    ? 100
    : ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100;

  const isPositive = percentageChange >= 0;

  // Mock categories (you can make this dynamic later)
  const categories = [
    { name: "Electronics", sales: 85, amount: thisMonthSales * 0.45 },
    { name: "Fashion", sales: 72, amount: thisMonthSales * 0.30 },
    { name: "Home & Living", sales: 58, amount: thisMonthSales * 0.15 },
    { name: "Others", sales: 45, amount: thisMonthSales * 0.10 },
  ];

  // Mock low stock (replace with real data later)
  const lowStockProducts = [
    { name: "iPhone 15 Case", stock: 4, critical: true },
    { name: "Wireless Earbuds", stock: 6, critical: true },
    { name: "Smart Watch Band", stock: 9, critical: false },
    { name: "USB-C Cable", stock: 7, critical: false },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            Top Categories This Month
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {categories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{category.name}</span>
                <span className="text-muted-foreground">
                  {formatNaira(category.amount)}
                </span>
              </div>
              <Progress value={category.sales} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Low Stock Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product.name}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
              >
                <span className="font-medium text-sm">{product.name}</span>
                <Badge
                  variant={product.critical ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {product.stock} left
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sales Comparison - Full Width */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Sales Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* This Month */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                This Month ({format(thisMonthStart, "MMMM yyyy")})
              </p>
              <p className="text-4xl font-bold text-foreground">
                {formatNaira(thisMonthSales)}
              </p>
              <div className="flex items-center gap-2 text-sm">
                {isPositive ? (
                  <TrendingUp className="w-5 h-5 text-success" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-destructive" />
                )}
                <span className={isPositive ? "text-success" : "text-destructive"}>
                  {isPositive ? "+" : ""}{percentageChange.toFixed(1)}%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </div>

            {/* Last Month */}
            <div className="space-y-3 opacity-80">
              <p className="text-sm text-muted-foreground">
                Last Month ({format(lastMonthStart, "MMMM yyyy")})
              </p>
              <p className="text-3xl font-bold text-muted-foreground">
                {formatNaira(lastMonthSales)}
              </p>
              <p className="text-sm text-muted-foreground">
                Base comparison period
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}