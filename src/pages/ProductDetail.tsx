// src/pages/ProductDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useProductsStore } from "@/lib/products-store"; // ← REACTIVE
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Star, Truck, Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  // REACTIVELY get product by ID
  const product = useProductsStore((state) =>
    state.products.find((p) => p.id === id)
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <Badge className="absolute top-4 right-4 bg-sale text-lg px-3 py-1">
                  Sale
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} reviews)</span>
                </div>
                {product.stock < 10 && product.stock > 0 && (
                  <Badge variant="secondary">Only {product.stock} left</Badge>
                )}
                {product.stock === 0 && <Badge variant="destructive">Out of Stock</Badge>}
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-price">
                {formatNaira(displayPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-2xl text-muted-foreground line-through">
                    {formatNaira(product.price)}
                  </span>
                  <Badge className="bg-sale text-lg">
                    Save {formatNaira(product.price - displayPrice)}
                  </Badge>
                </>
              )}
            </div>

            <p className="text-foreground leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-4">
              <label className="font-semibold text-foreground">Quantity:</label>
              <div className="flex items-center border border-border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-6 py-2 font-semibold min-w-16 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || product.stock === 0}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full text-lg font-semibold"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>

            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-accent" />
                <span className="text-foreground">Free shipping on orders over ₦50,000</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-accent" />
                <span className="text-foreground">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;