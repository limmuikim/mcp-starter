import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { MiniChartCard } from '../MiniChartCard';
import { MarketHeatmap } from '../MarketHeatmap';
import { SymbolLogo } from '../SymbolLogo';
import { Sparkline } from '../Sparkline';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Globe,
  Clock,
  Flame,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { BREAKING_NEWS_DATA, ECONOMIC_CALENDAR_DATA } from '../../data/marketData';

export const OverviewScreen: React.FC = () => {
  const { symbols, setSelectedSymbol, lastTickedId, lastTickDirection } = useMarket();
  const [moverTab, setMoverTab] = useState<'gainers' | 'losers' | 'active' | 'largeCap'>('active');

  // Featured instruments for top hero mini charts
  const featuredIds = ['spx', 'ndx', 'btcusd', 'xauusd', 'cl1', 'us10y'];
  const featuredSymbols = featuredIds
    .map(id => symbols.find(s => s.id === id))
    .filter(Boolean) as typeof symbols;

  // Filter symbols based on moverTab
  const moverSymbols = [...symbols].sort((a, b) => {
    if (moverTab === 'gainers') return b.changePercent - a.changePercent;
    if (moverTab === 'losers') return a.changePercent - b.changePercent;
    if (moverTab === 'active') return Math.abs(b.changePercent) - Math.abs(a.changePercent);
    return (b.peRatio || 0) - (a.peRatio || 0);
  }).slice(0, 8);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner: "Markets, everywhere" */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2a2e39] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2962ff] mb-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>Global Market Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Markets, everywhere
          </h1>
          <p className="text-xs sm:text-sm text-[#787b86] mt-1 max-w-2xl">
            Real-time quotes, technical insights, and performance tracking across global equities, crypto, commodities, forex, and bonds.
          </p>
        </div>

        {/* Market Vital Stat Pills (Clean unboxed style) */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#787b86]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-white font-medium">US Markets: Open</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>NYSE Regular Session</span>
          </div>
          <span aria-hidden="true">·</span>
          <div>
            <span>Market Sentiment: </span>
            <span className="text-[#089981] font-bold">64 (Greed)</span>
          </div>
        </div>
      </div>

      {/* Featured Overview Mini-Charts Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Market Summary</span>
          </h2>
          <span className="text-xs text-[#787b86]">
            Click any chart to open interactive Superchart
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredSymbols.map(sym => (
            <MiniChartCard key={sym.id} symbol={sym} />
          ))}
        </div>
      </div>

      {/* S&P 500 Market Heatmap */}
      <MarketHeatmap />

      {/* Market Movers Screener Section */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Market Movers
            </h3>
            <p className="text-xs text-[#787b86]">
              Real-time movers across global markets
            </p>
          </div>

          {/* Mover Tabs */}
          <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-md border border-[#2a2e39] text-xs overflow-x-auto">
            <button
              onClick={() => setMoverTab('active')}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                moverTab === 'active'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              Most Active
            </button>
            <button
              onClick={() => setMoverTab('gainers')}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                moverTab === 'gainers'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              Top Gainers
            </button>
            <button
              onClick={() => setMoverTab('losers')}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                moverTab === 'losers'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              Top Losers
            </button>
            <button
              onClick={() => setMoverTab('largeCap')}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                moverTab === 'largeCap'
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              High Valuation
            </button>
          </div>
        </div>

        {/* High-Density Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-semibold">
                <th className="py-2.5 px-3">SYMBOL</th>
                <th className="py-2.5 px-3 text-right">LAST</th>
                <th className="py-2.5 px-3 text-right">CHG</th>
                <th className="py-2.5 px-3 text-right">CHG %</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">24H RANGE</th>
                <th className="py-2.5 px-3 text-right hidden md:table-cell">VOLUME</th>
                <th className="py-2.5 px-3 text-right hidden lg:table-cell">MARKET CAP</th>
                <th className="py-2.5 px-3 text-center hidden xl:table-cell">TECHNICAL</th>
                <th className="py-2.5 px-3 text-right">TREND (24H)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60">
              {moverSymbols.map(sym => {
                const isUp = sym.change >= 0;
                const isTicking = lastTickedId === sym.id;

                return (
                  <tr
                    key={sym.id}
                    onClick={() => setSelectedSymbol(sym)}
                    className={`hover:bg-[#2a2e39]/50 cursor-pointer transition-colors ${
                      isTicking
                        ? lastTickDirection === 'up'
                          ? 'tick-flash-up bg-emerald-500/10'
                          : 'tick-flash-down bg-rose-500/10'
                        : ''
                    }`}
                  >
                    {/* Symbol & Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <SymbolLogo symbol={sym.symbol} logoUrl={sym.logoUrl} size="sm" />
                        <div>
                          <div className="font-bold text-white hover:text-[#2962ff] transition-colors">
                            {sym.symbol}
                          </div>
                          <div className="text-[11px] text-[#787b86] truncate max-w-[130px]">
                            {sym.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      {sym.price < 2 ? sym.price.toFixed(4) : sym.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Change $ */}
                    <td
                      className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}{sym.change.toFixed(2)}
                    </td>

                    {/* Change % */}
                    <td
                      className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      <span className="flex items-center justify-end gap-0.5">
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isUp ? '+' : ''}{sym.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    {/* 24h Range */}
                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden sm:table-cell text-[11px]">
                      {sym.low24h.toFixed(2)} - {sym.high24h.toFixed(2)}
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 text-right font-mono text-[#d1d4dc] tabular-nums hidden md:table-cell">
                      {sym.volume}
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-3 text-right font-mono text-[#d1d4dc] tabular-nums hidden lg:table-cell">
                      {sym.marketCap || '--'}
                    </td>

                    {/* Technical Rating */}
                    <td className="py-3 px-3 text-center hidden xl:table-cell">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                          sym.rating.includes('Buy')
                            ? 'bg-[#089981]/20 text-[#089981]'
                            : sym.rating.includes('Sell')
                            ? 'bg-[#f23645]/20 text-[#f23645]'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {sym.rating}
                      </span>
                    </td>

                    {/* Sparkline */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end">
                        <Sparkline data={sym.sparkline} isPositive={isUp} width={65} height={22} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Column Wire: Breaking Market News + Economic Calendar Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News Feed */}
        <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Market News Stream</span>
              </h3>
              <span className="text-xs text-[#787b86]">Live Wire</span>
            </div>

            <div className="space-y-3">
              {BREAKING_NEWS_DATA.slice(0, 4).map(news => (
                <div
                  key={news.id}
                  className="p-3 bg-[#131722] rounded border border-[#2a2e39] hover:border-[#2962ff]/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#787b86] mb-1">
                    <span className="font-semibold text-white/80">{news.source}</span>
                    <span>{news.timeAgo}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug hover:text-[#2962ff] transition-colors cursor-pointer">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-2">
                    {news.symbols.map(s => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e222d] text-[#2962ff]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Economic Events */}
        <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#2962ff]" />
              <span>Key Economic Events</span>
            </h3>
            <span className="text-xs text-[#787b86]">Calendar</span>
          </div>

          <div className="space-y-2.5">
            {ECONOMIC_CALENDAR_DATA.slice(0, 4).map(ev => (
              <div
                key={ev.id}
                className="p-3 bg-[#131722] rounded border border-[#2a2e39] text-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-[#787b86] mb-1">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={ev.flagUrl}
                      alt={ev.countryCode}
                      className="w-3.5 h-3.5 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-medium text-white/80">{ev.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{ev.time}</span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded uppercase font-semibold ${
                        ev.impact === 'high'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {ev.impact}
                    </span>
                  </div>
                </div>
                <div className="font-semibold text-white mb-2">{ev.event}</div>
                <div className="grid grid-cols-3 gap-2 text-[11px] bg-[#1e222d] p-1.5 rounded font-mono">
                  <div>
                    <span className="text-[#787b86] block text-[9px]">ACTUAL</span>
                    <span className="text-white font-bold">{ev.actual}</span>
                  </div>
                  <div>
                    <span className="text-[#787b86] block text-[9px]">FORECAST</span>
                    <span className="text-[#787b86]">{ev.forecast}</span>
                  </div>
                  <div>
                    <span className="text-[#787b86] block text-[9px]">PREVIOUS</span>
                    <span className="text-[#787b86]">{ev.previous}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
