import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || "all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 500]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter((p) => {
      const price = p.salePrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // Keep original order (newest first in our mock data)
        break;
      default:
        // Featured/default
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }

    return filtered;
  }, [selectedCategory, sortBy, priceRange]);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Category</h3>
        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer">All Products</Label>
          </div>
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={cat.id} id={cat.id} />
              <Label htmlFor={cat.id} className="cursor-pointer">{cat.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={500}
          step={10}
          className="w-full"
        />
      </div>

      {/* Sort By */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Sort By</h3>
        <RadioGroup value={sortBy} onValueChange={setSortBy}>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="featured" id="featured" />
            <Label htmlFor="featured" className="cursor-pointer">Featured</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="price-low" id="price-low" />
            <Label htmlFor="price-low" className="cursor-pointer">Price: Low to High</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="price-high" id="price-high" />
            <Label htmlFor="price-high" className="cursor-pointer">Price: High to Low</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="rating" id="rating" />
            <Label htmlFor="rating" className="cursor-pointer">Highest Rated</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="newest" id="newest" />
            <Label htmlFor="newest" className="cursor-pointer">Newest</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">All Products</h1>
            <p className="text-muted-foreground">
              {filteredAndSortedProducts.length} products found
            </p>
          </div>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">Filters</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  No products found matching your criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
