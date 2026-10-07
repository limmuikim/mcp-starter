import React from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Header } from './components/Header';
import { MarqueeTicker } from './components/MarqueeTicker';
import { CategoryNav } from './components/CategoryNav';
import { RightToolStrip } from './components/RightToolStrip';
import { WatchlistSidebar } from './components/WatchlistSidebar';
import { SearchModal } from './components/SearchModal';
import { SuperChartModal } from './components/SuperChartModal';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { IndicesScreen } from './components/screens/IndicesScreen';
import { StocksScreen } from './components/screens/StocksScreen';
import { CryptoScreen } from './components/screens/CryptoScreen';
import { ForexScreen } from './components/screens/ForexScreen';
import { FuturesScreen } from './components/screens/FuturesScreen';
import { BondsScreen } from './components/screens/BondsScreen';
import { EconomyScreen } from './components/screens/EconomyScreen';

const MainLayout: React.FC = () => {
  const { activeCategory, selectedSymbol, setSelectedSymbol } = useMarket();

  const renderActiveScreen = () => {
    switch (activeCategory) {
      case 'overview':
        return <OverviewScreen />;
      case 'indices':
        return <IndicesScreen />;
      case 'stocks':
        return <StocksScreen />;
      case 'crypto':
        return <CryptoScreen />;
      case 'forex':
        return <ForexScreen />;
      case 'futures':
        return <FuturesScreen />;
      case 'bonds':
        return <BondsScreen />;
      case 'economy':
        return <EconomyScreen />;
      default:
        return <OverviewScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#131722] text-[#d1d4dc] selection:bg-[#2962ff] selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Marquee Ticker Tape */}
      <MarqueeTicker />

      {/* Markets Category Sub-navigation */}
      <CategoryNav />

      {/* Main Container with Right Toolstrip */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {renderActiveScreen()}

          {/* Quiet Footer */}
          <footer className="mt-16 pt-8 border-t border-[#2a2e39] text-xs text-[#787b86] pb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-semibold text-[#d1d4dc]">TradingView Markets</span> · Real-time market data and analytical tools.
            </div>
            <div className="flex items-center gap-4">
              <span>Quotes simulated in real time</span>
              <span aria-hidden="true">·</span>
              <span>All exchanges supported</span>
            </div>
          </footer>
        </main>

        {/* Right Icon Dock */}
        <RightToolStrip />
      </div>

      {/* Slideout Watchlist & Tool Panel */}
      <WatchlistSidebar />

      {/* Global Search Dialog */}
      <SearchModal />

      {/* Flagship SuperChart Interactive Modal */}
      {selectedSymbol && (
        <SuperChartModal
          symbol={selectedSymbol}
          onClose={() => setSelectedSymbol(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <MainLayout />
    </MarketProvider>
  );
}
