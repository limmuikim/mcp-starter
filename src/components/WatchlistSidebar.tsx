import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { SymbolLogo } from './SymbolLogo';
import { Sparkline } from './Sparkline';
import {
  X,
  BookmarkCheck,
  Bell,
  Newspaper,
  Calendar,
  Trash2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { BREAKING_NEWS_DATA, ECONOMIC_CALENDAR_DATA } from '../data/marketData';

export const WatchlistSidebar: React.FC = () => {
  const {
    activeSidebarTab,
    setActiveSidebarTab,
    watchlist,
    toggleWatchlist,
    symbols,
    setSelectedSymbol,
    alerts,
    removeAlert,
    addAlert,
  } = useMarket();

  const [newAlertSymbol, setNewAlertSymbol] = useState('BTCUSD');
  const [newAlertPrice, setNewAlertPrice] = useState('65000');
  const [newAlertCondition, setNewAlertCondition] = useState<'above' | 'below'>('above');
  const [isAddingAlert, setIsAddingAlert] = useState(false);

  if (!activeSidebarTab) return null;

  const watchlistSymbols = symbols.filter(s => watchlist.includes(s.id));

  const handleAddAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newAlertPrice);
    if (!priceNum || !newAlertSymbol) return;
    addAlert(newAlertSymbol.toUpperCase(), priceNum, newAlertCondition);
    setIsAddingAlert(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-[#131722] text-[#d1d4dc] border-l border-[#2a2e39] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2e39] bg-[#1e222d]">
        <div className="flex items-center gap-2">
          {/* Tabs */}
          <button
            onClick={() => setActiveSidebarTab('watchlist')}
            className={`p-1.5 rounded transition-colors ${
              activeSidebarTab === 'watchlist'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-white'
            }`}
            title="Watchlist"
          >
            <BookmarkCheck className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveSidebarTab('alerts')}
            className={`p-1.5 rounded transition-colors ${
              activeSidebarTab === 'alerts'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-white'
            }`}
            title="Price Alerts"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveSidebarTab('news')}
            className={`p-1.5 rounded transition-colors ${
              activeSidebarTab === 'news'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-white'
            }`}
            title="News Stream"
          >
            <Newspaper className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveSidebarTab('calendar')}
            className={`p-1.5 rounded transition-colors ${
              activeSidebarTab === 'calendar'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-white'
            }`}
            title="Economic Calendar"
          >
            <Calendar className="w-4 h-4" />
          </button>

          <span className="text-sm font-bold text-white capitalize ml-2">
            {activeSidebarTab}
          </span>
        </div>

        <button
          onClick={() => setActiveSidebarTab(null)}
          className="p-1 text-[#787b86] hover:text-white hover:bg-[#2a2e39] rounded transition-colors"
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* TAB 1: WATCHLIST */}
        {activeSidebarTab === 'watchlist' && (
          <div>
            <div className="flex items-center justify-between text-xs text-[#787b86] mb-3 px-1">
              <span>{watchlistSymbols.length} SYMBOLS</span>
              <span>LAST PRICE / CHG %</span>
            </div>

            {watchlistSymbols.length === 0 ? (
              <div className="text-center py-12 text-[#787b86] text-sm">
                Your watchlist is empty. Click the bookmark icon on any symbol or search to add it.
              </div>
            ) : (
              <div className="space-y-1.5">
                {watchlistSymbols.map(sym => {
                  const isUp = sym.change >= 0;
                  return (
                    <div
                      key={sym.id}
                      onClick={() => setSelectedSymbol(sym)}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] border border-[#2a2e39] cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <SymbolLogo symbol={sym.symbol} logoUrl={sym.logoUrl} size="sm" />
                        <div>
                          <div className="font-bold text-xs text-white group-hover:text-[#2962ff] transition-colors">
                            {sym.symbol}
                          </div>
                          <div className="text-[11px] text-[#787b86] truncate max-w-[100px]">
                            {sym.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Sparkline data={sym.sparkline} isPositive={isUp} width={50} height={20} />
                        <div className="text-right">
                          <div className="text-xs font-bold font-mono text-white tabular-nums">
                            {sym.price < 2 ? sym.price.toFixed(4) : sym.price.toFixed(2)}
                          </div>
                          <div
                            className={`text-[11px] font-mono font-medium flex items-center justify-end ${
                              isUp ? 'text-[#089981]' : 'text-[#f23645]'
                            }`}
                          >
                            {isUp ? '+' : ''}{sym.changePercent.toFixed(2)}%
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(sym.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#787b86] hover:text-rose-400 transition-opacity"
                          title="Remove from watchlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALERTS */}
        {activeSidebarTab === 'alerts' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#787b86] font-semibold uppercase">Active Price Triggers</span>
              <button
                onClick={() => setIsAddingAlert(!isAddingAlert)}
                className="flex items-center gap-1 text-xs text-[#2962ff] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                {isAddingAlert ? 'Cancel' : 'New Alert'}
              </button>
            </div>

            {isAddingAlert && (
              <form onSubmit={handleAddAlertSubmit} className="p-3 bg-[#1e222d] rounded-lg border border-[#2a2e39] mb-4 space-y-2 text-xs">
                <div>
                  <label className="text-[11px] text-[#787b86] block mb-1">Symbol Ticker</label>
                  <input
                    type="text"
                    value={newAlertSymbol}
                    onChange={e => setNewAlertSymbol(e.target.value)}
                    placeholder="e.g. BTCUSD, NVDA, AAPL"
                    className="w-full px-2 py-1 bg-[#131722] text-white border border-[#2a2e39] rounded font-mono text-xs focus:outline-hidden focus:border-[#2962ff]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-[#787b86] block mb-1">Condition</label>
                    <select
                      value={newAlertCondition}
                      onChange={e => setNewAlertCondition(e.target.value as 'above' | 'below')}
                      className="w-full px-2 py-1 bg-[#131722] text-white border border-[#2a2e39] rounded text-xs"
                    >
                      <option value="above">Crosses Above</option>
                      <option value="below">Crosses Below</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-[#787b86] block mb-1">Target Price ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={newAlertPrice}
                      onChange={e => setNewAlertPrice(e.target.value)}
                      className="w-full px-2 py-1 bg-[#131722] text-white border border-[#2a2e39] rounded font-mono text-xs focus:outline-hidden focus:border-[#2962ff]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-[#2962ff] text-white rounded font-medium hover:bg-[#2962ff]/90 transition-colors"
                >
                  Create Alert Trigger
                </button>
              </form>
            )}

            <div className="space-y-2">
              {alerts.map(alt => (
                <div
                  key={alt.id}
                  className="p-3 bg-[#1e222d] rounded-lg border border-[#2a2e39] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{alt.symbol}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86]">
                        {alt.condition.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-[#089981] mt-0.5">
                      Target: ${alt.targetPrice.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => removeAlert(alt.id)}
                    className="p-1 text-[#787b86] hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: NEWS */}
        {activeSidebarTab === 'news' && (
          <div className="space-y-3">
            {BREAKING_NEWS_DATA.map(news => (
              <div
                key={news.id}
                className="p-3 bg-[#1e222d] rounded-lg border border-[#2a2e39] hover:border-[#2962ff]/50 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] text-[#787b86] mb-1">
                  <span>{news.source}</span>
                  <span>{news.timeAgo}</span>
                </div>
                <h4 className="text-xs font-semibold text-white leading-snug hover:text-[#2962ff] transition-colors cursor-pointer">
                  {news.title}
                </h4>
                <div className="flex items-center gap-1.5 mt-2">
                  {news.symbols.map(s => (
                    <span
                      key={s}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#2962ff]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: CALENDAR */}
        {activeSidebarTab === 'calendar' && (
          <div className="space-y-2.5">
            {ECONOMIC_CALENDAR_DATA.map(item => (
              <div
                key={item.id}
                className="p-3 bg-[#1e222d] rounded-lg border border-[#2a2e39] text-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-[#787b86] mb-1">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={item.flagUrl}
                      alt={item.countryCode}
                      className="w-3.5 h-3.5 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span>{item.country}</span>
                  </div>
                  <span className="font-mono">{item.time}</span>
                </div>
                <div className="font-semibold text-white mb-2">{item.event}</div>
                <div className="grid grid-cols-3 gap-1 text-[11px] bg-[#131722] p-1.5 rounded font-mono">
                  <div>
                    <span className="text-[#787b86] block text-[9px]">ACTUAL</span>
                    <span className="text-white font-bold">{item.actual}</span>
                  </div>
                  <div>
                    <span className="text-[#787b86] block text-[9px]">FCST</span>
                    <span className="text-[#787b86]">{item.forecast}</span>
                  </div>
                  <div>
                    <span className="text-[#787b86] block text-[9px]">PREV</span>
                    <span className="text-[#787b86]">{item.previous}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
