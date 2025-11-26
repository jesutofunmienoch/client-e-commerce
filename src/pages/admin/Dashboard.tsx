// src/pages/admin/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Menu,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserButton, useUser } from "@clerk/clerk-react";

import { useOrders } from "@/contexts/OrdersContext";
import { useProductsStore } from "@/lib/products-store"; // ← REACTIVE!
import { OrdersTable } from "@/components/admin/OrdersTable";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { QuickStats } from "@/components/admin/QuickStats";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { AddProductDialog } from "@/components/admin/AddProductDialog";
import { NavLink } from "@/components/NavLink";

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, isLoaded } = useUser();
  const { orders } = useOrders();

  // REACTIVE: Now updates instantly when products change
  const products = useProductsStore((state) => state.products);

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin-auth") === "true";
    if (!isAuthenticated) {
      toast.error("Access Denied. Unauthorized.");
      navigate("/emperor-access-2025");
    }
  }, [navigate]);

  const uniqueCustomers = new Set(orders.map((o) => o.customer.email)).size;
  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "delivered")
    .reduce((sum, order) => sum + (order.total || 0), 0);

  if (!isLoaded || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const adminName = user.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user.username || "Emperor";

  const stats = [
    { title: "Total Revenue", value: formatNaira(totalRevenue), icon: DollarSign },
    { title: "Total Orders", value: orders.length.toString(), icon: ShoppingCart },
    { title: "Total Products", value: products.length.toString(), icon: Package },
    { title: "Total Customers", value: uniqueCustomers.toString(), icon: Users },
  ];

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col border-r`}
      >
        <div className="p-6 border-b">
          <h1 className="font-bold text-xl">{sidebarOpen ? "Admin Panel" : "AP"}</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-card border-b sticky top-0 z-50 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {adminName}!</h2>
            <p className="text-muted-foreground">You have full control of the empire.</p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
                    <CardContent><OrdersTable /></CardContent>
                  </Card>
                </div>
                <div><ActivityFeed /></div>
              </div>
              <QuickStats />
            </TabsContent>

            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Products ({products.length})</CardTitle>
                  <AddProductDialog />
                </CardHeader>
                <CardContent>
                  <ProductsTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader><CardTitle>Detailed Statistics</CardTitle></CardHeader>
                <CardContent className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">More analytics coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;