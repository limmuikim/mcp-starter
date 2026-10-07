import React, { useState } from 'react';
import { SECTOR_HEATMAP_DATA } from '../data/marketData';
import { useMarket } from '../context/MarketContext';
import { HeatmapItem } from '../types/market';

export const MarketHeatmap: React.FC = () => {
  const { symbols, setSelectedSymbol } = useMarket();
  const [selectedSector, setSelectedSector] = useState<string>('All');

  const sectors = ['All', 'Technology', 'Communication', 'Financials', 'Healthcare', 'Energy'];

  const filteredItems = selectedSector === 'All'
    ? SECTOR_HEATMAP_DATA
    : SECTOR_HEATMAP_DATA.filter(item => item.sector === selectedSector);

  const getTileBg = (change: number) => {
    if (change >= 3) return 'bg-[#089981] hover:brightness-110';
    if (change >= 1.5) return 'bg-[#0e766e] hover:brightness-110';
    if (change > 0) return 'bg-[#134e4a] hover:brightness-110';
    if (change <= -2.5) return 'bg-[#b91c1c] hover:brightness-110';
    if (change <= -1) return 'bg-[#991b1b] hover:brightness-110';
    if (change < 0) return 'bg-[#7f1d1d] hover:brightness-110';
    return 'bg-[#2a2e39]';
  };

  const handleTileClick = (item: HeatmapItem) => {
    // Look up full symbol
    const found = symbols.find(s => s.symbol === item.symbol);
    if (found) {
      setSelectedSymbol(found);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-[#f8fafc] border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            S&P 500 Market Heatmap
          </h3>
          <p className="text-xs text-[#787b86]">
            Relative performance weighted by market capitalization
          </p>
        </div>

        {/* Sector filter tabs */}
        <div className="flex items-center gap-1 bg-[#131722] dark:bg-[#131722] light:bg-slate-200 p-0.5 rounded-md border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-300 text-xs overflow-x-auto">
          {sectors.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                selectedSector === sec
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white dark:hover:text-white light:hover:text-slate-900'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 min-h-[220px]">
        {filteredItems.map(item => {
          const isUp = item.changePercent >= 0;
          const bgClass = getTileBg(item.changePercent);

          // Span 2 columns for heavy weights if grid permits
          const colSpan = item.weight > 12 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1';

          return (
            <button
              key={item.symbol}
              onClick={() => handleTileClick(item)}
              className={`${colSpan} ${bgClass} rounded p-3 text-white flex flex-col justify-between transition-all cursor-pointer shadow-xs border border-white/10 group`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm tracking-wide">
                  {item.symbol}
                </span>
                <span className="text-[10px] opacity-80 uppercase tracking-wider font-mono">
                  {item.sector.slice(0, 4)}
                </span>
              </div>

              <div className="text-left my-1">
                <div className="text-xs font-mono tabular-nums opacity-90">
                  ${item.price.toFixed(2)}
                </div>
              </div>

              <div className="text-left">
                <span className="text-xs sm:text-sm font-bold font-mono tabular-nums">
                  {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-[11px] text-[#787b86]">
        <span>-3%</span>
        <div className="flex h-2.5 w-32 rounded-full overflow-hidden">
          <div className="bg-[#b91c1c] flex-1" />
          <div className="bg-[#991b1b] flex-1" />
          <div className="bg-[#2a2e39] flex-1" />
          <div className="bg-[#134e4a] flex-1" />
          <div className="bg-[#089981] flex-1" />
        </div>
        <span>+3%</span>
      </div>
    </div>
  );
};
