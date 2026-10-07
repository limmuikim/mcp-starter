import React, { useState, useEffect, useRef } from 'react';
import { useMarket } from '../context/MarketContext';
import { SymbolLogo } from './SymbolLogo';
import { Search, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MarketSymbol } from '../types/market';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, symbols, setSelectedSymbol } = useMarket();
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredSymbols = symbols.filter(sym => {
    const matchesQuery =
      sym.symbol.toLowerCase().includes(query.toLowerCase()) ||
      sym.name.toLowerCase().includes(query.toLowerCase()) ||
      (sym.sector && sym.sector.toLowerCase().includes(query.toLowerCase()));

    const matchesCat = filterCategory === 'all' || sym.category === filterCategory;

    return matchesQuery && matchesCat;
  });

  const handleSelect = (sym: MarketSymbol) => {
    setSelectedSymbol(sym);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#1e222d] text-[#d1d4dc] rounded-xl border border-[#2a2e39] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#2a2e39] gap-3 bg-[#131722]">
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search symbol, company, index, crypto..."
            className="flex-1 bg-transparent text-white placeholder-[#787b86] text-sm focus:outline-hidden"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-[#787b86] hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#1e222d] border-b border-[#2a2e39] overflow-x-auto text-xs">
          {['all', 'indices', 'stocks', 'crypto', 'forex', 'futures', 'bonds'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/60 p-2">
          {filteredSymbols.length === 0 ? (
            <div className="text-center py-12 text-[#787b86] text-xs">
              No matching instruments found for "{query}"
            </div>
          ) : (
            filteredSymbols.map(sym => {
              const isUp = sym.change >= 0;
              return (
                <div
                  key={sym.id}
                  onClick={() => handleSelect(sym)}
                  className="flex items-center justify-between p-3 hover:bg-[#2a2e39]/70 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <SymbolLogo symbol={sym.symbol} logoUrl={sym.logoUrl} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                          {sym.symbol}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#131722] text-[#787b86]">
                          {sym.category}
                        </span>
                        <span className="text-xs text-[#787b86]">
                          {sym.exchange}
                        </span>
                      </div>
                      <div className="text-xs text-[#787b86] truncate max-w-sm">
                        {sym.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-white tabular-nums">
                      {sym.price < 2 ? sym.price.toFixed(4) : sym.price.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs font-mono font-semibold flex items-center justify-end ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
                      {isUp ? '+' : ''}{sym.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-[#2a2e39] bg-[#131722] text-[11px] text-[#787b86] flex items-center justify-between">
          <span>Tip: Press ESC to exit</span>
          <span className="font-mono">{filteredSymbols.length} results</span>
        </div>
      </div>
    </div>
  );
};
