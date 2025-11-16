import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/data/products";
import { Laptop, Shirt, Home, Dumbbell, Book, Sparkles } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  Book,
  Sparkles,
};

const CategorySection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our curated collections
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon];
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
