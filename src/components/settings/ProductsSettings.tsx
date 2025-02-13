
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";
import { CategoryManager } from "@/components/products/CategoryManager";
import ProductManager from "@/components/products/ProductManager";
import { ProductThresholds } from "@/components/products/ProductThresholds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProductsSettings = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {t('products.productSettings')}
        </CardTitle>
        <CardDescription>
          {t('products.manageProducts')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">
              {t('products.categories')}
            </TabsTrigger>
            <TabsTrigger value="products">
              {t('products.products')}
            </TabsTrigger>
            <TabsTrigger value="thresholds">
              {t('products.productThresholds')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          <TabsContent value="thresholds">
            <ProductThresholds />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductsSettings;
