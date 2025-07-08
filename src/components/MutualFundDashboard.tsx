import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, Shield, Activity, DollarSign, BarChart3, Loader2 } from 'lucide-react';
import { RollingReturnsChart } from './RollingReturnsChart';
import { SharpeRatioComparison } from './SharpeRatioComparison';
import { CaptureRatiosChart } from './CaptureRatiosChart';
import { ExpenseRatioComparison } from './ExpenseRatioComparison';
import { MetricsOverview } from './MetricsOverview';
import VirtualizedFundSelect from './VirtualizedFundSelect';
import { mfApiService } from '../services/mfApiService';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '../hooks/useDebounce';

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
  const [fundsLoading, setFundsLoading] = useState(true);
  const [availableSchemes, setAvailableSchemes] = useState<Array<{schemeCode: number; schemeName: string}>>([]);
  const { toast } = useToast();

  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load available schemes on component mount
  useEffect(() => {
    const loadSchemes = async () => {
      setFundsLoading(true);
      try {
        const schemes = await mfApiService.getAllSchemes();
        const formattedSchemes = schemes.map(scheme => ({
          schemeCode: scheme.schemeCode,
          schemeName: scheme.schemeName
        }));
        setAvailableSchemes(formattedSchemes);
        
        toast({
          title: "Funds loaded",
          description: `${schemes.length} mutual funds loaded from MFApi`,
        });
      } catch (error) {
        console.error('Failed to load schemes:', error);
        toast({
          title: "Error",
          description: "Failed to load mutual funds. Please try again.",
          variant: "destructive",
        });
      } finally {
        setFundsLoading(false);
      }
    };

    loadSchemes();
  }, [toast]);

  const handleFundSelect = async (schemeCode: string) => {
    setLoading(true);
    try {
      const fundData = await mfApiService.convertToMutualFundData(parseInt(schemeCode));
      if (fundData) {
        setSelectedFund(fundData);
        const benchmark = mfApiService.generateCategoryBenchmark(fundData.category);
        setCategoryBenchmark(benchmark);
        
        toast({
          title: "Fund loaded",
          description: `Successfully loaded data for ${fundData.name}`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load fund data. Please try another fund.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to load fund:', error);
      toast({
        title: "Error",
        description: "Failed to load fund data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const riskFreeRate = 6.5; // Assuming 6.5% risk-free rate

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mutual Fund Analysis Tool
          </h1>
          <p className="text-lg text-gray-600">
            Real-time analysis of Indian mutual funds powered by MFApi
          </p>
        </div>

        {/* Search and Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Fund Selection
              {fundsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription>
              Search and select a mutual fund to analyze (Real-time data from MFApi)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VirtualizedFundSelect
              schemes={availableSchemes}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFundSelect={handleFundSelect}
              loading={fundsLoading}
              disabled={loading}
            />
            
            {loading && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading fund data...</span>
              </div>
            )}
            
            {selectedFund && !loading && (
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

        {selectedFund && categoryBenchmark && !loading && (
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

        {!selectedFund && !loading && !fundsLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a Mutual Fund
              </h3>
              <p className="text-gray-500">
                Use the search above to find and select a mutual fund for real-time analysis
              </p>
            </CardContent>
          </Card>
        )}
        
        {fundsLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <Loader2 className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Loading Mutual Funds
              </h3>
              <p className="text-gray-500">
                Fetching latest mutual fund data from MFApi...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MutualFundDashboard;
