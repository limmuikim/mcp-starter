import React from 'react';
import { useMarket } from '../context/MarketContext';
import { SymbolLogo } from './SymbolLogo';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const MarqueeTicker: React.FC = () => {
  const { symbols, setSelectedSymbol, lastTickedId, lastTickDirection } = useMarket();

  // Pick top benchmark instruments for the ticker tape
  const marqueeIds = ['spx', 'ndx', 'dji', 'btcusd', 'ethusd', 'xauusd', 'cl1', 'us10y', 'eurusd', 'nvda'];
  const marqueeSymbols = marqueeIds
    .map(id => symbols.find(s => s.id === id))
    .filter(Boolean) as typeof symbols;

  return (
    <div className="w-full bg-[#1e222d] dark:bg-[#1e222d] light:bg-[#f0f3fa] border-b border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 overflow-x-auto scrollbar-none py-1.5 px-4 text-xs select-none">
      <div className="flex items-center gap-6 min-w-max">
        {marqueeSymbols.map(sym => {
          const isTicking = lastTickedId === sym.id;
          const isUp = sym.change >= 0;

          return (
            <button
              key={sym.id}
              onClick={() => setSelectedSymbol(sym)}
              className={`flex items-center gap-2 px-2 py-1 rounded transition-colors group cursor-pointer text-left ${
                isTicking
                  ? lastTickDirection === 'up'
                    ? 'tick-flash-up bg-emerald-500/10'
                    : 'tick-flash-down bg-rose-500/10'
                  : 'hover:bg-[#2a2e39]/60 dark:hover:bg-[#2a2e39]/60 light:hover:bg-slate-200/60'
              }`}
            >
              <SymbolLogo symbol={sym.symbol} logoUrl={sym.logoUrl} size="sm" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="font-semibold text-white dark:text-white light:text-slate-900">
                    {sym.symbol}
                  </span>
                  <span className="text-[11px] text-[#787b86] hidden lg:inline">
                    {sym.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono tabular-nums text-[11px]">
                  <span className="text-white/90 dark:text-white/90 light:text-slate-800 font-medium">
                    {sym.price < 2 ? sym.price.toFixed(4) : sym.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`flex items-center font-medium ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="w-3 h-3 inline" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 inline" />
                    )}
                    {isUp ? '+' : ''}
                    {sym.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
