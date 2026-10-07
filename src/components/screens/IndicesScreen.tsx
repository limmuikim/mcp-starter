import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../SymbolLogo';
import { Sparkline } from '../Sparkline';
import { ArrowUpRight, ArrowDownRight, Globe, Layers, TrendingUp } from 'lucide-react';

export const IndicesScreen: React.FC = () => {
  const { symbols, setSelectedSymbol, lastTickedId, lastTickDirection } = useMarket();
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'americas' | 'europe' | 'asia'>('all');

  const indices = symbols.filter(s => s.category === 'indices');

  const filteredIndices = indices.filter(ind => {
    if (selectedRegion === 'all') return true;
    if (selectedRegion === 'americas') return ind.country === 'US';
    if (selectedRegion === 'europe') return ind.country === 'EU' || ind.country === 'GB';
    if (selectedRegion === 'asia') return ind.country === 'JP';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2962ff] mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span>World Market Benchmarks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Major Indices
          </h1>
          <p className="text-xs sm:text-sm text-[#787b86] mt-1">
            Real-time tracking of premier global equity benchmarks across the Americas, Europe, and Asia-Pacific.
          </p>
        </div>

        {/* Region selector */}
        <div className="flex items-center gap-1 bg-[#1e222d] p-1 rounded-md border border-[#2a2e39] text-xs">
          {(['all', 'americas', 'europe', 'asia'] as const).map(reg => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded capitalize font-medium transition-colors ${
                selectedRegion === reg
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Regional Index Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.slice(0, 4).map(idx => {
          const isUp = idx.change >= 0;
          return (
            <div
              key={idx.id}
              onClick={() => setSelectedSymbol(idx)}
              className="p-4 rounded-lg bg-[#1e222d] border border-[#2a2e39] hover:border-[#2962ff] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <SymbolLogo symbol={idx.symbol} logoUrl={idx.logoUrl} size="sm" />
                  <div>
                    <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                      {idx.symbol}
                    </span>
                    <span className="text-[11px] text-[#787b86] block">
                      {idx.exchange}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#131722] text-[#787b86]">
                  {idx.country}
                </span>
              </div>

              <div className="my-2">
                <div className="text-lg font-bold font-mono text-white tabular-nums">
                  {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-xs font-mono font-semibold flex items-center gap-1 mt-0.5 ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{isUp ? '+' : ''}{idx.change.toFixed(2)}</span>
                  <span>({isUp ? '+' : ''}{idx.changePercent.toFixed(2)}%)</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[#2a2e39] flex items-center justify-between">
                <span className="text-[11px] text-[#787b86]">24h Trend</span>
                <Sparkline data={idx.sparkline} isPositive={isUp} width={65} height={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* World Indices Table */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
        <div className="mb-4">
          <h2 className="text-base font-bold text-white tracking-tight">
            Global Index Quotes
          </h2>
          <p className="text-xs text-[#787b86]">
            Comprehensive global indices performance table
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-semibold">
                <th className="py-2.5 px-3">INDEX NAME</th>
                <th className="py-2.5 px-3 text-right">PRICE</th>
                <th className="py-2.5 px-3 text-right">CHANGE</th>
                <th className="py-2.5 px-3 text-right">CHANGE %</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">HIGH</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">LOW</th>
                <th className="py-2.5 px-3 text-center hidden md:table-cell">RATING</th>
                <th className="py-2.5 px-3 text-right">CHART</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60">
              {filteredIndices.map(idx => {
                const isUp = idx.change >= 0;
                const isTicking = lastTickedId === idx.id;

                return (
                  <tr
                    key={idx.id}
                    onClick={() => setSelectedSymbol(idx)}
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
                        <SymbolLogo symbol={idx.symbol} logoUrl={idx.logoUrl} size="sm" />
                        <div>
                          <span className="font-bold text-white hover:text-[#2962ff] transition-colors">
                            {idx.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] block">
                            {idx.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}{idx.change.toFixed(2)}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      <span className="flex items-center justify-end gap-0.5">
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isUp ? '+' : ''}{idx.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden sm:table-cell">
                      {idx.high24h.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden sm:table-cell">
                      {idx.low24h.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-center hidden md:table-cell">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                          idx.rating.includes('Buy')
                            ? 'bg-[#089981]/20 text-[#089981]'
                            : idx.rating.includes('Sell')
                            ? 'bg-[#f23645]/20 text-[#f23645]'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {idx.rating}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end">
                        <Sparkline data={idx.sparkline} isPositive={isUp} width={65} height={20} />
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
