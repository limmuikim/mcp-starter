import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../SymbolLogo';
import { Sparkline } from '../Sparkline';
import { ArrowUpRight, ArrowDownRight, CircleDollarSign, Clock } from 'lucide-react';
import { FOREX_CROSS_RATES } from '../../data/marketData';

export const ForexScreen: React.FC = () => {
  const { symbols, setSelectedSymbol, lastTickedId, lastTickDirection } = useMarket();

  const forexPairs = symbols.filter(s => s.category === 'forex');

  // Forex session hours
  const sessions = [
    { name: 'Sydney', hours: '22:00 - 07:00 UTC', status: 'Closed' },
    { name: 'Tokyo', hours: '00:00 - 09:00 UTC', status: 'Closed' },
    { name: 'London', hours: '08:00 - 17:00 UTC', status: 'Open', active: true },
    { name: 'New York', hours: '13:00 - 22:00 UTC', status: 'Open', active: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="border-b border-[#2a2e39] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2962ff] mb-1">
              <CircleDollarSign className="w-3.5 h-3.5" />
              <span>Foreign Exchange</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Currencies & Cross Rates
            </h1>
            <p className="text-xs sm:text-sm text-[#787b86] mt-1">
              Real-time quotes, pip movements, and interbank exchange rates across global FX majors and crosses.
            </p>
          </div>

          {/* Session Trading Hours */}
          <div className="flex items-center gap-2 text-xs">
            {sessions.map(s => (
              <div
                key={s.name}
                className="px-2.5 py-1.5 rounded bg-[#1e222d] border border-[#2a2e39] flex items-center gap-1.5"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    s.active ? 'bg-[#089981] animate-pulse' : 'bg-[#787b86]'
                  }`}
                />
                <span className="font-semibold text-white">{s.name}</span>
                <span className="text-[10px] text-[#787b86]">({s.status})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forex Cross Rates Matrix */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
        <div className="mb-3">
          <h2 className="text-base font-bold text-white tracking-tight">
            Forex Cross Rates Matrix
          </h2>
          <p className="text-xs text-[#787b86]">
            Base currency in rows, quote currency in columns
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86]">
                <th className="py-2 px-3 text-left font-bold text-white">FX</th>
                {FOREX_CROSS_RATES.currencies.map(c => (
                  <th key={c} className="py-2 px-3 font-mono font-bold text-white">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60">
              {FOREX_CROSS_RATES.currencies.map(rowCurr => (
                <tr key={rowCurr} className="hover:bg-[#2a2e39]/40 transition-colors">
                  <td className="py-2.5 px-3 text-left font-mono font-bold text-white">
                    {rowCurr}
                  </td>
                  {FOREX_CROSS_RATES.currencies.map(colCurr => {
                    const isSelf = rowCurr === colCurr;
                    const val = FOREX_CROSS_RATES.rates[rowCurr]?.[colCurr] ?? 1;

                    return (
                      <td
                        key={colCurr}
                        className={`py-2.5 px-3 font-mono tabular-nums text-xs ${
                          isSelf
                            ? 'bg-[#131722]/50 text-[#787b86]'
                            : 'text-white font-medium hover:bg-[#2962ff]/10'
                        }`}
                      >
                        {isSelf ? '1.0000' : val.toFixed(4)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Currency Pairs Table */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
        <div className="mb-4">
          <h2 className="text-base font-bold text-white tracking-tight">
            Currency Majors
          </h2>
          <p className="text-xs text-[#787b86]">
            Real-time bid, ask, and daily range for top currency pairs
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-semibold">
                <th className="py-2.5 px-3">PAIR</th>
                <th className="py-2.5 px-3 text-right">BID / RATE</th>
                <th className="py-2.5 px-3 text-right">CHANGE</th>
                <th className="py-2.5 px-3 text-right">CHANGE %</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">24H HIGH</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">24H LOW</th>
                <th className="py-2.5 px-3 text-center hidden md:table-cell">TECHNICAL</th>
                <th className="py-2.5 px-3 text-right">CHART</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60">
              {forexPairs.map(fx => {
                const isUp = fx.change >= 0;
                const isTicking = lastTickedId === fx.id;

                return (
                  <tr
                    key={fx.id}
                    onClick={() => setSelectedSymbol(fx)}
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
                        <SymbolLogo symbol={fx.symbol} logoUrl={fx.logoUrl} size="sm" />
                        <div>
                          <span className="font-bold text-white hover:text-[#2962ff] transition-colors">
                            {fx.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] block">
                            {fx.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      {fx.price.toFixed(4)}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}{fx.change.toFixed(4)}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      <span className="flex items-center justify-end gap-0.5">
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isUp ? '+' : ''}{fx.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden sm:table-cell">
                      {fx.high24h.toFixed(4)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden sm:table-cell">
                      {fx.low24h.toFixed(4)}
                    </td>

                    <td className="py-3 px-3 text-center hidden md:table-cell">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                          fx.rating.includes('Buy')
                            ? 'bg-[#089981]/20 text-[#089981]'
                            : fx.rating.includes('Sell')
                            ? 'bg-[#f23645]/20 text-[#f23645]'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {fx.rating}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end">
                        <Sparkline data={fx.sparkline} isPositive={isUp} width={65} height={20} />
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
