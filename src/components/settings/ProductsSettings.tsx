
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { CategoryManager } from "@/components/products/CategoryManager";
import ProductManager from "@/components/products/ProductManager";
import { ProductThresholds } from "@/components/products/ProductThresholds";

const ProductsSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <CategoryManager />
      <ProductManager />
      <ProductThresholds />
    </div>
  );
};

export default ProductsSettings;
