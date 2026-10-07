import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../SymbolLogo';
import { Sparkline } from '../Sparkline';
import { ArrowUpRight, ArrowDownRight, Flame, Droplets, Gem } from 'lucide-react';

export const FuturesScreen: React.FC = () => {
  const { symbols, setSelectedSymbol, lastTickedId, lastTickDirection } = useMarket();
  const [activeTab, setActiveTab] = useState<'all' | 'energy' | 'metals'>('all');

  const futures = symbols.filter(s => s.category === 'futures');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="border-b border-[#2a2e39] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2962ff] mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Commodity Derivatives</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Futures & Commodities
            </h1>
            <p className="text-xs sm:text-sm text-[#787b86] mt-1">
              Real-time commodity futures pricing across energy, precious metals, and industrial materials.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Commodities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {futures.map(fut => {
          const isUp = fut.change >= 0;
          return (
            <div
              key={fut.id}
              onClick={() => setSelectedSymbol(fut)}
              className="p-4 rounded-lg bg-[#1e222d] border border-[#2a2e39] hover:border-[#2962ff] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <SymbolLogo symbol={fut.symbol} logoUrl={fut.logoUrl} size="md" />
                  <div>
                    <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                      {fut.symbol}
                    </span>
                    <span className="text-[11px] text-[#787b86] block">
                      {fut.name}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#787b86]">
                  {fut.exchange}
                </span>
              </div>

              <div className="my-2">
                <div className="text-xl font-bold font-mono text-white tabular-nums">
                  ${fut.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-xs font-mono font-semibold flex items-center gap-1 mt-0.5 ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{isUp ? '+' : ''}{fut.change.toFixed(2)}</span>
                  <span>({isUp ? '+' : ''}{fut.changePercent.toFixed(2)}%)</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86]">
                <span>Vol: <strong className="text-white font-mono">{fut.volume}</strong></span>
                <Sparkline data={fut.sparkline} isPositive={isUp} width={65} height={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Commodities Table */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
        <div className="mb-4">
          <h2 className="text-base font-bold text-white tracking-tight">
            Commodity Futures Quotes
          </h2>
          <p className="text-xs text-[#787b86]">
            Front-month active continuous futures contracts
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-semibold">
                <th className="py-2.5 px-3">CONTRACT</th>
                <th className="py-2.5 px-3 text-right">LAST</th>
                <th className="py-2.5 px-3 text-right">CHANGE</th>
                <th className="py-2.5 px-3 text-right">CHANGE %</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">HIGH</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">LOW</th>
                <th className="py-2.5 px-3 text-right hidden md:table-cell">VOLUME</th>
                <th className="py-2.5 px-3 text-center hidden lg:table-cell">TECHNICAL</th>
                <th className="py-2.5 px-3 text-right">CHART</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60">
              {futures.map(fut => {
                const isUp = fut.change >= 0;
                const isTicking = lastTickedId === fut.id;

                return (
                  <tr
                    key={fut.id}
                    onClick={() => setSelectedSymbol(fut)}
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
                        <SymbolLogo symbol={fut.symbol} logoUrl={fut.logoUrl} size="sm" />
                        <div>
                          <span className="font-bold text-white hover:text-[#2962ff] transition-colors">
                            {fut.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] block">
                            {fut.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      ${fut.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}{fut.change.toFixed(2)}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      <span className="flex items-center justify-end gap-0.5">
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isUp ? '+' : ''}{fut.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden sm:table-cell">
                      ${fut.high24h.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden sm:table-cell">
                      ${fut.low24h.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#d1d4dc] tabular-nums hidden md:table-cell">
                      {fut.volume}
                    </td>

                    <td className="py-3 px-3 text-center hidden lg:table-cell">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                          fut.rating.includes('Buy')
                            ? 'bg-[#089981]/20 text-[#089981]'
                            : fut.rating.includes('Sell')
                            ? 'bg-[#f23645]/20 text-[#f23645]'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {fut.rating}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end">
                        <Sparkline data={fut.sparkline} isPositive={isUp} width={65} height={20} />
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
