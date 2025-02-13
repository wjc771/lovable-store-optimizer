
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ProductCategory, CategoryThreshold } from "@/types/products";

export function CategoryManager() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [thresholds, setThresholds] = useState<CategoryThreshold[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: staffData } = await supabase
        .from('staff')
        .select('store_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!staffData?.store_id) return;

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('store_id', staffData.store_id);

      if (categoriesError) throw categoriesError;

      const { data: thresholdsData, error: thresholdsError } = await supabase
        .from('category_thresholds')
        .select('*')
        .eq('store_id', staffData.store_id);

      if (thresholdsError) throw thresholdsError;

      setCategories(categoriesData || []);
      setThresholds(thresholdsData || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: t('common.error'),
        description: t('products.errorLoadingCategories'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory.name.trim()) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: staffData } = await supabase
        .from('staff')
        .select('store_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!staffData?.store_id) return;

      const { data, error } = await supabase
        .from('product_categories')
        .insert({
          name: newCategory.name,
          description: newCategory.description,
          store_id: staffData.store_id
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Criar thresholds padrão para a nova categoria
        const { error: thresholdError } = await supabase
          .from('category_thresholds')
          .insert({
            category_id: data.id,
            store_id: staffData.store_id,
            low_threshold: 10,
            critical_threshold: 5
          });

        if (thresholdError) throw thresholdError;

        setNewCategory({ name: "", description: "" });
        loadCategories();
        
        toast({
          title: t('common.success'),
          description: t('products.categoryAdded'),
        });
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: t('common.error'),
        description: t('products.errorAddingCategory'),
        variant: "destructive",
      });
    }
  };

  const handleUpdateThresholds = async (categoryId: string, data: Partial<CategoryThreshold>) => {
    try {
      const { error } = await supabase
        .from('category_thresholds')
        .update(data)
        .eq('category_id', categoryId);

      if (error) throw error;

      loadCategories();
      toast({
        title: t('common.success'),
        description: t('products.thresholdsUpdated'),
      });
    } catch (error) {
      console.error('Error updating thresholds:', error);
      toast({
        title: t('common.error'),
        description: t('products.errorUpdatingThresholds'),
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      loadCategories();
      toast({
        title: t('common.success'),
        description: t('products.categoryDeleted'),
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: t('common.error'),
        description: t('products.errorDeletingCategory'),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="space-y-4">
      <div className="h-32 animate-pulse bg-gray-100 rounded-lg" />
    </div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('products.categories')}</CardTitle>
        <CardDescription>{t('products.categoriesDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input
            placeholder={t('products.categoryName')}
            value={newCategory.name}
            onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder={t('products.description')}
            value={newCategory.description}
            onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
          />
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" />
            {t('common.add')}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('products.categoryName')}</TableHead>
              <TableHead>{t('products.lowThreshold')}</TableHead>
              <TableHead>{t('products.criticalThreshold')}</TableHead>
              <TableHead>{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const threshold = thresholds.find(t => t.category_id === category.id);
              return (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={threshold?.low_threshold || 10}
                      onChange={(e) => handleUpdateThresholds(category.id, {
                        low_threshold: parseInt(e.target.value)
                      })}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={threshold?.critical_threshold || 5}
                      onChange={(e) => handleUpdateThresholds(category.id, {
                        critical_threshold: parseInt(e.target.value)
                      })}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
