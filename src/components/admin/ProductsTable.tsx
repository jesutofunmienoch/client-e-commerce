// src/components/admin/ProductsTable.tsx
import { useState } from "react";
import { useProductsStore, Product } from "@/lib/products-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const ProductsTable = () => {
  // REACTIVE: Subscribe to store
  const { products, deleteProduct, updateProduct } = useProductsStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const saveEdit = () => {
    if (!editingId || !editForm.name || editForm.price === undefined) {
      toast.error("Name and price are required");
      return;
    }

    updateProduct(editingId, editForm);
    toast.success("Product updated successfully");
    setEditingId(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      toast.success("Product deleted");
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No products yet. Add your first product!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="text-left py-3 px-4 font-medium">Image</th>
            <th className="text-left py-3 px-4 font-medium">Name</th>
            <th className="text-left py-3 px-4 font-medium">Price</th>
            <th className="text-left py-3 px-4 font-medium">Stock</th>
            <th className="text-left py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
              <td className="py-4 px-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg border"
                />
              </td>

              <td className="py-4 px-4">
                {editingId === product.id ? (
                  <Input
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full"
                    autoFocus
                  />
                ) : (
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                )}
              </td>

              <td className="py-4 px-4">
                {editingId === product.id ? (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={editForm.price || ""}
                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                      placeholder="Price"
                    />
                    <Input
                      type="number"
                      value={editForm.salePrice || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, salePrice: e.target.value ? Number(e.target.value) : undefined })
                      }
                      placeholder="Sale Price (optional)"
                    />
                  </div>
                ) : (
                  <div>
                    {product.salePrice ? (
                      <>
                        <span className="font-bold text-green-600">{formatNaira(product.salePrice)}</span>
                        <span className="line-through text-muted-foreground text-xs ml-2">
                          {formatNaira(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium">{formatNaira(product.price)}</span>
                    )}
                  </div>
                )}
              </td>

              <td className="py-4 px-4">
                {editingId === product.id ? (
                  <Input
                    type="number"
                    value={editForm.stock || 0}
                    onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                  />
                ) : (
                  <span className={product.stock < 10 ? "text-orange-600 font-medium" : ""}>
                    {product.stock} in stock
                  </span>
                )}
              </td>

              <td className="py-4 px-4">
                <div className="flex gap-2">
                  {editingId === product.id ? (
                    <>
                      <Button size="icon" variant="ghost" onClick={saveEdit}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={cancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => startEdit(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(product.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};