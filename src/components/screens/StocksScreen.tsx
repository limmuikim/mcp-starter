import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../SymbolLogo';
import { Sparkline } from '../Sparkline';
import { ArrowUpRight, ArrowDownRight, Filter, TrendingUp, Layers } from 'lucide-react';

export const StocksScreen: React.FC = () => {
  const { symbols, setSelectedSymbol, lastTickedId, lastTickDirection } = useMarket();
  const [sectorFilter, setSectorFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'marketCap' | 'changePercent' | 'price' | 'volume'>('marketCap');

  const stocks = symbols.filter(s => s.category === 'stocks');

  const sectors = ['All', 'Electronic Technology', 'Technology Services', 'Retail Trade', 'Consumer Durables'];

  const filteredStocks = stocks
    .filter(s => (sectorFilter === 'All' ? true : s.sector === sectorFilter))
    .filter(s => (ratingFilter === 'All' ? true : s.rating.includes(ratingFilter)))
    .sort((a, b) => {
      if (sortBy === 'changePercent') return b.changePercent - a.changePercent;
      if (sortBy === 'price') return b.price - a.price;
      return (b.peRatio || 0) - (a.peRatio || 0);
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2962ff] mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Equities & Screeners</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            US Stocks
          </h1>
          <p className="text-xs sm:text-sm text-[#787b86] mt-1">
            Track performance, valuation, earnings multiples, and technical momentum across leading US public equities.
          </p>
        </div>

        {/* Quick Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-[#1e222d] px-2.5 py-1.5 rounded-md border border-[#2a2e39]">
            <Filter className="w-3.5 h-3.5 text-[#787b86]" />
            <select
              value={sectorFilter}
              onChange={e => setSectorFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-hidden text-xs cursor-pointer"
            >
              {sectors.map(sec => (
                <option key={sec} value={sec} className="bg-[#1e222d] text-white">
                  Sector: {sec}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#1e222d] px-2.5 py-1.5 rounded-md border border-[#2a2e39]">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent text-white focus:outline-hidden text-xs cursor-pointer"
            >
              <option value="marketCap" className="bg-[#1e222d] text-white">Sort: Market Cap</option>
              <option value="changePercent" className="bg-[#1e222d] text-white">Sort: % Change</option>
              <option value="price" className="bg-[#1e222d] text-white">Sort: Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Equities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stocks.slice(0, 4).map(stk => {
          const isUp = stk.change >= 0;
          return (
            <div
              key={stk.id}
              onClick={() => setSelectedSymbol(stk)}
              className="p-4 rounded-lg bg-[#1e222d] border border-[#2a2e39] hover:border-[#2962ff] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <SymbolLogo symbol={stk.symbol} logoUrl={stk.logoUrl} size="md" />
                  <div>
                    <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                      {stk.symbol}
                    </span>
                    <span className="text-[11px] text-[#787b86] block truncate max-w-[120px]">
                      {stk.name}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#787b86]">
                  {stk.marketCap}
                </span>
              </div>

              <div className="my-2">
                <div className="text-xl font-bold font-mono text-white tabular-nums">
                  ${stk.price.toFixed(2)}
                </div>
                <div
                  className={`text-xs font-mono font-semibold flex items-center gap-1 mt-0.5 ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{isUp ? '+' : ''}{stk.change.toFixed(2)}</span>
                  <span>({isUp ? '+' : ''}{stk.changePercent.toFixed(2)}%)</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86]">
                <span>P/E: <strong className="text-white font-mono">{stk.peRatio}</strong></span>
                <Sparkline data={stk.sparkline} isPositive={isUp} width={65} height={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* High Density Screener Table */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            US Stocks Screener
          </h2>
          <span className="text-xs text-[#787b86]">
            Showing {filteredStocks.length} equities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-semibold">
                <th className="py-2.5 px-3">TICKER</th>
                <th className="py-2.5 px-3 text-right">LAST</th>
                <th className="py-2.5 px-3 text-right">CHG</th>
                <th className="py-2.5 px-3 text-right">CHG %</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">MARKET CAP</th>
                <th className="py-2.5 px-3 text-right hidden md:table-cell">P/E RATIO</th>
                <th className="py-2.5 px-3 text-right hidden lg:table-cell">VOLUME</th>
                <th className="py-2.5 px-3 text-center hidden xl:table-cell">RATING</th>
                <th className="py-2.5 px-3 text-right">TREND (24H)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60">
              {filteredStocks.map(stk => {
                const isUp = stk.change >= 0;
                const isTicking = lastTickedId === stk.id;

                return (
                  <tr
                    key={stk.id}
                    onClick={() => setSelectedSymbol(stk)}
                    className={`hover:bg-[#2a2e39]/50 cursor-pointer transition-colors ${
                      isTicking
                        ? lastTickDirection === 'up'
                          ? 'tick-flash-up bg-emerald-500/10'
                          : 'tick-flash-down bg-rose-500/10'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <SymbolLogo symbol={stk.symbol} logoUrl={stk.logoUrl} size="sm" />
                        <div>
                          <div className="font-bold text-white hover:text-[#2962ff] transition-colors">
                            {stk.symbol}
                          </div>
                          <div className="text-[11px] text-[#787b86] truncate max-w-[140px]">
                            {stk.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      ${stk.price.toFixed(2)}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}{stk.change.toFixed(2)}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      <span className="flex items-center justify-end gap-0.5">
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isUp ? '+' : ''}{stk.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#d1d4dc] tabular-nums hidden sm:table-cell">
                      {stk.marketCap}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden md:table-cell">
                      {stk.peRatio ?? '--'}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden lg:table-cell">
                      {stk.volume}
                    </td>

                    <td className="py-3 px-3 text-center hidden xl:table-cell">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                          stk.rating.includes('Buy')
                            ? 'bg-[#089981]/20 text-[#089981]'
                            : stk.rating.includes('Sell')
                            ? 'bg-[#f23645]/20 text-[#f23645]'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {stk.rating}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end">
                        <Sparkline data={stk.sparkline} isPositive={isUp} width={65} height={20} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
