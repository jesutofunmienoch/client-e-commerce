// src/pages/Products.tsx
import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useProductsStore } from "@/lib/products-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, Search as SearchIcon } from "lucide-react";

const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Fixed: Match actual category names from your store
const categories = [
  { id: "all", name: "All Products" },
  { id: "Electronics", name: "Electronics" },
  { id: "Fashion", name: "Fashion" },
  { id: "Home & Living", name: "Home & Living" },
  { id: "Sports", name: "Sports" },
  { id: "Books", name: "Books" },
  { id: "Beauty", name: "Beauty" },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlQuery = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  // REACTIVE: Always up to date
  const products = useProductsStore((state) => state.products);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Search
    if (urlQuery.trim()) {
      const query = urlQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Category filter - NOW WORKS!
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price range
    filtered = filtered.filter((p) => {
      const price = p.salePrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-high":
        sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured first
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return sorted;
  }, [products, urlQuery, selectedCategory, sortBy, priceRange]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    const newParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newParams.set("q", value.trim());
    } else {
      newParams.delete("q");
    }
    navigate(`/products?${newParams.toString()}`, { replace: true });
  };

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4">Category</h3>
        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value={cat.id} id={cat.id} />
              <Label htmlFor={cat.id} className="cursor-pointer font-normal">
                {cat.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="mb-4 text-sm text-muted-foreground">
          {formatNaira(priceRange[0])} – {formatNaira(priceRange[1])}
        </div>
        <Slider
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          max={1000000}
          step={5000}
        />
      </div>

      <div>
        <h3 className="font-semibold mb-4">Sort By</h3>
        <RadioGroup value={sortBy} onValueChange={setSortBy}>
          {[
            { value: "featured", label: "Featured" },
            { value: "price-low", label: "Price: Low to High" },
            { value: "price-high", label: "Price: High to Low" },
            { value: "rating", label: "Highest Rated" },
          ].map((item) => (
            <div key={item.value} className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value={item.value} id={item.value} />
              <Label htmlFor={item.value} className="cursor-pointer font-normal">
                {item.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">
            {urlQuery ? `Results for "${urlQuery}"` : "All Products"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? "s" : ""} available
          </p>

          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-6">Filters</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-muted-foreground">
                Showing {filteredAndSortedProducts.length} of {products.length} products
              </div>

              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters & Sort</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground mb-4">
                  No products found matching your filters
                </p>
                <Button onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange([0, 1000000]);
                  setSortBy("featured");
                  navigate("/products");
                }}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;