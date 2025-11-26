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
  Crown,
  Shield,
  Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserButton, useUser } from "@clerk/clerk-react";

import { useOrders } from "@/contexts/OrdersContext";
import { useProductsStore } from "@/lib/products-store";
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
  const { user, isLoaded, isSignedIn } = useUser();
  const { orders } = useOrders();
  const products = useProductsStore((state) => state.products);
  const navigate = useNavigate();

  // === IMPENETRABLE SECURITY GUARD ===
  useEffect(() => {
    const checkEmperorAccess = () => {
      const hasPasscode = sessionStorage.getItem("admin-passcode-ok") === "true";
      const hasAuthFlag = localStorage.getItem("admin-auth") === "true";
      const isClerkSignedIn = isSignedIn && document.querySelector("[data-clerk-user]");

      if (!hasPasscode || !hasAuthFlag || !isClerkSignedIn) {
        toast.error("Unauthorized. Only the Emperor may enter.");
        navigate("/emperor-access-2025", { replace: true });
        return false;
      }
      return true;
    };

    // Initial check
    if (!checkEmperorAccess()) return;

    // Continuous protection
    const guardian = setInterval(checkEmperorAccess, 2000);
    return () => clearInterval(guardian);
  }, [isSignedIn, navigate]);

  // Stats
  const uniqueCustomers = new Set(orders.map((o) => o.customer.email)).size;
  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "delivered")
    .reduce((sum, order) => sum + (order.total || 0), 0);

  if (!isLoaded || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center">
          <Crown className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-pulse" />
          <p className="text-xl text-purple-400">Verifying Imperial Access...</p>
        </div>
      </div>
    );
  }

  const adminName = user.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user.username || "Emperor";

  const stats = [
    { title: "Imperial Treasury", value: formatNaira(totalRevenue), icon: DollarSign, color: "text-green-500" },
    { title: "Total Decrees", value: orders.length.toString(), icon: ShoppingCart, color: "text-blue-500" },
    { title: "Empire Inventory", value: products.length.toString(), icon: Package, color: "text-purple-500" },
    { title: "Loyal Subjects", value: uniqueCustomers.toString(), icon: Users, color: "text-orange-500" },
  ];

  const navigation = [
    { name: "Imperial Throne", icon: Crown, path: "/admin/dashboard" },
    { name: "Command Center", icon: Zap, path: "/admin/dashboard" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-purple-900/20 to-black text-white">
      {/* Imperial Sidebar */}
      <aside className={`${sidebarOpen ? "w-72" : "w-20"} bg-black/80 backdrop-blur border-r border-purple-500/30 transition-all duration-500 flex flex-col`}>
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <Crown className="w-10 h-10 text-purple-400" />
            {sidebarOpen && <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Emperor Panel</h1>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-purple-900/50 transition-all group"
              activeClassName="bg-gradient-to-r from-purple-600 to-pink-600 shadow-2xl"
            >
              <item.icon className="w-6 h-6 text-purple-300 group-hover:text-white transition-colors" />
              {sidebarOpen && <span className="font-medium text-lg">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-500/30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full hover:bg-purple-900/50"
          >
            <Menu className="w-6 h-6 text-purple-300" />
          </Button>
        </div>
      </aside>

      {/* Main Throne Room */}
      <main className="flex-1 overflow-auto">
        <header className="bg-black/70 backdrop-blur border-b border-purple-500/30 sticky top-0 z-50 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome back, {adminName}
            </h2>
            <p className="text-purple-300 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              You rule with absolute power
            </p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>

        <div className="p-8 space-y-10">
          {/* Imperial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-gradient-to-br from-purple-900/50 to-black border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-purple-200 text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-black/50 border border-purple-500/30">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Empire Overview</TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-purple-600">Imperial Inventory</TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-purple-600">War Room</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="bg-black/60 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-2xl text-purple-300">Recent Imperial Decrees</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <OrdersTable />
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <ActivityFeed />
                </div>
              </div>
              <QuickStats />
            </TabsContent>

            <TabsContent value="products">
              <Card className="bg-black/60 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl text-purple-300">
                    Empire's Vault ({products.length} Items)
                  </CardTitle>
                  <AddProductDialog />
                </CardHeader>
                <CardContent>
                  <ProductsTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card className="bg-black/60 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-300">Imperial Analytics</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-20">
                  <Zap className="w-20 h-20 text-purple-500 mx-auto mb-6 opacity-50" />
                  <p className="text-2xl text-purple-300">Advanced analytics deploying soon...</p>
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