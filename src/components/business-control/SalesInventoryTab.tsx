import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";

const SalesInventoryTab = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const { data: salesData } = useQuery({
    queryKey: ['sales-overview'],
    queryFn: async () => {
      const { data: sales } = await supabase
        .from('sales')
        .select('amount, created_at')
        .order('created_at', { ascending: true })
        .limit(30);
      
      return sales?.map(sale => ({
        date: new Date(sale.created_at).toLocaleDateString(),
        amount: Number(sale.amount)
      })) || [];
    }
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ['low-stock-products'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('name, stock')
        .lt('stock', 10)
        .order('stock', { ascending: true })
        .limit(5);
      
      return data || [];
    }
  });

  const renderChart = () => (
    <div className={`h-[${isMobile ? '200px' : '300px'}]`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: isMobile ? 10 : 12 }}
            interval={isMobile ? "preserveStartEnd" : 0}
          />
          <YAxis
            tick={{ fontSize: isMobile ? 10 : 12 }}
            width={isMobile ? 35 : 60}
          />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('business.sales.totalSales')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${salesData?.reduce((sum, sale) => sum + sale.amount, 0).toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('business.sales.lowStockItems')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('business.sales.alerts')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(lowStockProducts?.length || 0) > 0 ? t('business.sales.actionNeeded') : t('business.sales.allGood')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('business.sales.salesTrend')}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {lowStockProducts && lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('business.sales.lowStockAlerts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div key={product.name} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-red-500 text-sm">
                    {t('common.only')} {product.stock} {t('business.sales.itemsLeft')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesInventoryTab;
