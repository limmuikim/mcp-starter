export type AssetCategory = 'overview' | 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds' | 'economy';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketSymbol {
  id: string;
  symbol: string;
  name: string;
  category: 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds';
  exchange: string;
  currency: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  marketCap?: string;
  peRatio?: number;
  dividendYield?: number;
  rating: TechnicalRating;
  logoUrl?: string;
  sparkline: number[];
  historicalData: {
    '1D': CandlePoint[];
    '5D': CandlePoint[];
    '1M': CandlePoint[];
    '1Y': CandlePoint[];
    '5Y': CandlePoint[];
  };
  sector?: string;
  country?: string;
  description?: string;
}

export interface HeatmapItem {
  name: string;
  symbol: string;
  changePercent: number;
  weight: number; // For proportional visual sizing
  sector: string;
  price: number;
}

export interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  country: string;
  countryCode: string;
  flagUrl: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual: string;
  forecast: string;
  previous: string;
}

export interface MarketNewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  symbols: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  url: string;
}

export interface PaperPosition {
  id: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  date: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
  active: boolean;
}
