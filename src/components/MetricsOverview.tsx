
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Shield, Activity, DollarSign, Target } from 'lucide-react';

interface MutualFundData {
  id: string;
  name: string;
  category: string;
  nav: number;
  aum: number;
  expenseRatio: number;
  returns: {
    '1y': number;
    '3y': number;
    '5y': number;
    '10y': number;
  };
  sharpeRatio: number;
  upsideCapture: number;
  downsideCapture: number;
  standardDeviation: number;
  beta: number;
  alpha: number;
}

interface CategoryBenchmark {
  category: string;
  avgReturns: {
    '1y': number;
    '3y': number;
    '5y': number;
    '10y': number;
  };
  avgSharpeRatio: number;
  avgUpsideCapture: number;
  avgDownsideCapture: number;
  avgExpenseRatio: number;
  avgStandardDeviation: number;
}

interface MetricsOverviewProps {
  fund: MutualFundData;
  benchmark: CategoryBenchmark;
  riskFreeRate: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ 
  fund, 
  benchmark, 
  riskFreeRate 
}) => {
  const getPerformanceColor = (value: number, benchmarkValue: number) => {
    return value > benchmarkValue ? 'text-green-600' : 'text-red-600';
  };

  const getPerformanceBadge = (value: number, benchmarkValue: number) => {
    const isOutperforming = value > benchmarkValue;
    return (
      <Badge variant={isOutperforming ? "default" : "secondary"} className="ml-2">
        {isOutperforming ? "Outperforming" : "Underperforming"}
      </Badge>
    );
  };

  const metrics = [
    {
      title: "1-Year Returns",
      icon: TrendingUp,
      value: `${fund.returns['1y'].toFixed(1)}%`,
      benchmark: `${benchmark.avgReturns['1y'].toFixed(1)}%`,
      color: getPerformanceColor(fund.returns['1y'], benchmark.avgReturns['1y']),
      badge: getPerformanceBadge(fund.returns['1y'], benchmark.avgReturns['1y'])
    },
    {
      title: "Sharpe Ratio",
      icon: Shield,
      value: fund.sharpeRatio.toFixed(2),
      benchmark: benchmark.avgSharpeRatio.toFixed(2),
      color: getPerformanceColor(fund.sharpeRatio, benchmark.avgSharpeRatio),
      badge: getPerformanceBadge(fund.sharpeRatio, benchmark.avgSharpeRatio)
    },
    {
      title: "Upside Capture",
      icon: TrendingUp,
      value: `${fund.upsideCapture.toFixed(1)}%`,
      benchmark: `${benchmark.avgUpsideCapture.toFixed(1)}%`,
      color: getPerformanceColor(fund.upsideCapture, benchmark.avgUpsideCapture),
      badge: getPerformanceBadge(fund.upsideCapture, benchmark.avgUpsideCapture)
    },
    {
      title: "Downside Capture",
      icon: TrendingDown,
      value: `${fund.downsideCapture.toFixed(1)}%`,
      benchmark: `${benchmark.avgDownsideCapture.toFixed(1)}%`,
      color: getPerformanceColor(benchmark.avgDownsideCapture, fund.downsideCapture), // Lower is better
      badge: getPerformanceBadge(benchmark.avgDownsideCapture, fund.downsideCapture)
    },
    {
      title: "Expense Ratio",
      icon: DollarSign,
      value: `${fund.expenseRatio.toFixed(2)}%`,
      benchmark: `${benchmark.avgExpenseRatio.toFixed(2)}%`,
      color: getPerformanceColor(benchmark.avgExpenseRatio, fund.expenseRatio), // Lower is better
      badge: getPerformanceBadge(benchmark.avgExpenseRatio, fund.expenseRatio)
    },
    {
      title: "Alpha",
      icon: Target,
      value: `${fund.alpha.toFixed(1)}%`,
      benchmark: "0.0%",
      color: fund.alpha > 0 ? 'text-green-600' : 'text-red-600',
      badge: (
        <Badge variant={fund.alpha > 0 ? "default" : "secondary"} className="ml-2">
          {fund.alpha > 0 ? "Positive Alpha" : "Negative Alpha"}
        </Badge>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Category Avg: {metric.benchmark}
                </p>
              </div>
              {metric.badge}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
