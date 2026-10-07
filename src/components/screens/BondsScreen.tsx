import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { SymbolLogo } from '../SymbolLogo';
import { Sparkline } from '../Sparkline';
import { ArrowUpRight, ArrowDownRight, Landmark, Activity } from 'lucide-react';
import { YIELD_CURVE_POINTS } from '../../data/marketData';

export const BondsScreen: React.FC = () => {
  const { symbols, setSelectedSymbol, lastTickedId, lastTickDirection } = useMarket();

  const bonds = symbols.filter(s => s.category === 'bonds');

  // Curve coordinates calculation
  const width = 640;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const minYield = 3.5;
  const maxYield = 5.6;
  const yieldRange = maxYield - minYield;

  const getPoints = (key: 'current' | 'monthAgo' | 'yearAgo') => {
    return YIELD_CURVE_POINTS.map((pt, idx) => {
      const x = paddingX + (idx / (YIELD_CURVE_POINTS.length - 1)) * chartW;
      const y = paddingY + chartH - ((pt[key] - minYield) / yieldRange) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' L ');
  };

  const currentPath = `M ${getPoints('current')}`;
  const monthAgoPath = `M ${getPoints('monthAgo')}`;
  const yearAgoPath = `M ${getPoints('yearAgo')}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="border-b border-[#2a2e39] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2962ff] mb-1">
              <Landmark className="w-3.5 h-3.5" />
              <span>Sovereign Debt & Fixed Income</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Government Bonds & Yield Curves
            </h1>
            <p className="text-xs sm:text-sm text-[#787b86] mt-1">
              Analyze benchmark yields, credit spreads, and the term structure of interest rates across key sovereign debt issuers.
            </p>
          </div>
        </div>
      </div>

      {/* US Treasury Yield Curve Interactive Visualization */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2962ff]" />
              <span>US Treasury Yield Curve</span>
            </h2>
            <p className="text-xs text-[#787b86]">
              Term structure comparing current yields vs 1 month ago vs 1 year ago
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#2962ff] rounded-full" />
              <span className="text-white">Current (Oct 2026)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#089981] rounded-full" />
              <span className="text-[#787b86]">1 Month Ago</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-500 rounded-full" />
              <span className="text-[#787b86]">1 Year Ago</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto bg-[#131722] p-3 rounded-lg border border-[#2a2e39]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 min-w-[500px]">
            {/* Grid horizontal lines */}
            {[4.0, 4.5, 5.0, 5.5].map(lvl => {
              const y = paddingY + chartH - ((lvl - minYield) / yieldRange) * chartH;
              return (
                <g key={lvl}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#2a2e39"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={paddingX - 6}
                    y={y + 3}
                    fill="#787b86"
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    textAnchor="end"
                  >
                    {lvl.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* Maturity X Axis labels */}
            {YIELD_CURVE_POINTS.map((pt, idx) => {
              const x = paddingX + (idx / (YIELD_CURVE_POINTS.length - 1)) * chartW;
              return (
                <text
                  key={pt.maturity}
                  x={x}
                  y={height - 8}
                  fill="#787b86"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {pt.maturity}
                </text>
              );
            })}

            {/* Year ago line */}
            <path
              d={yearAgoPath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.8"
            />

            {/* Month ago line */}
            <path
              d={monthAgoPath}
              fill="none"
              stroke="#089981"
              strokeWidth="1.5"
              opacity="0.85"
            />

            {/* Current line */}
            <path
              d={currentPath}
              fill="none"
              stroke="#2962ff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Current data points */}
            {YIELD_CURVE_POINTS.map((pt, idx) => {
              const x = paddingX + (idx / (YIELD_CURVE_POINTS.length - 1)) * chartW;
              const y = paddingY + chartH - ((pt.current - minYield) / yieldRange) * chartH;
              return (
                <circle
                  key={pt.maturity}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#2962ff"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Sovereign 10Y Benchmarks Table */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
        <div className="mb-4">
          <h2 className="text-base font-bold text-white tracking-tight">
            Major Government 10-Year Bonds
          </h2>
          <p className="text-xs text-[#787b86]">
            Global sovereign benchmarks and yield spreads
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-semibold">
                <th className="py-2.5 px-3">BOND</th>
                <th className="py-2.5 px-3 text-right">YIELD</th>
                <th className="py-2.5 px-3 text-right">CHANGE (BPS)</th>
                <th className="py-2.5 px-3 text-right">CHANGE %</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">24H HIGH</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">24H LOW</th>
                <th className="py-2.5 px-3 text-right">CHART</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60">
              {bonds.map(b => {
                const isUp = b.change >= 0;
                const isTicking = lastTickedId === b.id;

                return (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedSymbol(b)}
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
                        <SymbolLogo symbol={b.symbol} logoUrl={b.logoUrl} size="sm" />
                        <div>
                          <span className="font-bold text-white hover:text-[#2962ff] transition-colors">
                            {b.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] block">
                            {b.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      {b.price.toFixed(3)}%
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}{(b.change * 100).toFixed(1)} bps
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      <span className="flex items-center justify-end gap-0.5">
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isUp ? '+' : ''}{b.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden sm:table-cell">
                      {b.high24h.toFixed(3)}%
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums hidden sm:table-cell">
                      {b.low24h.toFixed(3)}%
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end">
                        <Sparkline data={b.sparkline} isPositive={isUp} width={65} height={20} />
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
