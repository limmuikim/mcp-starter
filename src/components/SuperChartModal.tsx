import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Bookmark,
  Check,
  Maximize2,
  Sliders,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from 'lucide-react';
import { MarketSymbol, CandlePoint } from '../types/market';
import { useMarket } from '../context/MarketContext';
import { SymbolLogo } from './SymbolLogo';

interface SuperChartModalProps {
  symbol: MarketSymbol;
  onClose: () => void;
}

type Timeframe = '1D' | '5D' | '1M' | '1Y' | '5Y';
type ChartStyle = 'candles' | 'line' | 'area' | 'bars';

export const SuperChartModal: React.FC<SuperChartModalProps> = ({ symbol, onClose }) => {
  const { isInWatchlist, toggleWatchlist, placePaperTrade, paperPositions, closePaperTrade } = useMarket();
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candles');
  const [showMA, setShowMA] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  // Crosshair state
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Paper trade form
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeShares, setTradeShares] = useState<number>(10);
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const candleData: CandlePoint[] = useMemo(() => {
    return symbol.historicalData[timeframe] || symbol.historicalData['1D'];
  }, [symbol, timeframe]);

  const activePosition = paperPositions.find(p => p.symbol === symbol.symbol);

  // Calculations for moving averages and RSI
  const ma20 = useMemo(() => {
    const period = 5;
    return candleData.map((_, idx, arr) => {
      if (idx < period - 1) return null;
      const slice = arr.slice(idx - period + 1, idx + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / period;
    });
  }, [candleData]);

  const rsiValues = useMemo(() => {
    const period = 7;
    const rsi: (number | null)[] = [];
    let gains = 0;
    let losses = 0;

    for (let i = 0; i < candleData.length; i++) {
      if (i === 0) {
        rsi.push(50);
        continue;
      }
      const diff = candleData[i].close - candleData[i - 1].close;
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);

      if (i < period) {
        rsi.push(50);
      } else {
        const avgGain = gains / period;
        const avgLoss = losses / period || 0.001;
        const rs = avgGain / avgLoss;
        const val = 100 - (100 / (1 + rs));
        rsi.push(Math.min(95, Math.max(5, val)));
      }
    }
    return rsi;
  }, [candleData]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Layout partitions
    const mainChartHeight = showRSI ? height * 0.72 : height - 20;
    const rsiChartTop = mainChartHeight + 10;
    const rsiChartHeight = height - rsiChartTop - 15;
    const rightPadding = 65;
    const chartWidth = width - rightPadding;

    // Clear
    ctx.clearRect(0, 0, width, height);

    if (candleData.length === 0) return;

    // Price range
    const prices = candleData.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...prices) * 0.998;
    const maxPrice = Math.max(...prices) * 1.002;
    const priceRange = maxPrice - minPrice || 1;

    // Helper coords
    const getX = (index: number) => (index / (candleData.length - 1)) * chartWidth;
    const getY = (price: number) =>
      mainChartHeight - ((price - minPrice) / priceRange) * (mainChartHeight - 40) - 20;

    // Grid lines
    ctx.strokeStyle = '#2a2e39';
    ctx.lineWidth = 0.75;
    ctx.setLineDash([4, 4]);

    const numHorizLines = 5;
    for (let i = 0; i <= numHorizLines; i++) {
      const y = (i / numHorizLines) * (mainChartHeight - 40) + 20;
      const priceVal = maxPrice - (i / numHorizLines) * priceRange;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Right axis labels
      ctx.fillStyle = '#787b86';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(priceVal.toFixed(symbol.price < 2 ? 4 : 2), chartWidth + 6, y + 3);
    }

    ctx.setLineDash([]); // Reset line dash

    // Volume bars
    if (showVolume) {
      const maxVol = Math.max(...candleData.map(c => c.volume)) || 1;
      const volMaxH = mainChartHeight * 0.22;
      const barWidth = Math.max(2, (chartWidth / candleData.length) * 0.6);

      candleData.forEach((c, idx) => {
        const x = getX(idx);
        const vH = (c.volume / maxVol) * volMaxH;
        const isUp = c.close >= c.open;
        ctx.fillStyle = isUp ? 'rgba(8, 153, 129, 0.22)' : 'rgba(242, 54, 69, 0.22)';
        ctx.fillRect(x - barWidth / 2, mainChartHeight - vH, barWidth, vH);
      });
    }

    // Chart styles: Candlesticks / Bars / Line / Area
    const barW = Math.max(3, (chartWidth / candleData.length) * 0.65);

    if (chartStyle === 'candles' || chartStyle === 'bars') {
      candleData.forEach((c, idx) => {
        const x = getX(idx);
        const yOpen = getY(c.open);
        const yClose = getY(c.close);
        const yHigh = getY(c.high);
        const yLow = getY(c.low);
        const isUp = c.close >= c.open;
        const color = isUp ? '#089981' : '#f23645';

        // High-low wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        if (chartStyle === 'candles') {
          // Body
          ctx.fillStyle = color;
          const bodyY = Math.min(yOpen, yClose);
          const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
          ctx.fillRect(x - barW / 2, bodyY, barW, bodyHeight);
        } else {
          // OHLC Bars
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x - barW / 2, yOpen);
          ctx.lineTo(x, yOpen);
          ctx.moveTo(x, yClose);
          ctx.lineTo(x + barW / 2, yClose);
          ctx.stroke();
        }
      });
    } else {
      // Line or Area
      ctx.beginPath();
      candleData.forEach((c, idx) => {
        const x = getX(idx);
        const y = getY(c.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      const isUp = symbol.change >= 0;
      const lineColor = isUp ? '#089981' : '#f23645';

      if (chartStyle === 'area') {
        const lastX = getX(candleData.length - 1);
        ctx.lineTo(lastX, mainChartHeight);
        ctx.lineTo(0, mainChartHeight);
        ctx.closePath();
        const areaGrad = ctx.createLinearGradient(0, 0, 0, mainChartHeight);
        areaGrad.addColorStop(0, isUp ? 'rgba(8, 153, 129, 0.35)' : 'rgba(242, 54, 69, 0.35)');
        areaGrad.addColorStop(1, 'rgba(8, 153, 129, 0.0)');
        ctx.fillStyle = areaGrad;
        ctx.fill();

        // Stroke line on top
        ctx.beginPath();
        candleData.forEach((c, idx) => {
          const x = getX(idx);
          const y = getY(c.close);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
      }

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Moving average MA 20
    if (showMA) {
      ctx.beginPath();
      let started = false;
      ma20.forEach((val, idx) => {
        if (val === null) return;
        const x = getX(idx);
        const y = getY(val);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = '#2962ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // RSI Subchart
    if (showRSI) {
      // Subchart border
      ctx.strokeStyle = '#2a2e39';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, rsiChartTop, chartWidth, rsiChartHeight);

      // 70 and 30 threshold lines
      const y70 = rsiChartTop + (1 - 70 / 100) * rsiChartHeight;
      const y30 = rsiChartTop + (1 - 30 / 100) * rsiChartHeight;

      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = 'rgba(242, 54, 69, 0.5)';
      ctx.beginPath();
      ctx.moveTo(0, y70);
      ctx.lineTo(chartWidth, y70);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(8, 153, 129, 0.5)';
      ctx.beginPath();
      ctx.moveTo(0, y30);
      ctx.lineTo(chartWidth, y30);
      ctx.stroke();
      ctx.setLineDash([]);

      // RSI Label
      ctx.fillStyle = '#787b86';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText('RSI (14)', 6, rsiChartTop + 11);
      ctx.fillText('70', chartWidth + 6, y70 + 3);
      ctx.fillText('30', chartWidth + 6, y30 + 3);

      // Plot RSI line
      ctx.beginPath();
      let started = false;
      rsiValues.forEach((val, idx) => {
        if (val === null) return;
        const x = getX(idx);
        const y = rsiChartTop + (1 - val / 100) * rsiChartHeight;
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = '#e040fb';
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }

    // Interactive Crosshair
    if (cursorPos && hoverIndex !== null && hoverIndex >= 0 && hoverIndex < candleData.length) {
      const x = getX(hoverIndex);
      const hoveredCandle = candleData[hoverIndex];
      const hoveredY = getY(hoveredCandle.close);

      ctx.strokeStyle = '#787b86';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 3]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, cursorPos.y);
      ctx.lineTo(chartWidth, cursorPos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Right price badge
      const currentCursorPrice = maxPrice - (cursorPos.y / mainChartHeight) * priceRange;
      ctx.fillStyle = '#2962ff';
      ctx.fillRect(chartWidth, cursorPos.y - 9, rightPadding, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(currentCursorPrice.toFixed(symbol.price < 2 ? 4 : 2), chartWidth + 4, cursorPos.y + 4);

      // Bottom date badge
      ctx.fillStyle = '#1e222d';
      ctx.fillRect(x - 30, height - 16, 60, 16);
      ctx.strokeStyle = '#2a2e39';
      ctx.strokeRect(x - 30, height - 16, 60, 16);
      ctx.fillStyle = '#d1d4dc';
      ctx.textAlign = 'center';
      ctx.fillText(hoveredCandle.time, x, height - 4);
    }
  }, [candleData, chartStyle, showMA, showBollinger, showRSI, showVolume, cursorPos, hoverIndex, symbol]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rightPadding = 65;
    const chartWidth = rect.width - rightPadding;

    if (x >= 0 && x <= chartWidth) {
      const idx = Math.round((x / chartWidth) * (candleData.length - 1));
      setHoverIndex(Math.max(0, Math.min(candleData.length - 1, idx)));
      setCursorPos({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setCursorPos(null);
  };

  const currentHoverCandle = hoverIndex !== null && candleData[hoverIndex]
    ? candleData[hoverIndex]
    : candleData[candleData.length - 1];

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeShares <= 0) return;
    placePaperTrade(symbol, tradeType, tradeShares);
    setTradeSuccessMsg(`Order executed: ${tradeType.toUpperCase()} ${tradeShares} ${symbol.symbol} @ $${symbol.price.toFixed(2)}`);
    setTimeout(() => setTradeSuccessMsg(null), 3500);
  };

  const isUp = symbol.change >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-[#131722] dark:bg-[#131722] text-[#d1d4dc] rounded-lg border border-[#2a2e39] shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-[#2a2e39] bg-[#1e222d] gap-3">
          <div className="flex items-center gap-3">
            <SymbolLogo symbol={symbol.symbol} logoUrl={symbol.logoUrl} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {symbol.symbol}
                </span>
                <span className="text-xs text-[#787b86] hidden sm:inline">
                  {symbol.exchange} · {symbol.currency}
                </span>
                <button
                  onClick={() => toggleWatchlist(symbol.id)}
                  className={`p-1 rounded hover:bg-[#2a2e39] transition-colors ${
                    isInWatchlist(symbol.id) ? 'text-amber-400' : 'text-[#787b86]'
                  }`}
                  title={isInWatchlist(symbol.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
              <div className="text-xs text-[#787b86] truncate max-w-xs sm:max-w-md">
                {symbol.name}
              </div>
            </div>
          </div>

          {/* Current Live Price display */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-lg sm:text-xl font-bold font-mono text-white tabular-nums">
                {symbol.price < 2 ? symbol.price.toFixed(4) : symbol.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div
                className={`text-xs font-mono font-semibold flex items-center justify-end gap-1 ${
                  isUp ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{isUp ? '+' : ''}{symbol.change.toFixed(2)}</span>
                <span>({isUp ? '+' : ''}{symbol.changePercent.toFixed(2)}%)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#787b86] hover:text-white hover:bg-[#2a2e39] rounded-md transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Timeframe & Indicators & Chart Type */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-[#2a2e39] bg-[#131722] text-xs gap-2">
          {/* Timeframe tabs */}
          <div className="flex items-center gap-1 bg-[#1e222d] p-0.5 rounded border border-[#2a2e39]">
            {(['1D', '5D', '1M', '1Y', '5Y'] as Timeframe[]).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  timeframe === tf
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style Switcher */}
          <div className="flex items-center gap-1 bg-[#1e222d] p-0.5 rounded border border-[#2a2e39]">
            {(['candles', 'area', 'line', 'bars'] as ChartStyle[]).map(st => (
              <button
                key={st}
                onClick={() => setChartStyle(st)}
                className={`px-2 py-1 capitalize font-medium rounded transition-colors ${
                  chartStyle === st
                    ? 'bg-[#2a2e39] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Indicators toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMA(!showMA)}
              className={`px-2 py-1 rounded border transition-colors ${
                showMA
                  ? 'bg-[#2962ff]/20 text-[#2962ff] border-[#2962ff]/40 font-semibold'
                  : 'bg-[#1e222d] text-[#787b86] border-[#2a2e39]'
              }`}
            >
              MA (20)
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-1 rounded border transition-colors ${
                showRSI
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/40 font-semibold'
                  : 'bg-[#1e222d] text-[#787b86] border-[#2a2e39]'
              }`}
            >
              RSI (14)
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-1 rounded border transition-colors ${
                showVolume
                  ? 'bg-[#089981]/20 text-[#089981] border-[#089981]/40 font-semibold'
                  : 'bg-[#1e222d] text-[#787b86] border-[#2a2e39]'
              }`}
            >
              Volume
            </button>
          </div>
        </div>

        {/* OHLCV Dynamic Readout */}
        <div className="px-4 py-1.5 bg-[#131722] border-b border-[#2a2e39]/60 flex flex-wrap items-center gap-4 text-[11px] font-mono tabular-nums text-[#787b86]">
          {currentHoverCandle && (
            <>
              <span>TIME: <span className="text-white">{currentHoverCandle.time}</span></span>
              <span>O: <span className="text-white">{currentHoverCandle.open}</span></span>
              <span>H: <span className="text-[#089981]">{currentHoverCandle.high}</span></span>
              <span>L: <span className="text-[#f23645]">{currentHoverCandle.low}</span></span>
              <span>C: <span className="text-white">{currentHoverCandle.close}</span></span>
              <span>VOL: <span className="text-white">{(currentHoverCandle.volume / 1000).toFixed(1)}K</span></span>
            </>
          )}
        </div>

        {/* Main Body: Interactive Chart + Order/Stats Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 flex-1 overflow-y-auto">
          {/* Chart Canvas Area */}
          <div className="lg:col-span-3 p-3 relative flex flex-col min-h-[380px] sm:min-h-[440px] bg-[#131722]">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full h-full cursor-crosshair rounded"
            />
          </div>

          {/* Right Panel: Trading & Key Stats */}
          <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-[#2a2e39] bg-[#1e222d]/60 p-4 flex flex-col gap-5">
            {/* Paper Trading Execution Simulator */}
            <div className="p-3 bg-[#131722] rounded border border-[#2a2e39]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Paper Trading
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">SIMULATION</span>
              </div>

              {tradeSuccessMsg && (
                <div className="mb-2 p-1.5 text-[11px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{tradeSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleExecuteTrade} className="space-y-2.5 text-xs">
                {/* Buy / Sell selector */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTradeType('buy')}
                    className={`py-1.5 font-bold rounded transition-colors ${
                      tradeType === 'buy'
                        ? 'bg-[#089981] text-white shadow-xs'
                        : 'bg-[#1e222d] text-[#787b86] hover:text-white'
                    }`}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeType('sell')}
                    className={`py-1.5 font-bold rounded transition-colors ${
                      tradeType === 'sell'
                        ? 'bg-[#f23645] text-white shadow-xs'
                        : 'bg-[#1e222d] text-[#787b86] hover:text-white'
                    }`}
                  >
                    SELL
                  </button>
                </div>

                {/* Shares input */}
                <div>
                  <label className="text-[11px] text-[#787b86] block mb-1">
                    Units / Shares:
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={tradeShares}
                    onChange={e => setTradeShares(Number(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 bg-[#1e222d] text-white border border-[#2a2e39] rounded font-mono text-xs focus:outline-hidden focus:border-[#2962ff]"
                  />
                </div>

                <div className="flex justify-between text-[11px] text-[#787b86] pt-1">
                  <span>Est. Total:</span>
                  <span className="font-mono text-white font-semibold">
                    ${(tradeShares * symbol.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  type="submit"
                  className={`w-full py-2 font-bold text-white rounded transition-colors ${
                    tradeType === 'buy'
                      ? 'bg-[#089981] hover:bg-[#089981]/90'
                      : 'bg-[#f23645] hover:bg-[#f23645]/90'
                  }`}
                >
                  Place {tradeType.toUpperCase()} Order
                </button>
              </form>

              {/* Active Position if exists */}
              {activePosition && (
                <div className="mt-3 pt-2.5 border-t border-[#2a2e39] text-xs">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#787b86]">Open Position:</span>
                    <span className="font-semibold text-white">
                      {activePosition.shares} shares ({activePosition.type.toUpperCase()})
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] mb-2">
                    <span className="text-[#787b86]">Unrealized P&L:</span>
                    <span
                      className={`font-mono font-semibold ${
                        (symbol.price - activePosition.entryPrice) >= 0
                          ? 'text-[#089981]'
                          : 'text-[#f23645]'
                      }`}
                    >
                      {activePosition.type === 'buy'
                        ? (symbol.price - activePosition.entryPrice >= 0 ? '+' : '') +
                          ((symbol.price - activePosition.entryPrice) * activePosition.shares).toFixed(2)
                        : (activePosition.entryPrice - symbol.price >= 0 ? '+' : '') +
                          ((activePosition.entryPrice - symbol.price) * activePosition.shares).toFixed(2)}
                      {' USD'}
                    </span>
                  </div>
                  <button
                    onClick={() => closePaperTrade(activePosition.id)}
                    className="w-full py-1 text-[11px] bg-[#2a2e39] hover:bg-rose-500/20 hover:text-rose-300 text-[#d1d4dc] rounded transition-colors"
                  >
                    Close Position
                  </button>
                </div>
              )}
            </div>

            {/* Technical Gauge */}
            <div className="p-3 bg-[#131722] rounded border border-[#2a2e39]">
              <div className="text-xs font-semibold text-white mb-2">Technical Analysis</div>
              <div className="text-center py-2">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    symbol.rating.includes('Buy')
                      ? 'bg-[#089981]/20 text-[#089981] border border-[#089981]/40'
                      : symbol.rating.includes('Sell')
                      ? 'bg-[#f23645]/20 text-[#f23645] border border-[#f23645]/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {symbol.rating}
                </span>
                <div className="text-[10px] text-[#787b86] mt-1.5">
                  Based on 26 technical indicators
                </div>
              </div>
            </div>

            {/* Key Statistics */}
            <div className="p-3 bg-[#131722] rounded border border-[#2a2e39] text-xs space-y-2">
              <div className="text-xs font-semibold text-white mb-1">Key Statistics</div>
              {symbol.marketCap && (
                <div className="flex justify-between">
                  <span className="text-[#787b86]">Market Cap</span>
                  <span className="font-mono text-white font-medium">{symbol.marketCap}</span>
                </div>
              )}
              {symbol.peRatio && (
                <div className="flex justify-between">
                  <span className="text-[#787b86]">P/E Ratio</span>
                  <span className="font-mono text-white font-medium">{symbol.peRatio}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#787b86]">24h High</span>
                <span className="font-mono text-white font-medium">{symbol.high24h.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#787b86]">24h Low</span>
                <span className="font-mono text-white font-medium">{symbol.low24h.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#787b86]">Volume</span>
                <span className="font-mono text-white font-medium">{symbol.volume}</span>
              </div>
              {symbol.sector && (
                <div className="flex justify-between">
                  <span className="text-[#787b86]">Sector</span>
                  <span className="text-white truncate max-w-[120px]">{symbol.sector}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer / Description */}
        {symbol.description && (
          <div className="px-4 py-2 bg-[#1e222d] border-t border-[#2a2e39] text-xs text-[#787b86] line-clamp-1">
            <span className="font-semibold text-white mr-1.5">About {symbol.name}:</span>
            {symbol.description}
          </div>
        )}
      </div>
    </div>
  );
};
