
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DollarSign, Info, Calculator, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface MutualFundData {
  name: string;
  expenseRatio: number;
  aum: number;
}

interface CategoryBenchmark {
  category: string;
  avgExpenseRatio: number;
}

interface ExpenseRatioComparisonProps {
  fund: MutualFundData;
  benchmark: CategoryBenchmark;
}

export const ExpenseRatioComparison: React.FC<ExpenseRatioComparisonProps> = ({ 
  fund, 
  benchmark 
}) => {
  const expenseData = [
    {
      name: 'Expense Ratio',
      Fund: fund.expenseRatio,
      Category: benchmark.avgExpenseRatio,
      difference: fund.expenseRatio - benchmark.avgExpenseRatio
    }
  ];

  // Calculate impact on returns over different periods
  const impactData = [
    {
      period: '1 Year',
      fundImpact: -fund.expenseRatio,
      categoryImpact: -benchmark.avgExpenseRatio,
      savings: benchmark.avgExpenseRatio - fund.expenseRatio
    },
    {
      period: '5 Years',
      fundImpact: -fund.expenseRatio * 5,
      categoryImpact: -benchmark.avgExpenseRatio * 5,
      savings: (benchmark.avgExpenseRatio - fund.expenseRatio) * 5
    },
    {
      period: '10 Years',
      fundImpact: -fund.expenseRatio * 10,
      categoryImpact: -benchmark.avgExpenseRatio * 10,
      savings: (benchmark.avgExpenseRatio - fund.expenseRatio) * 10
    }
  ];

  // Calculate cost on different investment amounts
  const investmentAmounts = [50000, 100000, 500000, 1000000];
  const costData = investmentAmounts.map(amount => ({
    investment: amount,
    fundCost: (amount * fund.expenseRatio) / 100,
    categoryCost: (amount * benchmark.avgExpenseRatio) / 100,
    savings: (amount * (benchmark.avgExpenseRatio - fund.expenseRatio)) / 100
  }));

  const getExpenseInterpretation = (ratio: number, category: string) => {
    const thresholds = {
      'Large Cap': { low: 1.5, high: 2.0 },
      'Mid Cap': { low: 2.0, high: 2.5 },
      'Small Cap': { low: 2.2, high: 2.8 }
    };
    
    const threshold = thresholds[category as keyof typeof thresholds] || { low: 2.0, high: 2.5 };
    
    if (ratio <= threshold.low) return { level: "Low", color: "text-green-600", description: "Cost-effective fund" };
    if (ratio <= threshold.high) return { level: "Moderate", color: "text-yellow-600", description: "Average expense ratio" };
    return { level: "High", color: "text-red-600", description: "Above average expenses" };
  };

  const fundInterpretation = getExpenseInterpretation(fund.expenseRatio, benchmark.category);
  const categoryInterpretation = getExpenseInterpretation(benchmark.avgExpenseRatio, benchmark.category);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Fund: {payload[0].value.toFixed(2)}%
          </p>
          <p className="text-orange-600">
            Category: {payload[1].value.toFixed(2)}%
          </p>
          {payload[0].payload.savings && (
            <p className={`font-semibold ${payload[0].payload.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Annual Savings: {payload[0].payload.savings >= 0 ? '+' : ''}{payload[0].payload.savings.toFixed(2)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Total Expense Ratio (TER) represents the annual cost of investing in the fund as a percentage of your investment. 
          Lower expense ratios mean more of your money stays invested and compounds over time.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Ratio Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Expense Ratio Comparison
            </CardTitle>
            <CardDescription>
              Annual cost comparison with category average
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Expense Ratio (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip content={<CustomTooltip />} />
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
                  <span className={`text-2xl font-bold ${fundInterpretation.color}`}>
                    {fund.expenseRatio.toFixed(2)}%
                  </span>
                  <p className="text-xs text-gray-600">{fundInterpretation.level}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium">{benchmark.category} Average</span>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${categoryInterpretation.color}`}>
                    {benchmark.avgExpenseRatio.toFixed(2)}%
                  </span>
                  <p className="text-xs text-gray-600">{categoryInterpretation.level}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Annual Difference</span>
                <span className={`text-lg font-bold ${expenseData[0].difference <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {expenseData[0].difference <= 0 ? '' : '+'}
                  {expenseData[0].difference.toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Long-term Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Long-term Cost Impact
            </CardTitle>
            <CardDescription>
              Cumulative expense impact over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={impactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis label={{ value: 'Cumulative Cost (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="fundImpact" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Fund Cost"
                    dot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="categoryImpact" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    name="Category Cost"
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Investment Cost Calculator
          </CardTitle>
          <CardDescription>
            Annual cost for different investment amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Investment Amount</th>
                  <th className="text-right p-3">Fund Cost</th>
                  <th className="text-right p-3">Category Cost</th>
                  <th className="text-right p-3">Annual Savings</th>
                </tr>
              </thead>
              <tbody>
                {costData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      ₹{row.investment.toLocaleString()}
                    </td>
                    <td className="text-right p-3">
                      ₹{row.fundCost.toLocaleString()}
                    </td>
                    <td className="text-right p-3">
                      ₹{row.categoryCost.toLocaleString()}
                    </td>
                    <td className={`text-right p-3 font-semibold ${row.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {row.savings >= 0 ? '+' : ''}₹{row.savings.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Expense Ratio Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Fund Expense</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-4xl font-bold mb-2 ${fundInterpretation.color}`}>
              {fund.expenseRatio.toFixed(2)}%
            </div>
            <Progress 
              value={(fund.expenseRatio / 3) * 100} 
              className="mb-2"
            />
            <p className="text-sm text-gray-600">{fundInterpretation.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              AUM: ₹{fund.aum.toLocaleString()} Cr
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Category Average</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-4xl font-bold mb-2 ${categoryInterpretation.color}`}>
              {benchmark.avgExpenseRatio.toFixed(2)}%
            </div>
            <Progress 
              value={(benchmark.avgExpenseRatio / 3) * 100} 
              className="mb-2"
            />
            <p className="text-sm text-gray-600">{categoryInterpretation.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              {benchmark.category} funds average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">10-Year Impact</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-4xl font-bold mb-2 ${impactData[2].savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {impactData[2].savings >= 0 ? '+' : ''}{impactData[2].savings.toFixed(1)}%
            </div>
            <Progress 
              value={Math.abs(impactData[2].savings) * 4} 
              className="mb-2"
            />
            <p className="text-sm text-gray-600">
              {impactData[2].savings >= 0 ? 'Total Savings' : 'Extra Cost'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Over 10 years vs category
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
