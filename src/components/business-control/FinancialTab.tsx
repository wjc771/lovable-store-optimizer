import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, CreditCard, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";

const FinancialTab = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const { data: financialOverview } = useQuery({
    queryKey: ['financial-overview'],
    queryFn: async () => {
      const { data: sales } = await supabase
        .from('sales')
        .select('amount, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const dailyTotals = (sales || []).reduce((acc: Record<string, number>, sale) => {
        const date = new Date(sale.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + (typeof sale.amount === 'number' ? sale.amount : 0);
        return acc;
      }, {});

      return Object.entries(dailyTotals).map(([date, amount]) => ({
        date,
        amount: Number(amount)
      }));
    }
  });

  const { data: orderStats } = useQuery({
    queryKey: ['order-stats'],
    queryFn: async () => {
      const { data: pendingOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'pending');

      const pendingAmount = pendingOrders?.reduce((sum, order) => 
        sum + (typeof order.total_amount === 'number' ? Number(order.total_amount) : 0), 0) || 0;

      return {
        pendingAmount
      };
    }
  });

  const totalRevenue = financialOverview?.reduce((sum, day) => sum + day.amount, 0) || 0;
  const averageOrderValue = financialOverview && financialOverview.length > 0
    ? totalRevenue / financialOverview.length
    : 0;

  const renderChart = () => (
    <div className={`h-[${isMobile ? '200px' : '300px'}]`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={financialOverview}>
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
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('business.financial.revenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('business.financial.pendingPayments')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${orderStats?.pendingAmount.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('business.financial.averageOrder')}</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${averageOrderValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('business.financial.weeklyRevenue')}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialTab;
