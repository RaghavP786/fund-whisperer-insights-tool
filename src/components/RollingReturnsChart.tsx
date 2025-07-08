
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface MutualFundData {
  returns: {
    '1y': number;
    '3y': number;
    '5y': number;
    '10y': number;
  };
  name: string;
}

interface CategoryBenchmark {
  avgReturns: {
    '1y': number;
    '3y': number;
    '5y': number;
    '10y': number;
  };
  category: string;
}

interface RollingReturnsChartProps {
  fund: MutualFundData;
  benchmark: CategoryBenchmark;
}

export const RollingReturnsChart: React.FC<RollingReturnsChartProps> = ({ 
  fund, 
  benchmark 
}) => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const data = [
    {
      period: '1 Year',
      Fund: fund.returns['1y'],
      Category: benchmark.avgReturns['1y'],
      difference: fund.returns['1y'] - benchmark.avgReturns['1y']
    },
    {
      period: '3 Years',
      Fund: fund.returns['3y'],
      Category: benchmark.avgReturns['3y'],
      difference: fund.returns['3y'] - benchmark.avgReturns['3y']
    },
    {
      period: '5 Years',
      Fund: fund.returns['5y'],
      Category: benchmark.avgReturns['5y'],
      difference: fund.returns['5y'] - benchmark.avgReturns['5y']
    },
    {
      period: '10 Years',
      Fund: fund.returns['10y'],
      Category: benchmark.avgReturns['10y'],
      difference: fund.returns['10y'] - benchmark.avgReturns['10y']
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Fund: {payload[0].value.toFixed(1)}%
          </p>
          <p className="text-orange-600">
            Category: {payload[1].value.toFixed(1)}%
          </p>
          <p className={`font-semibold ${payload[0].payload.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Difference: {payload[0].payload.difference >= 0 ? '+' : ''}{payload[0].payload.difference.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Rolling Returns Analysis</CardTitle>
            <CardDescription>
              Compare fund performance across different time periods
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              Bar Chart
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              Line Chart
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis label={{ value: 'Returns (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Fund" fill="#3b82f6" name={fund.name} />
                <Bar dataKey="Category" fill="#f97316" name={`${benchmark.category} Category`} />
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis label={{ value: 'Returns (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Fund" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name={fund.name}
                  dot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Category" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  name={`${benchmark.category} Category`}
                  dot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((item, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{item.period}</p>
              <p className={`text-lg font-semibold ${item.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {item.difference >= 0 ? '+' : ''}{item.difference.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">vs Category</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
