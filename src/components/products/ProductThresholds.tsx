
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import { ProductCategory, ProductWithCategory } from '@/types/products';

interface ThresholdData {
  id?: string;
  product_id: string;
  store_id: string;
  low_threshold: number;
  critical_threshold: number;
}

export function ProductThresholds() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Get store_id from staff table
        const { data: staffData } = await supabase
          .from('staff')
          .select('store_id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (staffData?.store_id) {
          setStoreId(staffData.store_id);

          // Load categories
          const { data: categoriesData } = await supabase
            .from('product_categories')
            .select('*')
            .eq('store_id', staffData.store_id);

          if (categoriesData) {
            setCategories(categoriesData);
          }

          // Load products with their thresholds
          const { data: productsData } = await supabase
            .from('products')
            .select(`
              *,
              product_thresholds (
                id,
                low_threshold,
                critical_threshold
              )
            `)
            .eq('store_id', staffData.store_id);

          if (productsData) {
            setProducts(productsData.map((product: any) => ({
              ...product,
              custom_low_threshold: product.product_thresholds?.[0]?.low_threshold,
              custom_critical_threshold: product.product_thresholds?.[0]?.critical_threshold,
              threshold_id: product.product_thresholds?.[0]?.id
            })));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: t('common.error'),
          description: t('products.errorLoadingData'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [t, toast]);

  const handleUpdateThreshold = async (productId: string, lowThreshold: number, criticalThreshold: number) => {
    if (!storeId) return;

    try {
      // Get the current product to check if it already has a threshold
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const thresholdData: ThresholdData = {
        id: product.threshold_id, // Include the existing ID if it exists
        product_id: productId,
        store_id: storeId,
        low_threshold: lowThreshold,
        critical_threshold: criticalThreshold
      };

      const { error } = await supabase
        .from('product_thresholds')
        .upsert(thresholdData, {
          onConflict: 'product_id,store_id'
        });

      if (error) throw error;

      setProducts(products.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            custom_low_threshold: lowThreshold,
            custom_critical_threshold: criticalThreshold
          };
        }
        return p;
      }));

      toast({
        title: t('common.success'),
        description: t('products.thresholdsUpdated'),
      });
    } catch (error) {
      console.error('Error updating thresholds:', error);
      toast({
        title: t('common.error'),
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const handleResetThresholds = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('product_thresholds')
        .delete()
        .eq('product_id', productId);

      if (error) throw error;

      setProducts(products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            custom_low_threshold: null,
            custom_critical_threshold: null,
            threshold_id: null
          };
        }
        return product;
      }));

      toast({
        title: t('common.success'),
        description: t('products.thresholdsReset'),
      });
    } catch (error) {
      console.error('Error resetting thresholds:', error);
      toast({
        title: t('common.error'),
        description: t('products.errorResettingThresholds'),
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {t('products.productThresholds')}
        </CardTitle>
        <CardDescription>{t('products.productThresholdsDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('products.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('products.allCategories')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder={t('products.searchProducts')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('products.productName')}</TableHead>
                  <TableHead>{t('products.category')}</TableHead>
                  <TableHead>{t('products.low')}</TableHead>
                  <TableHead>{t('products.critical')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {categories.find(c => c.id === product.category_id)?.name || t('products.noCategory')}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={product.custom_low_threshold || ''}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            handleUpdateThreshold(
                              product.id,
                              value,
                              product.custom_critical_threshold || 5
                            );
                          }
                        }}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={product.custom_critical_threshold || ''}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            handleUpdateThreshold(
                              product.id,
                              product.custom_low_threshold || 10,
                              value
                            );
                          }
                        }}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetThresholds(product.id)}
                      >
                        {t('products.resetToCategory')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
