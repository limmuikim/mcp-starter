import React from 'react';
import { AssetCategory } from '../types/market';
import { useMarket } from '../context/MarketContext';
import {
  LayoutDashboard,
  LineChart,
  TrendingUp,
  Bitcoin,
  CircleDollarSign,
  Flame,
  Landmark,
  Globe2,
} from 'lucide-react';

interface TabItem {
  id: AssetCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_TABS: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'indices', label: 'Indices', icon: LineChart },
  { id: 'stocks', label: 'Stocks', icon: TrendingUp },
  { id: 'crypto', label: 'Crypto', icon: Bitcoin },
  { id: 'forex', label: 'Forex', icon: CircleDollarSign },
  { id: 'futures', label: 'Futures & Commodities', icon: Flame },
  { id: 'bonds', label: 'Bonds', icon: Landmark },
  { id: 'economy', label: 'Economy', icon: Globe2 },
];

export const CategoryNav: React.FC = () => {
  const { activeCategory, setActiveCategory } = useMarket();

  return (
    <div className="w-full bg-[#131722] dark:bg-[#131722] light:bg-white border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 px-4 sm:px-6">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
        {CATEGORY_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap rounded-md transition-colors relative cursor-pointer ${
                isActive
                  ? 'text-white dark:text-white light:text-slate-900 font-semibold bg-[#1e222d] dark:bg-[#1e222d] light:bg-slate-100'
                  : 'text-[#787b86] hover:text-[#d1d4dc] dark:hover:text-[#d1d4dc] light:hover:text-slate-900 hover:bg-[#1e222d]/50 dark:hover:bg-[#1e222d]/50 light:hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2962ff]' : 'opacity-70'}`} />
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#2962ff] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
