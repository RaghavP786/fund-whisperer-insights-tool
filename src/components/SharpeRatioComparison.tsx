
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Info, TrendingUp, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MutualFundData {
  name: string;
  sharpeRatio: number;
  returns: {
    '1y': number;
    '3y': number;
    '5y': number;
  };
  standardDeviation: number;
}

interface CategoryBenchmark {
  category: string;
  avgSharpeRatio: number;
  avgReturns: {
    '1y': number;
    '3y': number;
    '5y': number;
  };
  avgStandardDeviation: number;
}

interface SharpeRatioComparisonProps {
  fund: MutualFundData;
  benchmark: CategoryBenchmark;
  riskFreeRate: number;
}

export const SharpeRatioComparison: React.FC<SharpeRatioComparisonProps> = ({ 
  fund, 
  benchmark, 
  riskFreeRate 
}) => {
  // Calculate Sharpe ratios for different periods
  const sharpeData = [
    {
      period: '1 Year',
      Fund: ((fund.returns['1y'] - riskFreeRate) / fund.standardDeviation),
      Category: ((benchmark.avgReturns['1y'] - riskFreeRate) / benchmark.avgStandardDeviation)
    },
    {
      period: '3 Years',
      Fund: ((fund.returns['3y'] - riskFreeRate) / fund.standardDeviation),
      Category: ((benchmark.avgReturns['3y'] - riskFreeRate) / benchmark.avgStandardDeviation)
    },
    {
      period: '5 Years',
      Fund: ((fund.returns['5y'] - riskFreeRate) / fund.standardDeviation),
      Category: ((benchmark.avgReturns['5y'] - riskFreeRate) / benchmark.avgStandardDeviation)
    }
  ];

  const overallComparison = [
    {
      name: 'Fund',
      value: fund.sharpeRatio,
      color: '#3b82f6'
    },
    {
      name: 'Category Average',
      value: benchmark.avgSharpeRatio,
      color: '#f97316'
    }
  ];

  const riskReturnData = [
    {
      name: fund.name,
      risk: fund.standardDeviation,
      return: fund.returns['3y'],
      sharpe: fund.sharpeRatio
    },
    {
      name: `${benchmark.category} Average`,
      risk: benchmark.avgStandardDeviation,
      return: benchmark.avgReturns['3y'],
      sharpe: benchmark.avgSharpeRatio
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Fund Sharpe: {payload[0].value.toFixed(2)}
          </p>
          <p className="text-orange-600">
            Category Sharpe: {payload[1].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const getSharpeInterpretation = (sharpe: number) => {
    if (sharpe > 1.5) return { level: "Excellent", color: "text-green-600", description: "Very strong risk-adjusted returns" };
    if (sharpe > 1.0) return { level: "Good", color: "text-green-500", description: "Good risk-adjusted returns" };
    if (sharpe > 0.5) return { level: "Average", color: "text-yellow-600", description: "Moderate risk-adjusted returns" };
    return { level: "Poor", color: "text-red-600", description: "Below average risk-adjusted returns" };
  };

  const fundInterpretation = getSharpeInterpretation(fund.sharpeRatio);
  const categoryInterpretation = getSharpeInterpretation(benchmark.avgSharpeRatio);

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The Sharpe ratio measures risk-adjusted returns using the formula: (Fund Return - Risk-Free Rate) / Standard Deviation. 
          Higher values indicate better risk-adjusted performance. Risk-free rate used: {riskFreeRate}%
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Sharpe Ratio Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Overall Sharpe Ratio
            </CardTitle>
            <CardDescription>
              Risk-adjusted performance comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ 
                  name: 'Comparison', 
                  Fund: fund.sharpeRatio, 
                  Category: benchmark.avgSharpeRatio 
                }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Sharpe Ratio', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Fund" fill="#3b82f6" name={fund.name} />
                  <Bar dataKey="Category" fill="#f97316" name={`${benchmark.category} Average`} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">{fund.name}</span>
                <div className="text-right">
                  <span className={`text-lg font-bold ${fundInterpretation.color}`}>
                    {fund.sharpeRatio.toFixed(2)}
                  </span>
                  <p className="text-xs text-gray-600">{fundInterpretation.level}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium">{benchmark.category} Average</span>
                <div className="text-right">
                  <span className={`text-lg font-bold ${categoryInterpretation.color}`}>
                    {benchmark.avgSharpeRatio.toFixed(2)}
                  </span>
                  <p className="text-xs text-gray-600">{categoryInterpretation.level}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Period-wise Sharpe Ratio */}
        <Card>
          <CardHeader>
            <CardTitle>Period-wise Sharpe Ratio</CardTitle>
            <CardDescription>
              Sharpe ratio across different time periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sharpeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis label={{ value: 'Sharpe Ratio', angle: -90, position: 'insideLeft' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Fund" fill="#3b82f6" name="Fund" />
                  <Bar dataKey="Category" fill="#f97316" name="Category" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk-Return Scatter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Risk vs Return Analysis
          </CardTitle>
          <CardDescription>
            Standard deviation (risk) vs 3-year returns with Sharpe ratio visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Risk-Return Metrics</h4>
              {riskReturnData.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">{item.name}</h5>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Risk (σ)</p>
                      <p className="font-semibold">{item.risk.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Return</p>
                      <p className="font-semibold">{item.return.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Sharpe</p>
                      <p className="font-semibold">{item.sharpe.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${fund.sharpeRatio > benchmark.avgSharpeRatio ? 'text-green-600' : 'text-red-600'}`}>
                  {fund.sharpeRatio > benchmark.avgSharpeRatio ? '↗' : '↘'}
                </div>
                <p className="text-lg font-semibold">
                  {fund.sharpeRatio > benchmark.avgSharpeRatio ? 'Better' : 'Worse'}
                </p>
                <p className="text-sm text-gray-600">Risk-Adjusted Performance</p>
                <p className="text-xs text-gray-500 mt-2">
                  Difference: {(fund.sharpeRatio - benchmark.avgSharpeRatio).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
