
interface MFApiScheme {
  schemeCode: number;
  schemeName: string;
  nav: string;
  date: string;
}

interface MFApiSchemeDetails {
  meta: {
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: Array<{
    date: string;
    nav: string;
  }>;
  status: string;
}

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

const BASE_URL = 'https://api.mfapi.in/mf';

// Helper function to calculate returns
const calculateReturns = (navData: Array<{ date: string; nav: string }>) => {
  if (navData.length === 0) return { '1y': 0, '3y': 0, '5y': 0, '10y': 0 };
  
  const currentNav = parseFloat(navData[0]?.nav || '0');
  const oneYearAgo = navData.find((_, index) => index >= 252) || navData[navData.length - 1]; // ~252 trading days in a year
  const threeYearsAgo = navData.find((_, index) => index >= 756) || navData[navData.length - 1];
  const fiveYearsAgo = navData.find((_, index) => index >= 1260) || navData[navData.length - 1];
  const tenYearsAgo = navData.find((_, index) => index >= 2520) || navData[navData.length - 1];
  
  const calculateReturn = (oldNav: string) => {
    const old = parseFloat(oldNav);
    return old > 0 ? ((currentNav - old) / old) * 100 : 0;
  };
  
  return {
    '1y': calculateReturn(oneYearAgo?.nav || '0'),
    '3y': calculateReturn(threeYearsAgo?.nav || '0') / 3, // Annualized
    '5y': calculateReturn(fiveYearsAgo?.nav || '0') / 5, // Annualized
    '10y': calculateReturn(tenYearsAgo?.nav || '0') / 10, // Annualized
  };
};

// Helper function to calculate standard deviation
const calculateStandardDeviation = (navData: Array<{ date: string; nav: string }>) => {
  if (navData.length < 2) return 15; // Default value
  
  const returns = [];
  for (let i = 0; i < Math.min(navData.length - 1, 252); i++) {
    const currentNav = parseFloat(navData[i]?.nav || '0');
    const previousNav = parseFloat(navData[i + 1]?.nav || '0');
    if (currentNav > 0 && previousNav > 0) {
      returns.push((currentNav - previousNav) / previousNav);
    }
  }
  
  if (returns.length === 0) return 15;
  
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  return Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized
};

export const mfApiService = {
  // Get all available schemes
  async getAllSchemes(): Promise<MFApiScheme[]> {
    try {
      const response = await fetch(`${BASE_URL}`);
      if (!response.ok) throw new Error('Failed to fetch schemes');
      const data = await response.json();
      return data.slice(0, 50); // Limit to first 50 for performance
    } catch (error) {
      console.error('Error fetching schemes:', error);
      return [];
    }
  },

  // Get scheme details with historical data
  async getSchemeDetails(schemeCode: number): Promise<MFApiSchemeDetails | null> {
    try {
      const response = await fetch(`${BASE_URL}/${schemeCode}`);
      if (!response.ok) throw new Error('Failed to fetch scheme details');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching scheme details:', error);
      return null;
    }
  },

  // Convert API data to our internal format
  async convertToMutualFundData(schemeCode: number): Promise<MutualFundData | null> {
    const details = await this.getSchemeDetails(schemeCode);
    if (!details || !details.data || details.data.length === 0) return null;

    const navData = details.data;
    const currentNav = parseFloat(navData[0]?.nav || '0');
    const returns = calculateReturns(navData);
    const standardDeviation = calculateStandardDeviation(navData);
    
    // Mock some values that aren't available from the API
    const mockExpenseRatio = Math.random() * 1.5 + 0.5; // Random between 0.5-2%
    const riskFreeRate = 6.5;
    const sharpeRatio = (returns['3y'] - riskFreeRate) / standardDeviation;
    
    return {
      id: schemeCode.toString(),
      name: details.meta.scheme_name,
      category: details.meta.scheme_category,
      nav: currentNav,
      aum: Math.random() * 10000 + 1000, // Mock AUM
      expenseRatio: mockExpenseRatio,
      returns,
      sharpeRatio,
      upsideCapture: 95 + Math.random() * 20, // Mock values
      downsideCapture: 85 + Math.random() * 20,
      standardDeviation,
      beta: 0.8 + Math.random() * 0.4,
      alpha: (returns['3y'] - 12) * 0.5, // Mock alpha calculation
    };
  },

  // Generate category benchmark data
  generateCategoryBenchmark(category: string): CategoryBenchmark {
    const categoryBenchmarks: { [key: string]: CategoryBenchmark } = {
      'Equity Scheme - Large Cap Fund': {
        category: 'Large Cap',
        avgReturns: { '1y': 11.2, '3y': 13.8, '5y': 12.5, '10y': 13.1 },
        avgSharpeRatio: 1.12,
        avgUpsideCapture: 92.3,
        avgDownsideCapture: 91.7,
        avgExpenseRatio: 1.95,
        avgStandardDeviation: 17.2
      },
      'Equity Scheme - Mid Cap Fund': {
        category: 'Mid Cap',
        avgReturns: { '1y': 16.5, '3y': 19.8, '5y': 17.9, '10y': 16.2 },
        avgSharpeRatio: 1.08,
        avgUpsideCapture: 108.5,
        avgDownsideCapture: 102.3,
        avgExpenseRatio: 2.25,
        avgStandardDeviation: 23.5
      },
      'Equity Scheme - Small Cap Fund': {
        category: 'Small Cap',
        avgReturns: { '1y': 22.1, '3y': 25.3, '5y': 21.8, '10y': 19.5 },
        avgSharpeRatio: 0.98,
        avgUpsideCapture: 118.2,
        avgDownsideCapture: 115.6,
        avgExpenseRatio: 2.55,
        avgStandardDeviation: 31.2
      }
    };

    return categoryBenchmarks[category] || {
      category: 'Mixed',
      avgReturns: { '1y': 14.0, '3y': 16.5, '5y': 15.2, '10y': 14.8 },
      avgSharpeRatio: 1.05,
      avgUpsideCapture: 100.0,
      avgDownsideCapture: 98.5,
      avgExpenseRatio: 2.0,
      avgStandardDeviation: 20.0
    };
  }
};
