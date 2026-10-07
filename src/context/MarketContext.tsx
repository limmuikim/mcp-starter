import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MarketSymbol, AssetCategory, PaperPosition, PriceAlert } from '../types/market';
import { INITIAL_SYMBOLS } from '../data/marketData';

interface MarketContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeCategory: AssetCategory;
  setActiveCategory: (cat: AssetCategory) => void;
  symbols: MarketSymbol[];
  selectedSymbol: MarketSymbol | null;
  setSelectedSymbol: (symbol: MarketSymbol | null) => void;
  watchlist: string[];
  toggleWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  paperPositions: PaperPosition[];
  placePaperTrade: (symbol: MarketSymbol, type: 'buy' | 'sell', shares: number) => void;
  closePaperTrade: (id: string) => void;
  alerts: PriceAlert[];
  addAlert: (symbol: string, targetPrice: number, condition: 'above' | 'below') => void;
  removeAlert: (id: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  activeSidebarTab: 'watchlist' | 'alerts' | 'news' | 'calendar' | null;
  setActiveSidebarTab: (tab: 'watchlist' | 'alerts' | 'news' | 'calendar' | null) => void;
  lastTickedId: string | null;
  lastTickDirection: 'up' | 'down' | null;
  getSymbolById: (id: string) => MarketSymbol | undefined;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('overview');
  const [symbols, setSymbols] = useState<MarketSymbol[]>(INITIAL_SYMBOLS);
  const [selectedSymbol, setSelectedSymbol] = useState<MarketSymbol | null>(null);
  
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['spx', 'ndx', 'nvda', 'aapl', 'btcusd', 'xauusd'];
    } catch {
      return ['spx', 'ndx', 'nvda', 'aapl', 'btcusd', 'xauusd'];
    }
  });

  const [paperPositions, setPaperPositions] = useState<PaperPosition[]>(() => {
    try {
      const saved = localStorage.getItem('tv_positions');
      return saved ? JSON.parse(saved) : [
        {
          id: 'pos-1',
          symbol: 'NVDA',
          name: 'NVIDIA Corporation',
          type: 'buy',
          shares: 25,
          entryPrice: 124.50,
          currentPrice: 132.89,
          date: '2026-10-02',
        },
        {
          id: 'pos-2',
          symbol: 'BTCUSD',
          name: 'Bitcoin',
          type: 'buy',
          shares: 0.25,
          entryPrice: 61200.00,
          currentPrice: 63840.50,
          date: '2026-10-04',
        }
      ];
    } catch {
      return [];
    }
  });

  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('tv_alerts');
      return saved ? JSON.parse(saved) : [
        { id: 'alt-1', symbol: 'BTCUSD', targetPrice: 65000, condition: 'above', createdAt: 'Oct 05', active: true },
        { id: 'alt-2', symbol: 'NVDA', targetPrice: 140, condition: 'above', createdAt: 'Oct 04', active: true },
      ];
    } catch {
      return [];
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'watchlist' | 'alerts' | 'news' | 'calendar' | null>(null);
  const [lastTickedId, setLastTickedId] = useState<string | null>(null);
  const [lastTickDirection, setLastTickDirection] = useState<'up' | 'down' | null>(null);

  // Sync theme with document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-[#131722] text-[#d1d4dc] antialiased selection:bg-[#2962ff] selection:text-white';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-[#ffffff] text-[#131722] antialiased selection:bg-[#2962ff] selection:text-white';
    }
  }, [theme]);

  // Persist watchlist, positions, alerts
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem('tv_positions', JSON.stringify(paperPositions));
    } catch {
      // ignore
    }
  }, [paperPositions]);

  useEffect(() => {
    try {
      localStorage.setItem('tv_alerts', JSON.stringify(alerts));
    } catch {
      // ignore
    }
  }, [alerts]);

  // Keyboard shortcut Ctrl+K or / for symbol search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulated live ticking market ticks every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick random symbol to tick
      const randomIndex = Math.floor(Math.random() * INITIAL_SYMBOLS.length);
      const targetSymbol = INITIAL_SYMBOLS[randomIndex];
      if (!targetSymbol) return;

      const isUp = Math.random() > 0.45;
      const pctDelta = (Math.random() * 0.003 + 0.0005) * (isUp ? 1 : -1);

      setSymbols(prevSymbols =>
        prevSymbols.map(sym => {
          if (sym.id === targetSymbol.id) {
            const newPrice = Number(Math.max(0.001, sym.price * (1 + pctDelta)).toFixed(sym.price < 2 ? 4 : 2));
            const newChange = Number((sym.change + (newPrice - sym.price)).toFixed(sym.price < 2 ? 4 : 2));
            const newChangePercent = Number((((newPrice - (sym.price - sym.change)) / (sym.price - sym.change)) * 100).toFixed(2));
            
            // update sparkline
            const newSparkline = [...sym.sparkline.slice(1), newPrice];

            return {
              ...sym,
              price: newPrice,
              change: newChange,
              changePercent: newChangePercent,
              sparkline: newSparkline,
              high24h: Math.max(sym.high24h, newPrice),
              low24h: Math.min(sym.low24h, newPrice),
            };
          }
          return sym;
        })
      );

      // Trigger tick flash indicator
      setLastTickedId(targetSymbol.id);
      setLastTickDirection(isUp ? 'up' : 'down');

      setTimeout(() => {
        setLastTickedId(null);
        setLastTickDirection(null);
      }, 900);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isInWatchlist = (id: string) => watchlist.includes(id);

  const placePaperTrade = (symbol: MarketSymbol, type: 'buy' | 'sell', shares: number) => {
    const newPos: PaperPosition = {
      id: `pos-${Date.now()}`,
      symbol: symbol.symbol,
      name: symbol.name,
      type,
      shares,
      entryPrice: symbol.price,
      currentPrice: symbol.price,
      date: new Date().toISOString().split('T')[0],
    };
    setPaperPositions(prev => [newPos, ...prev]);
  };

  const closePaperTrade = (id: string) => {
    setPaperPositions(prev => prev.filter(pos => pos.id !== id));
  };

  const addAlert = (symbol: string, targetPrice: number, condition: 'above' | 'below') => {
    const newAlert: PriceAlert = {
      id: `alt-${Date.now()}`,
      symbol,
      targetPrice,
      condition,
      createdAt: 'Just now',
      active: true,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const getSymbolById = (id: string) => symbols.find(s => s.id === id);

  return (
    <MarketContext.Provider
      value={{
        theme,
        toggleTheme,
        activeCategory,
        setActiveCategory,
        symbols,
        selectedSymbol,
        setSelectedSymbol,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        paperPositions,
        placePaperTrade,
        closePaperTrade,
        alerts,
        addAlert,
        removeAlert,
        isSearchOpen,
        setIsSearchOpen,
        activeSidebarTab,
        setActiveSidebarTab,
        lastTickedId,
        lastTickDirection,
        getSymbolById,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
