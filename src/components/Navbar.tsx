// src/components/Navbar.tsx – CLEAN & PROFESSIONAL (No gradient!)
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  useClerk,
} from "@clerk/clerk-react";

const Navbar = () => {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoaded, user } = useUser();
  const { openSignIn } = useClerk();

  const isAdmin = user?.publicMetadata?.role === "admin";

  if (!isLoaded) return null;

  const handleLogin = () => {
    openSignIn({
      afterSignInUrl: "/admin/redirect",
      afterSignUpUrl: "/admin/redirect",
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-border/50 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3">
            {/* Simple, clean logo */}
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="text-2xl font-bold text-primary tracking-tight">
              IPD-Emporium
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-foreground hover:text-primary font-medium transition-colors">
              Products
            </Link>
            <Link to="/products?category=electronics" className="text-foreground hover:text-primary font-medium transition-colors">
              Electronics
            </Link>
            <Link to="/products?category=fashion" className="text-foreground hover:text-primary font-medium transition-colors">
              Fashion
            </Link>
            <Link to="/products?category=home" className="text-foreground hover:text-primary font-medium transition-colors">
              Home
            </Link>

            {/* Admin Dashboard */}
            {isAdmin && (
              <NavLink
                to="/admin/dashboard"
                className="flex items-center gap-2 text-foreground hover:text-primary font-medium transition-colors aria-[current=page]:text-primary aria-[current=page]:font-bold"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Right Side - Cart & Auth */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground flex items-center justify-center rounded-full">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <SignedOut>
              <Button onClick={handleLogin} variant="default" size="sm">
                Login
              </Button>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground rounded-full">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(v => !v)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <Link to="/products" className="block py-2 text-foreground font-medium" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>
            <Link to="/products?category=electronics" className="block py-2 text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Electronics
            </Link>
            <Link to="/products?category=fashion" className="block py-2 text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Fashion
            </Link>
            <Link to="/products?category=home" className="block py-2 text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 py-3 text-primary font-semibold border-t pt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5" />
                Admin Dashboard
              </Link>
            )}

            <div className="border-t pt-4">
              <SignedOut>
                <Button onClick={handleLogin} className="w-full" size="lg">
                  Login
                </Button>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-3 py-2">
                  <UserButton afterSignOutUrl="/" />
                  <span className="font-medium">My Account</span>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;