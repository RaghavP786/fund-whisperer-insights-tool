
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Info, Target } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface MutualFundData {
  name: string;
  upsideCapture: number;
  downsideCapture: number;
}

interface CategoryBenchmark {
  category: string;
  avgUpsideCapture: number;
  avgDownsideCapture: number;
}

interface CaptureRatiosChartProps {
  fund: MutualFundData;
  benchmark: CategoryBenchmark;
}

export const CaptureRatiosChart: React.FC<CaptureRatiosChartProps> = ({ 
  fund, 
  benchmark 
}) => {
  const captureData = [
    {
      metric: 'Upside Capture',
      Fund: fund.upsideCapture,
      Category: benchmark.avgUpsideCapture,
      type: 'upside'
    },
    {
      metric: 'Downside Capture',
      Fund: fund.downsideCapture,
      Category: benchmark.avgDownsideCapture,
      type: 'downside'
    }
  ];

  const radialData = [
    {
      name: 'Upside Capture',
      value: fund.upsideCapture,
      fill: '#22c55e'
    },
    {
      name: 'Downside Capture',
      value: fund.downsideCapture,
      fill: '#ef4444'
    }
  ];

  const getUpsideInterpretation = (ratio: number) => {
    if (ratio > 110) return { level: "Excellent", color: "text-green-600", description: "Strong outperformance in up markets" };
    if (ratio > 100) return { level: "Good", color: "text-green-500", description: "Outperforms in up markets" };
    if (ratio > 90) return { level: "Average", color: "text-yellow-600", description: "Close to market performance" };
    return { level: "Below Average", color: "text-red-600", description: "Underperforms in up markets" };
  };

  const getDownsideInterpretation = (ratio: number) => {
    if (ratio < 80) return { level: "Excellent", color: "text-green-600", description: "Strong downside protection" };
    if (ratio < 90) return { level: "Good", color: "text-green-500", description: "Good downside protection" };
    if (ratio < 100) return { level: "Average", color: "text-yellow-600", description: "Moderate downside protection" };
    return { level: "Poor", color: "text-red-600", description: "Limited downside protection" };
  };

  const upsideInterpretation = getUpsideInterpretation(fund.upsideCapture);
  const downsideInterpretation = getDownsideInterpretation(fund.downsideCapture);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isUpside = payload[0].payload.type === 'upside';
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Fund: {payload[0].value.toFixed(1)}%
          </p>
          <p className="text-orange-600">
            Category: {payload[1].value.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-600 mt-2">
            {isUpside ? 'Higher is better' : 'Lower is better'}
          </p>
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
          Capture ratios measure how well a fund performs relative to its benchmark during up and down markets. 
          Upside capture above 100% indicates outperformance in rising markets, while downside capture below 100% shows better protection in falling markets.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capture Ratios Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Capture Ratios Comparison
            </CardTitle>
            <CardDescription>
              Fund vs category average performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={captureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis label={{ value: 'Capture Ratio (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Fund" fill="#3b82f6" name={fund.name} />
                  <Bar dataKey="Category" fill="#f97316" name={`${benchmark.category} Average`} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Radial Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Capture Ratios Overview</CardTitle>
            <CardDescription>
              Visual representation of capture performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={radialData}>
                  <RadialBar dataKey="value" cornerRadius={10} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Capture Ratio']} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upside Capture Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              Upside Capture Analysis
            </CardTitle>
            <CardDescription>
              Performance in rising markets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Fund Performance</span>
              <span className={`text-2xl font-bold ${upsideInterpretation.color}`}>
                {fund.upsideCapture.toFixed(1)}%
              </span>
            </div>
            
            <Progress value={Math.min(fund.upsideCapture, 150)} className="h-3" />
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>0%</span>
              <span>100% (Benchmark)</span>
              <span>150%</span>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <p className={`font-semibold ${upsideInterpretation.color}`}>
                {upsideInterpretation.level}
              </p>
              <p className="text-sm text-gray-600">
                {upsideInterpretation.description}
              </p>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Category Average:</span>
              <span className="font-semibold">{benchmark.avgUpsideCapture.toFixed(1)}%</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Difference:</span>
              <span className={`font-semibold ${fund.upsideCapture > benchmark.avgUpsideCapture ? 'text-green-600' : 'text-red-600'}`}>
                {fund.upsideCapture > benchmark.avgUpsideCapture ? '+' : ''}
                {(fund.upsideCapture - benchmark.avgUpsideCapture).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Downside Capture Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-5 w-5" />
              Downside Capture Analysis
            </CardTitle>
            <CardDescription>
              Protection in falling markets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Fund Performance</span>
              <span className={`text-2xl font-bold ${downsideInterpretation.color}`}>
                {fund.downsideCapture.toFixed(1)}%
              </span>
            </div>
            
            <Progress 
              value={Math.min(fund.downsideCapture, 150)} 
              className="h-3"
            />
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>0% (Best)</span>
              <span>100% (Benchmark)</span>
              <span>150%</span>
            </div>
            
            <div className="p-3 bg-red-50 rounded-lg">
              <p className={`font-semibold ${downsideInterpretation.color}`}>
                {downsideInterpretation.level}
              </p>
              <p className="text-sm text-gray-600">
                {downsideInterpretation.description}
              </p>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Category Average:</span>
              <span className="font-semibold">{benchmark.avgDownsideCapture.toFixed(1)}%</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Difference:</span>
              <span className={`font-semibold ${fund.downsideCapture < benchmark.avgDownsideCapture ? 'text-green-600' : 'text-red-600'}`}>
                {fund.downsideCapture < benchmark.avgDownsideCapture ? '' : '+'}
                {(fund.downsideCapture - benchmark.avgDownsideCapture).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Capture Ratio Summary</CardTitle>
          <CardDescription>
            Overall assessment of market performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Market Sensitivity</h4>
              <p className="text-2xl font-bold text-blue-600">
                {((fund.upsideCapture + fund.downsideCapture) / 2).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Average Capture</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2">Risk Management</h4>
              <p className={`text-2xl font-bold ${fund.upsideCapture > fund.downsideCapture ? 'text-green-600' : 'text-red-600'}`}>
                {fund.upsideCapture > fund.downsideCapture ? 'Good' : 'Poor'}
              </p>
              <p className="text-sm text-gray-600">
                Upside/Downside Ratio: {(fund.upsideCapture / fund.downsideCapture).toFixed(2)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">vs Category</h4>
              <p className={`text-2xl font-bold ${
                (fund.upsideCapture > benchmark.avgUpsideCapture && fund.downsideCapture < benchmark.avgDownsideCapture) 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {(fund.upsideCapture > benchmark.avgUpsideCapture && fund.downsideCapture < benchmark.avgDownsideCapture) 
                  ? 'Better' : 'Worse'}
              </p>
              <p className="text-sm text-gray-600">Overall Performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
