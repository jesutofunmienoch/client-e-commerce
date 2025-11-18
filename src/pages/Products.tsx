// src/pages/Products.tsx
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, Search as SearchIcon } from "lucide-react";

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL params
  const urlQuery = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category");

  // Local states
  const [searchInput, setSearchInput] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || "all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  // Sync search input with URL on mount or when URL changes
  useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);

  // Sync category filter with URL
  useEffect(() => {
    setSelectedCategory(categoryFilter || "all");
  }, [categoryFilter]);

  // Main filtering + sorting logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // 1. Search query filter
    if (urlQuery.trim()) {
      const query = urlQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // 2. Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // 3. Price filter
    filtered = filtered.filter((p) => {
      const price = p.salePrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // 4. Sorting
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
        // Assuming original array is newest first
        break;
      default:
        // Featured first
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }

    return filtered;
  }, [urlQuery, selectedCategory, sortBy, priceRange]);

  // Handle live search (updates URL instantly)
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
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Category</h3>
        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer font-normal">
              All Products
            </Label>
          </div>
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

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </h3>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={0}
          max={500}
          step={10}
          className="w-full"
        />
      </div>

      {/* Sort By */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Sort By</h3>
        <RadioGroup value={sortBy} onValueChange={setSortBy}>
          {[
            { value: "featured", label: "Featured" },
            { value: "price-low", label: "Price: Low to High" },
            { value: "price-high", label: "Price: High to Low" },
            { value: "rating", label: "Highest Rated" },
            { value: "newest", label: "Newest" },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header + Search Bar */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            {urlQuery ? `Search Results for "${urlQuery}"` : "All Products"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {filteredAndSortedProducts.length} products found
          </p>

          {/* Search Input on Page */}
          <div className="relative max-w-xl">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          {/* Mobile Filters Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters & Sort
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters & Sorting</SheetTitle>
              </SheetHeader>
              <div className="mt-8">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-10">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-card p-7 rounded-xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-8">Filters</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  No products found matching your criteria.
                </p>
                {urlQuery && (
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchInput("");
                      navigate("/products");
                    }}
                    className="mt-4"
                  >
                    Clear search
                  </Button>
                )}
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