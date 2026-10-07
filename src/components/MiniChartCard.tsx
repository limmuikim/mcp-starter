import React, { useState } from 'react';
import { MarketSymbol } from '../types/market';
import { useMarket } from '../context/MarketContext';
import { SymbolLogo } from './SymbolLogo';
import { ArrowUpRight, ArrowDownRight, Maximize2 } from 'lucide-react';

interface MiniChartCardProps {
  symbol: MarketSymbol;
}

export const MiniChartCard: React.FC<MiniChartCardProps> = ({ symbol }) => {
  const { setSelectedSymbol } = useMarket();
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '1Y'>('1D');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const series = symbol.historicalData[timeframe] || symbol.historicalData['1D'];
  const closes = series.map(s => s.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;

  const currentDisplayPoint = hoveredIndex !== null && series[hoveredIndex]
    ? series[hoveredIndex]
    : series[series.length - 1];

  const displayPrice = currentDisplayPoint?.close ?? symbol.price;
  const isUp = symbol.change >= 0;
  const strokeColor = isUp ? '#089981' : '#f23645';

  const width = 280;
  const height = 90;

  const points = closes.map((val, idx) => {
    const x = (idx / (closes.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 16) - 8;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <div
      onClick={() => setSelectedSymbol(symbol)}
      className="p-4 rounded-lg bg-[#1e222d] dark:bg-[#1e222d] light:bg-[#f8fafc] border border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 hover:border-[#2962ff]/60 transition-all cursor-pointer group flex flex-col justify-between"
    >
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <SymbolLogo symbol={symbol.symbol} logoUrl={symbol.logoUrl} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white dark:text-white light:text-slate-900 group-hover:text-[#2962ff] transition-colors">
                  {symbol.symbol}
                </span>
                <span className="text-[11px] text-[#787b86]">
                  {symbol.exchange}
                </span>
              </div>
              <div className="text-xs text-[#787b86] truncate max-w-[150px]">
                {symbol.name}
              </div>
            </div>
          </div>
          <Maximize2 className="w-4 h-4 text-[#787b86] group-hover:text-white transition-colors" />
        </div>

        {/* Current / Hover Price & % Change */}
        <div className="flex items-baseline justify-between mt-1">
          <div className="text-lg font-bold font-mono text-white dark:text-white light:text-slate-900 tabular-nums">
            {displayPrice < 2
              ? displayPrice.toFixed(4)
              : displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div
            className={`text-xs font-mono font-semibold flex items-center gap-0.5 ${
              isUp ? 'text-[#089981]' : 'text-[#f23645]'
            }`}
          >
            {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{isUp ? '+' : ''}{symbol.changePercent.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Mini Area Chart SVG */}
      <div
        className="my-2 relative overflow-hidden"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const relX = Math.max(0, Math.min(width, ((e.clientX - rect.left) / rect.width) * width));
          const idx = Math.round((relX / width) * (closes.length - 1));
          setHoveredIndex(idx);
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-20 overflow-visible"
        >
          <defs>
            <linearGradient id={`grad-${symbol.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#grad-${symbol.id})`} />
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {hoveredIndex !== null && (
            <circle
              cx={(hoveredIndex / (closes.length - 1)) * width}
              cy={height - ((closes[hoveredIndex] - min) / range) * (height - 16) - 8}
              r="3.5"
              fill={strokeColor}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          )}
        </svg>

        {hoveredIndex !== null && currentDisplayPoint && (
          <div className="absolute top-0 right-0 text-[10px] font-mono text-[#787b86] bg-[#131722]/80 px-1 rounded">
            {currentDisplayPoint.time}
          </div>
        )}
      </div>

      {/* Timeframe switchers */}
      <div
        className="flex items-center justify-between border-t border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 pt-2 text-[11px]"
        onClick={e => e.stopPropagation()}
      >
        {(['1D', '5D', '1M', '1Y'] as const).map(tf => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              timeframe === tf
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-white dark:hover:text-white light:hover:text-slate-900'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  );
};
