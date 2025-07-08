
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Shield, Activity, DollarSign, BarChart3 } from 'lucide-react';
import { RollingReturnsChart } from './RollingReturnsChart';
import { SharpeRatioComparison } from './SharpeRatioComparison';
import { CaptureRatiosChart } from './CaptureRatiosChart';
import { ExpenseRatioComparison } from './ExpenseRatioComparison';
import { MetricsOverview } from './MetricsOverview';

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

const MutualFundDashboard = () => {
  const [selectedFund, setSelectedFund] = useState<MutualFundData | null>(null);
  const [categoryBenchmark, setCategoryBenchmark] = useState<CategoryBenchmark | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [funds, setFunds] = useState<MutualFundData[]>([]);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    const mockFunds: MutualFundData[] = [
      {
        id: '1',
        name: 'SBI Blue Chip Fund',
        category: 'Large Cap',
        nav: 45.67,
        aum: 12500,
        expenseRatio: 1.85,
        returns: { '1y': 12.5, '3y': 15.2, '5y': 13.8, '10y': 14.5 },
        sharpeRatio: 1.24,
        upsideCapture: 95.5,
        downsideCapture: 89.2,
        standardDeviation: 16.5,
        beta: 0.95,
        alpha: 2.1
      },
      {
        id: '2',
        name: 'HDFC Mid-Cap Opportunities Fund',
        category: 'Mid Cap',
        nav: 89.34,
        aum: 8750,
        expenseRatio: 2.15,
        returns: { '1y': 18.7, '3y': 22.1, '5y': 19.8, '10y': 17.9 },
        sharpeRatio: 1.18,
        upsideCapture: 112.3,
        downsideCapture: 105.8,
        standardDeviation: 22.1,
        beta: 1.15,
        alpha: 3.2
      },
      {
        id: '3',
        name: 'Axis Small Cap Fund',
        category: 'Small Cap',
        nav: 67.89,
        aum: 4200,
        expenseRatio: 2.45,
        returns: { '1y': 25.3, '3y': 28.5, '5y': 24.1, '10y': 21.8 },
        sharpeRatio: 1.05,
        upsideCapture: 125.7,
        downsideCapture: 118.4,
        standardDeviation: 28.7,
        beta: 1.35,
        alpha: 4.5
      }
    ];
    setFunds(mockFunds);
  }, []);

  const mockCategoryBenchmarks: { [key: string]: CategoryBenchmark } = {
    'Large Cap': {
      category: 'Large Cap',
      avgReturns: { '1y': 11.2, '3y': 13.8, '5y': 12.5, '10y': 13.1 },
      avgSharpeRatio: 1.12,
      avgUpsideCapture: 92.3,
      avgDownsideCapture: 91.7,
      avgExpenseRatio: 1.95,
      avgStandardDeviation: 17.2
    },
    'Mid Cap': {
      category: 'Mid Cap',
      avgReturns: { '1y': 16.5, '3y': 19.8, '5y': 17.9, '10y': 16.2 },
      avgSharpeRatio: 1.08,
      avgUpsideCapture: 108.5,
      avgDownsideCapture: 102.3,
      avgExpenseRatio: 2.25,
      avgStandardDeviation: 23.5
    },
    'Small Cap': {
      category: 'Small Cap',
      avgReturns: { '1y': 22.1, '3y': 25.3, '5y': 21.8, '10y': 19.5 },
      avgSharpeRatio: 0.98,
      avgUpsideCapture: 118.2,
      avgDownsideCapture: 115.6,
      avgExpenseRatio: 2.55,
      avgStandardDeviation: 31.2
    }
  };

  const handleFundSelect = (fundId: string) => {
    const fund = funds.find(f => f.id === fundId);
    if (fund) {
      setSelectedFund(fund);
      setCategoryBenchmark(mockCategoryBenchmarks[fund.category]);
    }
  };

  const filteredFunds = funds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const riskFreeRate = 6.5; // Assuming 6.5% risk-free rate

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mutual Fund Analysis Tool
          </h1>
          <p className="text-lg text-gray-600">
            Compare mutual fund performance with comprehensive metrics and benchmarks
          </p>
        </div>

        {/* Search and Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Fund Selection
            </CardTitle>
            <CardDescription>
              Search and select a mutual fund to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search mutual funds..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select onValueChange={handleFundSelect}>
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Select a fund" />
                </SelectTrigger>
                <SelectContent>
                  {filteredFunds.map((fund) => (
                    <SelectItem key={fund.id} value={fund.id}>
                      {fund.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedFund && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedFund.name}</h3>
                    <p className="text-gray-600">NAV: ₹{selectedFund.nav.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{selectedFund.category}</Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      AUM: ₹{selectedFund.aum.toLocaleString()} Cr
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedFund && categoryBenchmark && (
          <>
            {/* Overview Metrics */}
            <MetricsOverview 
              fund={selectedFund} 
              benchmark={categoryBenchmark}
              riskFreeRate={riskFreeRate}
            />

            {/* Detailed Analysis Tabs */}
            <Tabs defaultValue="returns" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="returns" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Rolling Returns
                </TabsTrigger>
                <TabsTrigger value="sharpe" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Sharpe Ratio
                </TabsTrigger>
                <TabsTrigger value="capture" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Capture Ratios
                </TabsTrigger>
                <TabsTrigger value="expense" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Expense Ratio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="returns" className="space-y-6">
                <RollingReturnsChart 
                  fund={selectedFund} 
                  benchmark={categoryBenchmark} 
                />
              </TabsContent>

              <TabsContent value="sharpe" className="space-y-6">
                <SharpeRatioComparison 
                  fund={selectedFund} 
                  benchmark={categoryBenchmark}
                  riskFreeRate={riskFreeRate}
                />
              </TabsContent>

              <TabsContent value="capture" className="space-y-6">
                <CaptureRatiosChart 
                  fund={selectedFund} 
                  benchmark={categoryBenchmark} 
                />
              </TabsContent>

              <TabsContent value="expense" className="space-y-6">
                <ExpenseRatioComparison 
                  fund={selectedFund} 
                  benchmark={categoryBenchmark} 
                />
              </TabsContent>
            </Tabs>
          </>
        )}

        {!selectedFund && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a Mutual Fund
              </h3>
              <p className="text-gray-500">
                Choose a mutual fund from the dropdown above to start analyzing its performance
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MutualFundDashboard;
