import { Link } from "react-router-dom";
import { Facebook, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">ShopHub</h3>
            <p className="text-muted-foreground text-sm">
              Your one-stop destination for quality products at great prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-accent">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=electronics"
                  className="text-muted-foreground hover:text-accent"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=fashion"
                  className="text-muted-foreground hover:text-accent"
                >
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-accent">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Social (only FB, LinkedIn, Gmail) */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Stay Connected</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Follow us for updates and exclusive offers.
            </p>

            <div className="flex space-x-6">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/yourcompany"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>

              {/* Gmail – opens mailto */}
              <a
                href="mailto:shophub@example.com"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Email us"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;