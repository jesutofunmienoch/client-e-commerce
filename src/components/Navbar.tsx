// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

// Logo with Infinite Rotating Gradient Border (only around the image)
const GradientLogo = () => {
  return (
    <div className="relative group">
      {/* Rotating Gradient Ring */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 animate-spin-slow"></div>
      
      {/* Actual Logo Image */}
      <div className="relative p-0.2 bg-white dark:bg-gray-900 rounded-full ring-4 ring-white/50 dark:ring-gray-900/50">
        <img
          src="/favicon.png"
          alt="ShopHub Logo"
          className="h-7 w-7 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

const Navbar = () => {
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/30 shadow-lg">
      {/* Add the slow spin animation once */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + ShopHub Name */}
          <Link to="/" className="flex items-center space-x-3">
            <GradientLogo />
            <span className="text-2xl font-bold text-primary">ShopHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-foreground/90 hover:text-primary transition-colors font-medium">
              Products
            </Link>
            <Link to="/products?category=electronics" className="text-foreground/90 hover:text-primary transition-colors font-medium">
              Electronics
            </Link>
            <Link to="/products?category=fashion" className="text-foreground/90 hover:text-primary transition-colors font-medium">
              Fashion
            </Link>
            <Link to="/products?category=home" className="text-foreground/90 hover:text-primary transition-colors font-medium">
              Home
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-foreground/80 hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <Button variant="ghost" size="icon" onClick={logout} className="text-foreground/80 hover:text-primary">
                <User className="h-5 w-5" />
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="default" className="bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-foreground/80">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground/80"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-t border-white/20 dark:border-gray-700/30">
          <div className="px-4 pt-3 pb-4 space-y-1">
            <Link to="/products" className="block px-3 py-2 rounded-md text-foreground/90 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>
            <Link to="/products?category=electronics" className="block px-3 py-2 rounded-md text-foreground/90 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Electronics
            </Link>
            <Link to="/products?category=fashion" className="block px-3 py-2 rounded-md text-foreground/90 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Fashion
            </Link>
            <Link to="/products?category=home" className="block px-3 py-2 rounded-md text-foreground/90 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="block px-3 py-2 rounded-md text-foreground/90 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;