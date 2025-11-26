// src/components/admin/AddProductDialog.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, X } from "lucide-react";
import { useProductsStore } from "@/lib/products-store";
import { toast } from "sonner";

const categories = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Sports",
  "Books",
  "Beauty",
];

export const AddProductDialog = () => {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Electronics"); // ← NEW STATE
  const addProduct = useProductsStore((state) => state.addProduct);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const price = Number(form.get("price"));
    const salePrice = form.get("salePrice") ? Number(form.get("salePrice")) : undefined;
    const name = form.get("name") as string;

    if (!name || !price || !imagePreview || !selectedCategory) {
      toast.error("Please fill all required fields");
      return;
    }

    addProduct({
      name,
      description: (form.get("description") as string) || "No description",
      price,
      salePrice,
      image: imagePreview!,
      images: [imagePreview!],
      category: selectedCategory, // ← NOW GUARANTEED
      stock: Number(form.get("stock")) || 20,
      rating: 4.5,
      reviews: 0,
      featured: false,
    });

    toast.success(`${name} added successfully!`);
    
    // Reset everything
    e.currentTarget.reset();
    setImagePreview(null);
    setSelectedCategory("Electronics");
    setOpen(false); // ← Dialog closes properly
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Product Name *</Label>
              <Input name="name" required placeholder="iPhone 15 Case" />
            </div>

            {/* CATEGORY NOW WORKS */}
            <div>
              <Label>Category *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Hidden input so React Hook Form or native form works if needed */}
              <input type="hidden" name="category" value={selectedCategory} />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea name="description" placeholder="Describe your product..." rows={3} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Price (₦) *</Label>
              <Input type="number" name="price" placeholder="50000" required />
            </div>
            <div>
              <Label>Sale Price (₦)</Label>
              <Input type="number" name="salePrice" placeholder="40000 (optional)" />
            </div>
            <div>
              <Label>Stock</Label>
              <Input type="number" name="stock" defaultValue="20" />
            </div>
          </div>

          <div>
            <Label>Product Image *</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="hidden"
                id="img-upload"
              />
              <Label htmlFor="img-upload" className="cursor-pointer block">
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <span className="text-sm">Click to upload image</span>
              </Label>
            </div>

            {imagePreview && (
              <div className="relative mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => setImagePreview(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};