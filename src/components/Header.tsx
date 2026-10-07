import React from 'react';
import { Search, Moon, Sun, BookmarkCheck, BarChart2 } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    setIsSearchOpen,
    watchlist,
    activeSidebarTab,
    setActiveSidebarTab,
  } = useMarket();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#131722]/95 dark:bg-[#131722]/95 light:bg-white/95 backdrop-blur border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 transition-colors">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          className="flex items-center gap-2 group text-base sm:text-lg font-bold tracking-tight text-white dark:text-white light:text-slate-900 transition-opacity"
        >
          <div className="w-7 h-7 rounded bg-[#2962ff] flex items-center justify-center text-white font-black text-xs shadow-sm">
            TV
          </div>
          <span className="font-semibold text-white dark:text-white light:text-slate-900">
            TradingView
          </span>
        </a>
      </div>

      {/* Zone 2: 4-6 Nav Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-[#787b86] dark:text-[#787b86] light:text-slate-600">
        <a
          href="#markets"
          className="text-white dark:text-white light:text-slate-900 font-semibold transition-colors"
        >
          Markets
        </a>
        <a
          href="#products"
          className="hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
        >
          Products
        </a>
        <a
          href="#community"
          className="hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
        >
          Community
        </a>
        <a
          href="#news"
          className="hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
        >
          News
        </a>
        <a
          href="#brokers"
          className="hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
        >
          Brokers
        </a>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search trigger button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#787b86] bg-[#1e222d] dark:bg-[#1e222d] light:bg-slate-100 hover:text-white dark:hover:text-white light:hover:text-slate-900 rounded-md border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 transition-colors whitespace-nowrap"
          title="Search markets (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search markets</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#787b86] bg-[#131722] dark:bg-[#131722] light:bg-white rounded border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200">
            Ctrl K
          </kbd>
        </button>

        {/* Watchlist toggle */}
        <button
          onClick={() => setActiveSidebarTab(activeSidebarTab === 'watchlist' ? null : 'watchlist')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeSidebarTab === 'watchlist'
              ? 'bg-[#2962ff] text-white'
              : 'text-[#d1d4dc] dark:text-[#d1d4dc] light:text-slate-700 bg-[#1e222d] dark:bg-[#1e222d] light:bg-slate-100 hover:bg-[#2a2e39] dark:hover:bg-[#2a2e39] light:hover:bg-slate-200 border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200'
          }`}
          title="Watchlist & alerts panel"
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Watchlist</span>
          <span className="text-[11px] font-mono opacity-80">({watchlist.length})</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-[#787b86] hover:text-white dark:hover:text-white light:hover:text-slate-900 rounded-md hover:bg-[#1e222d] dark:hover:bg-[#1e222d] light:hover:bg-slate-100 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>
    </header>
  );
};
