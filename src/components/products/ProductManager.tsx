
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { ProductWithCategory } from "@/types/products";

const ProductManager = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null);
  const [newProduct, setNewProduct] = useState(false);

  // Fetch products with categories
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_categories (
            id,
            name,
            description
          )
        `)
        .order('name');

      if (error) throw error;
      return data as ProductWithCategory[];
    },
  });

  // Fetch categories for the select input
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Mutation for creating/updating products
  const productMutation = useMutation({
    mutationFn: async (product: Partial<ProductWithCategory>) => {
      const { data, error } = await supabase
        .from('products')
        .upsert({
          id: product.id,
          name: product.name,
          description: product.description,
          category_id: product.category_id,
          stock: product.stock || 0,
          price: product.price || 0,
          active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: t('common.success'),
        description: t(editingProduct ? 'products.productUpdated' : 'products.productAdded'),
      });
      setEditingProduct(null);
      setNewProduct(false);
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: t(editingProduct ? 'products.errorUpdatingProduct' : 'products.errorAddingProduct'),
        variant: "destructive",
      });
      console.error('Error:', error);
    },
  });

  const handleSave = (product: Partial<ProductWithCategory>) => {
    if (!product.name || !product.category_id) {
      toast({
        title: t('common.error'),
        description: t('products.fillAllFields'),
        variant: "destructive",
      });
      return;
    }
    productMutation.mutate(product);
  };

  if (productsLoading) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('products.products')}</CardTitle>
            <CardDescription>{t('products.manageProducts')}</CardDescription>
          </div>
          <Button
            onClick={() => setNewProduct(true)}
            className="ml-4"
            disabled={newProduct}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('common.add')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(newProduct || editingProduct) && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder={t('products.productName')}
                      value={editingProduct?.name || ''}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value } as ProductWithCategory))}
                    />
                    <Select
                      value={editingProduct?.category_id || ''}
                      onValueChange={(value) => setEditingProduct(prev => ({ ...prev, category_id: value } as ProductWithCategory))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('products.selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    type="number"
                    placeholder={t('products.stock')}
                    value={editingProduct?.stock || 0}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, stock: parseInt(e.target.value) } as ProductWithCategory))}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingProduct(null);
                        setNewProduct(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      {t('common.cancel')}
                    </Button>
                    <Button onClick={() => handleSave(editingProduct || {})}>
                      <Save className="h-4 w-4 mr-2" />
                      {t('common.save')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('products.productName')}</TableHead>
                <TableHead>{t('products.category')}</TableHead>
                <TableHead>{t('products.stock')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.product_categories?.name || t('products.noCategory')}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductManager;
