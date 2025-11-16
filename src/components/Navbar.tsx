import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            ShopHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className="text-foreground/90 hover:text-primary transition-colors font-medium"
            >
              Products
            </Link>
            <Link
              to="/products?category=electronics"
              className="text-foreground/90 hover:text-primary transition-colors font-medium"
            >
              Electronics
            </Link>
            <Link
              to="/products?category=fashion"
              className="text-foreground/90 hover:text-primary transition-colors font-medium"
            >
              Fashion
            </Link>
            <Link
              to="/products?category=home"
              className="text-foreground/90 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>

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
                <Button
                  variant="default"
                  className="bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu - Also Glassy */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-t border-white/20 dark:border-gray-700/30">
          <div className="px-4 pt-3 pb-4 space-y-1">
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md text-foreground/90 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/products?category=electronics"
              className="block px-3 py-2 rounded-md text-foreground/90 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Electronics
            </Link>
            <Link
              to="/products?category=fashion"
              className="block px-3 py-2 rounded-md text-foreground/90 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fashion
            </Link>
            <Link
              to="/products?category=home"
              className="block px-3 py-2 rounded-md text-foreground/90 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-foreground/90 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
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