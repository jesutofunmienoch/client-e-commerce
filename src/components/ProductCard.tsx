// src/components/ProductCard.tsx
import { Link } from "react-router-dom";
import { Product } from "@/lib/products-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      ...product,
      price: product.salePrice || product.price,
      salePrice: product.salePrice,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - displayPrice) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="block h-full">
      <Card className="h-full flex flex-col overflow-hidden border hover:border-primary/40 hover:shadow-xl transition-all duration-300 group">
        <div className="relative aspect-square bg-muted/10 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {hasDiscount && (
            <Badge className="absolute top-3 right-3 bg-red-600 text-white font-bold">
              -{discountPercent}%
            </Badge>
          )}

          {product.stock < 10 && product.stock > 0 && (
            <Badge variant="secondary" className="absolute top-3 left-3">
              Only {product.stock} left
            </Badge>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-white font-bold text-xl">Sold Out</span>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-4 flex flex-col">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mt-2 text-sm">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.rating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews})</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">
              {formatNaira(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                {formatNaira(product.price)}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full h-12 text-base font-medium"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;