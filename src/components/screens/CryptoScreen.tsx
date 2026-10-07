import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../SymbolLogo';
import { Sparkline } from '../Sparkline';
import { ArrowUpRight, ArrowDownRight, Bitcoin, Coins, ShieldCheck, Zap } from 'lucide-react';

export const CryptoScreen: React.FC = () => {
  const { symbols, setSelectedSymbol, lastTickedId, lastTickDirection } = useMarket();
  const [filterType, setFilterType] = useState<'all' | 'l1' | 'top'>('all');

  const cryptos = symbols.filter(s => s.category === 'crypto');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Global Metrics */}
      <div className="border-b border-[#2a2e39] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2962ff] mb-1">
              <Bitcoin className="w-3.5 h-3.5" />
              <span>Digital Assets</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cryptocurrency Markets
            </h1>
            <p className="text-xs sm:text-sm text-[#787b86] mt-1">
              Live market capitalization rankings, price action, and volume across primary blockchain networks.
            </p>
          </div>

          {/* Global Crypto Stats Bar */}
          <div className="flex items-center gap-3 text-xs bg-[#1e222d] p-2.5 rounded-lg border border-[#2a2e39]">
            <div>
              <span className="text-[#787b86] block text-[10px]">TOTAL CAP</span>
              <span className="font-mono text-white font-bold">$2.68T</span>
            </div>
            <div className="h-6 w-px bg-[#2a2e39]" />
            <div>
              <span className="text-[#787b86] block text-[10px]">24H VOLUME</span>
              <span className="font-mono text-white font-bold">$84.2B</span>
            </div>
            <div className="h-6 w-px bg-[#2a2e39]" />
            <div>
              <span className="text-[#787b86] block text-[10px]">BTC DOMINANCE</span>
              <span className="font-mono text-[#089981] font-bold">54.6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Crypto Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cryptos.slice(0, 3).map(coin => {
          const isUp = coin.change >= 0;
          return (
            <div
              key={coin.id}
              onClick={() => setSelectedSymbol(coin)}
              className="p-4 rounded-lg bg-[#1e222d] border border-[#2a2e39] hover:border-[#2962ff] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <SymbolLogo symbol={coin.symbol} logoUrl={coin.logoUrl} size="md" />
                  <div>
                    <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                      {coin.symbol}
                    </span>
                    <span className="text-[11px] text-[#787b86] block">
                      {coin.name}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#787b86]">
                  Cap: {coin.marketCap}
                </span>
              </div>

              <div className="my-2">
                <div className="text-xl font-bold font-mono text-white tabular-nums">
                  ${coin.price < 2 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-xs font-mono font-semibold flex items-center gap-1 mt-0.5 ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{isUp ? '+' : ''}{coin.change.toFixed(2)}</span>
                  <span>({isUp ? '+' : ''}{coin.changePercent.toFixed(2)}%)</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86]">
                <span>Vol: <strong className="text-white font-mono">{coin.volume}</strong></span>
                <Sparkline data={coin.sparkline} isPositive={isUp} width={65} height={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Crypto Rankings Table */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Crypto Market Cap Ranking
          </h2>
          <span className="text-xs text-[#787b86]">
            Live quotes & 24h performance
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-semibold">
                <th className="py-2.5 px-3">ASSET</th>
                <th className="py-2.5 px-3 text-right">PRICE (USD)</th>
                <th className="py-2.5 px-3 text-right">24H CHANGE</th>
                <th className="py-2.5 px-3 text-right">24H CHG %</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">24H HIGH</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">24H LOW</th>
                <th className="py-2.5 px-3 text-right hidden md:table-cell">24H VOLUME</th>
                <th className="py-2.5 px-3 text-right hidden lg:table-cell">MARKET CAP</th>
                <th className="py-2.5 px-3 text-center hidden xl:table-cell">TECHNICAL</th>
                <th className="py-2.5 px-3 text-right">7D TREND</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60">
              {cryptos.map(coin => {
                const isUp = coin.change >= 0;
                const isTicking = lastTickedId === coin.id;

                return (
                  <tr
                    key={coin.id}
                    onClick={() => setSelectedSymbol(coin)}
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
                        <SymbolLogo symbol={coin.symbol} logoUrl={coin.logoUrl} size="sm" />
                        <div>
                          <span className="font-bold text-white hover:text-[#2962ff] transition-colors">
                            {coin.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] block">
                            {coin.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      ${coin.price < 2 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}{coin.change.toFixed(2)}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      <span className="flex items-center justify-end gap-0.5">
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isUp ? '+' : ''}{coin.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden sm:table-cell">
                      ${coin.high24h.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden sm:table-cell">
                      ${coin.low24h.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#d1d4dc] tabular-nums hidden md:table-cell">
                      {coin.volume}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#d1d4dc] tabular-nums hidden lg:table-cell">
                      {coin.marketCap}
                    </td>

                    <td className="py-3 px-3 text-center hidden xl:table-cell">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                          coin.rating.includes('Buy')
                            ? 'bg-[#089981]/20 text-[#089981]'
                            : coin.rating.includes('Sell')
                            ? 'bg-[#f23645]/20 text-[#f23645]'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {coin.rating}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end">
                        <Sparkline data={coin.sparkline} isPositive={isUp} width={65} height={20} />
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
